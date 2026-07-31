export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
] as const

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
] as const

export const SUPPORTED_MEDIA_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_VIDEO_TYPES,
] as const

export type ImageType = typeof SUPPORTED_IMAGE_TYPES[number]
export type VideoType = typeof SUPPORTED_VIDEO_TYPES[number]
export type MediaType = typeof SUPPORTED_MEDIA_TYPES[number]

export function isImageType(type: string): type is ImageType {
  return (SUPPORTED_IMAGE_TYPES as readonly string[]).includes(type)
}

export function isVideoType(type: string): type is VideoType {
  return (SUPPORTED_VIDEO_TYPES as readonly string[]).includes(type)
}

export function isSupportedMediaType(type: string): type is MediaType {
  return (SUPPORTED_MEDIA_TYPES as readonly string[]).includes(type)
}