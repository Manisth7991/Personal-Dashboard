import { useState, useEffect } from 'react'
import { createPlaceholderImage } from '@/lib/imageUtils'

interface UseImageWithFallbackProps {
    src: string
    fallbackType: 'news' | 'movie' | 'social'
    width?: number
    height?: number
}

export const useImageWithFallback = ({
    src,
    fallbackType,
    width = 400,
    height = 300
}: UseImageWithFallbackProps) => {
    const [imageSrc, setImageSrc] = useState(src)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    const handleError = () => {
        setHasError(true)
        setIsLoading(false)
        // Use data URL fallback that always works
        setImageSrc(createPlaceholderImage(fallbackType, width, height))
    }

    const handleLoad = () => {
        setIsLoading(false)
        setHasError(false)
    }

    useEffect(() => {
        setImageSrc(src)
        setIsLoading(true)
        setHasError(false)
    }, [src])

    return {
        imageSrc,
        isLoading,
        hasError,
        handleError,
        handleLoad
    }
}
