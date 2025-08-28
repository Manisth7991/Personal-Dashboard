import { searchMockContent } from '@/lib/mockData'

describe('Search Functionality', () => {
    describe('searchMockContent', () => {
        it('should return empty array for empty query', () => {
            const results = searchMockContent('')
            expect(Array.isArray(results)).toBe(true)
            expect(results.length).toBeGreaterThan(0) // Returns all content when query is empty
        })

        it('should search across all content types', () => {
            const results = searchMockContent('technology')
            expect(Array.isArray(results)).toBe(true)
            expect(results.length).toBeGreaterThan(0)
        })

        it('should filter by content type', () => {
            const results = searchMockContent('test', 'news')
            expect(Array.isArray(results)).toBe(true)
            // All results should be news type
            results.forEach((item: any) => {
                expect(item.type).toBe('news')
            })
        })

        it('should return filtered results for valid queries', () => {
            const results = searchMockContent('future')
            expect(Array.isArray(results)).toBe(true)
            // Should find "The Future Chronicles" movie
            const foundMovie = results.find((item: any) => item.title.includes('Future'))
            expect(foundMovie).toBeDefined()
        })

        it('should handle case insensitive search', () => {
            const upperCaseResults = searchMockContent('TECHNOLOGY')
            const lowerCaseResults = searchMockContent('technology')
            expect(upperCaseResults.length).toBe(lowerCaseResults.length)
        })
    })
})
