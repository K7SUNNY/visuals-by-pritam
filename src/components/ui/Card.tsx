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
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const shadowMap = {
  none: 'shadow-none',
  sm: 'shadow-sm',
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
        'relative rounded-xl bg-white border border-gray-200 overflow-hidden transition-all duration-200',
        paddingMap[padding],
        shadowMap[shadow],
        hover && 'hover:shadow-md hover:border-gray-300 cursor-pointer',
        variant === 'featured' && 'border-blue-200 shadow-md hover:scale-[1.01]',
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