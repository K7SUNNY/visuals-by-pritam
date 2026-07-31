export type UserRole = 'admin' | 'editor'

export interface Profile {
  id: string
  userId: string
  role: UserRole
  displayName: string
  email: string
  avatarUrl: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
}