import { signIn, signOut, getCurrentUser, getSession } from '@/integrations/supabase/auth'
import type { LoginCredentials } from '@/types/auth'

export class AuthRepository {
  async login(credentials: LoginCredentials) {
    return signIn(credentials)
  }

  async logout() {
    return signOut()
  }

  async getCurrentUser() {
    return getCurrentUser()
  }

  async getSession() {
    return getSession()
  }
}

export const authRepository = new AuthRepository()