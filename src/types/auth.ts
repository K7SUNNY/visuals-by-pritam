export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'editor' | null
  displayName: string
  avatarUrl: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}