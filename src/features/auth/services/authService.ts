import { login as loginService, logout as logoutService, getCurrentUser } from '@/services/authService'
import type { LoginCredentials } from '@/types/auth'

export async function login(credentials: LoginCredentials) {
  return loginService(credentials)
}

export async function logout() {
  return logoutService()
}

export async function getCurrentUserProfile() {
  return getCurrentUser()
}