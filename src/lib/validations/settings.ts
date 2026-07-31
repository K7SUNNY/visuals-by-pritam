import { z } from 'zod'

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(200),
  tagline: z.string().max(500).optional(),
  description: z.string().max(2000).optional(),
  contactEmail: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
  contactPhone: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  analyticsId: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']),
})