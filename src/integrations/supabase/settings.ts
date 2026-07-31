import { supabase } from './client'
import type { SiteSettings } from '@/types/settings'

const DEFAULT_SETTINGS: SiteSettings = {
  id: '1',
  siteName: 'Visuals Studio',
  tagline: 'Content Manager & Portfolio',
  description: '',
  contactEmail: '',
  contactPhone: '',
  theme: 'light',
  logoUrl: '',
  faviconUrl: '',
  analyticsId: '',
  socialLinks: {
    twitter: '',
    linkedin: '',
    github: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export async function getSettings(): Promise<SiteSettings> {
  // Use .maybeSingle() instead of .single() to prevent HTTP 406 on empty table
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('Error fetching settings:', error)
    return DEFAULT_SETTINGS
  }

  return (data as SiteSettings) ?? DEFAULT_SETTINGS
}

export async function updateSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .maybeSingle()

  if (existing) {
    const { data, error } = await supabase
      .from('settings')
      .update(input)
      .eq('id', existing.id)
      .select()
      .maybeSingle()

    if (error) throw error
    return (data as SiteSettings) ?? DEFAULT_SETTINGS
  } else {
    const { data, error } = await supabase
      .from('settings')
      .insert([input])
      .select()
      .maybeSingle()

    if (error) throw error
    return (data as SiteSettings) ?? DEFAULT_SETTINGS
  }
}