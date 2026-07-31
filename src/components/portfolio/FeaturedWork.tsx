import { motion } from 'framer-motion'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePortfolio } from '@/features/portfolio/hooks/usePortfolio'
import { fadeInUp, staggerContainer } from '@/animations/variants'
import { Image, Video } from 'lucide-react'

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'video':
      return <Video className="w-5 h-5" />
    default:
      return <Image className="w-5 h-5" />
  }
}

export function FeaturedWork() {
  const { items, isLoading } = usePortfolio()
  const featured = items.filter((i) => i.status === 'published')

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <Skeleton height={32} width={200} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={300} />
          ))}
        </div>
      </section>
    )
  }

  if (featured.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <Typography variant="overline" color="secondary" className="mb-2">
          Featured Work
        </Typography>
        <Typography variant="h2" weight="semibold">
          Selected Projects
        </Typography>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {featured.slice(0, 3).map((item) => (
          <motion.div key={item.id} variants={fadeInUp}>
            <Card padding="none" shadow="sm" hover className="overflow-hidden">
              <div className="aspect-video bg-surface relative">
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
              <div className="p-4">
                <Typography variant="body" weight="medium">
                  {item.title}
                </Typography>
                <Typography variant="caption" color="secondary" className="mt-1 line-clamp-2">
                  {item.description}
                </Typography>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}