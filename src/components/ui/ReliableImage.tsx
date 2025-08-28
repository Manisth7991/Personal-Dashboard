import React from 'react'
import Image from 'next/image'
import { useImageWithFallback } from '@/hooks/useImageWithFallback'

interface ReliableImageProps {
  src: string
  alt: string
  width: number
  height: number
  fallbackType: 'news' | 'movie' | 'social'
  className?: string
  priority?: boolean
}

export const ReliableImage: React.FC<ReliableImageProps> = ({
  src,
  alt,
  width,
  height,
  fallbackType,
  className = '',
  priority = false
}) => {
  const { imageSrc, isLoading, hasError, handleError, handleLoad } = useImageWithFallback({
    src,
    fallbackType,
    width,
    height
  })

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={hasError} // Use unoptimized for data URLs
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      )}
    </div>
  )
}
