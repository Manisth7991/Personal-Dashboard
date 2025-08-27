'use client'

import { ContentItem } from '@/components/content/fast-content-card'

// Fast mock data for immediate loading
export const fastContent: ContentItem[] = [
    {
        id: 'fast-news-1',
        type: 'news',
        title: 'AI Revolution: New Breakthrough in Machine Learning',
        description: 'Scientists announce a major breakthrough in artificial intelligence that could transform how computers understand and process human language, opening new possibilities for automation and human-computer interaction.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Tech Today',
            publishedAt: new Date().toISOString(),
            category: 'technology'
        }
    },
    {
        id: 'fast-news-2',
        type: 'news',
        title: 'Global Climate Action Plan Approved by 50 Nations',
        description: 'In a historic move, 50 countries have unanimously approved an ambitious climate action plan aimed at reducing carbon emissions by 80% over the next decade, marking a significant step in global environmental policy.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'World Report',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            category: 'environment'
        }
    },
    {
        id: 'fast-news-3',
        type: 'news',
        title: 'Economic Markets Show Strong Recovery Signs',
        description: 'Stock markets worldwide are experiencing a robust recovery as investor confidence grows following positive economic indicators and strong corporate earnings reports across multiple sectors.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Financial Daily',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            category: 'business'
        }
    },
    {
        id: 'fast-movie-1',
        type: 'movie',
        title: 'Galactic Horizons',
        description: 'An epic space adventure that follows a diverse crew as they explore uncharted galaxies, encounter alien civilizations, and uncover ancient mysteries that could change the fate of humanity.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Cinema Plus',
            publishedAt: '2024-01-15',
            rating: 8.7,
            category: 'sci-fi'
        }
    },
    {
        id: 'fast-movie-2',
        type: 'movie',
        title: 'Heart of the City',
        description: 'A touching romantic drama set against the backdrop of New York City, following two unlikely souls as they navigate love, career challenges, and personal growth in the urban jungle.',
        image: 'https://picsum.photos/400/600?random=12',
        url: '#',
        metadata: {
            source: 'MovieHub',
            publishedAt: '2024-02-20',
            rating: 7.9,
            category: 'romance'
        }
    },
    {
        id: 'fast-movie-3',
        type: 'movie',
        title: 'Thunder Strike',
        description: 'High-octane action thriller featuring spectacular chase sequences, cutting-edge special effects, and a gripping storyline about a former military operative fighting corruption.',
        image: 'https://picsum.photos/400/300?random=50',
        url: '#',
        metadata: {
            source: 'Action Cinema',
            publishedAt: '2024-03-10',
            rating: 9.1,
            category: 'action'
        }
    },
    {
        id: 'fast-social-1',
        type: 'social',
        title: 'Amazing sunrise this morning! 🌅✨',
        description: 'Woke up early to catch this breathtaking sunrise. The colors were absolutely stunning - nature never ceases to amaze me! Starting the day with gratitude and positive energy. #sunrise #grateful #morning #nature #photography',
        image: 'https://picsum.photos/400/300?random=50',
        metadata: {
            source: 'Social Feed',
            author: '@naturelover',
            publishedAt: new Date(Date.now() - 1800000).toISOString()
        }
    },
    {
        id: 'fast-social-2',
        type: 'social',
        title: 'Just finished reading "The Digital Frontier" 📚',
        description: 'Mind-blown by this incredible sci-fi novel! The author created such a vivid and immersive world that I felt like I was actually living in the future. Highly recommend to all book lovers! #reading #books #scifi #bookclub #recommended',
        metadata: {
            source: 'BookClub',
            author: '@bookworm',
            publishedAt: new Date(Date.now() - 3600000).toISOString()
        }
    },
    {
        id: 'fast-social-3',
        type: 'social',
        title: 'Perfect coding session with my morning coffee ☕💻',
        description: 'There\'s something magical about that first cup of coffee and diving into a new coding project. The combination of caffeine and creativity is unbeatable! Who else is having a productive Monday? #coding #coffee #productivity #mondayvibes #programming',
        image: 'https://picsum.photos/400/300?random=50',
        metadata: {
            source: 'Dev Community',
            author: '@coder_life',
            publishedAt: new Date(Date.now() - 5400000).toISOString()
        }
    }
]

// Fast search function
export const searchContent = (query: string, type?: string): ContentItem[] => {
    let results = fastContent

    // Filter by type
    if (type && type !== 'all') {
        results = results.filter(item => item.type === type)
    }

    // Filter by search query
    if (query.trim()) {
        const searchTerm = query.toLowerCase()
        results = results.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.metadata.category?.toLowerCase().includes(searchTerm) ||
            item.metadata.source?.toLowerCase().includes(searchTerm)
        )
    }

    return results
}

// Get content by type
export const getContentByType = (type: 'news' | 'movie' | 'social'): ContentItem[] => {
    return fastContent.filter(item => item.type === type)
}

// Refresh content (simulates getting new content)
export const refreshContent = (): ContentItem[] => {
    // Simulate fresh content by updating timestamps
    return fastContent.map(item => ({
        ...item,
        metadata: {
            ...item.metadata,
            publishedAt: item.metadata.publishedAt ?
                new Date(Date.now() - Math.random() * 7200000).toISOString() :
                item.metadata.publishedAt
        }
    }))
}

