import { cn } from '@/lib/utils/cn'

interface PortfolioListProps {
  className?: string
}

export function PortfolioList({ className }: PortfolioListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <p className="text-muted-foreground">Portfolio list coming soon.</p>
    </div>
  )
}