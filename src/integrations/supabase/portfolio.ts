import { supabase } from './client'
import { storage } from './storage'
import type { PortfolioItem, PortfolioItemInput } from '@/types/portfolio'

function toCamelCase(data: Record<string, unknown>): PortfolioItem {
  const mediaUrl = (data.media_url as string) ?? ''
  const thumbnailUrl = (data.thumbnail_url as string) || mediaUrl || null

  return {
    id: data.id as string,
    title: (data.title as string) ?? '',
    description: (data.description as string) ?? '',
    category: data.category as PortfolioItem['category'],
    status: data.status as PortfolioItem['status'],
    featured: Boolean(data.featured),
    mediaUrl,
    thumbnailUrl,
    altText: (data.alt_text as string) ?? (data.title as string) ?? '',
    order: (data.order as number) ?? 0,
    metadata: (data.metadata as Record<string, unknown>) ?? null,
    createdAt: (data.created_at as string) ?? new Date().toISOString(),
    updatedAt: (data.updated_at as string) ?? new Date().toISOString(),
  }
}

function toSnakeCase(input: Partial<PortfolioItemInput>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  if (input.title !== undefined) result.title = input.title
  if (input.description !== undefined) result.description = input.description
  if (input.category !== undefined) result.category = input.category
  if (input.status !== undefined) result.status = input.status
  if (input.featured !== undefined) result.featured = input.featured
  if (input.mediaUrl !== undefined) result.media_url = input.mediaUrl
  if (input.thumbnailUrl !== undefined) result.thumbnail_url = input.thumbnailUrl
  if (input.altText !== undefined) result.alt_text = input.altText
  if (input.order !== undefined) result.order = input.order
  if (input.metadata !== undefined) result.metadata = input.metadata

  return result
}

export async function getPortfolioItems() {
  // Fetch all items ordered by creation date / order
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching portfolio items:', error)
    return []
  }

  return ((data as Record<string, unknown>[]) ?? []).map(toCamelCase)
}

export async function getPortfolioItemById(id: string) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('Portfolio item not found')
  return toCamelCase(data as Record<string, unknown>)
}

export async function createPortfolioItem(input: PortfolioItemInput) {
  const snakeInput = toSnakeCase(input)
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert(snakeInput)
    .select()
    .single()

  if (error) {
    console.error('Error creating portfolio item:', error)
    throw error
  }

  return toCamelCase(data as Record<string, unknown>)
}

export async function updatePortfolioItem(
  id: string,
  input: Partial<PortfolioItemInput>
) {
  const snakeInput = toSnakeCase(input)
  const { data, error } = await supabase
    .from('portfolio_items')
    .update(snakeInput)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data as Record<string, unknown>)
}

export async function deletePortfolioItem(id: string) {
  // 1. Fetch item to get file paths
  const { data: item } = await supabase
    .from('portfolio_items')
    .select('media_url, thumbnail_url')
    .eq('id', id)
    .single()

  // 2. Delete database record
  const { error } = await supabase
    .from('portfolio_items')
    .delete()
    .eq('id', id)

  if (error) throw error

  // 3. Delete files from storage
  if (item) {
    const getPathFromUrl = (url: string | null | undefined): string | null => {
      if (!url) return null
      const marker = '/storage/v1/object/public/portfolio-media/'
      const index = url.indexOf(marker)
      if (index !== -1) {
        return url.substring(index + marker.length)
      }
      return null
    }

    const mediaPath = getPathFromUrl(item.media_url)
    const thumbnailPath = getPathFromUrl(item.thumbnail_url)

    if (mediaPath) {
      try {
        await storage.deleteFile(mediaPath)
      } catch (err) {
        console.error('Failed to delete media file from storage:', err)
      }
    }

    if (thumbnailPath && thumbnailPath !== mediaPath) {
      try {
        await storage.deleteFile(thumbnailPath)
      } catch (err) {
        console.error('Failed to delete thumbnail file from storage:', err)
      }
    }
  }
}