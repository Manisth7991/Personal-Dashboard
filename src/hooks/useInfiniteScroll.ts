import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions {
    threshold?: number
    root?: Element | null
    rootMargin?: string
}

interface UseInfiniteScrollReturn {
    isLoading: boolean
    hasMore: boolean
    loadMore: () => void
    setHasMore: (hasMore: boolean) => void
    setIsLoading: (loading: boolean) => void
    observerRef: React.RefObject<HTMLDivElement>
}

export function useInfiniteScroll(
    fetchMore: () => Promise<void> | void,
    options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const observerRef = useRef<HTMLDivElement>(null)
    const { threshold = 1.0, root = null, rootMargin = '100px' } = options

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        try {
            await fetchMore()
        } catch (error) {
            console.error('Error loading more content:', error)
        } finally {
            setIsLoading(false)
        }
    }, [fetchMore, isLoading, hasMore])

    useEffect(() => {
        const observerElement = observerRef.current
        if (!observerElement) return

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries
                if (entry.isIntersecting && !isLoading && hasMore) {
                    loadMore()
                }
            },
            {
                threshold,
                root,
                rootMargin,
            }
        )

        observer.observe(observerElement)

        return () => {
            if (observerElement) {
                observer.unobserve(observerElement)
            }
        }
    }, [loadMore, threshold, root, rootMargin, isLoading, hasMore])

    return {
        isLoading,
        hasMore,
        loadMore,
        setHasMore,
        setIsLoading,
        observerRef,
    }
}
