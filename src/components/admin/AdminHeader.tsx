import { cn } from '@/lib/utils/cn'
import { useLocation, Link } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'
import { useMessages } from '@/features/messages/hooks/useMessages'

interface AdminHeaderProps {
  className?: string
  onMenuClick?: () => void
}

export function AdminHeader({ className, onMenuClick }: AdminHeaderProps) {
  const location = useLocation()
  const { messages } = useMessages()
  const hasUnread = messages.some((msg) => !msg.read)

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return 'Dashboard'
      case '/admin/works':
        return 'Portfolio Works'
      case '/admin/upload':
        return 'Upload Content'
      case '/admin/messages':
        return 'Messages'
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

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Link
          to="/admin/messages"
          className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="View messages"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-medium text-gray-500">Live</span>
        </div>
      </div>
    </header>
  )
}