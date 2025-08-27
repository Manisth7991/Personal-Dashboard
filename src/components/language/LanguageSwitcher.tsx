'use client'

import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Globe } from 'lucide-react'
import { setLanguage } from '@/features/language/languageSlice'
import type { RootState } from '@/store'

const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
]

export function LanguageSwitcher() {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const currentLanguage = useSelector((state: RootState) => state.language?.currentLanguage || 'en')

    const handleLanguageChange = async (languageCode: string) => {
        try {
            await i18n.changeLanguage(languageCode)
            dispatch(setLanguage(languageCode))
        } catch (error) {
            console.error('Failed to change language:', error)
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <label className="text-sm font-medium">{t('language')}</label>
            </div>
            <div className="grid gap-2">
                {languages.map((language) => (
                    <label
                        key={language.code}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                    >
                        <input
                            type="radio"
                            name="language"
                            value={language.code}
                            checked={currentLanguage === language.code}
                            onChange={() => handleLanguageChange(language.code)}
                            className="text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                            <div className="font-medium">{language.nativeName}</div>
                            <div className="text-sm text-muted-foreground">{language.name}</div>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    )
}

