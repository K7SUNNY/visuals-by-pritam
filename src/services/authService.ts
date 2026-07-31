import { authRepository } from '@/repositories'
import type { LoginCredentials } from '@/types/auth'

export async function login(credentials: LoginCredentials) {
  return authRepository.login(credentials)
}

export async function logout() {
  return authRepository.logout()
}

export async function getCurrentUser() {
  return authRepository.getCurrentUser()
}

export async function getSession() {
  return authRepository.getSession()
}