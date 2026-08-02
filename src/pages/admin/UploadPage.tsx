import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { createUploadManager } from '@/upload/UploadManager'
import { UPLOAD_CONFIG } from '@/config/upload'
import { createPortfolioItem } from '@/services/portfolioService'
import { useToast } from '@/app/providers/ToastProvider'
import {
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Star,
  CheckCircle2,
} from 'lucide-react'

const categoryOptions = [
  { value: 'video', label: 'Video', icon: VideoIcon },
  { value: 'photo', label: 'Photo', icon: ImageIcon },
  { value: 'banner', label: 'Banner', icon: ImageIcon },
  { value: 'thumbnail', label: 'Thumbnail', icon: ImageIcon },
]

function getCategoryFromFiles(files: File[]): 'video' | 'photo' | 'banner' | 'thumbnail' {
  if (files.length === 0) return 'photo'
  const videoCount = files.filter((f) => f.type.startsWith('video/')).length
  if (videoCount === files.length) return 'video'
  return 'photo'
}

type UploadPhase = 'idle' | 'compressing' | 'uploading'

let wakeLock: any = null

async function acquireWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await (navigator as any).wakeLock.request('screen')
      console.log('Wake Lock acquired')
    }
  } catch (err) {
    console.warn('Failed to acquire Wake Lock:', err)
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release().then(() => {
      wakeLock = null
      console.log('Wake Lock released')
    })
  }
}

