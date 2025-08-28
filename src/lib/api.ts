import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockNewsData, mockMovieData, mockSocialData, searchMockContent, getAllMockContent } from '@/lib/mockData'
import { getUnsplashImage } from '@/lib/imageUtils'

export interface NewsArticle {
    id: string
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
    source: {
        id: string
        name: string
    }
    category: string
}

export interface Movie {
    id: number
    title: string
    overview: string
    poster_path: string
    backdrop_path: string
    release_date: string
    vote_average: number
    genre_ids: number[]
}

export interface SocialPost {
    id: string
    username: string
    content: string
    image?: string
    timestamp: string
    likes: number
    hashtags: string[]
    platform: 'twitter' | 'instagram' | 'facebook'
}

export interface ContentItem {
    id: string
    type: 'news' | 'movie' | 'social'
    title: string
    description: string
    image?: string
    url?: string
    metadata: {
        source?: string
        author?: string
        publishedAt?: string
        rating?: number
        category?: string
    }
}

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/',
    }),
    tagTypes: ['News', 'Movies', 'Social'],
    endpoints: (builder) => ({
        // News API endpoints
        getNewsByCategory: builder.query<NewsArticle[], string>({
            query: (category) => ({
                url: `https://newsapi.org/v2/top-headlines`,
                params: {
                    category,
                    country: 'us',
                    apiKey: NEWS_API_KEY,
                    pageSize: 20,
                },
            }),
            transformResponse: (response: any, meta, arg) => {
                const category = arg
                return response.articles.map((article: any, index: number) => ({
                    ...article,
                    id: `news-${index}-${Date.now()}`,
                    category,
                }))
            },
            providesTags: ['News'],
        }),

        searchNews: builder.query<NewsArticle[], string>({
            query: (query) => ({
                url: `https://newsapi.org/v2/everything`,
                params: {
                    q: query,
                    apiKey: NEWS_API_KEY,
                    pageSize: 20,
                    sortBy: 'relevancy',
                },
            }),
            transformResponse: (response: any) => {
                return response.articles.map((article: any, index: number) => ({
                    ...article,
                    id: `search-news-${index}-${Date.now()}`,
                }))
            },
        }),

        // TMDB API endpoints
        getTrendingMovies: builder.query<Movie[], void>({
            query: () => ({
                url: `https://api.themoviedb.org/3/trending/movie/week`,
                params: {
                    api_key: TMDB_API_KEY,
                },
            }),
            transformResponse: (response: any) => response.results,
            providesTags: ['Movies'],
        }),

        getMoviesByGenre: builder.query<Movie[], number>({
            query: (genreId) => ({
                url: `https://api.themoviedb.org/3/discover/movie`,
                params: {
                    api_key: TMDB_API_KEY,
                    with_genres: genreId,
                    sort_by: 'popularity.desc',
                },
            }),
            transformResponse: (response: any) => response.results,
        }),

        searchMovies: builder.query<Movie[], string>({
            query: (query) => ({
                url: `https://api.themoviedb.org/3/search/movie`,
                params: {
                    api_key: TMDB_API_KEY,
                    query,
                },
            }),
            transformResponse: (response: any) => response.results,
        }),

        // Keep the old getSocialPosts for backward compatibility
        getSocialPosts: builder.query<SocialPost[], { hashtag?: string; username?: string }>({
            queryFn: async ({ hashtag, username }) => {
                // Mock social media data
                const mockPosts: SocialPost[] = [
                    {
                        id: 'social-1',
                        username: 'techguru',
                        content: 'Just discovered this amazing new framework! #tech #coding',
                        image: getUnsplashImage('social', 0, 400, 300),
                        timestamp: new Date().toISOString(),
                        likes: 42,
                        hashtags: ['tech', 'coding'],
                        platform: 'twitter',
                    },
                    {
                        id: 'social-2',
                        username: 'designpro',
                        content: 'Beautiful sunset from my workspace today 🌅',
                        image: getUnsplashImage('social', 1, 400, 300),
                        timestamp: new Date(Date.now() - 3600000).toISOString(),
                        likes: 89,
                        hashtags: ['sunset', 'workspace'],
                        platform: 'instagram',
                    },
                    {
                        id: 'social-3',
                        username: 'newsfeed',
                        content: 'Breaking: Major tech conference announced for next month!',
                        timestamp: new Date(Date.now() - 7200000).toISOString(),
                        likes: 156,
                        hashtags: ['breaking', 'tech', 'conference'],
                        platform: 'facebook',
                    },
                ]

                // Filter by hashtag or username if provided
                let filteredPosts = mockPosts
                if (hashtag) {
                    filteredPosts = mockPosts.filter(post =>
                        post.hashtags.some(tag => tag.toLowerCase().includes(hashtag.toLowerCase()))
                    )
                }
                if (username) {
                    filteredPosts = mockPosts.filter(post =>
                        post.username.toLowerCase().includes(username.toLowerCase())
                    )
                }

                return { data: filteredPosts }
            },
            providesTags: ['Social'],
        }),
    }),
})

export const {
    useGetNewsByCategoryQuery,
    useSearchNewsQuery,
    useGetTrendingMoviesQuery,
    useGetMoviesByGenreQuery,
    useSearchMoviesQuery,
    useGetSocialPostsQuery,
} = api

