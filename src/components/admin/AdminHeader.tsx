import { cn } from '@/lib/utils/cn'

interface AdminHeaderProps {
  className?: string
}

export function AdminHeader({ className }: AdminHeaderProps) {
  return (
    <header className={cn('h-16 border-b bg-background flex items-center px-6', className)}>
      <h1 className="font-heading font-medium text-xl">Admin Panel</h1>
    </header>
  )
}