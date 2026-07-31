import { type ReactNode, createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { AuthUser, LoginCredentials } from '@/types/auth'

interface AuthContextValue {
  user: AuthUser | null
  role: 'admin' | 'editor' | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error

      if (data.user) {
        const profile = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        const role = profile?.data?.role ?? 'admin'

        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          role: role as AuthUser['role'],
          displayName: data.user.user_metadata?.full_name ?? data.user.email ?? '',
          avatarUrl: data.user.user_metadata?.avatar_url ?? null,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value: AuthContextValue = {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}