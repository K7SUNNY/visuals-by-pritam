import { type ReactNode } from 'react'
import { SupabaseProvider } from './SupabaseProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from './ToastProvider'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  useRealtimeSync()

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