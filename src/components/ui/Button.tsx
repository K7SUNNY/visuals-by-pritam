import { cn } from '@/lib/utils/cn'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        {
          'h-9 px-4 py-2 text-sm': size === 'sm',
          'h-10 px-5 py-2.5 text-sm': size === 'md',
          'h-12 px-6 py-3 text-base': size === 'lg',
        },
        {
          'bg-primary text-text-inverse shadow-sm hover:bg-primary-hover active:scale-[0.98]':
            variant === 'primary',
          'bg-surface text-text border border-border hover:bg-surface-secondary active:scale-[0.98]':
            variant === 'secondary',
          'bg-transparent text-text border border-transparent hover:bg-surface-secondary active:scale-[0.98]':
            variant === 'tertiary',
          'bg-transparent text-text hover:bg-surface-secondary active:scale-[0.98]':
            variant === 'ghost',
          'bg-error text-text-inverse shadow-sm hover:bg-error/90 active:scale-[0.98]':
            variant === 'destructive',
        },
        loading && 'opacity-70 cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2 inline-flex">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2 inline-flex">{icon}</span>
      )}
    </button>
  )
}