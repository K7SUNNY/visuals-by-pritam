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
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer',
        {
          'h-9 px-3.5 text-xs font-semibold': size === 'sm',
          'h-10 px-5 py-2.5 text-sm': size === 'md',
          'h-12 px-6 py-3 text-base': size === 'lg',
        },
        {
          'bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.98]':
            variant === 'primary',
          'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] shadow-sm':
            variant === 'secondary',
          'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100 active:scale-[0.98]':
            variant === 'tertiary',
          'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-[0.98]':
            variant === 'ghost',
          'bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.98]':
            variant === 'destructive',
        },
        loading && 'opacity-70 cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent shrink-0" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>
      )}
      <span className="truncate">{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>
      )}
    </button>
  )
}