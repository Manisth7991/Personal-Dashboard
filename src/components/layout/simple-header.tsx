'use client'

import { useState, useEffect } from 'react'
import { Search, Sun, Moon, Bell, User, RefreshCw } from 'lucide-react'

interface SimpleHeaderProps {
    onViewChange: (view: string) => void
}

export function SimpleHeader({ onViewChange }: SimpleHeaderProps) {
    const [darkMode, setDarkMode] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Load theme from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('dashboard-theme')
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleTheme = () => {
        const newMode = !darkMode
        setDarkMode(newMode)

        if (newMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('dashboard-theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('dashboard-theme', 'light')
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            onViewChange('search')
        }
    }

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Search */}
                <div className="flex-1 max-w-lg">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search news, movies, posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </form>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 ml-6">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Refresh Button */}
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Refresh page"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <button
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    {/* User Menu */}
                    <button
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="User menu"
                    >
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    )
}

