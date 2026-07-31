import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePortfolio } from '@/features/portfolio/hooks/usePortfolio'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { Image, Video, Search } from 'lucide-react'

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Videos' },
  { value: 'photo', label: 'Photos' },
  { value: 'banner', label: 'Banners' },
  { value: 'thumbnail', label: 'Thumbnails' },
]

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'video':
      return <Video className="w-5 h-5 text-gray-400" />
    default:
      return <Image className="w-5 h-5 text-gray-400" />
  }
}

export function PortfolioGallery() {
  const { items, isLoading } = usePortfolio()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = (items || []).filter((item) => {
    const matchesCategory =
      activeFilter === 'all' || item.category === activeFilter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          description="Try adjusting your search or filter."
          icon={<CategoryIcon category="photo" />}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filtered.map((item, index) => {
              const isFeatured = index === 0 && item.category !== 'thumbnail'
              const isWide = isFeatured && index % 3 === 0
              return (
                <motion.div key={item.id} variants={fadeInUp}>
                  <Card
                    padding="none"
                    shadow="sm"
                    hover
                    variant={isFeatured ? 'featured' : 'default'}
                    className={cn(
                      'overflow-hidden group bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md',
                      isWide && 'lg:col-span-2 lg:row-span-2'
                    )}
                  >
                    <div
                      className={cn(
                        'bg-gray-100 relative overflow-hidden',
                        isWide ? 'aspect-[4/3]' : 'aspect-video'
                      )}
                    >
                      {item.thumbnailUrl ? (
                        item.category === 'video' ? (
                          <video
                            src={item.mediaUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.altText || item.title}
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
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-medium border-gray-200">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className={cn(isFeatured ? 'p-6' : 'p-4')}>
                      <Typography variant="body" weight="semibold" className="text-gray-900 text-base">
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="secondary" className="mt-1 text-gray-600 line-clamp-2 text-xs">
                        {item.description}
                      </Typography>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}