import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContentItem } from '@/lib/api'

interface FeedState {
    items: ContentItem[]
    filteredItems: ContentItem[]
    currentPage: number
    hasMore: boolean
    isLoading: boolean
    error: string | null
    sortBy: 'date' | 'relevance' | 'popularity'
    filterBy: 'all' | 'news' | 'movies' | 'social'
}

const initialState: FeedState = {
    items: [],
    filteredItems: [],
    currentPage: 1,
    hasMore: true,
    isLoading: false,
    error: null,
    sortBy: 'date',
    filterBy: 'all',
}

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<ContentItem[]>) => {
            state.items = action.payload
            state.filteredItems = action.payload
        },
        addItems: (state, action: PayloadAction<ContentItem[]>) => {
            state.items = [...state.items, ...action.payload]
            state.filteredItems = [...state.filteredItems, ...action.payload]
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setSortBy: (state, action: PayloadAction<'date' | 'relevance' | 'popularity'>) => {
            state.sortBy = action.payload
            // Re-apply filtering and sorting
            state.filteredItems = filterAndSortItems(state.items, state.filterBy, action.payload)
        },
        setFilterBy: (state, action: PayloadAction<'all' | 'news' | 'movies' | 'social'>) => {
            state.filterBy = action.payload
            state.filteredItems = filterAndSortItems(state.items, action.payload, state.sortBy)
        },
        incrementPage: (state) => {
            state.currentPage += 1
        },
        resetPage: (state) => {
            state.currentPage = 1
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload
        },
        reorderItems: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
            const { fromIndex, toIndex } = action.payload
            const [removed] = state.filteredItems.splice(fromIndex, 1)
            state.filteredItems.splice(toIndex, 0, removed)
        },
        clearFeed: (state) => {
            state.items = []
            state.filteredItems = []
            state.currentPage = 1
            state.hasMore = true
            state.error = null
        },
    },
})

// Helper function to filter and sort items
function filterAndSortItems(
    items: ContentItem[],
    filterBy: 'all' | 'news' | 'movies' | 'social',
    sortBy: 'date' | 'relevance' | 'popularity'
): ContentItem[] {
    let filtered = items

    // Apply filter
    if (filterBy !== 'all') {
        filtered = items.filter(item => item.type === filterBy)
    }

    // Apply sort
    return [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                const dateA = new Date(a.metadata.publishedAt || 0).getTime()
                const dateB = new Date(b.metadata.publishedAt || 0).getTime()
                return dateB - dateA
            case 'popularity':
                const ratingA = a.metadata.rating || 0
                const ratingB = b.metadata.rating || 0
                return ratingB - ratingA
            case 'relevance':
            default:
                return 0 // Keep original order for relevance
        }
    })
}

export const {
    setItems,
    addItems,
    setLoading,
    setError,
    setSortBy,
    setFilterBy,
    incrementPage,
    resetPage,
    setHasMore,
    reorderItems,
    clearFeed,
} = feedSlice.actions

export default feedSlice.reducer

// Selectors
export const selectFeedItems = (state: { feed: FeedState }) => state.feed.filteredItems
export const selectFeedLoading = (state: { feed: FeedState }) => state.feed.isLoading
export const selectFeedError = (state: { feed: FeedState }) => state.feed.error
export const selectFeedHasMore = (state: { feed: FeedState }) => state.feed.hasMore
export const selectFeedPage = (state: { feed: FeedState }) => state.feed.currentPage
export const selectFeedSort = (state: { feed: FeedState }) => state.feed.sortBy
export const selectFeedFilter = (state: { feed: FeedState }) => state.feed.filterBy

