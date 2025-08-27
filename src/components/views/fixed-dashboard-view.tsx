'use client'

import { useState, useEffect } from 'react'
import { ContentCard } from '@/components/content/content-card'
import { RefreshCw, TrendingUp, Clock, Star } from 'lucide-react'

// Sample content data for dashboard
const dashboardContent = [
    {
        id: 'news-1',
        type: 'news' as const,
        title: 'AI Revolution: Breakthrough in Machine Learning',
        description: 'Scientists announce a revolutionary advancement in artificial intelligence that could transform computing and solve complex global challenges.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Tech Today',
            publishedAt: new Date().toISOString(),
            category: 'technology'
        }
    },
    {
        id: 'movie-1',
        type: 'movie' as const,
        title: 'Galactic Odyssey',
        description: 'An epic space adventure that follows a diverse crew as they explore uncharted galaxies and encounter alien civilizations.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Cinema Hub',
            publishedAt: '2024-01-15',
            rating: 8.9,
            category: 'sci-fi'
        }
    },
    {
        id: 'social-1',
        type: 'social' as const,
        title: 'Amazing sunrise this morning! 🌅',
        description: 'Woke up early to witness this breathtaking sunrise. The colors were absolutely magical - nature never fails to inspire!',
        image: 'https://picsum.photos/400/300?random=50',
        metadata: {
            source: 'Social Feed',
            author: '@naturelover',
            publishedAt: new Date(Date.now() - 1800000).toISOString()
        }
    },
    {
        id: 'news-2',
        type: 'news' as const,
        title: 'Global Climate Action Accelerates',
        description: 'World leaders unite on ambitious environmental policies, setting unprecedented targets for carbon emission reduction.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'World Report',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            category: 'environment'
        }
    },
    {
        id: 'movie-2',
        type: 'movie' as const,
        title: 'City Hearts',
        description: 'A heartwarming romantic drama set in bustling New York City, exploring love, dreams, and second chances.',
        image: 'https://picsum.photos/400/600?random=15',
        url: '#',
        metadata: {
            source: 'Movie Central',
            publishedAt: '2024-02-20',
            rating: 7.8,
            category: 'romance'
        }
    },
    {
        id: 'social-2',
        type: 'social' as const,
        title: 'Productive coding session! 💻',
        description: 'Just finished building an amazing new feature. The satisfaction of clean code and smooth functionality never gets old!',
        metadata: {
            source: 'Dev Community',
            author: '@coder_life',
            publishedAt: new Date(Date.now() - 5400000).toISOString()
        }
    }
]

export function DashboardView() {
    const [content, setContent] = useState(dashboardContent)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(new Date())

    const handleRefresh = async () => {
        setIsRefreshing(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // Update content with fresh timestamps
        const refreshedContent = dashboardContent.map(item => ({
            ...item,
            metadata: {
                ...item.metadata,
                publishedAt: item.metadata?.publishedAt ?
                    new Date(Date.now() - Math.random() * 3600000).toISOString() :
                    item.metadata?.publishedAt
            }
        }))

        setContent(refreshedContent)
        setLastUpdate(new Date())
        setIsRefreshing(false)
    }

    // Auto-refresh every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            handleRefresh()
        }, 5 * 60 * 1000)

        return () => clearInterval(interval)
    }, [])

    const newsItems = content.filter(item => item.type === 'news')
    const movieItems = content.filter(item => item.type === 'movie')
    const socialItems = content.filter(item => item.type === 'social')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your personalized content feed
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Items
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {content.length}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Favorites
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {typeof window !== 'undefined' ?
                                    JSON.parse(localStorage.getItem('dashboard-favorites') || '[]').length :
                                    0
                                }
                            </p>
                        </div>
                        <Star className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Last Refresh
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {Math.floor((Date.now() - lastUpdate.getTime()) / 60000)}m
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-green-600" />
                    </div>
                </div>
            </div>

            {/* Trending Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    🔥 Trending Now
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.slice(0, 3).map((item, index) => (
                        <ContentCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>

            {/* Latest News */}
            {newsItems.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        📰 Latest News
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {newsItems.map((item, index) => (
                            <ContentCard key={item.id} item={item} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {/* Featured Movies */}
            {movieItems.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        🎬 Featured Movies
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {movieItems.map((item, index) => (
                            <ContentCard key={item.id} item={item} index={index} />
                        ))}
                    </div>
                </div>
            )}

            {/* Social Updates */}
            {socialItems.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        💬 Social Updates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {socialItems.map((item, index) => (
                            <ContentCard key={item.id} item={item} index={index} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

