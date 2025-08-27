import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme, setSystemTheme } from '@/features/theme/themeSlice'
import { RootState } from '@/store'

export function useTheme() {
    const dispatch = useDispatch()
    const { theme, systemTheme } = useSelector((state: RootState) => state.theme)

    const currentTheme = theme === 'system' ? systemTheme : theme

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = (e: MediaQueryListEvent) => {
            dispatch(setSystemTheme(e.matches ? 'dark' : 'light'))
        }

        // Set initial system theme
        dispatch(setSystemTheme(mediaQuery.matches ? 'dark' : 'light'))

        // Listen for changes
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [dispatch])

    useEffect(() => {
        const root = document.documentElement

        if (currentTheme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [currentTheme])

    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        dispatch(setTheme(newTheme))
    }

    const setThemeMode = (newTheme: 'light' | 'dark' | 'system') => {
        dispatch(setTheme(newTheme))
    }

    return {
        theme,
        currentTheme,
        toggleTheme,
        setTheme: setThemeMode,
    }
}

