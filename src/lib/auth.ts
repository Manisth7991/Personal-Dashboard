export class AuthError extends Error {
    constructor(message: string, public code?: string) {
        super(message)
        this.name = 'AuthError'
    }
}

import { getUnsplashImage } from './imageUtils'

interface User {
    id: string
    email: string
    name: string
    avatar?: string
    preferences?: {
        categories: string[]
        language: string
        theme: 'light' | 'dark'
    }
}

// Mock user database
const mockUsers: User[] = [
    {
        id: '1',
        email: 'demo@dashboard.com',
        name: 'Demo User',
        avatar: getUnsplashImage('social', 0, 200, 200),
        preferences: {
            categories: ['technology', 'business', 'entertainment'],
            language: 'en',
            theme: 'light'
        }
    },
    {
        id: '2',
        email: 'user@dashboard.com',
        name: 'Dashboard User',
        avatar: getUnsplashImage('social', 1, 200, 200),
        preferences: {
            categories: ['news', 'sports', 'technology'],
            language: 'en',
            theme: 'dark'
        }
    }
]

// Mock password database (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
    'demo@dashboard.com': 'demo123',
    'user@dashboard.com': 'user123'
}

export async function signIn(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = mockUsers.find(u => u.email === email)
    if (!user) {
        throw new AuthError('User not found', 'USER_NOT_FOUND')
    }

    if (mockPasswords[email] !== password) {
        throw new AuthError('Invalid password', 'INVALID_PASSWORD')
    }

    // Store user session
    localStorage.setItem('dashboard-user', JSON.stringify(user))
    localStorage.setItem('dashboard-auth-token', `token_${user.id}_${Date.now()}`)

    return user
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
        throw new AuthError('User already exists', 'USER_EXISTS')
    }

    // Validate inputs
    if (!name.trim()) {
        throw new AuthError('Name is required', 'INVALID_NAME')
    }

    if (!email.includes('@')) {
        throw new AuthError('Invalid email address', 'INVALID_EMAIL')
    }

    if (password.length < 6) {
        throw new AuthError('Password must be at least 6 characters', 'WEAK_PASSWORD')
    }

    // Create new user
    const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff&size=100`,
        preferences: {
            categories: ['general'],
            language: 'en',
            theme: 'light'
        }
    }

    // Add to mock database
    mockUsers.push(newUser)
    mockPasswords[email] = password

    // Store user session
    localStorage.setItem('dashboard-user', JSON.stringify(newUser))
    localStorage.setItem('dashboard-auth-token', `token_${newUser.id}_${Date.now()}`)

    return newUser
}

export async function signOut(): Promise<void> {
    localStorage.removeItem('dashboard-user')
    localStorage.removeItem('dashboard-auth-token')
}

export function getCurrentUser(): User | null {
    try {
        const userStr = localStorage.getItem('dashboard-user')
        const token = localStorage.getItem('dashboard-auth-token')

        if (!userStr || !token) return null

        return JSON.parse(userStr)
    } catch {
        return null
    }
}

export function isAuthenticated(): boolean {
    return !!getCurrentUser()
}

export async function updateUserPreferences(preferences: Partial<User['preferences']>): Promise<User> {
    const currentUser = getCurrentUser()
    if (!currentUser) {
        throw new AuthError('Not authenticated', 'NOT_AUTHENTICATED')
    }

    const updatedUser: User = {
        ...currentUser,
        preferences: {
            categories: currentUser.preferences?.categories || ['general'],
            language: currentUser.preferences?.language || 'en',
            theme: currentUser.preferences?.theme || 'light',
            ...preferences
        }
    }

    localStorage.setItem('dashboard-user', JSON.stringify(updatedUser))
    return updatedUser
}

export async function updateUserProfile(updates: Partial<Pick<User, 'name' | 'avatar'>>): Promise<User> {
    const currentUser = getCurrentUser()
    if (!currentUser) {
        throw new AuthError('Not authenticated', 'NOT_AUTHENTICATED')
    }

    const updatedUser = {
        ...currentUser,
        ...updates
    }

    localStorage.setItem('dashboard-user', JSON.stringify(updatedUser))
    return updatedUser
}

