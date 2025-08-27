'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react'
import { useRealTimeUpdates } from '@/hooks/useRealTime'

export function StatusIndicator() {
    const { t } = useTranslation()

    const { lastUpdate, isEnabled, forceUpdate } = useRealTimeUpdates({
        onUpdate: () => {
            // Real-time update received - trigger any necessary actions
            console.log('Real-time update received in StatusIndicator')
        }
    })

    const formatLastUpdate = (date: Date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) {
            return t('justNow')
        } else if (diffInMinutes === 1) {
            return t('minutesAgo', { count: 1 })
        } else if (diffInMinutes < 60) {
            return t('minutesAgo', { count: diffInMinutes })
        } else {
            const diffInHours = Math.floor(diffInMinutes / 60)
            return t('hoursAgo', { count: diffInHours })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 flex items-center gap-2 text-xs z-50"
        >
            <div className="flex items-center gap-1">
                {isEnabled ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Wifi className="w-3 h-3 text-green-500" />
                    </motion.div>
                ) : (
                    <WifiOff className="w-3 h-3 text-gray-400" />
                )}
                <span className={`text-xs ${isEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                    {isEnabled ? t('autoRefresh') : 'Manual'}
                </span>
            </div>

            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />

            <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">
                    {formatLastUpdate(lastUpdate)}
                </span>
            </div>

            <button
                onClick={forceUpdate}
                className="ml-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Manual refresh"
                aria-label="Manually refresh content"
            >
                <RefreshCw className="w-3 h-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
        </motion.div>
    )
}

