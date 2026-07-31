import { cn } from '@/lib/utils/cn'
import { type ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: ReactNode
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  footer,
}: DialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative z-10 w-full rounded-2xl bg-bg shadow-modal border border-border-light',
          'transform transition-all duration-200',
          sizeMap[size],
          'mx-4'
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <div>
            {title && (
              <h2
                id="dialog-title"
                className="text-lg font-semibold text-text"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-text-secondary mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="ml-4 inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-secondary transition-colors text-text-secondary hover:text-text"
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-divider flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}