'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    Home,
    Search,
    Heart,
    Settings,
    TrendingUp,
    Newspaper,
    Film,
    Users,
    Menu,
    X
} from 'lucide-react'
import { RootState } from '@/store'
import { getTranslation } from '@/lib/translations'
import { useLanguage } from '@/contexts/LanguageContext'

interface SimpleSidebarProps {
    currentView: string
    onViewChange: (view: string) => void
}

export function SimpleSidebar({ currentView, onViewChange }: SimpleSidebarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [favoritesCount, setFavoritesCount] = useState(0)
    const { currentLanguage, version } = useLanguage()

    // Use useMemo to make navigation reactive to language changes
    const navigation = useMemo(() => [
        { id: 'dashboard', name: getTranslation('dashboard', currentLanguage), icon: Home },
        { id: 'trending', name: getTranslation('trending', currentLanguage), icon: TrendingUp },
        { id: 'news', name: getTranslation('news', currentLanguage), icon: Newspaper },
        { id: 'movies', name: getTranslation('movies', currentLanguage), icon: Film },
        { id: 'social', name: getTranslation('social', currentLanguage), icon: Users },
        { id: 'favorites', name: getTranslation('favorites', currentLanguage), icon: Heart },
        { id: 'search', name: getTranslation('search', currentLanguage), icon: Search },
        { id: 'settings', name: getTranslation('settings', currentLanguage), icon: Settings },
    ], [currentLanguage, version]) // Include version as dependency

    // Debug function to clear localStorage
    const clearFavoritesDebug = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('dashboard-favorites')
            // Also clear any related storage
            const allKeys = Object.keys(localStorage)
            allKeys.forEach(key => {
                if (key.includes('favorite')) {
                    localStorage.removeItem(key)
                    console.log('Removed key:', key)
                }
            })
            setFavoritesCount(0)
            // Dispatch event to update other components
            window.dispatchEvent(new CustomEvent('favoritesUpdated', {
                detail: { favorites: [], action: 'clear' }
            }))
            console.log('All favorites cleared!')
        }
    }

    useEffect(() => {
        // Load initial favorites count
        const updateFavoritesCount = () => {
            if (typeof window !== 'undefined') {
                try {
                    const favoritesData = localStorage.getItem('dashboard-favorites')
                    if (!favoritesData || favoritesData === 'null' || favoritesData === 'undefined') {
                        setFavoritesCount(0)
                        return
                    }
                    const favorites = JSON.parse(favoritesData)
                    if (Array.isArray(favorites)) {
                        setFavoritesCount(favorites.length)
                    } else {
                        // Invalid data format, reset
                        localStorage.removeItem('dashboard-favorites')
                        setFavoritesCount(0)
                    }
                } catch (error) {
                    console.error('Error parsing favorites:', error)
                    // Clear corrupted data
                    localStorage.removeItem('dashboard-favorites')
                    setFavoritesCount(0)
                }
            }
        }

        updateFavoritesCount()

        // Listen for favorites updates
        const handleFavoritesUpdate = () => {
            updateFavoritesCount()
        }

        window.addEventListener('favoritesUpdated', handleFavoritesUpdate)
        return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate)
    }, [])

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const isActive = currentView === item.id
                    const Icon = item.icon

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onViewChange(item.id)
                                setIsMobileOpen(false)
                            }}
                            className={`
                                w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                                ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                            {item.id === 'favorites' && favoritesCount > 0 && (
                                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                    {favoritesCount}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    v1.0.0 - Fixed & Working
                </div>
                {/* Debug button - remove in production */}
                <div className="space-y-1">
                    <button
                        onClick={clearFavoritesDebug}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded block w-full"
                    >
                        Clear Favorites (Debug)
                    </button>
                    <button
                        onClick={() => {
                            const data = localStorage.getItem('dashboard-favorites')
                            console.log('Current favorites data:', data)
                            console.log('Current count state:', favoritesCount)
                            alert(`Favorites data: ${data}\nCount: ${favoritesCount}`)
                        }}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded block w-full"
                    >
                        Debug Favorites
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile sidebar */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setIsMobileOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                Menu
                            </span>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <SidebarContent />
            </div>
        </>
    )
}

