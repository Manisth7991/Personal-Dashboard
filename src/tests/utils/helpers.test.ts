import { debounce } from '@/utils/debounce'
import { formatDate, truncateText, capitalize, slugify } from '@/utils/helpers'

describe('debounce utility', () => {
    jest.useFakeTimers()

    it('should debounce function calls', () => {
        const mockFn = jest.fn()
        const debouncedFn = debounce(mockFn, 100)

        debouncedFn('test1')
        debouncedFn('test2')
        debouncedFn('test3')

        expect(mockFn).not.toHaveBeenCalled()

        jest.advanceTimersByTime(100)

        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toHaveBeenCalledWith('test3')
    })

    it('should call immediately when immediate is true', () => {
        const mockFn = jest.fn()
        const debouncedFn = debounce(mockFn, 100, true)

        debouncedFn('test')

        expect(mockFn).toHaveBeenCalledTimes(1)
        expect(mockFn).toHaveBeenCalledWith('test')
    })
})

describe('helper utilities', () => {
    describe('formatDate', () => {
        it('should format recent dates as relative time', () => {
            const now = new Date()
            const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

            expect(formatDate(fiveMinutesAgo)).toBe('5 minutes ago')
        })

        it('should format very recent dates as "just now"', () => {
            const now = new Date()
            const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000)

            expect(formatDate(thirtySecondsAgo)).toBe('just now')
        })
    })

    describe('truncateText', () => {
        it('should truncate long text', () => {
            const longText = 'This is a very long text that should be truncated'
            const result = truncateText(longText, 20)

            expect(result).toBe('This is a very lo...')
            expect(result.length).toBe(20)
        })

        it('should not truncate short text', () => {
            const shortText = 'Short text'
            const result = truncateText(shortText, 20)

            expect(result).toBe(shortText)
        })
    })

    describe('capitalize', () => {
        it('should capitalize first letter', () => {
            expect(capitalize('hello')).toBe('Hello')
            expect(capitalize('HELLO')).toBe('HELLO')
            expect(capitalize('')).toBe('')
        })
    })

    describe('slugify', () => {
        it('should convert text to slug', () => {
            expect(slugify('Hello World')).toBe('hello-world')
            expect(slugify('This is a Test!')).toBe('this-is-a-test')
            expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
        })
    })
})

