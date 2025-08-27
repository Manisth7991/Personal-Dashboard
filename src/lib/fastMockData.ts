'use client'

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

// Fast mock data for immediate loading
export const fastMockData: ContentItem[] = [
    {
        id: 'quick-news-1',
        type: 'news',
        title: 'Tech Innovation Breakthrough',
        description: 'Revolutionary AI technology promises to transform daily life with unprecedented capabilities.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Tech Daily',
            publishedAt: new Date().toISOString(),
            category: 'technology'
        }
    },
    {
        id: 'quick-news-2',
        type: 'news',
        title: 'Global Markets Rally',
        description: 'Stock markets around the world show strong performance as economic indicators improve.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Market Watch',
            publishedAt: new Date(Date.now() - 1800000).toISOString(),
            category: 'business'
        }
    },
    {
        id: 'quick-movie-1',
        type: 'movie',
        title: 'Stellar Odyssey',
        description: 'An epic space adventure that takes viewers on a thrilling journey across the galaxy.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Cinema Hub',
            publishedAt: '2024-01-15',
            rating: 8.7,
            category: 'sci-fi'
        }
    },
    {
        id: 'quick-social-1',
        type: 'social',
        title: 'Beautiful morning view! ☀️',
        description: 'Starting the day with this amazing sunrise. Feeling grateful and energized! #morning #gratitude #sunrise',
        image: 'https://picsum.photos/400/300?random=50',
        metadata: {
            source: 'Social Feed',
            author: '@sunshine_daily',
            publishedAt: new Date(Date.now() - 900000).toISOString()
        }
    },
    {
        id: 'quick-movie-2',
        type: 'movie',
        title: 'Urban Legend',
        description: 'A thrilling mystery set in the heart of a bustling metropolis with unexpected twists.',
        image: 'https://picsum.photos/400/600?random=11',
        url: '#',
        metadata: {
            source: 'Movie Central',
            publishedAt: '2024-02-20',
            rating: 7.9,
            category: 'thriller'
        }
    },
    {
        id: 'quick-social-2',
        type: 'social',
        title: 'Just finished an amazing workout! 💪',
        description: 'Feeling stronger every day. Consistency is key! Who else is crushing their fitness goals? #fitness #motivation #workout',
        metadata: {
            source: 'Fitness Community',
            author: '@fit_life',
            publishedAt: new Date(Date.now() - 2700000).toISOString()
        }
    }
]

export const searchFastMockData = (query: string, type?: string): ContentItem[] => {
    let filteredData = fastMockData

    // Filter by type if specified
    if (type && type !== 'all') {
        filteredData = filteredData.filter(item => item.type === type)
    }

    // Filter by search query
    if (query.trim()) {
        const searchTerm = query.toLowerCase()
        filteredData = filteredData.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.metadata.category?.toLowerCase().includes(searchTerm) ||
            item.metadata.source?.toLowerCase().includes(searchTerm)
        )
    }

    return filteredData
}

export const getContentByType = (type: 'news' | 'movie' | 'social'): ContentItem[] => {
    return fastMockData.filter(item => item.type === type)
}

export const getFeaturedContent = (): ContentItem[] => {
    // Return a mix of content types for featured section
    return [
        fastMockData.find(item => item.id === 'quick-news-1'),
        fastMockData.find(item => item.id === 'quick-movie-1'),
        fastMockData.find(item => item.id === 'quick-social-1'),
    ].filter(Boolean) as ContentItem[]
}

