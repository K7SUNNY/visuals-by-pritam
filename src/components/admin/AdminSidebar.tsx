import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  FolderKanban,
  UploadCloud,
  Settings,
  Mail,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Works', href: '/admin/works', icon: FolderKanban },
  { label: 'Upload', href: '/admin/upload', icon: UploadCloud },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Failed to log out:', err)
    } finally {
      navigate('/login')
    }
  }

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-5 select-none bg-white">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-3 py-2 mb-6">
          <div>
            <h2 className="font-extrabold text-lg tracking-tight text-gray-900">
              Visuals Studio
            </h2>
            <p className="text-xs text-gray-400 font-medium">Content Manager</p>
          </div>

          {/* Close button for mobile drawer */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-400')} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Utility Actions */}
      <div className="pt-4 border-t border-gray-100 flex flex-col gap-1">
        <Link
          to="/"
          target="_blank"
          onClick={onMobileClose}
          className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 transition-all"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
          <span>View Live Site</span>
        </Link>

        <button
          onClick={() => {
            if (onMobileClose) onMobileClose()
            handleLogout()
          }}
          className="flex items-center gap-3 w-full rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-red-600 transition-all cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 border-r border-gray-200/80 bg-white min-h-screen hidden md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Animated Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
              onClick={onMobileClose}
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-72 max-w-[80vw] bg-white h-full z-10 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}