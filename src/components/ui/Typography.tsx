import { cn } from '@/lib/utils/cn'

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'overline'

interface TypographyProps {
  variant?: Variant
  as?: React.ElementType
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'tertiary'
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<Variant, string> = {
  h1: 'text-4xl md:text-6xl font-extrabold tracking-tight leading-tight',
  h2: 'text-2xl md:text-3xl font-bold tracking-tight leading-snug',
  h3: 'text-xl md:text-2xl font-semibold tracking-tight leading-snug',
  h4: 'text-lg md:text-xl font-semibold leading-normal',
  h5: 'text-base md:text-lg font-medium leading-normal',
  h6: 'text-base font-medium leading-normal',
  body: 'text-base font-normal leading-relaxed',
  caption: 'text-sm font-normal leading-normal',
  overline: 'text-xs font-semibold uppercase tracking-wider block',
}

const variantTags: Record<Variant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  caption: 'p',
  overline: 'span',
}

const weightStyles: Record<string, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const colorStyles: Record<string, string> = {
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
  tertiary: 'text-gray-400',
}

const alignStyles: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function Typography({
  variant = 'body',
  as,
  weight,
  color = 'primary',
  align = 'left',
  truncate = false,
  className,
  children,
}: TypographyProps) {
  const Component = as || variantTags[variant] || 'span'

  return (
    <Component
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
    </Component>
  )
}