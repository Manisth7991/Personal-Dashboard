// Note: In a production app, Reddit API calls should be made from a backend API route
// to protect credentials. This is a simplified example for demonstration.

export interface RedditPost {
    id: string
    title: string
    author: string
    subreddit: string
    score: number
    num_comments: number
    created_utc: number
    selftext?: string
    url?: string
    thumbnail?: string
    preview?: {
        images: Array<{
            source: {
                url: string
                width: number
                height: number
            }
        }>
    }
}

export interface RedditResponse {
    data: {
        children: Array<{
            data: RedditPost
        }>
    }
}

const REDDIT_BASE_URL = 'https://www.reddit.com'

// Helper function to clean Reddit URLs
const cleanRedditUrl = (url: string): string => {
    return url.replace(/&amp;/g, '&')
}

// Get posts from a specific subreddit
export const getSubredditPosts = async (
    subreddit: string,
    limit: number = 25,
    sort: 'hot' | 'new' | 'top' = 'hot'
): Promise<RedditPost[]> => {
    try {
        const response = await fetch(
            `${REDDIT_BASE_URL}/r/${subreddit}/${sort}.json?limit=${limit}`,
            {
                headers: {
                    'User-Agent': 'PersonalDashboard/1.0.0'
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Reddit API error: ${response.status}`)
        }

        const data: RedditResponse = await response.json()

        return data.data.children.map(child => {
            const post = child.data
            return {
                ...post,
                url: post.url ? cleanRedditUrl(post.url) : undefined,
                thumbnail: post.thumbnail && post.thumbnail !== 'self' ? cleanRedditUrl(post.thumbnail) : undefined,
                preview: post.preview ? {
                    ...post.preview,
                    images: post.preview.images.map(img => ({
                        ...img,
                        source: {
                            ...img.source,
                            url: cleanRedditUrl(img.source.url)
                        }
                    }))
                } : undefined
            }
        })
    } catch (error) {
        console.error('Error fetching Reddit posts:', error)
        throw error
    }
}

// Get posts from multiple subreddits
export const getMultipleSubredditPosts = async (
    subreddits: string[],
    limit: number = 10
): Promise<RedditPost[]> => {
    try {
        const promises = subreddits.map(subreddit =>
            getSubredditPosts(subreddit, Math.ceil(limit / subreddits.length))
        )

        const results = await Promise.all(promises)
        const allPosts = results.flat()

        // Sort by score and take the requested limit
        return allPosts
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
    } catch (error) {
        console.error('Error fetching multiple subreddit posts:', error)
        throw error
    }
}

// Get trending posts from popular subreddits
export const getTrendingPosts = async (limit: number = 25): Promise<RedditPost[]> => {
    const trendingSubreddits = [
        'popular',
        'technology',
        'worldnews',
        'science',
        'AskReddit',
        'todayilearned'
    ]

    return getMultipleSubredditPosts(trendingSubreddits, limit)
}

// Format Reddit post for display
export const formatRedditPost = (post: RedditPost) => {
    const timeAgo = new Date(post.created_utc * 1000)
    const imageUrl = post.preview?.images[0]?.source?.url || post.thumbnail

    return {
        id: post.id,
        title: post.title,
        description: post.selftext ? post.selftext.substring(0, 200) + '...' : `Posted in r/${post.subreddit}`,
        author: `u/${post.author}`,
        subreddit: `r/${post.subreddit}`,
        score: post.score,
        comments: post.num_comments,
        timestamp: timeAgo.toISOString(),
        imageUrl: imageUrl && imageUrl !== 'self' ? imageUrl : undefined,
        url: post.url?.startsWith('http') ? post.url : `${REDDIT_BASE_URL}${post.url}`,
        type: 'reddit' as const
    }
}

