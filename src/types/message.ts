export interface Message {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
  updated_at?: string
}