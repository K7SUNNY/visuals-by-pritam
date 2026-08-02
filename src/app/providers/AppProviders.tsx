import { type ReactNode } from 'react'
import { SupabaseProvider } from './SupabaseProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from './ToastProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </SupabaseProvider>
  )
}