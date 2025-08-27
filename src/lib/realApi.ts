interface NewsAPIResponse {
    status: string
    totalResults: number
    articles: Array<{
        source: { id: string | null; name: string }
        author: string | null
        title: string
        description: string | null
        url: string
        urlToImage: string | null
        publishedAt: string
        content: string | null
    }>
}

interface TMDBResponse {
    page: number
    results: Array<{
        id: number
        title: string
        overview: string
        poster_path: string | null
        backdrop_path: string | null
        release_date: string
        vote_average: number
        genre_ids: number[]
    }>
    total_pages: number
    total_results: number
}

export class RealAPIService {
    private readonly NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || 'demo_key'
    private readonly TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'demo_key'
    private readonly NEWS_BASE_URL = 'https://newsapi.org/v2'
    private readonly TMDB_BASE_URL = 'https://api.themoviedb.org/3'

    // Fetch news based on user preferences
    async fetchNews(categories: string[] = ['general'], country: string = 'us', pageSize: number = 12): Promise<any[]> {
        try {
            const newsPromises = categories.map(async (category) => {
                const response = await fetch(
                    `${this.NEWS_BASE_URL}/top-headlines?country=${country}&category=${category}&pageSize=${Math.ceil(pageSize / categories.length)}&apiKey=${this.NEWS_API_KEY}`
                )

                if (!response.ok) {
                    throw new Error(`News API error: ${response.status}`)
                }

                const data: NewsAPIResponse = await response.json()

                return data.articles.map(article => ({
                    id: `news-${article.url.split('/').pop()}`,
                    type: 'news' as const,
                    title: article.title,
                    description: article.description || 'No description available',
                    image: article.urlToImage || 'https://picsum.photos/400/300?random=50',
                    url: article.url,
                    metadata: {
                        source: article.source.name,
                        author: article.author || 'Unknown',
                        publishedAt: article.publishedAt,
                        category: category,
                    }
                }))
            })

            const allNews = await Promise.all(newsPromises)
            return allNews.flat().slice(0, pageSize)
        } catch (error) {
            console.error('Error fetching news:', error)
            return this.getMockNews(pageSize)
        }
    }

    // Fetch movies from TMDB
    async fetchMovies(page: number = 1): Promise<any[]> {
        try {
            const response = await fetch(
                `${this.TMDB_BASE_URL}/movie/popular?api_key=${this.TMDB_API_KEY}&page=${page}`
            )

            if (!response.ok) {
                throw new Error(`TMDB API error: ${response.status}`)
            }

            const data: TMDBResponse = await response.json()

            return data.results.map(movie => ({
                id: `movie-${movie.id}`,
                type: 'movie' as const,
                title: movie.title,
                description: movie.overview || 'No description available',
                image: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                    : 'https://picsum.photos/400/600?random=16',
                url: `https://www.themoviedb.org/movie/${movie.id}`,
                metadata: {
                    source: 'TMDB',
                    publishedAt: movie.release_date,
                    rating: movie.vote_average,
                    category: 'movie',
                }
            }))
        } catch (error) {
            console.error('Error fetching movies:', error)
            return this.getMockMovies()
        }
    }

    // Fetch trending content
    async fetchTrending(): Promise<any[]> {
        try {
            const [news, movies] = await Promise.all([
                this.fetchNews(['technology', 'business'], 'us', 6),
                this.fetchMovies(1)
            ])

            const trending = [
                ...news.slice(0, 3),
                ...movies.slice(0, 3),
                ...this.getMockSocialContent().slice(0, 2)
            ]

            return trending.sort(() => Math.random() - 0.5)
        } catch (error) {
            console.error('Error fetching trending:', error)
            return this.getMockTrendingContent()
        }
    }

    // Search across all content types
    async searchContent(query: string, filters: { type?: string, category?: string } = {}): Promise<any[]> {
        try {
            const searchPromises: Promise<any[]>[] = []

            // Search news
            if (!filters.type || filters.type === 'news') {
                searchPromises.push(this.searchNews(query))
            }

            // Search movies
            if (!filters.type || filters.type === 'movie') {
                searchPromises.push(this.searchMovies(query))
            }

            // Add mock social search
            if (!filters.type || filters.type === 'social') {
                searchPromises.push(Promise.resolve(this.searchMockSocial(query)))
            }

            const allResults = await Promise.all(searchPromises)
            return allResults.flat()
        } catch (error) {
            console.error('Error searching content:', error)
            return []
        }
    }

    private async searchNews(query: string): Promise<any[]> {
        try {
            const response = await fetch(
                `${this.NEWS_BASE_URL}/everything?q=${encodeURIComponent(query)}&pageSize=10&apiKey=${this.NEWS_API_KEY}`
            )

            if (!response.ok) throw new Error('News search failed')

            const data: NewsAPIResponse = await response.json()

            return data.articles.map(article => ({
                id: `news-search-${article.url.split('/').pop()}`,
                type: 'news' as const,
                title: article.title,
                description: article.description || 'No description available',
                image: article.urlToImage || 'https://picsum.photos/400/300?random=50',
                url: article.url,
                metadata: {
                    source: article.source.name,
                    author: article.author || 'Unknown',
                    publishedAt: article.publishedAt,
                    category: 'general',
                }
            }))
        } catch (error) {
            return []
        }
    }

