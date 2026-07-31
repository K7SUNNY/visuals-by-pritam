import { cn } from '@/lib/utils/cn'
import { Contact } from './Contact'

interface ContactSectionProps {
  className?: string
}

export function ContactSection({ className }: ContactSectionProps) {
  return (
    <div className={cn('w-full', className)}>
      <Contact />
    </div>
  )
}