'use client'

// Client-side storage utility that works in the browser
export const clientStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === 'undefined') return null
        try {
            return localStorage.getItem(key)
        } catch {
            return null
        }
    },

    setItem: (key: string, value: string): void => {
        if (typeof window === 'undefined') return
        try {
            localStorage.setItem(key, value)
        } catch {
            // Silently fail
        }
    },

    removeItem: (key: string): void => {
        if (typeof window === 'undefined') return
        try {
            localStorage.removeItem(key)
        } catch {
            // Silently fail
        }
    }
}

// Storage keys
export const STORAGE_KEYS = {
    FAVORITES: 'dashboard-favorites',
    PREFERENCES: 'dashboard-preferences',
    THEME: 'dashboard-theme',
    LANGUAGE: 'dashboard-language',
    RECENT_SEARCHES: 'dashboard-recent-searches'
} as const

