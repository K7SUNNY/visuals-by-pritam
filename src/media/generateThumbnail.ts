import type { ImageType } from './supportedFormats'

export interface ThumbnailOptions {
  width?: number
  height?: number
  quality?: number
  format?: ImageType
}

export interface ThumbnailResult {
  blob: Blob
  width: number
  height: number
  size: number
}

export async function generateThumbnail(
  file: File,
  options: ThumbnailOptions = {}
): Promise<ThumbnailResult> {
  const {
    width = 400,
    height = 300,
    quality = 0.8,
    format = 'image/webp',
  } = options

  const bitmap = await createImageBitmap(file)
  const { width: origWidth, height: origHeight } = bitmap

  const ratio = Math.min(width / origWidth, height / origHeight, 1)
  const thumbWidth = Math.round(origWidth * ratio)
  const thumbHeight = Math.round(origHeight * ratio)

  const canvas = new OffscreenCanvas(thumbWidth, thumbHeight)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Unable to get canvas context')
  }

  ctx.drawImage(bitmap, 0, 0, thumbWidth, thumbHeight)
  bitmap.close()

  const blob = await canvas.convertToBlob({
    type: format,
    quality,
  })

  return {
    blob,
    width: thumbWidth,
    height: thumbHeight,
    size: blob.size,
  }
}