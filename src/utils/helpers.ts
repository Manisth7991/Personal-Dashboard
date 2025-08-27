import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()

    const minute = 60 * 1000
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7

    if (diff < minute) {
        return 'just now'
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute)
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    } else if (diff < day) {
        const hours = Math.floor(diff / hour)
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else if (diff < week) {
        const days = Math.floor(diff / day)
        return `${days} day${days !== 1 ? 's' : ''} ago`
    } else {
        return d.toLocaleDateString()
    }
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
}

export function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return '/placeholder-image.jpg'
    if (path.startsWith('http')) return path
    return `https://image.tmdb.org/t/p/${size}${path}`
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    return String(error)
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

