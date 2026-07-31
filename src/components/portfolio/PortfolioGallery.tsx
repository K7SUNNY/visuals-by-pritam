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
import { Image, Video } from 'lucide-react'

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
      return <Video className="w-5 h-5" />
    default:
      return <Image className="w-5 h-5" />
  }
}

export function PortfolioGallery() {
  const { items, isLoading } = usePortfolio()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = items.filter((item) => {
    const matchesCategory =
      activeFilter === 'all' || item.category === activeFilter
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <Skeleton height={32} width={200} className="mb-8" />
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={36} width={80} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={250} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16" id="portfolio">
      <div className="mb-8">
        <Typography variant="overline" color="secondary" className="mb-2">
          Portfolio
        </Typography>
        <Typography variant="h2" weight="semibold" className="mb-4">
          All Works
        </Typography>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-input bg-surface px-4 py-2.5 text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 shrink-0">
            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                  activeFilter === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface text-text-secondary hover:bg-surface-secondary'
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
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
                      'overflow-hidden',
                      isWide && 'lg:col-span-2 lg:row-span-2'
                    )}
                  >
                    <div
                      className={cn(
                        'bg-surface relative',
                        isWide ? 'aspect-[4/3]' : 'aspect-video'
                      )}
                    >
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.altText}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CategoryIcon category={item.category} />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                    </div>
                    <div className={cn(isFeatured ? 'p-5' : 'p-4')}>
                      <Typography variant="body" weight="medium">
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="secondary" className="mt-1 line-clamp-2">
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