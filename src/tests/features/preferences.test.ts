import { configureStore } from '@reduxjs/toolkit'
import preferencesReducer, {
    updateCategories,
    addCategory,
    removeCategory,
    resetPreferences
} from '@/features/preferences/preferencesSlice'

describe('preferencesSlice', () => {
    let store: any

    beforeEach(() => {
        store = configureStore({
            reducer: {
                preferences: preferencesReducer,
            },
        })
    })

    it('should have initial state', () => {
        const state = store.getState().preferences
        expect(state.preferences.categories).toEqual(['technology', 'business', 'entertainment'])
        expect(state.preferences.language).toBe('en')
        expect(state.preferences.region).toBe('us')
        expect(state.preferences.itemsPerPage).toBe(12)
        expect(state.preferences.autoRefresh).toBe(true)
        expect(state.preferences.refreshInterval).toBe(30)
    })

    it('should update categories', () => {
        const newCategories = ['technology', 'sports']
        store.dispatch(updateCategories(newCategories))

        const state = store.getState().preferences
        expect(state.preferences.categories).toEqual(newCategories)
    })

    it('should add category', () => {
        store.dispatch(addCategory('health'))

        const state = store.getState().preferences
        expect(state.preferences.categories).toContain('health')
    })

    it('should not add duplicate category', () => {
        store.dispatch(addCategory('technology'))

        const state = store.getState().preferences
        const techCount = state.preferences.categories.filter((cat: string) => cat === 'technology').length
        expect(techCount).toBe(1)
    })

    it('should remove category', () => {
        store.dispatch(removeCategory('technology'))

        const state = store.getState().preferences
        expect(state.preferences.categories).not.toContain('technology')
    })

    it('should reset preferences', () => {
        // Change some preferences first
        store.dispatch(updateCategories(['sports']))
        store.dispatch(resetPreferences())

        const state = store.getState().preferences
        expect(state.preferences.categories).toEqual(['technology', 'business', 'entertainment'])
    })
})

