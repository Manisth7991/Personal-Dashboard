'use client'

import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Search, Bell, Sun, Moon, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useSearch } from '@/hooks/useSearch'
import { useClickOutside } from '@/hooks/useUtils'
import { cn } from '@/utils/helpers'

interface HeaderProps {
    onViewChange: (view: string) => void
}

export function Header({ onViewChange }: HeaderProps) {
    const { currentTheme, toggleTheme } = useTheme()
    const { query, executeSearch, setQuery } = useSearch()
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const userMenuRef = useRef<HTMLDivElement>(null)

    useClickOutside(searchRef, () => setShowSearchResults(false))
    useClickOutside(userMenuRef, () => setShowUserMenu(false))

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            executeSearch(query)
            onViewChange('search')
            setShowSearchResults(false)
        }
    }

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Search */}
                <div className="flex-1 max-w-lg mr-6" ref={searchRef}>
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search news, movies, posts..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setShowSearchResults(true)}
                                className="pl-10 pr-4"
                            />
                        </div>
                    </form>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className="p-2"
                    >
                        {currentTheme === 'dark' ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </Button>

                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="p-2 relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </Button>

                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="p-2"
                        >
                            <User className="w-5 h-5" />
                        </Button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                <button
                                    onClick={() => {
                                        onViewChange('settings')
                                        setShowUserMenu(false)
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Settings
                                </button>
                                <button
                                    onClick={() => setShowUserMenu(false)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

