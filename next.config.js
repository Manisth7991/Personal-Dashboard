/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
            },
            {
                protocol: 'https',
                hostname: 'newsapi.org',
            },
            {
                protocol: 'https',
                hostname: 'cdn.newsapi.org',
            },
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: '**.reddit.com',
            },
            {
                protocol: 'https',
                hostname: '**.redd.it',
            },
            {
                protocol: 'https',
                hostname: 'external-preview.redd.it',
            },
            {
                protocol: 'https',
                hostname: 'i.redd.it',
            },
            {
                protocol: 'https',
                hostname: 'preview.redd.it',
            },
        ],
    },
    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ]
    },
}

module.exports = nextConfig
