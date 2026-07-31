import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  return (
    <nav className={cn('flex items-center gap-4', className)}>
      <Link to="/" className="font-heading font-medium">
        Visuals by Pritam
      </Link>
    </nav>
  )
}