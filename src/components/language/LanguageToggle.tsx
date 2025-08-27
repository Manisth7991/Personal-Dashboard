'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { setLanguage } from '@/features/language/languageSlice'
import type { RootState } from '@/store'

export function LanguageToggle() {
    const { i18n } = useTranslation()
    const dispatch = useDispatch()
    const currentLanguage = useSelector((state: RootState) => state.language?.currentLanguage || 'en')

    const toggleLanguage = async () => {
        const newLanguage = currentLanguage === 'en' ? 'hi' : 'en'
        try {
            await i18n.changeLanguage(newLanguage)
            dispatch(setLanguage(newLanguage))
        } catch (error) {
            console.error('Failed to change language:', error)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
            title={`Switch to ${currentLanguage === 'en' ? 'हिन्दी' : 'English'}`}
            aria-label={`Switch to ${currentLanguage === 'en' ? 'Hindi' : 'English'}`}
        >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
                {currentLanguage === 'en' ? 'EN' : 'हि'}
            </span>
        </Button>
    )
}

