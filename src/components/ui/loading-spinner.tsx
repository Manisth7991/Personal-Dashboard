import { cn } from '@/utils/helpers'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }

    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div
                className={cn(
                    'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
                    sizeClasses[size]
                )}
            />
        </div>
    )
}

export function SkeletonCard() {
    return (
        <div className="card p-4">
            <div className="animate-shimmer h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
            <div className="space-y-2">
                <div className="animate-shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="animate-shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="animate-shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="animate-shimmer h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
        </div>
    )
}

export function ErrorMessage({
    message,
    onRetry
}: {
    message: string
    onRetry?: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-lg font-medium mb-2">
                Something went wrong
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                {message}
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="btn-primary"
                >
                    Try Again
                </button>
            )}
        </div>
    )
}

export function EmptyState({
    title,
    description,
    action
}: {
    title: string
    description: string
    action?: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <div className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-md">
                {description}
            </div>
            {action && action}
        </div>
    )
}

