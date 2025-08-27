'use client'

import { useEffect, useRef, useState } from 'react'

interface RealTimeUpdate {
    type: 'news' | 'movie' | 'social' | 'trending'
    action: 'add' | 'update' | 'delete'
    data: any
    timestamp: number
}

interface UseRealTimeOptions {
    enabled?: boolean
    updateInterval?: number
    onUpdate?: (update: RealTimeUpdate) => void
}

export function useRealTime({
    enabled = true,
    updateInterval = 30000, // 30 seconds
    onUpdate
}: UseRealTimeOptions = {}) {
    const [isConnected, setIsConnected] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const [updateCount, setUpdateCount] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const wsRef = useRef<WebSocket | null>(null)

    // Mock WebSocket connection (since we don't have a real WebSocket server)
    const connectWebSocket = () => {
        try {
            // In a real app, you'd connect to your WebSocket server
            // const ws = new WebSocket('ws://localhost:3001/realtime')

            // For demo purposes, we'll simulate updates
            setIsConnected(true)
            console.log('🔌 Real-time connection established (simulated)')

            return true
        } catch (error) {
            console.error('WebSocket connection failed:', error)
            setIsConnected(false)
            return false
        }
    }

    const disconnectWebSocket = () => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
        setIsConnected(false)
        console.log('🔌 Real-time connection closed')
    }

    // Simulate real-time updates
    const simulateUpdate = () => {
        const updateTypes: RealTimeUpdate['type'][] = ['news', 'movie', 'social', 'trending']
        const actions: RealTimeUpdate['action'][] = ['add', 'update']

        const mockUpdates: Partial<RealTimeUpdate>[] = [
            {
                type: 'news',
                action: 'add',
                data: {
                    id: `news-realtime-${Date.now()}`,
                    type: 'news',
                    title: '🔴 LIVE: Breaking News Update',
                    description: 'This is a real-time news update delivered via WebSocket connection.',
                    image: 'https://picsum.photos/400/300?random=50',
                    url: '#',
                    metadata: {
                        source: 'Live News',
                        publishedAt: new Date().toISOString(),
                        category: 'breaking',
                        isRealTime: true
                    }
                }
            },
            {
                type: 'social',
                action: 'add',
                data: {
                    id: `social-realtime-${Date.now()}`,
                    type: 'social',
                    title: '🔴 LIVE: Trending now! #RealTime',
                    description: 'This post is being delivered in real-time through our live update system!',
                    metadata: {
                        source: 'Live Social',
                        author: '@realtime_user',
                        publishedAt: new Date().toISOString(),
                        category: 'trending',
                        isRealTime: true
                    }
                }
            },
            {
                type: 'movie',
                action: 'add',
                data: {
                    id: `movie-realtime-${Date.now()}`,
                    type: 'movie',
                    title: '🔴 LIVE: New Movie Release Alert',
                    description: 'Just announced! This movie is now available and this update came through real-time.',
                    image: 'https://picsum.photos/400/600?random=19',
                    url: 'https://www.imdb.com/title/tt1111111/',
                    metadata: {
                        source: 'Live Movies',
                        publishedAt: new Date().toISOString(),
                        rating: 9.1,
                        category: 'new-release',
                        isRealTime: true
                    }
                }
            }
        ]

        const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)]
        const update: RealTimeUpdate = {
            type: randomUpdate.type!,
            action: randomUpdate.action!,
            data: randomUpdate.data,
            timestamp: Date.now()
        }

        setLastUpdate(new Date())
        setUpdateCount(prev => prev + 1)

        if (onUpdate) {
            onUpdate(update)
        }

        console.log('📡 Real-time update received:', update)

        // Show notification for real-time updates
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Dashboard Update', {
                body: `New ${update.type} content available`,
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png'
            })
        }
    }

    // Start real-time updates
    const startRealTime = () => {
        if (!enabled) return

        const connected = connectWebSocket()
        if (connected) {
            // Start simulated updates
            intervalRef.current = setInterval(simulateUpdate, updateInterval)
        }
    }

    // Stop real-time updates
    const stopRealTime = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        disconnectWebSocket()
        setUpdateCount(0)
        setLastUpdate(null)
    }

    // Request notification permission
    const requestNotificationPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission()
            return permission === 'granted'
        }
        return Notification.permission === 'granted'
    }

    useEffect(() => {
        if (enabled) {
            startRealTime()
            requestNotificationPermission()
        } else {
            stopRealTime()
        }

        return () => {
            stopRealTime()
        }
    }, [enabled, updateInterval])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopRealTime()
        }
    }, [])

    return {
        isConnected,
        lastUpdate,
        updateCount,
        startRealTime,
        stopRealTime,
        requestNotificationPermission
    }
}

