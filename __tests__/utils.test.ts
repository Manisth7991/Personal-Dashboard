import { debounce } from '@/utils/debounce'

describe('Utility Functions', () => {
    describe('debounce', () => {
        jest.useFakeTimers()

        it('should delay function execution', () => {
            const mockFn = jest.fn()
            const debouncedFn = debounce(mockFn, 300)

            debouncedFn('test')
            expect(mockFn).not.toHaveBeenCalled()

            jest.advanceTimersByTime(300)
            expect(mockFn).toHaveBeenCalledWith('test')
        })

        it('should cancel previous calls when called multiple times', () => {
            const mockFn = jest.fn()
            const debouncedFn = debounce(mockFn, 300)

            debouncedFn('first')
            debouncedFn('second')
            debouncedFn('third')

            jest.advanceTimersByTime(300)

            expect(mockFn).toHaveBeenCalledTimes(1)
            expect(mockFn).toHaveBeenCalledWith('third')
        })

        it('should work with different delay times', () => {
            const mockFn = jest.fn()
            const debouncedFn = debounce(mockFn, 500)

            debouncedFn('test')
            jest.advanceTimersByTime(400)
            expect(mockFn).not.toHaveBeenCalled()

            jest.advanceTimersByTime(100)
            expect(mockFn).toHaveBeenCalledWith('test')
        })

        afterEach(() => {
            jest.clearAllTimers()
        })
    })
})
