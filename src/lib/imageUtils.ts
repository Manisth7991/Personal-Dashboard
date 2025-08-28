// Image utilities for handling fallbacks and placeholders

export const FALLBACK_IMAGES = {
  news: '/images/placeholder-news.svg',
  movie: '/images/placeholder-movie.svg', 
  social: '/images/placeholder-social.svg',
  default: '/images/placeholder-news.svg'
}

// Enhanced image utility with multiple fallback strategies  
export const getUnsplashImage = (
  type: 'news' | 'movie' | 'social', 
  index: number = 0,
  width: number = 400,
  height: number = 300
): string => {
  // Create deterministic seeds for consistent images
  const baseSeeds = {
    news: [200, 300, 400, 500, 600, 700],
    movie: [100, 150, 250, 350, 450, 550],  
    social: [800, 900, 1000, 1100, 1200, 1300]
  }
  
  const seeds = baseSeeds[type]
  const seedNumber = seeds[index % seeds.length]
  
  // Primary: Picsum Photos (most reliable)
  const picsum = `https://picsum.photos/seed/${seedNumber}/${width}/${height}`
  
  // Return picsum as it's proven to be reliable
  return picsum
}

// Helper functions for color coding
const getColorForType = (type: string): string => {
  const colors = {
    news: '3B82F6',    // Blue
    movie: '8B5CF6',   // Purple  
    social: '10B981',  // Green
    default: '6B7280'  // Gray
  }
  return colors[type as keyof typeof colors] || colors.default
}

const getTextColorForType = (type: string): string => {
  return 'FFFFFF' // White text for all backgrounds
}

export const RELIABLE_PLACEHOLDER_IMAGES = {
  news: [
    'https://picsum.photos/seed/200/400/300',
    'https://picsum.photos/seed/300/400/300',
    'https://picsum.photos/seed/400/400/300',
  ],
  movie: [
    'https://picsum.photos/seed/100/400/600',
    'https://picsum.photos/seed/150/400/600',
    'https://picsum.photos/seed/250/400/600',
  ],
  social: [
    'https://picsum.photos/seed/800/400/300',
    'https://picsum.photos/seed/900/400/300',
    'https://picsum.photos/seed/1000/400/300',
  ]
}

export const getReliableImage = (type: keyof typeof RELIABLE_PLACEHOLDER_IMAGES, index: number = 0): string => {
  return getUnsplashImage(type, index)
}

export const createPlaceholderImage = (type: string, width: number = 400, height: number = 300): string => {
  // Create a data URL for a solid color placeholder
  const colors = {
    news: '#3B82F6', // Blue
    movie: '#8B5CF6', // Purple  
    social: '#10B981', // Green
    default: '#6B7280' // Gray
  }
  
  const color = colors[type as keyof typeof colors] || colors.default
  
  // Create SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dy=".3em">
        ${type.toUpperCase()}
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

export const getImageWithFallback = (
  originalUrl: string | undefined, 
  type: 'news' | 'movie' | 'social',
  index: number = 0
): string => {
  if (!originalUrl) {
    return getUnsplashImage(type, index)
  }
  
  // If it's a picsum URL or any known problematic source, replace with Unsplash
  if (originalUrl.includes('picsum.photos') || originalUrl.includes('placeholder') || originalUrl.includes('/images/placeholder')) {
    return getUnsplashImage(type, index)
  }
  
  return originalUrl
}

// Enhanced image loading with multiple fallbacks
export const getImageWithMultipleFallbacks = (
  originalUrl: string | undefined,
  type: 'news' | 'movie' | 'social',
  index: number = 0
): string[] => {
  const fallbacks = [
    getUnsplashImage(type, index),
    getUnsplashImage(type, (index + 1) % 6),
    createPlaceholderImage(type)
  ]
  
  if (originalUrl && !originalUrl.includes('picsum.photos') && !originalUrl.includes('/images/placeholder')) {
    return [originalUrl, ...fallbacks]
  }
  
  return fallbacks
}
