import type { ImageType } from './supportedFormats'

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: ImageType
}

export interface CompressionResult {
  blob: Blob
  width: number
  height: number
  size: number
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 4096,
    maxHeight = 4096,
    quality = 0.85,
    format = 'image/webp',
  } = options

  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
  const newWidth = Math.round(width * ratio)
  const newHeight = Math.round(height * ratio)

  const canvas = new OffscreenCanvas(newWidth, newHeight)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Unable to get canvas context')
  }

  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight)
  bitmap.close()

  const blob = await canvas.convertToBlob({
    type: format,
    quality,
  })

  return {
    blob,
    width: newWidth,
    height: newHeight,
    size: blob.size,
  }
}