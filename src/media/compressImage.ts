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

  let canvas: OffscreenCanvas | HTMLCanvasElement
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(newWidth, newHeight)
  } else {
    canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
  }
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Unable to get canvas context')
  }

  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight)
  bitmap.close()

  let blob: Blob
  if (canvas instanceof OffscreenCanvas) {
    blob = await canvas.convertToBlob({
      type: format,
      quality,
    })
  } else {
    blob = await new Promise<Blob>((resolve, reject) => {
      (canvas as HTMLCanvasElement).toBlob(
        (b) => {
          if (b) resolve(b)
          else reject(new Error('Canvas toBlob failed'))
        },
        format,
        quality
      )
    })
  }

  return {
    blob,
    width: newWidth,
    height: newHeight,
    size: blob.size,
  }
}