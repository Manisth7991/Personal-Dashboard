'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ContentCard } from './content-card'
import { GripVertical } from 'lucide-react'

interface SortableContentCardProps {
    id: string
    item: any
    index: number
    isDragEnabled?: boolean
}

export function SortableContentCard({ id, item, index, isDragEnabled = true }: SortableContentCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    if (!isDragEnabled) {
        return <ContentCard item={item} index={index} />
    }

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            {/* Drag Handle */}
            <div
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-800 rounded-md p-1 shadow-md cursor-grab active:cursor-grabbing"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>

            {/* Content Card */}
            <div className={`h-full ${isDragging ? 'scale-105 shadow-xl' : ''} transition-transform duration-200`}>
                <ContentCard item={item} index={index} />
            </div>
        </div>
    )
}

