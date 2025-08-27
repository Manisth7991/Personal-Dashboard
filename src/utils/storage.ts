export const storage = {
    getItem: (key: string): string | null => {
        if (typeof window === 'undefined') return null
        try {
            return localStorage.getItem(key)
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return null
        }
    },

    setItem: (key: string, value: string): void => {
        if (typeof window === 'undefined') return
        try {
            localStorage.setItem(key, value)
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error)
        }
    },

    removeItem: (key: string): void => {
        if (typeof window === 'undefined') return
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error)
        }
    },

    clear: (): void => {
        if (typeof window === 'undefined') return
        try {
            localStorage.clear()
        } catch (error) {
            console.warn('Error clearing localStorage:', error)
        }
    },
}

export const getStoredPreferences = () => {
    const stored = storage.getItem('preferences')
    return stored ? JSON.parse(stored) : null
}

export const setStoredPreferences = (preferences: any) => {
    storage.setItem('preferences', JSON.stringify(preferences))
}

export const getStoredFavorites = () => {
    const stored = storage.getItem('favorites')
    return stored ? JSON.parse(stored) : []
}

export const setStoredFavorites = (favorites: any[]) => {
    storage.setItem('favorites', JSON.stringify(favorites))
}

export const getStoredTheme = () => {
    return storage.getItem('theme') || 'system'
}

export const setStoredTheme = (theme: string) => {
    storage.setItem('theme', theme)
}

