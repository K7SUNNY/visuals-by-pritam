import { cn } from '@/lib/utils/cn'

interface ContactSectionProps {
  className?: string
}

export function ContactSection({ className }: ContactSectionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-heading font-medium mb-4">
          Get in Touch
        </h2>
        <p className="text-muted-foreground">
          Contact section coming soon.
        </p>
      </div>
    </section>
  )
}