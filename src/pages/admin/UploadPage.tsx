import { useState, useCallback, useRef } from 'react'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createUploadManager } from '@/upload/UploadManager'
import { UPLOAD_CONFIG } from '@/config/upload'
import { Upload, Image as ImageIcon, Video as VideoIcon } from 'lucide-react'

const categoryOptions = [
  { value: 'video', label: 'Video', icon: VideoIcon },
  { value: 'photo', label: 'Photo', icon: ImageIcon },
  { value: 'banner', label: 'Banner', icon: ImageIcon },
  { value: 'thumbnail', label: 'Thumbnail', icon: ImageIcon },
]

export function UploadPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('photo')
  const [featured, setFeatured] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    },
    []
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    },
    []
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
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
        validFiles.forEach((file) => {
          const url = URL.createObjectURL(file)
          setPreviews((prev) => [...prev, url])
        })
      }
    },
    []
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files ?? [])
      const validFiles = selectedFiles.filter(
        (f) =>
          UPLOAD_CONFIG.supportedImageTypes.includes(f.type as any) ||
          UPLOAD_CONFIG.supportedVideoTypes.includes(f.type as any)
      )

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles])
        validFiles.forEach((file) => {
          const url = URL.createObjectURL(file)
          setPreviews((prev) => [...prev, url])
        })
      }
    },
    []
  )

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
        if (UPLOAD_CONFIG.supportedImageTypes.includes(file.type as any)) {
          await uploadManager.uploadImage(file, category)
        } else if (UPLOAD_CONFIG.supportedVideoTypes.includes(file.type as any)) {
          await uploadManager.uploadVideo(file, category)
        }
      }

      setTitle('')
      setDescription('')
      setCategory('photo')
      setFeatured(false)
      setFiles([])
      setPreviews([])
    } catch {
      // Error handling would go here with toast
    } finally {
      setIsUploading(false)
    }
  }, [files, title, category])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Typography variant="h2" weight="semibold">
          Upload
        </Typography>
        <Typography variant="body" color="secondary" className="mt-1">
          Add new creative work to your portfolio
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card padding="lg" shadow="sm" className="mb-6">
            <Typography variant="h5" weight="medium" className="mb-4">
              Media Files
            </Typography>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 cursor-pointer ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-surface'
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
              <Upload className="w-10 h-10 mx-auto mb-4 text-text-tertiary" />
              <Typography variant="body" weight="medium" className="mb-1">
                Drag and drop files here
              </Typography>
              <Typography variant="caption" color="tertiary">
                or click to browse • Supports images and videos
              </Typography>
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
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface"
                  >
                    <div className="flex items-center gap-3">
                      {file.type.startsWith('video/') ? (
                        <VideoIcon className="w-5 h-5 text-text-secondary" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-text-secondary" />
                      )}
                      <div>
                        <Typography variant="body" weight="medium">
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="tertiary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                      className="p-1 rounded-lg hover:bg-surface-secondary transition-colors"
                    >
                      <Upload className="w-4 h-4 text-text-tertiary" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {previews.length > 0 && (
            <Card padding="md" shadow="sm">
              <Typography variant="h5" weight="medium" className="mb-4">
                Preview
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-surface">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card padding="lg" shadow="sm">
            <Typography variant="h5" weight="medium" className="mb-4">
              Details
            </Typography>

            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Enter work title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Description
                </label>
                <textarea
                  className="w-full rounded-lg border border-input bg-surface px-4 py-2.5 text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                  rows={4}
                  placeholder="Describe your work"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                        category === opt.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-surface text-text-secondary hover:border-primary/50'
                      }`}
                    >
                      <opt.icon className="w-4 h-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Typography variant="body" weight="medium">
                    Featured
                  </Typography>
                  <Typography variant="caption" color="tertiary">
                    Highlight this work on the homepage
                  </Typography>
                </div>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    featured ? 'bg-primary' : 'bg-surface-secondary'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      featured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleUpload}
                  disabled={files.length === 0 || !title.trim() || isUploading}
                  loading={isUploading}
                >
                  Publish Work
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}