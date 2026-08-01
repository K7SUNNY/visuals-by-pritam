import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePortfolio } from '@/features/portfolio/hooks/usePortfolio'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { Image as ImageIcon, Video, Search } from 'lucide-react'
import { MediaModal } from './MediaModal'

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Videos' },
  { value: 'photo', label: 'Photos' },
  { value: 'banner', label: 'Banners' },
  { value: 'thumbnail', label: 'Thumbnails' },
]

function CategoryIcon({ category }: { category: string }) {
  switch (category?.toLowerCase()) {
    case 'video':
      return <Video className="w-5 h-5 text-gray-400" />
    default:
      return <ImageIcon className="w-5 h-5 text-gray-400" />
  }
}

// Reliable Auto-playing Video Component
function AutoPlayVideo({ src, className }: { src: string; className?: string }) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className={className}
    />
  )
}

export function PortfolioGallery() {
  const { items, isLoading } = usePortfolio()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<ReturnType<typeof usePortfolio>['items'][number] | null>(null)

  // Safe robust filtering
  const filtered = (items || []).filter((item) => {
    const itemCat = (item.category || '').toLowerCase().trim()
    const matchesCategory =
      activeFilter === 'all' || itemCat === activeFilter.toLowerCase()

    const query = searchQuery.toLowerCase().trim()
    const title = (item.title || '').toLowerCase()
    const description = (item.description || '').toLowerCase()
    const matchesSearch =
      !query || title.includes(query) || description.includes(query)

    return matchesCategory && matchesSearch
  })

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Skeleton height={32} width={200} className="mb-8" />
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={36} width={90} className="rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={280} className="rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20" id="portfolio">
      <div className="mb-8">
        <Typography
          variant="overline"
          color="secondary"
          className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Portfolio
        </Typography>
        <Typography
          variant="h2"
          weight="semibold"
          className="text-3xl font-bold text-gray-900 tracking-tight mb-6"
        >
          All Works
        </Typography>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 shrink-0">
            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer select-none',
                  activeFilter === filter.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No works found"
          description="Try adjusting your search or category filter."
          icon={<CategoryIcon category={activeFilter} />}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const displayMedia = item.thumbnailUrl || item.mediaUrl
              const itemCat = (item.category || '').toLowerCase()

              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    padding="none"
                    shadow="sm"
                    hover
                    className="overflow-hidden group bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="bg-gray-100 relative overflow-hidden aspect-video shrink-0">
                       {displayMedia ? (
                         itemCat === 'video' ? (
                           <AutoPlayVideo
                             src={item.mediaUrl}
                             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                           />
                         ) : (
                           <img
                             src={displayMedia}
                             alt={item.altText || item.title || 'Work sample'}
                             loading="lazy"
                             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                           />
                         )
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-gray-50">
                           <CategoryIcon category={item.category} />
                         </div>
                       )}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-medium border-gray-200 capitalize"
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 flex-1">
                      <Typography
                        variant="body"
                        weight="semibold"
                        className="text-gray-900 text-base"
                      >
                        {item.title}
                      </Typography>
                      {item.description && (
                        <Typography
                          variant="caption"
                          color="secondary"
                          className="mt-1 text-gray-600 line-clamp-2 text-xs"
                        >
                          {item.description}
                        </Typography>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>

    <MediaModal
      item={selectedItem}
      onClose={() => setSelectedItem(null)}
    />
    </>
  )
}