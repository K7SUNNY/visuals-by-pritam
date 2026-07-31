import { supabase } from './client'
import type { SiteSettings } from '@/types/settings'

export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) throw error
  return data as SiteSettings
}

export async function updateSettings(input: Partial<SiteSettings>) {
  const { data, error } = await supabase
    .from('settings')
    .update(input)
    .select()
    .single()

  if (error) throw error
  return data as SiteSettings
}