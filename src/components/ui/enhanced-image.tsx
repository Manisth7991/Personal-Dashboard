'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createPlaceholderImage } from '@/lib/imageUtils'

interface EnhancedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  contentType?: 'news' | 'movie' | 'social'
  priority?: boolean
}

export const EnhancedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  contentType = 'news',
  priority = false 
}: EnhancedImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [hasErrored, setHasErrored] = useState(false)

  const handleError = () => {
    if (!hasErrored) {
      // First fallback: Generate a colored placeholder
      const fallbackSrc = createPlaceholderImage(contentType, width, height)
      setCurrentSrc(fallbackSrc)
      setHasErrored(true)
    }
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      style={{
        objectFit: 'cover',
        backgroundColor: hasErrored ? '#f3f4f6' : 'transparent'
      }}
    />
  )
}
