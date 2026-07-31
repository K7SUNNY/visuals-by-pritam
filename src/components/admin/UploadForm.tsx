import { cn } from '@/lib/utils/cn'

interface UploadFormProps {
  className?: string
}

export function UploadForm({ className }: UploadFormProps) {
  return (
    <div className={cn('p-6', className)}>
      <p className="text-muted-foreground">Upload form coming soon.</p>
    </div>
  )
}