export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  order: number
  createdAt: string
  updatedAt: string
}