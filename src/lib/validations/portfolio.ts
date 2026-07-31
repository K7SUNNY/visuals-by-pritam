import { z } from 'zod'

export const portfolioItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  category: z.enum(['video', 'photo', 'banner', 'thumbnail']),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  mediaUrl: z.string().regex(/^https?:\/\/.+/, 'Invalid media URL'),
  thumbnailUrl: z.string().regex(/^https?:\/\/.+/, 'Invalid thumbnail URL').optional().or(z.literal('')),
  altText: z.string().min(1, 'Alt text is required').max(500),
  order: z.number().int().min(0).default(0),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const portfolioItemUpdateSchema = portfolioItemSchema.partial()