import { cn } from '@/lib/utils/cn'

interface CardProps {
  className?: string
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
  variant?: 'default' | 'featured'
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const shadowMap = {
  none: '',
  sm: 'shadow-card',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

export function Card({
  className,
  children,
  padding = 'md',
  shadow = 'sm',
  hover = false,
  onClick,
  variant = 'default',
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-bg border border-border-light',
        paddingMap[padding],
        shadowMap[shadow],
        hover && 'hover:shadow-md hover:border-border transition-shadow duration-200 cursor-pointer',
        variant === 'featured' && 'hover:scale-[1.02] transition-transform duration-200',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}