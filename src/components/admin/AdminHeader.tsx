import { cn } from '@/lib/utils/cn'
import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'

interface AdminHeaderProps {
  className?: string
  onMenuClick?: () => void
}

export function AdminHeader({ className, onMenuClick }: AdminHeaderProps) {
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return 'Dashboard'
      case '/admin/works':
        return 'Portfolio Works'
      case '/admin/upload':
        return 'Upload Content'
      case '/admin/settings':
        return 'Settings'
      default:
        return 'Admin Panel'
    }
  }

  return (
    <header className={cn('h-16 border-b border-gray-200/80 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20', className)}>
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="font-bold text-gray-900 text-lg tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="text-xs font-medium text-gray-500">Live</span>
      </div>
    </header>
  )
}