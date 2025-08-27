import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
    query: string
    results: any[]
    isLoading: boolean
    error: string | null
    filters: {
        type: 'all' | 'news' | 'movies' | 'social'
        dateRange: 'all' | 'today' | 'week' | 'month'
    }
    suggestions: string[]
    recentSearches: string[]
}

const initialState: SearchState = {
    query: '',
    results: [],
    isLoading: false,
    error: null,
    filters: {
        type: 'all',
        dateRange: 'all',
    },
    suggestions: [],
    recentSearches: [],
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload
        },
        setResults: (state, action: PayloadAction<any[]>) => {
            state.results = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setFilters: (state, action: PayloadAction<Partial<SearchState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        setSuggestions: (state, action: PayloadAction<string[]>) => {
            state.suggestions = action.payload
        },
        addRecentSearch: (state, action: PayloadAction<string>) => {
            const query = action.payload.trim()
            if (query && !state.recentSearches.includes(query)) {
                state.recentSearches.unshift(query)
                // Keep only last 10 searches
                state.recentSearches = state.recentSearches.slice(0, 10)
            }
        },
        removeRecentSearch: (state, action: PayloadAction<string>) => {
            state.recentSearches = state.recentSearches.filter(
                search => search !== action.payload
            )
        },
        clearRecentSearches: (state) => {
            state.recentSearches = []
        },
        clearResults: (state) => {
            state.results = []
            state.error = null
        },
        clearSearch: (state) => {
            state.query = ''
            state.results = []
            state.error = null
            state.suggestions = []
        },
    },
})

export const {
    setQuery,
    setResults,
    setLoading,
    setError,
    setFilters,
    setSuggestions,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    clearResults,
    clearSearch,
} = searchSlice.actions

export default searchSlice.reducer

// Selectors
export const selectSearchQuery = (state: { search: SearchState }) => state.search.query
export const selectSearchResults = (state: { search: SearchState }) => state.search.results
export const selectSearchLoading = (state: { search: SearchState }) => state.search.isLoading
export const selectSearchError = (state: { search: SearchState }) => state.search.error
export const selectSearchFilters = (state: { search: SearchState }) => state.search.filters
export const selectSearchSuggestions = (state: { search: SearchState }) => state.search.suggestions
export const selectRecentSearches = (state: { search: SearchState }) => state.search.recentSearches

