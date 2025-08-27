'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ContentCard, ContentCardSkeleton } from '@/components/content/content-card'
import { reorderItems } from '@/features/feed/feedSlice'
import { reorderFavorites } from '@/features/favorites/favoritesSlice'
import { ContentItem } from '@/lib/api'
import { cn } from '@/utils/helpers'

interface SortableCardProps {
    item: ContentItem
    index: number
}

function SortableCard({ item, index }: SortableCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(isDragging && 'z-50')}
        >
            <ContentCard item={item} index={index} isDragging={isDragging} />
        </div>
    )
}

interface ContentGridProps {
    items: ContentItem[]
    isLoading?: boolean
    gridType?: 'feed' | 'favorites'
    className?: string
}

export function ContentGrid({
    items,
    isLoading = false,
    gridType = 'feed',
    className
}: ContentGridProps) {
    const dispatch = useDispatch()
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex(item => item.id === active.id)
            const newIndex = items.findIndex(item => item.id === over?.id)

            if (gridType === 'feed') {
                dispatch(reorderItems({ fromIndex: oldIndex, toIndex: newIndex }))
            } else if (gridType === 'favorites') {
                dispatch(reorderFavorites({ fromIndex: oldIndex, toIndex: newIndex }))
            }
        }

        setActiveId(null)
    }

    const activeItem = activeId ? items.find(item => item.id === activeId) : null

    if (isLoading) {
        return (
            <div className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
                className
            )}>
                {Array.from({ length: 8 }).map((_, index) => (
                    <ContentCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📭</div>
                <div className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No content found
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    {gridType === 'favorites'
                        ? 'Start adding items to your favorites to see them here.'
                        : 'Try adjusting your filters or search terms.'
                    }
                </div>
            </div>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
                <div className={cn(
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
                    className
                )}>
                    {items.map((item, index) => (
                        <SortableCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeItem ? (
                    <ContentCard item={activeItem} isDragging />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

