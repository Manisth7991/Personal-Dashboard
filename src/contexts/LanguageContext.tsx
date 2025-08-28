'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LanguageContextType {
    currentLanguage: string
    setLanguage: (language: string) => void
    version: number // Add version to force re-renders
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('dashboard-language') || 'en'
        }
        return 'en'
    })

    const [version, setVersion] = useState(0) // Version to force re-renders

    const setLanguage = (language: string) => {
        setCurrentLanguage(language)
        setVersion(prev => prev + 1) // Increment version to force re-renders
        if (typeof window !== 'undefined') {
            localStorage.setItem('dashboard-language', language)
        }
    }

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, version }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }

    // Return both language and version to ensure components re-render
    return {
        currentLanguage: context.currentLanguage,
        setLanguage: context.setLanguage,
        version: context.version
    }
}
