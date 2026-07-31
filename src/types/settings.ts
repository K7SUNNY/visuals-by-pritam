export interface SiteSettings {
  id: string
  siteName: string
  tagline: string
  description: string
  logoUrl: string | null
  faviconUrl: string | null
  contactEmail: string
  contactPhone: string | null
  socialLinks: Record<string, string> | null
  analyticsId: string | null
  theme: 'light' | 'dark' | 'system'
  createdAt: string
  updatedAt: string
}