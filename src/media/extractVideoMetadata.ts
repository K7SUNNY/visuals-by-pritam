export interface VideoMetadata {
  duration: number
  width: number
  height: number
  format: string
  bitrate: number | null
  frameRate: number | null
}

export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('error', onError)
      setTimeout(() => {
        URL.revokeObjectURL(src)
      }, 1000)
    }

    const onLoaded = () => {
      const duration = video.duration || 0
      const bitrate = duration > 0 ? Math.round((file.size * 8) / duration) : null

      let frameRate: number | null = null
      const decodedFrameCount = (video as any).webkitDecodedFrameCount
      if (decodedFrameCount && duration > 0) {
        frameRate = Math.round(decodedFrameCount / duration)
      }

      const metadata: VideoMetadata = {
        duration,
        width: video.videoWidth,
        height: video.videoHeight,
        format: file.type,
        bitrate,
        frameRate,
      }
      cleanup()
      resolve(metadata)
    }

    const onError = () => {
      cleanup()
      reject(new Error('Failed to extract video metadata'))
    }

    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('error', onError)

    const src = URL.createObjectURL(file)
    video.src = src
  })
}