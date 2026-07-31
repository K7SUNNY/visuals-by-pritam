import { type ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

interface MotionProviderProps {
  children: ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
    </MotionConfig>
  )
}