import { UPLOAD_CONFIG } from '@/config/upload'
import { compressImage } from '@/media/compressImage'
import { generateThumbnail } from '@/media/generateThumbnail'
import { validateImage, validateVideo } from '@/media/validateMedia'
import { extractVideoMetadata } from '@/media/extractVideoMetadata'
import { storage } from '@/integrations/supabase/storage'

export interface UploadProgress {
  stage: 'validating' | 'compressing' | 'uploading' | 'thumbnail' | 'complete'
  progress: number
  message: string
}

export interface UploadResult {
  success: boolean
  mediaUrl: string
  thumbnailUrl: string | null
  metadata: Record<string, unknown>
}

export interface UploadManager {
  uploadImage(file: File, category: string): Promise<UploadResult>
  uploadVideo(file: File, category: string): Promise<UploadResult>
  uploadBanner(file: File): Promise<UploadResult>
}

function blobToFile(blob: Blob, name: string): File {
  return new File([blob], name, { type: blob.type })
}

export function createUploadManager(): UploadManager {
  async function processImage(file: File, category: string): Promise<UploadResult> {
    const validation = validateImage(file)
    if (!validation.valid) {
      throw new Error(`Image validation failed: ${validation.errors.join(', ')}`)
    }

    const compressed = await compressImage(file, {
      maxWidth: UPLOAD_CONFIG.maxImageDimension,
      maxHeight: UPLOAD_CONFIG.maxImageDimension,
      quality: UPLOAD_CONFIG.imageCompressionQuality,
    })

    const extension = file.type.split('/')[1] || 'webp'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const path = `${UPLOAD_CONFIG.storagePaths.photos}/${fileName}`

    await storage.uploadFile(path, blobToFile(compressed.blob, fileName))

    const mediaUrl = await storage.getPublicUrl(path)

    let thumbnailUrl: string | null = null
    if (file.type !== 'image/svg+xml') {
      const thumbnail = await generateThumbnail(file, {
        width: UPLOAD_CONFIG.thumbnailWidth,
        height: UPLOAD_CONFIG.thumbnailHeight,
        quality: UPLOAD_CONFIG.thumbnailQuality,
      })

      const thumbFileName = `thumb-${fileName}`
      const thumbPath = `${UPLOAD_CONFIG.storagePaths.thumbnails}/${thumbFileName}`
      await storage.uploadFile(thumbPath, blobToFile(thumbnail.blob, thumbFileName))
      thumbnailUrl = await storage.getPublicUrl(thumbPath)
    }

    return {
      success: true,
      mediaUrl,
      thumbnailUrl,
      metadata: {
        originalName: file.name,
        originalSize: file.size,
        compressedSize: compressed.size,
        width: compressed.width,
        height: compressed.height,
        category,
      },
    }
  }

  async function processVideo(file: File, category: string): Promise<UploadResult> {
    const validation = validateVideo(file)
    if (!validation.valid) {
      throw new Error(`Video validation failed: ${validation.errors.join(', ')}`)
    }

    const extension = file.type.split('/')[1] || 'mp4'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const path = `${UPLOAD_CONFIG.storagePaths.videos}/${fileName}`

    await storage.uploadFile(path, file)

    const mediaUrl = await storage.getPublicUrl(path)

    let thumbnailUrl: string | null = null
    try {
      await extractVideoMetadata(file)
      const videoEl = document.createElement('video')
      videoEl.preload = 'metadata'

      const blobUrl = URL.createObjectURL(file)
      videoEl.src = blobUrl

      await new Promise<void>((resolve, reject) => {
        const onLoaded = () => {
          videoEl.removeEventListener('loadeddata', onLoaded)
          videoEl.removeEventListener('error', onError)
          resolve()
        }
        const onError = () => {
          videoEl.removeEventListener('loadeddata', onLoaded)
          videoEl.removeEventListener('error', onError)
          reject(new Error('Failed to load video for thumbnail'))
        }
        videoEl.addEventListener('loadeddata', onLoaded)
        videoEl.addEventListener('error', onError)
        setTimeout(() => {
          videoEl.removeEventListener('loadeddata', onLoaded)
          videoEl.removeEventListener('error', onError)
          reject(new Error('Video thumbnail timeout'))
        }, 10000)
      })

      const canvas = new OffscreenCanvas(
        UPLOAD_CONFIG.thumbnailWidth,
        UPLOAD_CONFIG.thumbnailHeight
      )
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoEl, 0, 0, UPLOAD_CONFIG.thumbnailWidth, UPLOAD_CONFIG.thumbnailHeight)
        const thumbBlob = await canvas.convertToBlob({
          type: 'image/webp',
          quality: UPLOAD_CONFIG.thumbnailQuality,
        })

        const thumbFileName = `thumb-${fileName}`
        const thumbPath = `${UPLOAD_CONFIG.storagePaths.thumbnails}/${thumbFileName}`
        await storage.uploadFile(thumbPath, blobToFile(thumbBlob, thumbFileName))
        thumbnailUrl = await storage.getPublicUrl(thumbPath)
      }

      URL.revokeObjectURL(blobUrl)
    } catch {
      thumbnailUrl = null
    }

    return {
      success: true,
      mediaUrl,
      thumbnailUrl,
      metadata: {
        originalName: file.name,
        originalSize: file.size,
        category,
        duration: 0,
      },
    }
  }

  async function processBanner(file: File): Promise<UploadResult> {
    const validation = validateImage(file)
    if (!validation.valid) {
      throw new Error(`Banner validation failed: ${validation.errors.join(', ')}`)
    }

    const compressed = await compressImage(file, {
      maxWidth: UPLOAD_CONFIG.maxImageDimension,
      maxHeight: UPLOAD_CONFIG.maxImageDimension,
      quality: UPLOAD_CONFIG.imageCompressionQuality,
    })

    const extension = file.type.split('/')[1] || 'webp'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const path = `${UPLOAD_CONFIG.storagePaths.banners}/${fileName}`

    await storage.uploadFile(path, blobToFile(compressed.blob, fileName))

    const mediaUrl = await storage.getPublicUrl(path)

    let thumbnailUrl: string | null = null
    if (file.type !== 'image/svg+xml') {
      const thumbnail = await generateThumbnail(file, {
        width: UPLOAD_CONFIG.thumbnailWidth,
        height: UPLOAD_CONFIG.thumbnailHeight,
        quality: UPLOAD_CONFIG.thumbnailQuality,
      })

      const thumbFileName = `thumb-${fileName}`
      const thumbPath = `${UPLOAD_CONFIG.storagePaths.thumbnails}/${thumbFileName}`
      await storage.uploadFile(thumbPath, blobToFile(thumbnail.blob, thumbFileName))
      thumbnailUrl = await storage.getPublicUrl(thumbPath)
    }

    return {
      success: true,
      mediaUrl,
      thumbnailUrl,
      metadata: {
        originalName: file.name,
        originalSize: file.size,
        compressedSize: compressed.size,
        width: compressed.width,
        height: compressed.height,
      },
    }
  }

  return {
    uploadImage: processImage,
    uploadVideo: processVideo,
    uploadBanner: processBanner,
  }
}