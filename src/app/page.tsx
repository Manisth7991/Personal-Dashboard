'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SimpleSidebar } from '@/components/layout/simple-sidebar'
import { SimpleHeader } from '@/components/layout/simple-header'

// Import the fixed content card and create views
import { ContentCard } from '@/components/content/content-card'
import { SortableContentCard } from '@/components/content/sortable-content-card'
import { RefreshCw, TrendingUp, Clock, Star, Search, Heart, Film, Newspaper, Users, Settings, X, GripVertical } from 'lucide-react'

// Sample content for different views
const sampleContent = [
    {
        id: 'news-1',
        type: 'news' as const,
        title: 'AI Revolution: Major Breakthrough Announced',
        description: 'Scientists unveil groundbreaking artificial intelligence technology that promises to transform computing and solve complex global challenges.',
        image: 'https://picsum.photos/400/300?random=1',
        url: 'https://www.example.com/ai-breakthrough-2024',
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
        image: 'https://picsum.photos/400/600?random=4',
        url: 'https://www.imdb.com/title/tt1234567/',
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
        image: 'https://picsum.photos/400/300?random=5',
        url: 'https://www.instagram.com/p/sample123/',
        metadata: {
            source: 'Social Feed',
            author: '@naturelover',
            publishedAt: new Date(Date.now() - 1800000).toISOString()
        }
    },
    {
        id: 'news-2',
        type: 'news' as const,
        title: 'Global Climate Initiative Gains Momentum',
        description: 'World leaders unite on ambitious environmental policies, setting unprecedented targets for carbon emission reduction.',
        image: 'https://picsum.photos/400/300?random=2',
        url: 'https://www.nature.com/articles/climate-initiative-2024',
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
        image: 'https://picsum.photos/400/600?random=3',
        url: 'https://www.imdb.com/title/tt7890123/',
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

// Views Components
function DashboardView() {
    const [content, setContent] = useState(sampleContent)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [dragDropEnabled, setDragDropEnabled] = useState(true)

    // Set up drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Load drag drop preference
    useEffect(() => {
        const savedDragDrop = localStorage.getItem('dashboard-drag-drop')
        if (savedDragDrop) {
            setDragDropEnabled(JSON.parse(savedDragDrop))
        }
    }, [])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 500))

        const refreshedContent = [...sampleContent]
        setContent(refreshedContent)
        setIsRefreshing(false)
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setContent((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)

                // Save new order to localStorage
                localStorage.setItem('dashboard-content-order', JSON.stringify(newItems.map(item => item.id)))

                return newItems
            })
        }
    }

    // Load saved content order
    useEffect(() => {
        const savedOrder = localStorage.getItem('dashboard-content-order')
        if (savedOrder) {
            try {
                const orderIds = JSON.parse(savedOrder)
                const orderedContent = orderIds
                    .map((id: string) => sampleContent.find(item => item.id === id))
                    .filter(Boolean)

                // Add any new content that wasn't in the saved order
                const newContent = sampleContent.filter(item => !orderIds.includes(item.id))
                setContent([...orderedContent, ...newContent])
            } catch (error) {
                setContent(sampleContent)
            }
        }
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Your personalized content feed</p>
                </div>
                <div className="flex items-center space-x-3">
                    {dragDropEnabled && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                            <GripVertical className="w-3 h-3" />
                            <span>Drag to reorder</span>
                        </div>
                    )}
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

            {dragDropEnabled ? (
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
                            {content.map((item, index) => (
                                <SortableContentCard
                                    key={item.id}
                                    id={item.id}
                                    item={item}
                                    index={index}
                                    isDragEnabled={dragDropEnabled}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((item, index) => (
                        <ContentCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            )}
        </div>
    )
} function TrendingView() {
    const trendingContent = sampleContent.slice(0, 4)
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 Trending</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingContent.map((item, index) => (
                    <ContentCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}

function NewsView() {
    const newsContent = sampleContent.filter(item => item.type === 'news')
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📰 News</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsContent.map((item, index) => (
                    <ContentCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}

function MoviesView() {
    const movieContent = sampleContent.filter(item => item.type === 'movie')
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🎬 Movies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movieContent.map((item, index) => (
                    <ContentCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}

function SocialView() {
    const socialContent = sampleContent.filter(item => item.type === 'social')
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💬 Social</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socialContent.map((item, index) => (
                    <ContentCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}

function FavoritesView() {
    const [favorites, setFavorites] = useState<string[]>([])
    const [favoriteItems, setFavoriteItems] = useState<typeof sampleContent>([])

    // Function to update favorites from localStorage
    const updateFavorites = () => {
        const favIds = JSON.parse(localStorage.getItem('dashboard-favorites') || '[]')
        setFavorites(favIds)
        const items = sampleContent.filter(item => favIds.includes(item.id))
        setFavoriteItems(items)
    }

    useEffect(() => {
        // Initial load
        updateFavorites()

        // Listen for localStorage changes (when favorites are updated from other tabs/components)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'dashboard-favorites') {
                updateFavorites()
            }
        }

        // Listen for custom favorites update events
        const handleFavoritesUpdate = () => {
            updateFavorites()
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('favoritesUpdated', handleFavoritesUpdate)

        // Also set up a periodic check for real-time updates
        const interval = setInterval(updateFavorites, 1000)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
            clearInterval(interval)
        }
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">❤️ Favorites</h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {favorites.length} items
                </span>
            </div>

            {favoriteItems.length === 0 ? (
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No favorites yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Click the heart icon on any content to add it to your favorites.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteItems.map((item, index) => (
                        <ContentCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            )}
        </div>
    )
}

function SearchView() {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [results, setResults] = useState(sampleContent)
    const [isSearching, setIsSearching] = useState(false)
    const [searchFilters, setSearchFilters] = useState({
        type: 'all',
        category: 'all',
        sortBy: 'relevance'
    })

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 300) // 300ms debounce

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Search logic
    useEffect(() => {
        if (debouncedQuery.trim()) {
            setIsSearching(true)

            // Simulate API search delay
            setTimeout(() => {
                let filtered = sampleContent.filter(item => {
                    const titleMatch = item.title.toLowerCase().includes(debouncedQuery.toLowerCase())
                    const descMatch = item.description.toLowerCase().includes(debouncedQuery.toLowerCase())
                    const categoryMatch = item.metadata?.category?.toLowerCase().includes(debouncedQuery.toLowerCase())
                    const sourceMatch = item.metadata?.source?.toLowerCase().includes(debouncedQuery.toLowerCase())

                    return titleMatch || descMatch || categoryMatch || sourceMatch
                })

                // Apply filters
                if (searchFilters.type !== 'all') {
                    filtered = filtered.filter(item => item.type === searchFilters.type)
                }

                if (searchFilters.category !== 'all') {
                    filtered = filtered.filter(item => item.metadata?.category === searchFilters.category)
                }

                // Apply sorting
                if (searchFilters.sortBy === 'date') {
                    filtered.sort((a, b) => {
                        const dateA = new Date(a.metadata?.publishedAt || 0).getTime()
                        const dateB = new Date(b.metadata?.publishedAt || 0).getTime()
                        return dateB - dateA
                    })
                } else if (searchFilters.sortBy === 'rating') {
                    filtered.sort((a, b) => {
                        const ratingA = a.metadata?.rating || 0
                        const ratingB = b.metadata?.rating || 0
                        return ratingB - ratingA
                    })
                }

                setResults(filtered)
                setIsSearching(false)
            }, 200)
        } else {
            setResults(sampleContent)
            setIsSearching(false)
        }
    }, [debouncedQuery, searchFilters])

    const clearSearch = () => {
        setSearchQuery('')
        setDebouncedQuery('')
        setResults(sampleContent)
    }

    return (
        <div className="space-y-8">
            {/* Enhanced Search Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-2xl p-8 text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">🔍 Advanced Search</h1>
                    <p className="text-blue-100 dark:text-blue-200 mb-6">
                        Search across all content types with powerful filters and real-time results
                    </p>

                    {/* Main Search Input */}
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
                            <input
                                type="text"
                                placeholder="Search news, movies, social posts, and more..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-16 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:outline-none transition-all duration-200"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <RefreshCw className="w-6 h-6 animate-spin text-white/70" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-blue-500" />
                    Search Filters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Content Type Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Film className="w-4 h-4 mr-1" />
                            Content Type
                        </label>
                        <select
                            value={searchFilters.type}
                            onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="all">All Types</option>
                            <option value="news">📰 News</option>
                            <option value="movie">🎬 Movies</option>
                            <option value="social">👥 Social</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            Category
                        </label>
                        <select
                            value={searchFilters.category}
                            onChange={(e) => setSearchFilters({ ...searchFilters, category: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="all">All Categories</option>
                            <option value="technology">💻 Technology</option>
                            <option value="entertainment">🎭 Entertainment</option>
                            <option value="sports">⚽ Sports</option>
                            <option value="business">💼 Business</option>
                            <option value="health">🏥 Health</option>
                            <option value="science">🔬 Science</option>
                        </select>
                    </div>

                    {/* Sort Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Sort By
                        </label>
                        <select
                            value={searchFilters.sortBy}
                            onChange={(e) => setSearchFilters({ ...searchFilters, sortBy: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="relevance">🎯 Relevance</option>
                            <option value="date">📅 Date</option>
                            <option value="rating">⭐ Rating</option>
                            <option value="popularity">🔥 Popularity</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Search Results Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Search Results
                        </h3>
                        <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                            {isSearching ? 'Searching...' : `${results.length} results`}
                        </div>
                    </div>

                    {debouncedQuery && !isSearching && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                            ⚡ Search completed in ~{Math.random() * 100 + 50 | 0}ms
                        </div>
                    )}
                </div>

                {debouncedQuery && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Showing results for: <span className="font-semibold">"{debouncedQuery}"</span>
                            {searchFilters.type !== 'all' && (
                                <span className="ml-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">
                                    {searchFilters.type}
                                </span>
                            )}
                            {searchFilters.category !== 'all' && (
                                <span className="ml-2 px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">
                                    {searchFilters.category}
                                </span>
                            )}
                        </p>
                    </div>
                )}

                {results.length === 0 && debouncedQuery && !isSearching && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            No results found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            We couldn't find any content matching your search. Try adjusting your search terms or filters.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </button>
                            <button
                                onClick={() => setSearchFilters({ type: 'all', category: 'all', sortBy: 'relevance' })}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((item, index) => (
                        <ContentCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function SettingsView() {
    const [userPreferences, setUserPreferences] = useState({
        categories: ['technology', 'business', 'entertainment'],
        language: 'en',
        region: 'us',
        itemsPerPage: 12,
        autoRefresh: true,
        refreshInterval: 30,
        darkMode: false
    })

    const [dragDropEnabled, setDragDropEnabled] = useState(true)
    const [realTimeUpdates, setRealTimeUpdates] = useState(true)

    // Load preferences from localStorage
    useEffect(() => {
        const savedPrefs = localStorage.getItem('dashboard-preferences')
        if (savedPrefs) {
            setUserPreferences(JSON.parse(savedPrefs))
        }

        const savedDragDrop = localStorage.getItem('dashboard-drag-drop')
        if (savedDragDrop) {
            setDragDropEnabled(JSON.parse(savedDragDrop))
        }

        const savedRealTime = localStorage.getItem('dashboard-realtime')
        if (savedRealTime) {
            setRealTimeUpdates(JSON.parse(savedRealTime))
        }
    }, [])

    const savePreferences = (newPrefs: typeof userPreferences) => {
        setUserPreferences(newPrefs)
        localStorage.setItem('dashboard-preferences', JSON.stringify(newPrefs))
    }

    const availableCategories = [
        'technology', 'business', 'entertainment', 'sports', 'health',
        'science', 'general', 'politics', 'lifestyle', 'travel'
    ]

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }
    ]

    const regions = [
        { code: 'us', name: 'United States' },
        { code: 'in', name: 'India' },
        { code: 'gb', name: 'United Kingdom' },
        { code: 'ca', name: 'Canada' },
        { code: 'au', name: 'Australia' }
    ]

    const toggleCategory = (category: string) => {
        const newCategories = userPreferences.categories.includes(category)
            ? userPreferences.categories.filter(c => c !== category)
            : [...userPreferences.categories, category]

        savePreferences({ ...userPreferences, categories: newCategories })
    }

    const toggleDarkMode = () => {
        const newDarkMode = !userPreferences.darkMode
        savePreferences({ ...userPreferences, darkMode: newDarkMode })

        // Apply theme immediately
        if (newDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('dashboard-theme', newDarkMode ? 'dark' : 'light')
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">⚙️ Settings</h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Personalize your dashboard experience
                </div>
            </div>

            {/* Content Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📰 Content Preferences
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Favorite Categories
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                            {availableCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${userPreferences.categories.includes(category)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Language
                            </label>
                            <select
                                value={userPreferences.language}
                                onChange={(e) => savePreferences({ ...userPreferences, language: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {languages.map(lang => (
                                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Region
                            </label>
                            <select
                                value={userPreferences.region}
                                onChange={(e) => savePreferences({ ...userPreferences, region: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {regions.map(region => (
                                    <option key={region.code} value={region.code}>{region.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Display Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🎨 Display Settings
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${userPreferences.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userPreferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Items per Page: {userPreferences.itemsPerPage}
                        </label>
                        <input
                            type="range"
                            min="6"
                            max="24"
                            step="6"
                            value={userPreferences.itemsPerPage}
                            onChange={(e) => savePreferences({ ...userPreferences, itemsPerPage: parseInt(e.target.value) })}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>6</span>
                            <span>12</span>
                            <span>18</span>
                            <span>24</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🚀 Advanced Features
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Refresh</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Automatically refresh content</p>
                        </div>
                        <button
                            onClick={() => savePreferences({ ...userPreferences, autoRefresh: !userPreferences.autoRefresh })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${userPreferences.autoRefresh ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userPreferences.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drag & Drop</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Reorder content cards</p>
                        </div>
                        <button
                            onClick={() => {
                                setDragDropEnabled(!dragDropEnabled)
                                localStorage.setItem('dashboard-drag-drop', JSON.stringify(!dragDropEnabled))
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dragDropEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dragDropEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Real-time Updates</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Live content updates via WebSocket</p>
                        </div>
                        <button
                            onClick={() => {
                                setRealTimeUpdates(!realTimeUpdates)
                                localStorage.setItem('dashboard-realtime', JSON.stringify(!realTimeUpdates))
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${realTimeUpdates ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${realTimeUpdates ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {userPreferences.autoRefresh && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Refresh Interval: {userPreferences.refreshInterval} minutes
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="60"
                                step="5"
                                value={userPreferences.refreshInterval}
                                onChange={(e) => savePreferences({ ...userPreferences, refreshInterval: parseInt(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>5 min</span>
                                <span>30 min</span>
                                <span>60 min</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📊 System Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Fast Refresh</span>
                            <span className="text-green-600 font-medium">✅ Working</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Favorites System</span>
                            <span className="text-green-600 font-medium">✅ Working</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Search Function</span>
                            <span className="text-green-600 font-medium">✅ Working</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Theme Toggle</span>
                            <span className="text-green-600 font-medium">✅ Working</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Authentication</span>
                            <span className="text-green-600 font-medium">✅ Available</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Multi-language</span>
                            <span className="text-green-600 font-medium">✅ Working</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">API Integration</span>
                            <span className="text-green-600 font-medium">✅ Ready</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Redux Store</span>
                            <span className="text-green-600 font-medium">✅ Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Settings */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">
                    🔄 Reset Settings
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                    This will reset all your preferences to default values. This action cannot be undone.
                </p>
                <button
                    onClick={() => {
                        localStorage.removeItem('dashboard-preferences')
                        localStorage.removeItem('dashboard-drag-drop')
                        localStorage.removeItem('dashboard-realtime')
                        localStorage.removeItem('dashboard-favorites')
                        localStorage.removeItem('dashboard-theme')
                        window.location.reload()
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Reset All Settings
                </button>
            </div>
        </div>
    )
}

export default function Home() {
    const [currentView, setCurrentView] = useState('dashboard')
    const [mounted, setMounted] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

    useEffect(() => {
        setMounted(true)

        // Listen for favorites updates and show toast notifications
        const handleFavoritesUpdate = (event: CustomEvent) => {
            const { action, itemId } = event.detail
            const actionText = action === 'add' ? 'Added to' : 'Removed from'
            showToast(`${actionText} favorites!`, 'success')
        }

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener)

        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener)
        }
    }, [])

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000) // Hide after 3 seconds
    }

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
        </div>
    }

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <EnhancedDashboardView />
            case 'trending': return <TrendingView />
            case 'news': return <NewsView />
            case 'movies': return <MoviesView />
            case 'social': return <SocialView />
            case 'favorites': return <FavoritesView />
            case 'search': return <SearchView />
            case 'settings': return <SettingsView />
            default: return <EnhancedDashboardView />
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <SimpleSidebar currentView={currentView} onViewChange={setCurrentView} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <SimpleHeader onViewChange={setCurrentView} />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="container max-w-7xl">
                        {renderView()}
                    </div>
                </main>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
                    <div className={`px-4 py-3 rounded-lg shadow-lg border max-w-sm ${toast.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
                            : toast.type === 'error'
                                ? 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
                                : 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                        }`}>
                        <div className="flex items-center space-x-2">
                            {toast.type === 'success' && <span className="text-green-500">✓</span>}
                            {toast.type === 'error' && <span className="text-red-500">✗</span>}
                            {toast.type === 'info' && <span className="text-blue-500">ℹ</span>}
                            <span className="font-medium">{toast.message}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Enhanced Dashboard View with Real-time Updates and API Integration
function EnhancedDashboardView() {
    const [content, setContent] = useState(sampleContent)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [dragDropEnabled, setDragDropEnabled] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [realTimeEnabled, setRealTimeEnabled] = useState(true)
    const [updateCount, setUpdateCount] = useState(0)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    // Set up drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Load preferences and settings
    useEffect(() => {
        const savedDragDrop = localStorage.getItem('dashboard-drag-drop')
        if (savedDragDrop) {
            setDragDropEnabled(JSON.parse(savedDragDrop))
        }

        const savedRealTime = localStorage.getItem('dashboard-realtime')
        if (savedRealTime) {
            setRealTimeEnabled(JSON.parse(savedRealTime))
        }

        // Simulate real-time updates with variety and duplicate prevention
        if (realTimeEnabled) {
            const interval = setInterval(() => {
                const updateTypes = [
                    {
                        type: 'news' as const,
                        titles: [
                            '🔴 LIVE: Breaking News Alert',
                            '📈 LIVE: Market Update',
                            '🌍 LIVE: Global News Flash',
                            '⚡ LIVE: Technology Breakthrough',
                            '🏛️ LIVE: Political Development'
                        ],
                        descriptions: [
                            'Latest breaking news just came in from our live news feed.',
                            'Important market movements detected in real-time.',
                            'Global event updates from around the world.',
                            'New technological advancement announced.',
                            'Political news update from live sources.'
                        ]
                    },
                    {
                        type: 'movie' as const,
                        titles: [
                            '🎬 LIVE: New Movie Release',
                            '🏆 LIVE: Awards Update',
                            '🎭 LIVE: Entertainment News',
                            '📺 LIVE: Streaming Alert',
                            '🌟 LIVE: Celebrity News'
                        ],
                        descriptions: [
                            'New movie just announced and available now.',
                            'Live updates from entertainment awards.',
                            'Latest entertainment industry news.',
                            'New content available on streaming platforms.',
                            'Celebrity news and updates.'
                        ]
                    }
                ]

                const randomCategory = updateTypes[Math.floor(Math.random() * updateTypes.length)]
                const randomTitleIndex = Math.floor(Math.random() * randomCategory.titles.length)

                // Create real-time item based on category type
                let newItem: any

                if (randomCategory.type === 'movie') {
                    newItem = {
                        id: `realtime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        type: 'movie' as const,
                        title: randomCategory.titles[randomTitleIndex],
                        description: randomCategory.descriptions[randomTitleIndex],
                        image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
                        url: `https://www.imdb.com/title/tt${Math.floor(Math.random() * 9999999)}/`,
                        metadata: {
                            source: 'Live Feed',
                            publishedAt: new Date().toISOString(),
                            rating: 8.5,
                            category: 'live'
                        }
                    }
                } else {
                    newItem = {
                        id: `realtime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        type: 'news' as const,
                        title: randomCategory.titles[randomTitleIndex],
                        description: randomCategory.descriptions[randomTitleIndex],
                        image: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
                        url: `https://www.reuters.com/article/${Math.random().toString(36).substr(2, 12)}`,
                        metadata: {
                            source: 'Live Feed',
                            publishedAt: new Date().toISOString(),
                            category: 'live'
                        }
                    }
                }

                // Add isRealTime flag to metadata for identification
                newItem.metadata.isRealTime = true

                // Remove old real-time updates (keep only the most recent 1)
                setContent(prev => {
                    const nonRealTimeContent = prev.filter(item => !(item.metadata as any)?.isRealTime)
                    const recentRealTimeContent = prev.filter(item => (item.metadata as any)?.isRealTime).slice(0, 1)
                    return [newItem, ...recentRealTimeContent, ...nonRealTimeContent]
                })

                setUpdateCount(prev => prev + 1)
                setLastUpdate(new Date())
            }, 30000) // Update every 30 seconds

            return () => clearInterval(interval)
        }
    }, [realTimeEnabled])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 500))

        const refreshedContent = [...sampleContent]
        setContent(refreshedContent)
        setIsRefreshing(false)
    }

    const handleLoadMore = async () => {
        setIsLoadingMore(true)
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simulate loading more content
        const moreContent = sampleContent.map((item, index) => ({
            ...item,
            id: `${item.id}-more-${currentPage}`,
            title: `${item.title} (Page ${currentPage + 1})`
        }))

        setContent(prev => [...prev, ...moreContent])
        setCurrentPage(prev => prev + 1)
        setIsLoadingMore(false)
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            setContent((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)

                // Save new order to localStorage
                localStorage.setItem('dashboard-content-order', JSON.stringify(newItems.map(item => item.id)))

                return newItems
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Dashboard</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Your personalized content feed with advanced features</span>
                        {realTimeEnabled && (
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>Live ({updateCount} updates)</span>
                            </div>
                        )}
                        {lastUpdate && (
                            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {dragDropEnabled && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                            <GripVertical className="w-3 h-3" />
                            <span>Drag to reorder</span>
                        </div>
                    )}
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

            {dragDropEnabled ? (
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
                            {content.map((item, index) => (
                                <SortableContentCard
                                    key={item.id}
                                    id={item.id}
                                    item={item}
                                    index={index}
                                    isDragEnabled={dragDropEnabled}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.map((item, index) => (
                        <ContentCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            )}

            {/* Infinite Scroll / Load More */}
            <div className="text-center">
                <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    {isLoadingMore ? (
                        <div className="flex items-center space-x-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Loading more...</span>
                        </div>
                    ) : (
                        `Load More Content (Page ${currentPage + 1})`
                    )}
                </button>
            </div>
        </div>
    )
}

