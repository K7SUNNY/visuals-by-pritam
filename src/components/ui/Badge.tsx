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
        'inline-flex items-center justify-center rounded-full font-medium transition-colors select-none',
        {
          'bg-blue-50 text-blue-700 border border-blue-200': variant === 'default',
          'bg-gray-100 text-gray-700 border border-gray-200': variant === 'secondary',
          'bg-emerald-50 text-emerald-700 border border-emerald-200': variant === 'success',
          'bg-amber-50 text-amber-700 border border-amber-200': variant === 'warning',
          'bg-red-50 text-red-700 border border-red-200': variant === 'error',
          'bg-sky-50 text-sky-700 border border-sky-200': variant === 'info',
          'border border-gray-300 bg-transparent text-gray-600': variant === 'outline',
        },
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },
        className
      )}
      {...props}
    />
  )
}