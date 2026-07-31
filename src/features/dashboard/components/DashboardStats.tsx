import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  label: string
  value: string | number
  className?: string
}

function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-heading font-medium mt-1">{value}</p>
    </div>
  )
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Works" value="0" />
      <StatCard label="Published" value="0" />
      <StatCard label="Drafts" value="0" />
      <StatCard label="Visitors" value="0" />
    </div>
  )
}