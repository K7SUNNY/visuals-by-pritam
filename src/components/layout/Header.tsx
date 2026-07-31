import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'
import { useState, useEffect } from 'react'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg/80 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading font-semibold text-lg tracking-tight">
          Visuals by Pritam
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/portfolio">Portfolio</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <Link
          to="/admin"
          className="text-sm font-medium text-text-secondary hover:text-text transition-colors"
        >
          Admin
        </Link>
      </div>
    </header>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={cn(
        'transition-colors duration-200',
        isActive ? 'text-text' : 'text-text-secondary hover:text-text'
      )}
    >
      {children}
    </Link>
  )
}