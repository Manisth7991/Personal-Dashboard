'use client'

import { useState } from 'react'
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
import { cn } from '@/utils/helpers'
import { RootState } from '@/store'

interface SidebarProps {
    currentView: string
    onViewChange: (view: string) => void
}

const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'trending', name: 'Trending', icon: TrendingUp },
    { id: 'news', name: 'News', icon: Newspaper },
    { id: 'movies', name: 'Movies', icon: Film },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'favorites', name: 'Favorites', icon: Heart },
    { id: 'search', name: 'Search', icon: Search },
    { id: 'settings', name: 'Settings', icon: Settings },
]

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const favorites = useSelector((state: RootState) => state.favorites.items)

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className={cn(
                    'flex items-center space-x-2',
                    isCollapsed && 'justify-center'
                )}>
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">D</span>
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:block p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = currentView === item.id
                    const showBadge = item.id === 'favorites' && favorites.length > 0

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onViewChange(item.id)
                                setIsMobileOpen(false)
                            }}
                            className={cn(
                                'w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors',
                                isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                                isCollapsed && 'justify-center px-2'
                            )}
                        >
                            <Icon className={cn('w-5 h-5', !isCollapsed && 'mr-3')} />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1">{item.name}</span>
                                    {showBadge && (
                                        <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                            {favorites.length}
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* User Info */}
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-sm font-medium">U</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                User
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                user@example.com
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={cn(
                'hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64'
            )}>
                <SidebarContent />
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    <div className="relative flex flex-col w-64 bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">D</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    Dashboard
                                </span>
                            </div>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <SidebarContent />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

