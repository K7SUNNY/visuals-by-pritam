import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  radius?: 'sm' | 'md' | 'lg' | 'full'
}

const radiusMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

export function Skeleton({
  className,
  width,
  height,
  radius = 'md',
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-secondary',
        radiusMap[radius],
        className
      )}
      style={{
        width:
          typeof width === 'number' ? `${width}px` : width ?? '100%',
        height:
          typeof height === 'number' ? `${height}px` : height ?? '1em',
      }}
      role="status"
      aria-label="Loading"
    />
  )
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? '60%' : '100%'}
          radius="sm"
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl p-4 space-y-3', className)}>
      <Skeleton height={24} width="40%" radius="sm" />
      <Skeleton height={16} width="100%" radius="sm" />
      <Skeleton height={16} width="80%" radius="sm" />
      <div className="flex gap-2 pt-2">
        <Skeleton height={32} width={80} radius="full" />
        <Skeleton height={32} width={80} radius="full" />
      </div>
    </div>
  )
}