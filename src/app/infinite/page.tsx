'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Settings, Globe } from 'lucide-react'
import { InfiniteContentGrid } from '@/components/content/infinite-content-grid'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { getAllMockContent, mockNewsData, mockMovieData, mockSocialData } from '@/lib/mockData'

// Language Picker Component
function LanguagePicker() {
    const { currentLanguage, setLanguage } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)

    const languageOptions = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: '中文', flag: '🇨🇳' }
    ]

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage)
        setIsOpen(false)
    }

    const currentLangInfo = languageOptions.find(lang => lang.code === currentLanguage) || languageOptions[0]

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-lg">{currentLangInfo.flag}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentLangInfo.name}
                </span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
                    {languageOptions.map((option) => (
                        <button
                            key={option.code}
                            onClick={() => handleLanguageChange(option.code)}
                            className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${currentLanguage === option.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <span className="text-lg">{option.flag}</span>
                            <span className="font-medium">{option.name}</span>
                            {currentLanguage === option.code && (
                                <span className="ml-auto text-blue-600 dark:text-blue-400">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

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

export default function InfiniteDashboard() {
    const { currentLanguage } = useLanguage()
    const [content, setContent] = useState<ContentItem[]>([])
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [dragDropEnabled, setDragDropEnabled] = useState(true)
    const [preferences, setPreferences] = useState({
        categories: ['technology', 'business', 'entertainment'],
        region: 'us',
        itemsPerPage: 12,
        autoRefresh: true,
        refreshInterval: 30
    })

    // Load preferences
    useEffect(() => {
        const savedPrefs = localStorage.getItem('dashboard-preferences')
        if (savedPrefs) {
            try {
                const parsed = JSON.parse(savedPrefs)
                setPreferences(prev => ({ ...prev, ...parsed }))
            } catch (error) {
                console.error('Error loading preferences:', error)
            }
        }

        const savedDragDrop = localStorage.getItem('dashboard-drag-drop')
        if (savedDragDrop) {
            setDragDropEnabled(JSON.parse(savedDragDrop))
        }
    }, [])

    // Mock API service functions
    const fetchMockNews = async (categories: string[], region: string, count: number): Promise<ContentItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        return mockNewsData.slice(0, count).map((item, index) => ({
            ...item,
            id: `${item.id}-${Date.now()}-${index}` // Ensure unique IDs
        }))
    }

    const fetchMockMovies = async (page: number): Promise<ContentItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        return mockMovieData.map((item, index) => ({
            ...item,
            id: `${item.id}-page-${page}-${index}` // Ensure unique IDs
        }))
    }

    // Fetch initial content
    const fetchInitialContent = useCallback(async () => {
        setIsInitialLoading(true)
        try {
            const [news, movies] = await Promise.all([
                fetchMockNews(preferences.categories, preferences.region, 6),
                fetchMockMovies(1)
            ])

            const mixedContent = [
                ...news.slice(0, 6),
                ...movies.slice(0, 6)
            ].sort(() => Math.random() - 0.5)

            setContent(mixedContent)
        } catch (error) {
            console.error('Error fetching initial content:', error)
            // Fallback to empty array - the grid will handle empty state
            setContent([])
        } finally {
            setIsInitialLoading(false)
        }
    }, [preferences])

    // Fetch more content for infinite scrolling
    const fetchMoreContent = useCallback(async (page: number): Promise<ContentItem[]> => {
        try {
            const [news, movies] = await Promise.all([
                fetchMockNews(preferences.categories, preferences.region, 6),
                fetchMockMovies(page)
            ])

            // Mix content types for variety
            const mixedContent = [
                ...news.slice(0, 6),
                ...movies.slice(0, 6),
                ...mockSocialData.map((item, index) => ({
                    ...item,
                    id: `${item.id}-page-${page}-${index}`
                }))
            ].sort(() => Math.random() - 0.5)

            // Add unique IDs for pagination
            return mixedContent.map((item, index) => ({
                ...item,
                id: `${item.id}-page-${page}-${index}`
            }))
        } catch (error) {
            console.error('Error fetching more content:', error)
            return []
        }
    }, [preferences])

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchInitialContent()
        setIsRefreshing(false)
    }

    // Load initial content on mount
    useEffect(() => {
        fetchInitialContent()
    }, [fetchInitialContent])

    // Auto-refresh setup
    useEffect(() => {
        if (!preferences.autoRefresh) return

        const interval = setInterval(() => {
            fetchInitialContent()
        }, preferences.refreshInterval * 1000)

        return () => clearInterval(interval)
    }, [preferences.autoRefresh, preferences.refreshInterval, fetchInitialContent])

    if (isInitialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {getTranslation('loading', currentLanguage)}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {getTranslation('preparingContent', currentLanguage)}
                    </p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {getTranslation('dashboard', currentLanguage)}
                            </h1>
                            <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-600" />
                            <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                                {getTranslation('personalizedContentFeed', currentLanguage)}
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <LanguagePicker />

                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                title={getTranslation('refresh', currentLanguage)}
                            >
                                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <InfiniteContentGrid
                    initialContent={content}
                    fetchMoreContent={fetchMoreContent}
                    enableDragDrop={dragDropEnabled}
                    itemsPerPage={preferences.itemsPerPage}
                    className="w-full"
                />
            </div>
        </div>
    )
}
