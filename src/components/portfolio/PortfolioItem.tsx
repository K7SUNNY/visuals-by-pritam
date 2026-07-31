import { cn } from '@/lib/utils/cn'

interface PortfolioItemProps {
  title: string
  description: string
  mediaUrl: string
  thumbnailUrl?: string | null
  altText: string
  className?: string
}

export function PortfolioItem({
  title,
  description,
  mediaUrl,
  thumbnailUrl,
  altText,
  className,
}: PortfolioItemProps) {
  return (
    <div className={cn('group relative overflow-hidden rounded-lg', className)}>
      <img
        src={thumbnailUrl ?? mediaUrl}
        alt={altText}
        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="p-4">
        <h3 className="font-heading font-medium text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}