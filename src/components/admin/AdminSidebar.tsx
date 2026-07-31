import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Works', href: '/admin/works' },
  { label: 'Upload', href: '/admin/upload' },
  { label: 'Settings', href: '/admin/settings' },
]

export function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r bg-background min-h-screen p-4 hidden md:flex flex-col">
      <div className="mb-8">
        <h2 className="font-heading font-medium text-lg">Admin</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              location.pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}