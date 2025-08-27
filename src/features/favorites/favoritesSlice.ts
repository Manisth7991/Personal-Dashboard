import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContentItem } from '@/lib/api'
import { clientStorage, STORAGE_KEYS } from '@/lib/storage'

interface FavoritesState {
    items: ContentItem[]
}

// Load initial state from localStorage
const loadInitialState = (): FavoritesState => {
    try {
        const saved = clientStorage.getItem(STORAGE_KEYS.FAVORITES)
        if (saved) {
            return { items: JSON.parse(saved) }
        }
    } catch (error) {
        console.warn('Failed to load favorites from storage:', error)
    }
    return { items: [] }
}

const initialState: FavoritesState = loadInitialState()

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addToFavorites: (state, action: PayloadAction<ContentItem>) => {
            const exists = state.items.find(item => item.id === action.payload.id)
            if (!exists) {
                state.items.push(action.payload)
                // Save to localStorage immediately
                try {
                    clientStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.items))
                } catch (error) {
                    console.warn('Failed to save favorites to storage:', error)
                }
            }
        },
        removeFromFavorites: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload)
            // Save to localStorage immediately
            try {
                clientStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.items))
            } catch (error) {
                console.warn('Failed to save favorites to storage:', error)
            }
        },
        clearFavorites: (state) => {
            state.items = []
            try {
                clientStorage.removeItem(STORAGE_KEYS.FAVORITES)
            } catch (error) {
                console.warn('Failed to clear favorites from storage:', error)
            }
        },
        reorderFavorites: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
            const { fromIndex, toIndex } = action.payload
            const [removed] = state.items.splice(fromIndex, 1)
            state.items.splice(toIndex, 0, removed)
            try {
                clientStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.items))
            } catch (error) {
                console.warn('Failed to save reordered favorites to storage:', error)
            }
        },
        // Action to manually load favorites from storage
        loadFavoritesFromStorage: (state) => {
            const savedState = loadInitialState()
            state.items = savedState.items
        },
    },
})

export const {
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    reorderFavorites,
    loadFavoritesFromStorage,
} = favoritesSlice.actions

export default favoritesSlice.reducer

// Selectors
export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.items
export const selectIsFavorite = (state: { favorites: FavoritesState }, itemId: string) =>
    state.favorites.items.some(item => item.id === itemId)

