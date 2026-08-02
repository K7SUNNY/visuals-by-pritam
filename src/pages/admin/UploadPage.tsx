import { useState, useCallback, useRef } from 'react'
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
  Loader2,
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
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    setIsUploading(true)
    const uploadManager = createUploadManager()

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
          featured: Boolean(featured), // Forces a clear boolean true/false
          mediaUrl,
          thumbnailUrl,
          altText: title.trim(),
          order: 0,
          metadata: { category },
        })
      }

      await queryClient.invalidateQueries({ queryKey: ['portfolio-items'] })

      setTitle('')
      setDescription('')
      setCategory('photo')
      setFeatured(false)
      setFiles([])
      setPreviews([])
      success('Portfolio item created successfully')
      navigate('/admin/works')
    } catch (err: any) {
      error(err?.message || 'Failed to upload portfolio item')
    } finally {
      setIsUploading(false)
    }
  }, [files, title, category, description, featured, navigate, queryClient])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Upload Content
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
          Add new video or photographic work to your studio portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media Dropzone & Previews */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900">Media Files</h2>

            {/* Drag and Drop Zone */}
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

            {/* File List */}
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

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Media Preview
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200/80"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Metadata & Submit Form */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-gray-900">Work Details</h2>

            {/* Title Field */}
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

            {/* Description Field */}
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

            {/* Category Selection */}
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

            {/* Featured Toggle Section */}
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

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleUpload}
              disabled={files.length === 0 || !title.trim() || isUploading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Work...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Work</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}