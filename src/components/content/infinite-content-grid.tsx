'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ContentCard } from '@/components/content/content-card'
import { SortableContentCard } from '@/components/content/sortable-content-card'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { RefreshCw } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

interface ContentItem {
    id: string
    type: 'news' | 'movie' | 'social'
    title: string
    description: string
    image?: string
    url?: string
    metadata?: {
        source?: string
        author?: string
        publishedAt?: string
        rating?: number
        category?: string
        isRealTime?: boolean
    }
}

interface InfiniteContentGridProps {
    initialContent: ContentItem[]
    fetchMoreContent: (page: number) => Promise<ContentItem[]>
    enableDragDrop?: boolean
    itemsPerPage?: number
    className?: string
}

export function InfiniteContentGrid({
    initialContent,
    fetchMoreContent,
    enableDragDrop = false,
    itemsPerPage = 12,
    className = ''
}: InfiniteContentGridProps) {
    const [content, setContent] = useState<ContentItem[]>(initialContent)
    const [currentPage, setCurrentPage] = useState(1)
    const [error, setError] = useState<string | null>(null)

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Fetch more content function
    const fetchMore = useCallback(async () => {
        try {
            setError(null)
            const nextPage = currentPage + 1
            const newContent = await fetchMoreContent(nextPage)

            if (newContent.length === 0) {
                setHasMore(false)
                return
            }

            // Filter out duplicates
            const uniqueNewContent = newContent.filter(
                newItem => !content.some(existingItem => existingItem.id === newItem.id)
            )

            if (uniqueNewContent.length > 0) {
                setContent(prev => [...prev, ...uniqueNewContent])
                setCurrentPage(nextPage)
            }

            // If we got less than expected, we might be at the end
            if (newContent.length < itemsPerPage) {
                setHasMore(false)
            }
        } catch (err) {
            setError('Failed to load more content')
            console.error('Error fetching more content:', err)
        }
    }, [currentPage, fetchMoreContent, content, itemsPerPage])

    const {
        isLoading,
        hasMore,
        setHasMore,
        observerRef
    } = useInfiniteScroll(fetchMore)

    // Handle drag and drop
    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setContent((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)

                // Save new order to localStorage
                try {
                    localStorage.setItem('dashboard-content-order', JSON.stringify(newItems.map(item => item.id)))
                } catch (error) {
                    console.error('Failed to save content order:', error)
                }

                return newItems
            })
        }
    }

    // Update content when initial content changes
    useEffect(() => {
        if (initialContent.length > 0) {
            setContent(initialContent)
            setCurrentPage(1)
            setHasMore(true)
        }
    }, [initialContent])

    // Error boundary for individual cards
    const renderContentCard = (item: ContentItem, index: number) => {
        try {
            if (enableDragDrop) {
                return (
                    <SortableContentCard
                        key={item.id}
                        id={item.id}
                        item={item}
                        index={index}
                        isDragEnabled={true}
                    />
                )
            } else {
                return (
                    <ContentCard
                        key={item.id}
                        item={item}
                        index={index}
                    />
                )
            }
        } catch (error) {
            console.error('Error rendering content card:', error)
            return (
                <div key={item.id} className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="text-red-600 dark:text-red-400">Error loading content</p>
                </div>
            )
        }
    }

    if (content.length === 0 && !isLoading) {
        return (
            <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    No content available
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Try refreshing the page or check back later.
                </p>
            </div>
        )
    }

    return (
        <div className={className}>
            {enableDragDrop ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext
                        items={content.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {content.map((item, index) => renderContentCard(item, index))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((item, index) => renderContentCard(item, index))}
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
                </div>
            )}

            {/* Loading indicator and infinite scroll trigger */}
            {hasMore && (
                <div
                    ref={observerRef}
                    className="mt-8 flex justify-center items-center py-8"
                >
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center space-x-3 text-gray-600 dark:text-gray-400"
                        >
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            <span className="text-lg">Loading more content...</span>
                        </motion.div>
                    ) : (
                        <div className="text-gray-400 dark:text-gray-500 text-sm">
                            Scroll down for more content
                        </div>
                    )}
                </div>
            )}

            {/* End of content indicator */}
            {!hasMore && content.length > 0 && (
                <div className="mt-8 text-center py-8">
                    <div className="text-gray-400 dark:text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🎉</span>
                        </div>
                        <p className="text-lg font-medium">You've reached the end!</p>
                        <p className="text-sm mt-2">That's all the content for now.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
