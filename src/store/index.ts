import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createWebStorage from "redux-persist/lib/storage/createWebStorage"
import { api } from '@/lib/api'
import preferencesReducer from '@/features/preferences/preferencesSlice'
import favoritesReducer from '@/features/favorites/favoritesSlice'
import feedReducer from '@/features/feed/feedSlice'
import searchReducer from '@/features/search/searchSlice'
import themeReducer from '@/features/theme/themeSlice'
import languageReducer from '@/features/language/languageSlice'

// Create a noop storage for server-side rendering
const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null)
        },
        setItem(_key: string, value: any) {
            return Promise.resolve(value)
        },
        removeItem(_key: string) {
            return Promise.resolve()
        },
    }
}

// Use localStorage on client-side, noop on server-side
const clientStorage = typeof window !== 'undefined' ? storage : createNoopStorage()

const persistConfig = {
    key: 'root',
    storage: clientStorage,
    whitelist: ['preferences', 'favorites', 'theme', 'language'], // Only persist these slices
}

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    feed: feedReducer,
    search: searchReducer,
    theme: themeReducer,
    language: languageReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(api.middleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

