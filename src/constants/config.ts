export const APP_NAME = 'Visuals by Pritam'

export const APP_DESCRIPTION =
  'Visual portfolio of Director, Content Manager and Video Editor'

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
} as const

export const MAX_UPLOAD_SIZE = 49 * 1024 * 1024

export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']

export const THUMBNAIL_WIDTH = 400
export const THUMBNAIL_HEIGHT = 300

export const DEBOUNCE_DELAY = 300

export const ANIMATION_DURATION = {
  FAST: 0.15,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const