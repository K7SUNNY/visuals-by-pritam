import { FFmpeg } from '@ffmpeg/ffmpeg'
import { extractVideoMetadata } from './extractVideoMetadata'

export interface CompressVideoOptions {
  maxSizeBytes?: number
  minWidth?: number
  minHeight?: number
  onProgress?: (progress: number) => void
  signal?: AbortSignal
}

export interface CompressVideoResult {
  blob: Blob
  size: number
  width: number
  height: number
  wasCompressed: boolean
  phasesUsed: CompressionPhase[]
}

export type CompressionPhase = 'bitrate' | 'resolution'

const DEFAULT_MAX_SIZE = 49 * 1024 * 1024
const DEFAULT_MIN_WIDTH = 1280
const DEFAULT_MIN_HEIGHT = 720
const AUDIO_OVERHEAD_FACTOR = 0.65
const MIN_VIDEO_BITRATE = 200000
const PRESET = 'ultrafast'

let ffmpegInstance: FFmpeg | null = null

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance

  const ffmpeg = new FFmpeg()
  await ffmpeg.load()
  ffmpegInstance = ffmpeg
  return ffmpeg
}

function calculateTargetVideoBitrate(
  fileSize: number,
  duration: number
): number {
  const targetTotalBitrate = (fileSize * 8) / duration
  const targetVideoBitrate = targetTotalBitrate * AUDIO_OVERHEAD_FACTOR
  return Math.max(MIN_VIDEO_BITRATE, Math.round(targetVideoBitrate))
}

function calculateResolutionScale(
  originalWidth: number,
  originalHeight: number,
  minWidth: number,
  minHeight: number
): number | null {
  if (originalWidth <= minWidth && originalHeight <= minHeight) {
    return null
  }

  const scaleW = minWidth / originalWidth
  const scaleH = minHeight / originalHeight
  const scale = Math.min(scaleW, scaleH, 0.5)

  return Math.max(scale, 0.25)
}

function roundToEven(value: number): number {
  return Math.round(value / 2) * 2
}

async function tryBitrateCompression(
  ffmpeg: FFmpeg,
  file: File,
  meta: Awaited<ReturnType<typeof extractVideoMetadata>>,
  maxSizeBytes: number,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<Blob | null> {
  if (signal?.aborted) return null

  const targetBitrate = calculateTargetVideoBitrate(maxSizeBytes, meta.duration)

  ffmpeg.on('progress', ({ progress }) => {
    onProgress?.(progress * 0.5)
  })

  await ffmpeg.writeFile('input.mp4', new Uint8Array(await file.arrayBuffer()))

  const args = [
    '-i', 'input.mp4',
    '-threads', '0',
    '-b:v', `${targetBitrate}`,
    '-c:a', 'copy',
    '-c:v', 'libx264',
    '-preset', PRESET,
    '-movflags', '+faststart',
    'output.mp4',
  ]

  await ffmpeg.exec(args)

  const data = await ffmpeg.readFile('output.mp4')
  const blob = new Blob([data as unknown as ArrayBuffer], { type: file.type || 'video/mp4' })

  await ffmpeg.deleteFile('input.mp4')
  await ffmpeg.deleteFile('output.mp4')

  if (blob.size <= maxSizeBytes) {
    onProgress?.(0.5)
    return blob
  }

  return null
}

async function tryResolutionReduction(
  ffmpeg: FFmpeg,
  file: File,
  meta: Awaited<ReturnType<typeof extractVideoMetadata>>,
  maxSizeBytes: number,
  minWidth: number,
  minHeight: number,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal
): Promise<{ blob: Blob; width: number; height: number } | null> {
  let currentWidth = meta.width
  let currentHeight = meta.height
  let phaseProgressOffset = 0.5

  while (true) {
    if (signal?.aborted) return null

    const scale = calculateResolutionScale(
      currentWidth,
      currentHeight,
      minWidth,
      minHeight
    )

    if (scale === null) break

    const newWidth = roundToEven(currentWidth * scale)
    const newHeight = roundToEven(currentHeight * scale)

    if (newWidth < minWidth || newHeight < minHeight) break

    const targetBitrate = calculateTargetVideoBitrate(maxSizeBytes, meta.duration)

    ffmpeg.on('progress', ({ progress }) => {
      onProgress?.(phaseProgressOffset + progress * 0.5)
    })

await ffmpeg.writeFile('input.mp4', new Uint8Array(await file.arrayBuffer()))

    const args = [
      '-i', 'input.mp4',
      '-threads', '0',
      '-vf', `scale=${newWidth}:${newHeight}`,
      '-b:v', `${targetBitrate}`,
      '-c:a', 'copy',
      '-c:v', 'libx264',
      '-preset', PRESET,
      '-movflags', '+faststart',
      'output.mp4',
    ]

    await ffmpeg.exec(args)

    const data = await ffmpeg.readFile('output.mp4')
    const blob = new Blob([data as unknown as ArrayBuffer], { type: file.type || 'video/mp4' })

    await ffmpeg.deleteFile('input.mp4')
    await ffmpeg.deleteFile('output.mp4')

    if (blob.size <= maxSizeBytes) {
      onProgress?.(1.0)
      return { blob, width: newWidth, height: newHeight }
    }

    currentWidth = newWidth
    currentHeight = newHeight
    phaseProgressOffset += 0.5
  }

  return null
}

export async function compressVideo(
  file: File,
  options: CompressVideoOptions = {}
): Promise<CompressVideoResult> {
  const {
    maxSizeBytes = DEFAULT_MAX_SIZE,
    minWidth = DEFAULT_MIN_WIDTH,
    minHeight = DEFAULT_MIN_HEIGHT,
    onProgress,
    signal,
  } = options

  if (file.size <= maxSizeBytes) {
    const meta = await extractVideoMetadata(file)
    return {
      blob: file,
      size: file.size,
      width: meta.width,
      height: meta.height,
      wasCompressed: false,
      phasesUsed: [],
    }
  }

  const ffmpeg = await getFFmpeg()
  onProgress?.(0)

  const meta = await extractVideoMetadata(file)

  const bitrateBlob = await tryBitrateCompression(
    ffmpeg,
    file,
    meta,
    maxSizeBytes,
    onProgress,
    signal
  )

  if (bitrateBlob) {
    return {
      blob: bitrateBlob,
      size: bitrateBlob.size,
      width: meta.width,
      height: meta.height,
      wasCompressed: true,
      phasesUsed: ['bitrate'],
    }
  }

  const resolutionResult = await tryResolutionReduction(
    ffmpeg,
    file,
    meta,
    maxSizeBytes,
    minWidth,
    minHeight,
    onProgress,
    signal
  )

  if (resolutionResult) {
    return {
      blob: resolutionResult.blob,
      size: resolutionResult.blob.size,
      width: resolutionResult.width,
      height: resolutionResult.height,
      wasCompressed: true,
      phasesUsed: ['bitrate', 'resolution'],
    }
  }

  throw new Error(
    `Video "${file.name}" could not be compressed below the 49 MB upload limit.`
  )
}
