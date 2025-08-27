'use client'

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'

interface UseRealTimeUpdatesOptions {
    enabled?: boolean
    interval?: number
    onUpdate?: () => void
}

export function useRealTimeUpdates({
    enabled = true,
    interval = 5 * 60 * 1000, // 5 minutes default
    onUpdate
}: UseRealTimeUpdatesOptions = {}) {
    const dispatch = useDispatch()
    const preferences = useSelector((state: RootState) => state.preferences?.preferences)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
    const intervalRef = useRef<NodeJS.Timeout>()

    // Check if auto-refresh is enabled in user preferences
    const autoRefreshEnabled = preferences?.autoRefresh ?? true
    const refreshInterval = (preferences?.refreshInterval ?? 5) * 60 * 1000

    useEffect(() => {
        if (!enabled || !autoRefreshEnabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
            return
        }

        intervalRef.current = setInterval(() => {
            setLastUpdate(new Date())
            onUpdate?.()
        }, refreshInterval)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [enabled, autoRefreshEnabled, refreshInterval, onUpdate])

    const forceUpdate = () => {
        setLastUpdate(new Date())
        onUpdate?.()
    }

    return {
        lastUpdate,
        forceUpdate,
        isEnabled: enabled && autoRefreshEnabled
    }
}

// Server-Sent Events hook for real-time updates (for future implementation)
export function useServerSentEvents(url: string) {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (!url) return

        const eventSource = new EventSource(url)

        eventSource.onopen = () => {
            setIsConnected(true)
            setError(null)
        }

        eventSource.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data)
                setData(parsedData)
            } catch (err) {
                setError('Failed to parse event data')
            }
        }

        eventSource.onerror = () => {
            setIsConnected(false)
            setError('Connection error')
        }

        return () => {
            eventSource.close()
            setIsConnected(false)
        }
    }, [url])

    return { data, error, isConnected }
}

// WebSocket hook for real-time updates (for future implementation)
export function useWebSocket(url: string) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [lastMessage, setLastMessage] = useState<any>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (!url) return

        const ws = new WebSocket(url)
        setSocket(ws)

        ws.onopen = () => {
            setIsConnected(true)
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                setLastMessage(data)
            } catch (err) {
                console.error('Failed to parse WebSocket message:', err)
            }
        }

        ws.onclose = () => {
            setIsConnected(false)
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            setIsConnected(false)
        }

        return () => {
            ws.close()
        }
    }, [url])

    const sendMessage = (message: any) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message))
        }
    }

    return { lastMessage, sendMessage, isConnected }
}

