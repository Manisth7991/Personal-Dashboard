'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Heart, ExternalLink, Share, Clock, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { getImageWithFallback, FALLBACK_IMAGES } from '@/lib/imageUtils'

export interface ContentItem {
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
    }
}

// Utility functions
const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ')
}

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    } catch {
        return 'Unknown date'
    }
}

const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

// Simple localStorage favorites management
const getFavoritesFromStorage = (): string[] => {
    if (typeof window === 'undefined') return []
    try {
        const saved = localStorage.getItem('dashboard-favorites')
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const saveFavoritesToStorage = (favorites: string[]) => {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem('dashboard-favorites', JSON.stringify(favorites))
    } catch {
        // Silently fail
    }
}

interface ContentCardProps {
    item: ContentItem
    index?: number
    isDragging?: boolean
}

export function ContentCard({ item, index = 0, isDragging = false }: ContentCardProps) {
    const [favorites, setFavorites] = useState<string[]>([])
    const [imageError, setImageError] = useState(false)

    useEffect(() => {
        setFavorites(getFavoritesFromStorage())

        // Listen for favorites updates from other components
        const handleFavoritesUpdate = () => {
            setFavorites(getFavoritesFromStorage())
        }

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate)

        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
        }
    }, [])

    const isFavorite = favorites.includes(item.id)

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const newFavorites = isFavorite
            ? favorites.filter(id => id !== item.id)
            : [...favorites, item.id]

        setFavorites(newFavorites)
        saveFavoritesToStorage(newFavorites)

        // Dispatch custom event to notify other components about favorites update
        window.dispatchEvent(new CustomEvent('favoritesUpdated', {
            detail: { favorites: newFavorites, itemId: item.id, action: isFavorite ? 'remove' : 'add' }
        }))
    }

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (navigator.share && item.url) {
            navigator.share({
                title: item.title,
                text: item.description,
                url: item.url,
            })
        } else if (item.url) {
            navigator.clipboard.writeText(item.url)
        }
    }

    const getTypeIcon = () => {
        switch (item.type) {
            case 'news':
                return '📰'
            case 'movie':
                return '🎬'
            case 'social':
                return '💬'
            default:
                return '📄'
        }
    }

    const getTypeColor = () => {
        switch (item.type) {
            case 'news':
                return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
            case 'movie':
                return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
            case 'social':
                return 'text-green-600 bg-green-100 dark:bg-green-900/20'
            default:
                return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                'card group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
                isDragging && 'opacity-50 rotate-2 shadow-2xl'
            )}
            data-testid="content-card"
        >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                {!imageError ? (
                    <Image
                        src={imageError ? FALLBACK_IMAGES[item.type] : getImageWithFallback(item.image, item.type, index)}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={() => setImageError(true)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3} // Load first 3 images with priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                        {getTypeIcon()}
                    </div>
                )}

                {/* Type Badge */}
                <div className={cn(
                    'absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium',
                    getTypeColor()
                )}>
                    {item.type}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleToggleFavorite}
                    className={cn(
                        'absolute top-3 right-3 p-2 rounded-full transition-colors',
                        isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white'
                    )}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Metadata */}
                <div className="flex items-center justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                        {item.metadata?.source && (
                            <span className="font-medium">{item.metadata.source}</span>
                        )}
                        {item.metadata?.publishedAt && (
                            <>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDate(item.metadata.publishedAt)}</span>
                                </div>
                            </>
                        )}
                    </div>
                    {item.metadata?.rating && (
                        <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            <span>{item.metadata.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {truncateText(item.description || '', 120)}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 h-8 text-sm p-2"
                            aria-label="Share this content"
                            title="Share this content"
                        >
                            <Share className="w-4 h-4" />
                        </button>
                    </div>

                    {item.url && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 h-8 px-3 text-sm flex items-center space-x-1"
                            onClick={e => e.stopPropagation()}
                        >
                            <span>Read More</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export function ContentCardSkeleton() {
    return (
        <div className="card">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg animate-pulse" />
            <div className="p-4 space-y-3">
                <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
                </div>
            </div>
        </div>
    )
}

