import { cn } from '@/lib/utils/cn'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline'

interface TypographyProps {
  variant?: Variant
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'tertiary'
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  h1: 'text-4xl font-bold leading-tight tracking-tight',
  h2: 'text-3xl font-semibold leading-tight tracking-tight',
  h3: 'text-2xl font-semibold leading-snug tracking-tight',
  h4: 'text-xl font-medium leading-snug',
  h5: 'text-lg font-medium leading-normal',
  h6: 'text-base font-medium leading-normal',
  body: 'text-base font-normal leading-relaxed',
  caption: 'text-sm font-normal leading-normal',
  overline: 'text-xs font-medium uppercase tracking-wider',
}

const weightStyles: Record<string, string> = {
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const colorStyles: Record<string, string> = {
  primary: 'text-text',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
}

const alignStyles: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function Typography({
  variant = 'body',
  weight,
  color = 'primary',
  align = 'left',
  truncate = false,
  className,
  children,
}: TypographyProps) {
  return (
    <span
      className={cn(
        variantStyles[variant],
        weight ? weightStyles[weight] : '',
        colorStyles[color],
        alignStyles[align],
        truncate && 'truncate',
        className
      )}
    >
      {children}
    </span>
  )
}