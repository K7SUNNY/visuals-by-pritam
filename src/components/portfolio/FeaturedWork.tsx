import { motion } from 'framer-motion'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePortfolio } from '@/features/portfolio/hooks/usePortfolio'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { Image as ImageIcon, Video } from 'lucide-react'

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'video':
      return <Video className="w-5 h-5 text-gray-400" />
    default:
      return <ImageIcon className="w-5 h-5 text-gray-400" />
  }
}

export function FeaturedWork() {
  const { items, isLoading, isError, error } = usePortfolio()

  // --- DEBUG LOGS ---
  // console.log('[FeaturedWork] isLoading:', isLoading)
  // console.log('[FeaturedWork] isError:', isError, error)
  // console.log('[FeaturedWork] Raw items from hook:', items)

  const featured = (items || []).filter((i) => {
    const isFeatured =
      i.featured === true ||
      String(i.featured) === 'true' ||
      String(i.featured) === '1' ||
      String(i.featured) === 't'

    const isPublished = !i.status || i.status === 'published'

    return isFeatured && isPublished
  })

  // console.log('[FeaturedWork] Filtered featured items:', featured)
  // ------------------

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Skeleton height={32} width={200} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={300} className="rounded-xl" />
          ))}
        </div>
      </section>
    )
  }

  if (featured.length === 0) {
    console.warn('[FeaturedWork] No featured items found. Component returning null.')
    return null
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 bg-transparent">
      <div className="mb-8">
        <Typography
          variant="overline"
          color="secondary"
          className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Featured Work
        </Typography>
        <Typography
          variant="h2"
          weight="semibold"
          className="text-3xl font-bold text-gray-900 tracking-tight"
        >
          Selected Projects
        </Typography>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {featured.slice(0, 3).map((item) => {
          const displayMedia = item.thumbnailUrl || item.mediaUrl

          return (
            <motion.div key={item.id} variants={fadeInUp}>
              <Card
                padding="none"
                shadow="sm"
                hover
                className="overflow-hidden group bg-white border border-gray-200/80 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {displayMedia ? (
                    item.category === 'video' && !item.thumbnailUrl ? (
                      <video
                        src={item.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={displayMedia}
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
                    <Badge
                      variant="secondary"
                      className="bg-white/90 backdrop-blur-md text-gray-800 text-xs font-medium border-gray-200 capitalize"
                    >
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <Typography
                    variant="body"
                    weight="semibold"
                    className="text-gray-900 text-base"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="secondary"
                    className="mt-1 text-gray-600 line-clamp-2 text-xs"
                  >
                    {item.description}
                  </Typography>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}