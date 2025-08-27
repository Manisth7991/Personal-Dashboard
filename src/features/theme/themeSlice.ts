import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
    theme: Theme
    systemTheme: 'light' | 'dark'
}

const initialState: ThemeState = {
    theme: 'system',
    systemTheme: 'light',
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload
        },
        setSystemTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.systemTheme = action.payload
        },
        toggleTheme: (state) => {
            if (state.theme === 'light') {
                state.theme = 'dark'
            } else if (state.theme === 'dark') {
                state.theme = 'light'
            } else {
                // If system, toggle to opposite of current system theme
                state.theme = state.systemTheme === 'light' ? 'dark' : 'light'
            }
        },
    },
})

export const { setTheme, setSystemTheme, toggleTheme } = themeSlice.actions

export default themeSlice.reducer

// Selectors
export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme
export const selectSystemTheme = (state: { theme: ThemeState }) => state.theme.systemTheme
export const selectCurrentTheme = (state: { theme: ThemeState }) => {
    if (state.theme.theme === 'system') {
        return state.theme.systemTheme
    }
    return state.theme.theme
}