    private async searchMovies(query: string): Promise<any[]> {
        try {
            const response = await fetch(
                `${this.TMDB_BASE_URL}/search/movie?api_key=${this.TMDB_API_KEY}&query=${encodeURIComponent(query)}`
            )

            if (!response.ok) throw new Error('Movie search failed')

            const data: TMDBResponse = await response.json()

            return data.results.map(movie => ({
                id: `movie-search-${movie.id}`,
                type: 'movie' as const,
                title: movie.title,
                description: movie.overview || 'No description available',
                image: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                    : 'https://picsum.photos/400/600?random=17',
                url: `https://www.themoviedb.org/movie/${movie.id}`,
                metadata: {
                    source: 'TMDB',
                    publishedAt: movie.release_date,
                    rating: movie.vote_average,
                    category: 'movie',
                }
            }))
        } catch (error) {
            return []
        }
    }

    private searchMockSocial(query: string): any[] {
        const mockSocial = this.getMockSocialContent()
        return mockSocial.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        )
    }

    // Fallback mock data
    private getMockNews(count: number = 12): any[] {
        const mockNews = [
            {
                id: 'news-mock-1',
                type: 'news' as const,
                title: 'Breaking: AI Revolution Transforms Technology Sector',
                description: 'Major breakthrough in artificial intelligence promises to revolutionize how we interact with technology across all industries.',
                image: 'https://picsum.photos/400/300?random=50',
                url: '#',
                metadata: {
                    source: 'Tech News',
                    author: 'Tech Reporter',
                    publishedAt: new Date().toISOString(),
                    category: 'technology',
                }
            },
            {
                id: 'news-mock-2',
                type: 'news' as const,
                title: 'Global Markets Show Strong Growth in Q4',
                description: 'Financial analysts report unprecedented growth across major market indices as investor confidence reaches new heights.',
                image: 'https://picsum.photos/400/300?random=50',
                url: '#',
                metadata: {
                    source: 'Business Today',
                    author: 'Market Analyst',
                    publishedAt: new Date(Date.now() - 3600000).toISOString(),
                    category: 'business',
                }
            }
        ]

        return Array.from({ length: count }, (_, i) => ({
            ...mockNews[i % mockNews.length],
            id: `news-mock-${i + 1}`,
            metadata: {
                ...mockNews[i % mockNews.length].metadata,
                publishedAt: new Date(Date.now() - i * 1800000).toISOString()
            }
        }))
    }

    private getMockMovies(): any[] {
        return [
            {
                id: 'movie-mock-1',
                type: 'movie' as const,
                title: 'Galactic Adventures: The Final Journey',
                description: 'An epic space odyssey that follows a crew of explorers as they venture into uncharted territories of the galaxy.',
                image: 'https://picsum.photos/400/300?random=50',
                url: '#',
                metadata: {
                    source: 'TMDB',
                    publishedAt: '2024-01-15',
                    rating: 8.7,
                    category: 'sci-fi',
                }
            },
            {
                id: 'movie-mock-2',
                type: 'movie' as const,
                title: 'Urban Hearts',
                description: 'A romantic drama set in the bustling streets of New York City, exploring love and relationships in modern times.',
                image: 'https://picsum.photos/400/600?random=18',
                url: 'https://www.imdb.com/title/tt9876543/',
                metadata: {
                    source: 'TMDB',
                    publishedAt: '2024-02-20',
                    rating: 7.9,
                    category: 'romance',
                }
            }
        ]
    }

    private getMockSocialContent(): any[] {
        return [
            {
                id: 'social-mock-1',
                type: 'social' as const,
                title: 'Beautiful sunset captured in the mountains! 🌄',
                description: 'Had an amazing hiking trip today. The sunset view from the peak was absolutely breathtaking. Nature never fails to amaze me!',
                image: 'https://picsum.photos/400/300?random=50',
                metadata: {
                    source: 'Social Network',
                    author: '@outdoorexplorer',
                    publishedAt: new Date(Date.now() - 900000).toISOString(),
                    category: 'lifestyle'
                }
            },
            {
                id: 'social-mock-2',
                type: 'social' as const,
                title: 'Just finished building an amazing React app! 💻',
                description: 'Spent the weekend working on a new dashboard project. The feeling of clean code and smooth functionality is unmatched! #coding #react',
                metadata: {
                    source: 'Developer Community',
                    author: '@techdev',
                    publishedAt: new Date(Date.now() - 1800000).toISOString(),
                    category: 'technology'
                }
            }
        ]
    }

    private getMockTrendingContent(): any[] {
        return [
            ...this.getMockNews(3),
            ...this.getMockMovies(),
            ...this.getMockSocialContent()
        ]
    }
}

export const apiService = new RealAPIService()

