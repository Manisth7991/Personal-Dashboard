import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface LanguageState {
  currentLanguage: string
}

// Load initial language from localStorage or default to 'en'
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dashboard-language')
      if (saved) {
        return saved
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error)
    }
  }
  return 'en'
}

const initialState: LanguageState = {
  currentLanguage: getInitialLanguage()
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('dashboard-language', action.payload)
          // Dispatch custom event to notify components
          window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: action.payload }
          }))
        } catch (error) {
          console.error('Error saving language to localStorage:', error)
        }
      }
    }
  }
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer

