'use client'

import { useState } from 'react'
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

interface SimpleSidebarProps {
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

export function SimpleSidebar({ currentView, onViewChange }: SimpleSidebarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

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
                            {item.id === 'favorites' && (
                                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                    {typeof window !== 'undefined' ?
                                        JSON.parse(localStorage.getItem('dashboard-favorites') || '[]').length :
                                        0
                                    }
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    v1.0.0 - Fixed & Working
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

