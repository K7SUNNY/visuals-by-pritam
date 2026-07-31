import { cn } from '@/lib/utils/cn'
import { type ComponentPropsWithoutRef } from 'react'

interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
  size?: 'sm' | 'md'
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        {
          'bg-primary/10 text-primary': variant === 'default',
          'bg-secondary/10 text-secondary': variant === 'secondary',
          'bg-success/10 text-success': variant === 'success',
          'bg-warning/10 text-warning': variant === 'warning',
          'bg-error/10 text-error': variant === 'error',
          'bg-info/10 text-info': variant === 'info',
          'border border-border bg-transparent text-text-secondary':
            variant === 'outline',
        },
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
        },
        className
      )}
      {...props}
    />
  )
}