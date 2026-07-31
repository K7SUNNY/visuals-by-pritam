import { cn } from '@/lib/utils/cn'

interface WorkCardProps {
  title: string
  description: string
  category: string
  status: string
  className?: string
}

export function WorkCard({
  title,
  description,
  category,
  status,
  className,
}: WorkCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-heading font-medium">{title}</h3>
        <span className="text-xs text-muted-foreground">{status}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <span className="text-xs bg-muted px-2 py-1 rounded">{category}</span>
    </div>
  )
}