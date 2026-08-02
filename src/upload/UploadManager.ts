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
    let duration = 0
    let width = 0
    let height = 0
    let videoEl: HTMLVideoElement | null = null
    let blobUrl: string | null = null

    try {
      const meta = await extractVideoMetadata(file)
      duration = meta.duration
      width = meta.width
      height = meta.height

      videoEl = document.createElement('video')
      videoEl.preload = 'metadata'
      videoEl.muted = true
      videoEl.playsInline = true

      const el = videoEl

      blobUrl = URL.createObjectURL(file)
      el.src = blobUrl

      await new Promise<void>((resolve, reject) => {
        let timeoutId: number

        const onLoaded = () => {
          cleanupListeners()
          resolve()
        }
        const onError = () => {
          cleanupListeners()
          reject(new Error('Failed to load video for thumbnail'))
        }
        const cleanupListeners = () => {
          clearTimeout(timeoutId)
          el.removeEventListener('loadeddata', onLoaded)
          el.removeEventListener('error', onError)
        }

        el.addEventListener('loadeddata', onLoaded)
        el.addEventListener('error', onError)

        timeoutId = window.setTimeout(() => {
          cleanupListeners()
          reject(new Error('Video thumbnail timeout'))
        }, 15000)
      })

      let canvas: OffscreenCanvas | HTMLCanvasElement
      if (typeof OffscreenCanvas !== 'undefined') {
        canvas = new OffscreenCanvas(
          UPLOAD_CONFIG.thumbnailWidth,
          UPLOAD_CONFIG.thumbnailHeight
        )
      } else {
        canvas = document.createElement('canvas')
        canvas.width = UPLOAD_CONFIG.thumbnailWidth
        canvas.height = UPLOAD_CONFIG.thumbnailHeight
      }

      const ctx = canvas.getContext('2d')
      if (ctx && videoEl) {
        ctx.drawImage(videoEl, 0, 0, UPLOAD_CONFIG.thumbnailWidth, UPLOAD_CONFIG.thumbnailHeight)
        
        let thumbBlob: Blob
        if (canvas instanceof OffscreenCanvas) {
          thumbBlob = await canvas.convertToBlob({
            type: 'image/webp',
            quality: UPLOAD_CONFIG.thumbnailQuality,
          })
        } else {
          thumbBlob = await new Promise<Blob>((resolve, reject) => {
            (canvas as HTMLCanvasElement).toBlob(
              (b) => b ? resolve(b) : reject(new Error('Thumbnail canvas toBlob failed')),
              'image/webp',
              UPLOAD_CONFIG.thumbnailQuality
            )
          })
        }

        const thumbFileName = `thumb-${fileName}`
        const thumbPath = `${UPLOAD_CONFIG.storagePaths.thumbnails}/${thumbFileName}`
        await storage.uploadFile(thumbPath, blobToFile(thumbBlob, thumbFileName))
        thumbnailUrl = await storage.getPublicUrl(thumbPath)
      }
    } catch (err) {
      console.error('Error generating video thumbnail:', err)
      thumbnailUrl = null
    } finally {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
      if (videoEl) {
        videoEl.src = ''
        videoEl.load()
      }
    }

    return {
      success: true,
      mediaUrl,
      thumbnailUrl,
      metadata: {
        originalName: file.name,
        originalSize: file.size,
        category,
        duration,
        width,
        height,
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