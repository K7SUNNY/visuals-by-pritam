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
    <div className={cn('group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md', className)}>
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={thumbnailUrl ?? mediaUrl}
          alt={altText}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
      </div>
    </div>
  )
}