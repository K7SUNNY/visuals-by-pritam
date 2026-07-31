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
      URL.revokeObjectURL(src)
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('error', onError)
    }

    const onLoaded = () => {
      const metadata: VideoMetadata = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        format: file.type,
        bitrate: null,
        frameRate: null,
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