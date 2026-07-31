import { cn } from '@/lib/utils/cn'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  icon,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-error">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-text mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-text-secondary max-w-sm mb-6">
          {message}
        </p>
      )}
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
}