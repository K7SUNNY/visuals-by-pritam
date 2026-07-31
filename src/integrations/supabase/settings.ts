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

function toCamelCase(data: Record<string, unknown>): SiteSettings {
  return {
    id: data.id as string,
    siteName: data.site_name as string,
    tagline: data.tagline as string,
    description: data.description as string,
    contactEmail: data.contact_email as string,
    contactPhone: data.contact_phone as string ?? null,
    theme: data.theme as SiteSettings['theme'],
    logoUrl: data.logo_url as string ?? null,
    faviconUrl: data.favicon_url as string ?? null,
    analyticsId: data.analytics_id as string ?? null,
    socialLinks: (data.social_links as Record<string, string>) ?? null,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
}

function toSnakeCase(input: Partial<SiteSettings>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  if (input.siteName !== undefined) result.site_name = input.siteName
  if (input.tagline !== undefined) result.tagline = input.tagline
  if (input.description !== undefined) result.description = input.description
  if (input.contactEmail !== undefined) result.contact_email = input.contactEmail
  if (input.contactPhone !== undefined) result.contact_phone = input.contactPhone
  if (input.theme !== undefined) result.theme = input.theme
  if (input.logoUrl !== undefined) result.logo_url = input.logoUrl
  if (input.faviconUrl !== undefined) result.favicon_url = input.faviconUrl
  if (input.analyticsId !== undefined) result.analytics_id = input.analyticsId
  if (input.socialLinks !== undefined) result.social_links = input.socialLinks

  return result
}

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('Error fetching settings:', error)
    return DEFAULT_SETTINGS
  }

  if (!data) return DEFAULT_SETTINGS

  return toCamelCase(data as Record<string, unknown>)
}

export async function updateSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
  const snakeInput = toSnakeCase(input)

  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .maybeSingle()

  if (existing) {
    const { data, error } = await supabase
      .from('settings')
      .update(snakeInput)
      .eq('id', existing.id)
      .select()
      .maybeSingle()

    if (error) throw error
    if (!data) return DEFAULT_SETTINGS
    return toCamelCase(data as Record<string, unknown>)
  } else {
    const { data, error } = await supabase
      .from('settings')
      .insert([snakeInput])
      .select()
      .maybeSingle()

    if (error) throw error
    if (!data) return DEFAULT_SETTINGS
    return toCamelCase(data as Record<string, unknown>)
  }
}