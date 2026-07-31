import { cn } from '@/lib/utils/cn'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-text-tertiary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-text mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}