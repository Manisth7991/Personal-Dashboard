import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from '@/utils/debounce'
import { setQuery, setLoading, setResults, addRecentSearch } from '@/features/search/searchSlice'
import { useSearchNewsQuery, useSearchMoviesQuery } from '@/lib/api'
import { RootState } from '@/store'

export function useSearch() {
    const dispatch = useDispatch()
    const { query, results, isLoading, filters } = useSelector((state: RootState) => state.search)
    const [debouncedQuery, setDebouncedQuery] = useState('')

    // Debounce search query
    const debouncedSetQuery = debounce((value: string) => {
        setDebouncedQuery(value)
    }, 300)

    useEffect(() => {
        debouncedSetQuery(query)
    }, [query, debouncedSetQuery])

    // API queries
    const { data: newsResults, isLoading: newsLoading } = useSearchNewsQuery(debouncedQuery, {
        skip: !debouncedQuery || filters.type === 'movies' || filters.type === 'social',
    })

    const { data: movieResults, isLoading: movieLoading } = useSearchMoviesQuery(debouncedQuery, {
        skip: !debouncedQuery || filters.type === 'news' || filters.type === 'social',
    })

    // Combine results
    useEffect(() => {
        if (debouncedQuery) {
            dispatch(setLoading(newsLoading || movieLoading))

            const combinedResults = []

            if (newsResults && (filters.type === 'all' || filters.type === 'news')) {
                combinedResults.push(...newsResults.map(item => ({
                    id: item.id,
                    type: 'news' as const,
                    title: item.title,
                    description: item.description,
                    image: item.urlToImage,
                    url: item.url,
                    metadata: {
                        source: item.source.name,
                        publishedAt: item.publishedAt,
                        category: item.category,
                    },
                })))
            }

            if (movieResults && (filters.type === 'all' || filters.type === 'movies')) {
                combinedResults.push(...movieResults.map(item => ({
                    id: item.id.toString(),
                    type: 'movie' as const,
                    title: item.title,
                    description: item.overview,
                    image: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                    metadata: {
                        publishedAt: item.release_date,
                        rating: item.vote_average,
                    },
                })))
            }

            dispatch(setResults(combinedResults))
        } else {
            dispatch(setResults([]))
        }
    }, [debouncedQuery, newsResults, movieResults, newsLoading, movieLoading, filters.type, dispatch])

    const executeSearch = (searchQuery: string) => {
        dispatch(setQuery(searchQuery))
        if (searchQuery.trim()) {
            dispatch(addRecentSearch(searchQuery.trim()))
        }
    }

    return {
        query,
        results,
        isLoading,
        executeSearch,
        setQuery: (query: string) => dispatch(setQuery(query)),
    }
}

