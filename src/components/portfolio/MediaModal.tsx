import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { PortfolioItem } from '@/types/portfolio'

interface MediaModalProps {
  item: PortfolioItem | null
  onClose: () => void
}

export function MediaModal({ item, onClose }: MediaModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (item) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [item, handleKeyDown])

  if (typeof window === 'undefined') return null

  // Use createPortal to attach the modal directly to <body>
  // This bypasses Header stacking contexts and z-index limits completely
  return createPortal(
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Content Box */}
          <motion.div
            className="relative z-10 w-auto max-w-5xl h-auto max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-gray-800"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer shadow-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Area (Constrained strictly to 80vh to prevent scaling out of view) */}
            <div className="bg-black flex items-center justify-center h-[50vh] md:h-[80vh] max-h-[80vh] w-full md:w-auto overflow-hidden relative shrink-0">
              {item.category?.toLowerCase() === 'video' && item.mediaUrl ? (
                <video
                  src={item.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain mx-auto max-h-[80vh]"
                />
              ) : item.mediaUrl ? (
                <img
                  src={item.mediaUrl}
                  alt={item.altText || item.title}
                  className="h-full w-full object-contain mx-auto max-h-[80vh]"
                />
              ) : (
                <div className="w-64 aspect-video flex items-center justify-center text-gray-400 text-sm font-medium">
                  No media available
                </div>
              )}
            </div>

            {/* Sidebar Description Area */}
            <div className="w-full md:w-80 p-6 bg-white flex flex-col justify-between shrink-0 overflow-y-auto max-h-[80vh] border-t md:border-t-0 md:border-l border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize text-xs font-semibold">
                    <Tag className="w-3 h-3 mr-1 inline" />
                    {item.category}
                  </Badge>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                    {item.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 text-[11px] text-gray-400 font-medium flex items-center justify-between">
                <span>Visuals by Pritam</span>
                <span>Portfolio</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}