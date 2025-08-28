// Mock data for development when API keys are not available
import { getUnsplashImage } from './imageUtils'

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

export const mockNewsData: ContentItem[] = [
    {
        id: 'news-1',
        type: 'news',
        title: 'Breaking: Major Tech Innovation Announced',
        description: 'A revolutionary new technology promises to change how we interact with digital devices.',
        image: getUnsplashImage('news', 0),
        url: 'https://www.theverge.com/tech',
        metadata: {
            source: 'TechNews',
            publishedAt: new Date().toISOString(),
            category: 'technology'
        }
    },
    {
        id: 'news-2',
        type: 'news',
        title: 'Global Climate Summit Reaches Historic Agreement',
        description: 'World leaders unite on ambitious climate action plan with concrete targets.',
        image: getUnsplashImage('news', 1),
        url: 'https://www.bbc.com/news/science-environment-56837908',
        metadata: {
            source: 'World News',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            category: 'environment'
        }
    },
    {
        id: 'news-3',
        type: 'news',
        title: 'Stock Market Hits New Record High',
        description: 'Markets continue their upward trend as investors remain optimistic about economic recovery.',
        image: getUnsplashImage('news', 2),
        url: 'https://www.reuters.com/markets/',
        metadata: {
            source: 'Financial Times',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            category: 'business'
        }
    }
]

export const mockMovieData: ContentItem[] = [
    {
        id: 'movie-1',
        type: 'movie',
        title: 'The Future Chronicles',
        description: 'A sci-fi epic that takes viewers on a journey through time and space.',
        image: getUnsplashImage('movie', 0, 400, 600),
        url: 'https://www.imdb.com/title/tt0816692/',
        metadata: {
            source: 'Cinema Plus',
            publishedAt: '2024-01-15',
            rating: 8.5,
            category: 'sci-fi'
        }
    },
    {
        id: 'movie-2',
        type: 'movie',
        title: 'Romance in the City',
        description: 'A heartwarming romantic comedy set in the bustling streets of New York.',
        image: getUnsplashImage('movie', 1, 400, 600),
        url: 'https://www.imdb.com/title/tt0112442/',
        metadata: {
            source: 'MovieHub',
            publishedAt: '2024-02-20',
            rating: 7.8,
            category: 'romance'
        }
    },
    {
        id: 'movie-3',
        type: 'movie',
        title: 'Action Heroes United',
        description: 'High-octane action thriller with spectacular stunts and visual effects.',
        image: getUnsplashImage('movie', 2, 400, 600),
        url: 'https://www.imdb.com/title/tt0848228/',
        metadata: {
            source: 'Action Cinema',
            publishedAt: '2024-03-10',
            rating: 9.2,
            category: 'action'
        }
    }
]

export const mockSocialData: ContentItem[] = [
    {
        id: 'social-1',
        type: 'social',
        title: 'Amazing sunset today! 🌅',
        description: 'The colors in the sky were absolutely breathtaking. Nature never fails to amaze me. #sunset #nature #photography',
        image: getUnsplashImage('social', 0),
        url: 'https://www.instagram.com/p/explore/',
        metadata: {
            source: 'SocialFeed',
            author: '@naturelover',
            publishedAt: new Date(Date.now() - 1800000).toISOString()
        }
    },
    {
        id: 'social-2',
        type: 'social',
        title: 'Just finished reading an incredible book!',
        description: 'Mind-blown by this sci-fi novel. The author created such a vivid world that I felt like I was actually there. #reading #books #scifi',
        image: getUnsplashImage('social', 1),
        url: 'https://www.goodreads.com/book/show/968.The_Left_Hand_of_Darkness',
        metadata: {
            source: 'BookClub',
            author: '@bookworm',
            publishedAt: new Date(Date.now() - 3600000).toISOString()
        }
    },
    {
        id: 'social-3',
        type: 'social',
        title: 'Coffee and code - perfect Monday morning ☕',
        description: 'Starting the week with my favorite blend and some exciting new projects. Nothing beats that first cup! #coffee #programming #monday',
        image: getUnsplashImage('social', 2),
        url: 'https://dev.to/',
        metadata: {
            source: 'DevCommunity',
            author: '@coder_life',
            publishedAt: new Date(Date.now() - 5400000).toISOString()
        }
    }
]

export const getAllMockContent = (): ContentItem[] => {
    return [...mockNewsData, ...mockMovieData, ...mockSocialData]
}

export const searchMockContent = (query: string, type?: string): ContentItem[] => {
    const allContent = getAllMockContent()
    const filteredByType = type && type !== 'all' ? allContent.filter(item => item.type === type) : allContent

    if (!query.trim()) return filteredByType

    const searchTerm = query.toLowerCase()
    return filteredByType.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.metadata.category?.toLowerCase().includes(searchTerm)
    )
}

