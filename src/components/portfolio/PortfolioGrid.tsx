import { cn } from '@/lib/utils/cn'
import { PortfolioGallery } from './PortfolioGallery'

interface PortfolioGridProps {
  className?: string
}

export function PortfolioGrid({ className }: PortfolioGridProps) {
  return (
    <div className={cn('w-full', className)}>
      <PortfolioGallery />
    </div>
  )
}