export function UploadPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('photo')
  const [featured, setFeatured] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isUploading = uploadPhase !== 'idle'
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    let interval: number
    if (isUploading) {
      setUploadProgress(5)
      interval = window.setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            return prev
          }
          const increment = Math.max(1, Math.floor((95 - prev) / 12))
          return prev + increment
        })
      }, 250)
    } else {
      setUploadProgress(0)
    }
    return () => clearInterval(interval)
  }, [isUploading])

  useEffect(() => {
    const stored = sessionStorage.getItem('upload-state')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.title) setTitle(parsed.title)
        if (parsed.description) setDescription(parsed.description)
        if (parsed.category) setCategory(parsed.category)
        if (parsed.featured) setFeatured(parsed.featured)
      } catch {
        sessionStorage.removeItem('upload-state')
      }
    }
  }, [])

  useEffect(() => {
    if (isUploading) {
      sessionStorage.setItem(
        'upload-state',
        JSON.stringify({ title, description, category, featured })
      )
    } else {
      sessionStorage.removeItem('upload-state')
    }
  }, [isUploading, title, description, category, featured])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading) {
        e.preventDefault()
        e.returnValue = 'Your upload is in progress. Are you sure you want to leave?'
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isUploading])

  useEffect(() => {
    if (isUploading) {
      acquireWakeLock()
    } else {
      releaseWakeLock()
    }

    return () => {
      releaseWakeLock()
    }
  }, [isUploading])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.filter(
      (f) =>
        UPLOAD_CONFIG.supportedImageTypes.includes(f.type as any) ||
        UPLOAD_CONFIG.supportedVideoTypes.includes(f.type as any)
    )

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
      setCategory(getCategoryFromFiles(validFiles))
      validFiles.forEach((file) => {
        const url = URL.createObjectURL(file)
        setPreviews((prev) => [...prev, url])
      })
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? [])
    const validFiles = selectedFiles.filter(
      (f) =>
        UPLOAD_CONFIG.supportedImageTypes.includes(f.type as any) ||
        UPLOAD_CONFIG.supportedVideoTypes.includes(f.type as any)
    )

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
      setCategory(getCategoryFromFiles(validFiles))
      validFiles.forEach((file) => {
        const url = URL.createObjectURL(file)
        setPreviews((prev) => [...prev, url])
      })
    }
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  const handleUpload = useCallback(async () => {
    if (files.length === 0 || !title.trim()) return

    const uploadManager = createUploadManager()
    const videoFiles = files.filter((f) => f.type.startsWith('video/'))
    const tooLarge = videoFiles.some(
      (f) => f.size > UPLOAD_CONFIG.maxCompressedVideoSize
    )

    if (tooLarge) {
      error('Please upload videos of 49MB or less')
      return
    }

    setUploadPhase('uploading')

    try {
      for (const file of files) {
        let mediaUrl = ''
        let thumbnailUrl: string | null = null

        if (UPLOAD_CONFIG.supportedImageTypes.includes(file.type as any)) {
          const result = await uploadManager.uploadImage(file, category)
          mediaUrl = result.mediaUrl
          thumbnailUrl = result.thumbnailUrl
        } else if (UPLOAD_CONFIG.supportedVideoTypes.includes(file.type as any)) {
          const result = await uploadManager.uploadVideo(file, category)
          mediaUrl = result.mediaUrl
          thumbnailUrl = result.thumbnailUrl
        }

        await createPortfolioItem({
          title: title.trim(),
          description: description.trim(),
          category: category as 'video' | 'photo' | 'banner' | 'thumbnail',
          status: 'published',
          featured: Boolean(featured),
          mediaUrl,
          thumbnailUrl,
          altText: title.trim(),
          order: 0,
          metadata: { category },
        })
      }

      await queryClient.invalidateQueries({ queryKey: ['portfolio-items'] })

      setUploadProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 600))

      setTitle('')
      setDescription('')
      setCategory('photo')
      setFeatured(false)
      setFiles([])
      setPreviews([])
      setUploadPhase('idle')
      success('Video published successfully.')
      navigate('/admin/works')
    } catch (err: any) {
      setUploadPhase('idle')
      const message = err?.message || 'Failed to upload portfolio item'
      if (message.includes('could not be compressed')) {
        error(message)
      } else {
        error(message)
      }
    }
  }, [files, title, category, description, featured, navigate, queryClient, uploadPhase, success, error])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Upload Content
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
          Add new video or photographic work to your studio portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900">Media Files</h2>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging
                ? 'border-blue-600 bg-blue-50/50'
                : 'border-gray-200 hover:border-blue-500 hover:bg-gray-50/50'
                }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  fileInputRef.current?.click()
                }
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-500">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Drag and drop media files here
              </p>
              <p className="text-xs text-gray-400">
                or click to browse &bull; MP4, WebM, JPG, PNG, WEBP supported
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Selected Files ({files.length})
                </p>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {file.type.startsWith('video/') ? (
                          <VideoIcon className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(index)
                        }}
                        className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {previews.length > 0 && (
            <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Media Preview
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {previews.map((preview, index) => {
                  const file = files[index]
                  const isVideo = file?.type.startsWith('video/')

                  return (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200/80"
                    >
                      {isVideo ? (
                        <video
                          src={preview}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-gray-900">Work Details</h2>

            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
              >
                Work Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Cinematic Commercial Edit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Brief summary or creative notes about this piece..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = category === opt.value

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${isSelected
                        ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">
                Auto-detected from file type
              </p>
            </div>

            <div className="flex items-center justify-between py-3 px-4 bg-gray-50/70 border border-gray-200/80 rounded-xl">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-gray-900">Featured Work</p>
                  {featured && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Highlight prominently on the homepage portfolio grid
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${featured
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                <Star className={`w-3.5 h-3.5 ${featured ? 'fill-white text-white' : 'text-gray-400'}`} />
                <span>{featured ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {isUploading ? (
              <div className="w-full h-12 bg-blue-50 border border-blue-200 rounded-lg relative overflow-hidden flex items-center justify-center select-none mt-2">
                <style>{`
      @keyframes wave-horizontal {
        0% { transform: translateY(0); }
        100% { transform: translateY(-50%); }
      }
      .animate-wave-light {
        animation: wave-horizontal 1.2s linear infinite;
      }
      .animate-wave-actual {
        animation: wave-horizontal 0.8s linear infinite;
      }
    `}</style>

                {/* Background filled portion */}
                <div
                  className="absolute top-0 left-0 bottom-0 bg-blue-600 transition-all duration-300 ease-out z-20"
                  style={{ width: `calc(${uploadProgress}% - 6px)` }}
                />

                {/* Overlapping liquid waves at the leading edge */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <>
                    {/* Light wave (background depth) */}
                    <div
                      className="absolute top-0 bottom-0 w-4 overflow-hidden pointer-events-none transition-all duration-300 ease-out z-10"
                      style={{ left: `calc(${uploadProgress}% - 10px)` }}
                    >
                      <svg
                        className="absolute left-0 w-full h-[200%] text-blue-400 fill-current animate-wave-light"
                        viewBox="0 0 16 96"
                        preserveAspectRatio="none"
                        style={{ top: 0 }}
                      >
                        {/* Seamless repeating S-curve path */}
                        <path d="M 0 0 L 8 0 Q 16 12 8 24 T 8 48 Q 16 60 8 72 T 8 96 L 0 96 Z" />
                      </svg>
                    </div>

                    {/* Actual wave (front layer) */}
                    <div
                      className="absolute top-0 bottom-0 w-3 overflow-hidden pointer-events-none transition-all duration-300 ease-out z-30"
                      style={{ left: `calc(${uploadProgress}% - 6px)` }}
                    >
                      <svg
                        className="absolute left-0 w-full h-[200%] text-blue-600 fill-current animate-wave-actual"
                        viewBox="0 0 12 96"
                        preserveAspectRatio="none"
                        style={{ top: 0 }}
                      >
                        {/* Seamless repeating S-curve path offset */}
                        <path d="M 0 0 L 6 0 Q 0 12 6 24 T 6 48 Q 0 60 6 72 T 6 96 L 0 96 Z" />
                      </svg>
                    </div>
                  </>
                )}

                {/* Text Indicator overlay */}
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-wide z-40 transition-colors duration-200">
                  <span className={uploadProgress > 52 ? 'text-white' : 'text-blue-800'}>
                    Uploading... {uploadProgress}%
                  </span>
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUpload}
                disabled={files.length === 0 || !title.trim()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Work</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}