import { supabase } from './client'
import type { PortfolioItem, PortfolioItemInput } from '@/types/portfolio'

export async function getPortfolioItems() {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('status', 'published')
    .order('order', { ascending: true })

  if (error) throw error
  return data as PortfolioItem[]
}

export async function getPortfolioItemById(id: string) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as PortfolioItem
}

export async function createPortfolioItem(input: PortfolioItemInput) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data as PortfolioItem
}

export async function updatePortfolioItem(
  id: string,
  input: Partial<PortfolioItemInput>
) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as PortfolioItem
}

export async function deletePortfolioItem(id: string) {
  const { error } = await supabase
    .from('portfolio_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}