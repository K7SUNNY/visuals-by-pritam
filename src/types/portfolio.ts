export type PortfolioItemStatus = 'draft' | 'published' | 'archived'

export type PortfolioItemCategory =
  | 'video'
  | 'photo'
  | 'banner'
  | 'thumbnail'

export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: PortfolioItemCategory
  status: PortfolioItemStatus
  mediaUrl: string
  thumbnailUrl: string | null
  altText: string
  order: number
  metadata: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface PortfolioItemInput {
  title: string
  description: string
  category: PortfolioItemCategory
  status: PortfolioItemStatus
  mediaUrl: string
  thumbnailUrl: string | null
  altText: string
  order: number
  metadata: Record<string, unknown> | null
}