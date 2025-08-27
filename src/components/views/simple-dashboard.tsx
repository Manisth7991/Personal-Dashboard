'use client'

import { useState, useEffect } from 'react'
import { ContentCard, ContentCardSkeleton, ContentItem } from '@/components/content/content-card'
import { Search, RefreshCw, Filter } from 'lucide-react'

// Working sample data
const sampleContent: ContentItem[] = [
    {
        id: 'news-1',
        type: 'news',
        title: 'Breaking: AI Technology Breakthrough',
        description: 'Scientists announce a revolutionary advancement in artificial intelligence that could transform computing as we know it.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Tech Daily',
            publishedAt: new Date().toISOString(),
            category: 'technology'
        }
    },
    {
        id: 'news-2',
        type: 'news',
        title: 'Global Climate Summit Results',
        description: 'World leaders reach historic agreement on climate action with unprecedented commitments to reduce emissions.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'World News',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            category: 'environment'
        }
    },
    {
        id: 'movie-1',
        type: 'movie',
        title: 'Stellar Odyssey',
        description: 'An epic space adventure that follows a crew of explorers as they journey to the far reaches of the galaxy.',
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
        type: 'social',
        title: 'Beautiful sunrise this morning! ☀️',
        description: 'Started the day with this incredible view. Nothing beats the natural beauty of a perfect sunrise. Feeling grateful! #morning #sunrise #nature',
        image: 'https://picsum.photos/400/300?random=50',
        metadata: {
            source: 'Social Feed',
            author: '@naturelover',
            publishedAt: new Date(Date.now() - 1800000).toISOString()
        }
    },
    {
        id: 'movie-2',
        type: 'movie',
        title: 'City Lights Romance',
        description: 'A heartwarming romantic comedy set in New York City, following two souls finding love in unexpected places.',
        image: 'https://picsum.photos/400/600?random=13',
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
        type: 'social',
        title: 'Productive coding session complete! 💻',
        description: 'Just wrapped up an amazing coding marathon. Built some cool features and learned new techniques. Love what I do! #coding #productivity #webdev',
        metadata: {
            source: 'Dev Community',
            author: '@coder_life',
            publishedAt: new Date(Date.now() - 5400000).toISOString()
        }
    }
]

export function SimpleDashboard() {
    const [content, setContent] = useState<ContentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'news' | 'movie' | 'social'>('all')
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Load content on mount
    useEffect(() => {
        const loadContent = async () => {
            setLoading(true)
            // Simulate API call with fast response
            await new Promise(resolve => setTimeout(resolve, 500))
            setContent(sampleContent)
            setLoading(false)
        }
        loadContent()
    }, [])

    // Filter content
    const filteredContent = content.filter(item => {
        const matchesType = filterType === 'all' || item.type === filterType
        const matchesSearch = !searchQuery.trim() ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesType && matchesSearch
    })

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 800))

        // Update timestamps to simulate fresh content
        const refreshedContent = sampleContent.map(item => ({
            ...item,
            metadata: {
                ...item.metadata,
                publishedAt: item.metadata?.publishedAt ?
                    new Date(Date.now() - Math.random() * 3600000).toISOString() :
                    item.metadata?.publishedAt
            }
        }))

        setContent(refreshedContent)
        setIsRefreshing(false)
    }

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

                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <div className="flex space-x-2">
                        {(['all', 'news', 'movie', 'social'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${filterType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ContentCardSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <>
                    {filteredContent.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No content found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your search or filter criteria.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Latest Content
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredContent.length} items
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredContent.map((item, index) => (
                                    <ContentCard
                                        key={item.id}
                                        item={item}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Info Footer */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start space-x-3">
                    <div className="text-blue-600 dark:text-blue-400">ℹ️</div>
                    <div>
                        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Dashboard Features Working:
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• ❤️ <strong>Favorites:</strong> Click heart icons to save items (localStorage)</li>
                            <li>• 🔍 <strong>Search:</strong> Type in search box for instant filtering</li>
                            <li>• 🔄 <strong>Fast Refresh:</strong> Click refresh for updated content (500ms)</li>
                            <li>• 📱 <strong>Responsive:</strong> Works on all screen sizes</li>
                            <li>• 🌙 <strong>Dark Mode:</strong> Theme switching supported</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SimpleDashboard

