import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  return (
    <nav className={cn('flex items-center justify-between w-full py-4 max-w-6xl mx-auto px-4', className)}>
      <Link to="/" className="font-bold text-lg text-gray-900 tracking-tight">
        Visuals by Pritam
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <Link to="/portfolio" className="hover:text-gray-900 transition-colors">Portfolio</Link>
        <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
      </div>
    </nav>
  )
}