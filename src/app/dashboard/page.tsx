'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { motion, AnimatePresence } from 'framer-motion'
import { SimpleSidebar } from '@/components/layout/simple-sidebar'
import { SimpleHeader } from '@/components/layout/simple-header'

// Import the fixed content card and create views
import { ContentCard } from '@/components/content/content-card'
import { SortableContentCard } from '@/components/content/sortable-content-card'
import { RefreshCw, TrendingUp, Clock, Star, Search, Heart, Film, Newspaper, Users, Settings, X, GripVertical } from 'lucide-react'

// Import auth related
import { AuthWrapper } from '@/components/auth/AuthWrapper'
import { getAllMockContent, ContentItem } from '@/lib/mockData'
import { getUnsplashImage } from '@/lib/imageUtils'
import { RootState } from '@/store'

// Import hooks for theme only (remove language)
import { useTheme } from '@/hooks/useTheme'

// Placeholder components for now - will be replaced with actual implementations
const UserPreferencesPanel = () => {
    const { theme, currentTheme, setTheme } = useTheme()

    const [preferences, setPreferences] = useState({
        notifications: true,
        autoRefresh: true,
        itemsPerPage: 12,
        favoriteCategories: ['technology', 'business', 'entertainment'],
        contentTypes: {
            news: true,
            movies: true,
            social: true
        },
        privacy: {
            analytics: true,
            cookies: true,
            dataSharing: false
        }
    })
    const [activeSection, setActiveSection] = useState('general')
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        // Load saved preferences
        const saved = localStorage.getItem('dashboard-preferences')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setPreferences(prev => ({ ...prev, ...parsed }))
            } catch (error) {
                console.error('Error loading preferences:', error)
            }
        }
    }, [])

    const updatePreference = (path: string, value: any) => {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)

        setPreferences(prev => {
            const newPrefs = { ...prev }
            const keys = path.split('.')
            let current: any = newPrefs

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]]
            }
            current[keys[keys.length - 1]] = value

            // Save to localStorage
            localStorage.setItem('dashboard-preferences', JSON.stringify(newPrefs))

            return newPrefs
        })
    }

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)

        if (newTheme === 'auto') {
            setTheme('system')
        } else {
            setTheme(newTheme)
        }
    }

    const sections = [
        { id: 'general', name: 'General', icon: '⚙️' },
        { id: 'appearance', name: 'Appearance', icon: '🎨' },
        { id: 'content', name: 'Content', icon: '📱' },
        { id: 'privacy', name: 'Privacy', icon: '🔒' },
        { id: 'about', name: 'About', icon: 'ℹ️' }
    ]

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3"
            >
                <Settings className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Settings
                </h1>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Settings Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <nav className="space-y-2">
                            {sections.map((section, index) => (
                                <motion.button
                                    key={section.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeSection === section.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="text-lg">{section.icon}</span>
                                    <span className="font-medium">{section.name}</span>
                                    {activeSection === section.id && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </nav>
                    </div>
                </motion.div>

                {/* Settings Content */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                        >
                            {/* General Settings */}
                            {activeSection === 'general' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        General Settings
                                    </h2>

                                    <div className="space-y-4">
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div>
                                                <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Enable Notifications
                                                </label>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Get notified about new content and updates
                                                </p>
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => updatePreference('notifications', !preferences.notifications)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.notifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <motion.span
                                                    animate={{ x: preferences.notifications ? 20 : 2 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
                                                />
                                            </motion.button>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div>
                                                <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Auto Refresh
                                                </label>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Automatically refresh content every 30 seconds
                                                </p>
                                            </div>
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => updatePreference('autoRefresh', !preferences.autoRefresh)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.autoRefresh ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <motion.span
                                                    animate={{ x: preferences.autoRefresh ? 20 : 2 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
                                                />
                                            </motion.button>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3"
                                        >
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                Items per Page: {preferences.itemsPerPage}
                                            </label>
                                            <input
                                                type="range"
                                                min="6"
                                                max="24"
                                                step="6"
                                                value={preferences.itemsPerPage}
                                                onChange={(e) => updatePreference('itemsPerPage', parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>6</span>
                                                <span>12</span>
                                                <span>18</span>
                                                <span>24</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Settings */}
                            {activeSection === 'appearance' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Appearance
                                    </h2>

                                    <div className="space-y-4">
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                Theme: {theme === 'system' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'}
                                            </h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {[
                                                    { key: 'light', label: 'Light', icon: '☀️' },
                                                    { key: 'dark', label: 'Dark', icon: '🌙' },
                                                    { key: 'auto', label: 'Auto', icon: '🌓' }
                                                ].map((themeOption) => (
                                                    <motion.button
                                                        key={themeOption.key}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleThemeChange(themeOption.key as 'light' | 'dark' | 'auto')}
                                                        className={`p-3 rounded-lg border-2 transition-all ${(themeOption.key === 'auto' && theme === 'system') ||
                                                            (themeOption.key === theme)
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                                                            } ${themeOption.key === 'light'
                                                                ? 'bg-white text-gray-900'
                                                                : themeOption.key === 'dark'
                                                                    ? 'bg-gray-800 text-white'
                                                                    : 'bg-gradient-to-r from-white to-gray-800 text-gray-900'
                                                            }`}
                                                    >
                                                        <div className="text-center">
                                                            <div className="text-lg mb-1">
                                                                {themeOption.icon}
                                                            </div>
                                                            <span className="text-xs font-medium">{themeOption.label}</span>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* Content Settings */}
                            {activeSection === 'content' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Content Preferences
                                    </h2>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                            Favorite Categories
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                            {['technology', 'business', 'entertainment', 'sports', 'health',
                                                'science', 'general', 'politics', 'lifestyle', 'travel'].map(category => (
                                                    <motion.button
                                                        key={category}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            // Toggle category selection
                                                            const currentCategories = preferences.favoriteCategories || ['technology', 'business', 'entertainment']
                                                            const newCategories = currentCategories.includes(category)
                                                                ? currentCategories.filter(cat => cat !== category)
                                                                : [...currentCategories, category]
                                                            updatePreference('favoriteCategories', newCategories)
                                                        }}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${(preferences.favoriteCategories || ['technology', 'business', 'entertainment']).includes(category)
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </motion.button>
                                                ))}
                                        </div>

                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                            Content Types
                                        </h3>
                                        {Object.entries(preferences.contentTypes).map(([type, enabled]) => (
                                            <motion.div
                                                key={type}
                                                whileHover={{ scale: 1.01 }}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-lg">
                                                        {type === 'news' ? '📰' : type === 'movies' ? '🎬' : '💬'}
                                                    </span>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </label>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Show {type} in feed
                                                        </p>
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => updatePreference(`contentTypes.${type}`, !enabled)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                        }`}
                                                >
                                                    <motion.span
                                                        animate={{ x: enabled ? 20 : 2 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
                                                    />
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Privacy Settings */}
                            {activeSection === 'privacy' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>

                                    <div className="space-y-4">
                                        {Object.entries(preferences.privacy).map(([setting, enabled]) => (
                                            <motion.div
                                                key={setting}
                                                whileHover={{ scale: 1.01 }}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                            >
                                                <div>
                                                    <label className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                        {setting.replace(/([A-Z])/g, ' $1')}
                                                    </label>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {setting === 'analytics' && 'Help improve the app with usage analytics'}
                                                        {setting === 'cookies' && 'Allow cookies for better user experience'}
                                                        {setting === 'dataSharing' && 'Share data with third-party services'}
                                                    </p>
                                                </div>
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => updatePreference(`privacy.${setting}`, !enabled)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                        }`}
                                                >
                                                    <motion.span
                                                        animate={{ x: enabled ? 20 : 2 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
                                                    />
                                                </motion.button>
                                            </motion.div>
                                        ))}

                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
                                        >
                                            <h3 className="text-sm font-medium text-red-900 dark:text-red-300 mb-2">Danger Zone</h3>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                                                        localStorage.clear()
                                                        window.location.reload()
                                                    }
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                            >
                                                Clear All Data
                                            </motion.button>
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* About Section */}
                            {activeSection === 'about' && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About</h2>

                                    <div className="space-y-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-8"
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
                                            >
                                                <span className="text-2xl">🚀</span>
                                            </motion.div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Personal Dashboard
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">Version 1.0.0</p>
                                        </motion.div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center"
                                            >
                                                <div className="text-lg mb-2">📊</div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">Features</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Real-time updates, favorites, search</div>
                                            </motion.div>

                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center"
                                            >
                                                <div className="text-lg mb-2">🛠️</div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">Built With</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Next.js, React, TypeScript</div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Save Indicator */}
            <AnimatePresence>
                {isAnimating && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            ⚙️
                        </motion.div>
                        <span>Settings Saved!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const EnhancedSearchView = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search</h1>
        <p className="text-gray-600 dark:text-gray-400">Enhanced search functionality will be displayed here.</p>
    </div>
)

// Sample content for different views
const sampleContent = [
    {
        id: 'news-1',
        type: 'news' as const,
        title: 'AI Revolution: Major Breakthrough Announced',
        description: 'Scientists unveil groundbreaking artificial intelligence technology that promises to transform computing and solve complex global challenges.',
        image: getUnsplashImage('news', 0, 400, 300),
        url: 'https://www.nature.com/articles/d41586-023-01295-4',
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
        image: getUnsplashImage('movie', 0, 400, 600),
        url: 'https://www.imdb.com/title/tt1375666/',
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
        image: getUnsplashImage('social', 0, 400, 300),
        url: 'https://unsplash.com/s/photos/sunrise',
        metadata: {
            source: 'Social Feed',
            publishedAt: new Date().toISOString(),
            category: 'lifestyle'
        }
    },
    {
        id: 'news-2',
        type: 'news' as const,
        title: 'Global Climate Summit Reaches Historic Agreement',
        description: 'World leaders unite on ambitious climate action plan with concrete targets for carbon neutrality by 2035.',
        image: getUnsplashImage('news', 1, 400, 300),
        url: 'https://www.un.org/en/climatechange/cop26',
        metadata: {
            source: 'Global News',
            publishedAt: new Date().toISOString(),
            category: 'environment'
        }
    },
    {
        id: 'movie-2',
        type: 'movie' as const,
        title: 'The Last Detective',
        description: 'A gripping thriller about a retired detective who must solve one final case to clear his name and save his family.',
        image: getUnsplashImage('movie', 1, 400, 600),
        url: 'https://www.imdb.com/title/tt0468569/',
        metadata: {
            source: 'Movie Central',
            publishedAt: '2024-01-20',
            rating: 9.2,
            category: 'thriller'
        }
    },
    {
        id: 'social-2',
        type: 'social' as const,
        title: 'Coffee art level: Expert ☕',
        description: 'Spent way too much time perfecting this latte art, but totally worth it! Coffee culture is amazing.',
        image: getUnsplashImage('social', 1, 400, 300),
        url: 'https://www.reddit.com/r/Coffee/',
        metadata: {
            source: 'Social Feed',
            publishedAt: new Date().toISOString(),
            category: 'food'
        }
    }
]

// Enhanced Dashboard View with Real-time Updates and API Integration
function EnhancedDashboardView() {
    const [userPreferences, setUserPreferences] = useState({
        categories: ['technology', 'business'],
        autoRefresh: true,
        itemsPerPage: 12
    })
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

    // Load user preferences
    useEffect(() => {
        const savedPreferences = localStorage.getItem('user-preferences')
        if (savedPreferences) {
            try {
                const parsed = JSON.parse(savedPreferences)
                setUserPreferences(prev => ({ ...prev, ...parsed }))
            } catch (error) {
                console.error('Error loading preferences:', error)
            }
        }

        // Listen for preference updates
        const handlePreferencesUpdate = (event: CustomEvent) => {
            setUserPreferences(prev => ({ ...prev, ...event.detail }))
        }

        window.addEventListener('preferencesUpdated', handlePreferencesUpdate as EventListener)
        return () => window.removeEventListener('preferencesUpdated', handlePreferencesUpdate as EventListener)
    }, [])

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
                        image: getUnsplashImage('movie', Math.floor(Math.random() * 100), 400, 600),
                        url: `https://www.imdb.com/title/tt0137523/`,
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
                        image: getUnsplashImage('news', Math.floor(Math.random() * 100), 400, 300),
                        url: `https://www.reuters.com/technology/`,
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
        <div className="space-y-6" data-testid="content-feed">
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

function TrendingView() {
    const allContent = getAllMockContent()
    const trendingContent = allContent.filter((item: ContentItem) =>
        item.metadata.category === 'technology' ||
        (item.metadata.rating && item.metadata.rating > 8)
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trending</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Popular content that's getting attention</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingContent.map((item: ContentItem, index: number) => (
                    <ContentCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}

function NewsView() {
    const allContent = getAllMockContent()
    const newsContent = allContent.filter((item: ContentItem) => item.type === 'news')

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <Newspaper className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">News</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Latest news and updates</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsContent.map((item: ContentItem, index: number) => (
                    <ContentCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}

function MoviesView() {
    const allContent = getAllMockContent()
    const movieContent = allContent.filter((item: ContentItem) => item.type === 'movie')

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <Film className="w-6 h-6 text-purple-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Movies</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Latest movies and entertainment</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movieContent.map((item: ContentItem, index: number) => (
                    <ContentCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}

function SocialView() {
    const allContent = getAllMockContent()
    const socialContent = allContent.filter((item: ContentItem) => item.type === 'social')

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-green-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Social</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Social media posts and updates</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialContent.map((item: ContentItem, index: number) => (
                    <ContentCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    )
}

function FavoritesView() {
    const [favoriteItems, setFavoriteItems] = useState<ContentItem[]>([])
    const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage)

    useEffect(() => {
        const loadFavorites = () => {
            const favorites = localStorage.getItem('dashboard-favorites')
            if (favorites) {
                try {
                    const favoriteIds = JSON.parse(favorites)
                    const allContent = getAllMockContent()
                    const favs = allContent.filter((item: ContentItem) => favoriteIds.includes(item.id))
                    setFavoriteItems(favs)
                } catch (error) {
                    console.error('Error loading favorites:', error)
                }
            }
        }

        loadFavorites()

        // Listen for favorites updates
        const handleFavoritesUpdate = () => loadFavorites()
        window.addEventListener('favoritesUpdated', handleFavoritesUpdate)

        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Favorites
                </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Your saved favorite content</p>

            {favoriteItems.length === 0 ? (
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No favorites yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Click the heart icon on content cards to add them to your favorites!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteItems.map((item: ContentItem, index: number) => (
                        <ContentCard key={item.id} item={item} index={index} />
                    ))}
                </div>
            )}
        </div>
    )
}

function SearchView() {
    return <EnhancedSearchView />
}

function SettingsView() {
    return <UserPreferencesPanel />
}

function DashboardContent() {
    const [currentView, setCurrentView] = useState('dashboard')
    const [mounted, setMounted] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
    const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage)

    useEffect(() => {
        setMounted(true)
        console.log('DashboardContent mounted, current language:', currentLanguage)

        // Listen for favorites updates and show toast notifications
        const handleFavoritesUpdate = (event: CustomEvent) => {
            const { action, itemId } = event.detail
            const actionText = action === 'add' ? 'Added to' : 'Removed from'
            showToast(`${actionText} favorites!`, 'success')
        }

        // Listen for language changes
        const handleLanguageChange = (event: CustomEvent) => {
            console.log('Language changed event received:', event.detail)
            showToast(`Language changed to ${event.detail.language}`, 'info')
        }

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener)
        window.addEventListener('languageChanged', handleLanguageChange as EventListener)

        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate as EventListener)
            window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
        }
    }, [currentLanguage])

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        )
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

// Main Dashboard Component (Default Export)
const Dashboard = () => {
    return (
        <AuthWrapper>
            <DashboardContent />
        </AuthWrapper>
    )
}

export default Dashboard
