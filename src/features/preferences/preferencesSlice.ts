import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserPreferences {
    categories: string[]
    language: string
    region: string
    itemsPerPage: number
    autoRefresh: boolean
    refreshInterval: number // in minutes
}

interface PreferencesState {
    preferences: UserPreferences
}

const initialState: PreferencesState = {
    preferences: {
        categories: ['technology', 'business', 'entertainment'],
        language: 'en',
        region: 'us',
        itemsPerPage: 12,
        autoRefresh: true,
        refreshInterval: 30,
    },
}

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        updateCategories: (state, action: PayloadAction<string[]>) => {
            state.preferences.categories = action.payload
        },
        addCategory: (state, action: PayloadAction<string>) => {
            if (!state.preferences.categories.includes(action.payload)) {
                state.preferences.categories.push(action.payload)
            }
        },
        removeCategory: (state, action: PayloadAction<string>) => {
            state.preferences.categories = state.preferences.categories.filter(
                category => category !== action.payload
            )
        },
        updateLanguage: (state, action: PayloadAction<string>) => {
            state.preferences.language = action.payload
        },
        updateRegion: (state, action: PayloadAction<string>) => {
            state.preferences.region = action.payload
        },
        updateItemsPerPage: (state, action: PayloadAction<number>) => {
            state.preferences.itemsPerPage = action.payload
        },
        toggleAutoRefresh: (state) => {
            state.preferences.autoRefresh = !state.preferences.autoRefresh
        },
        updateRefreshInterval: (state, action: PayloadAction<number>) => {
            state.preferences.refreshInterval = action.payload
        },
        resetPreferences: (state) => {
            state.preferences = initialState.preferences
        },
    },
})

export const {
    updateCategories,
    addCategory,
    removeCategory,
    updateLanguage,
    updateRegion,
    updateItemsPerPage,
    toggleAutoRefresh,
    updateRefreshInterval,
    resetPreferences,
} = preferencesSlice.actions

export default preferencesSlice.reducer

