'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, signOut } from '@/lib/auth'
import { AuthForm } from '@/components/auth/AuthForm'
import { User, LogOut, Settings as SettingsIcon } from 'lucide-react'

interface User {
    id: string
    email: string
    name: string
    avatar?: string
    preferences?: {
        categories: string[]
        language: string
        theme: 'light' | 'dark'
    }
}

interface AuthWrapperProps {
    children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
    const [user, setUser] = useState<User | null>(null)
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
    const [showAuth, setShowAuth] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const currentUser = getCurrentUser()
        setUser(currentUser)
    }, [])

    const handleAuthSuccess = () => {
        const currentUser = getCurrentUser()
        setUser(currentUser)
        setShowAuth(false)
    }

    const handleSignOut = async () => {
        await signOut()
        setUser(null)
        setShowAuth(true)
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    if (!user || showAuth) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <AuthForm
                    mode={authMode}
                    onSuccess={handleAuthSuccess}
                    onModeChange={setAuthMode}
                />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* User Menu */}
            <div className="absolute top-4 right-4 z-50">
                <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {children}
        </div>
    )
}

