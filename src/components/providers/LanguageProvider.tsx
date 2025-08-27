'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { setLanguage } from '@/features/language/languageSlice'
import i18n from '@/lib/i18n'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const currentLanguage = useAppSelector((state) => state.language.currentLanguage)
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Sync Redux state with i18n
        if (currentLanguage !== i18n.language) {
            i18n.changeLanguage(currentLanguage)
        }
    }, [currentLanguage])

    useEffect(() => {
        // Initialize language from browser locale if not set
        const browserLanguage = navigator.language.split('-')[0]
        const supportedLanguages = ['en', 'hi']

        if (supportedLanguages.includes(browserLanguage) && currentLanguage === 'en') {
            dispatch(setLanguage(browserLanguage))
        }
    }, [dispatch, currentLanguage])

    return <>{children}</>
}

export const changeLanguage = (language: string) => (dispatch: any) => {
    dispatch(setLanguage(language))
    i18n.changeLanguage(language)
}

