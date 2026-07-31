import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { FolderOpen, Video, Image, ImageIcon, Star } from 'lucide-react'

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number | string
  icon: React.ElementType
}) {
  return (
    <Card padding="md" shadow="sm" hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary font-medium">{label}</p>
          <p className="text-2xl font-heading font-semibold mt-1">
            {value}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const { portfolioItems: items, isLoading } = useDashboard()

  const totalWorks = items.length
  const videos = items.filter((i) => i.category === 'video').length
  const photos = items.filter((i) => i.category === 'photo').length
  const banners = items.filter((i) => i.category === 'banner').length
  const featured = items.filter((i) => i.status === 'published').length

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton height={32} width={200} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={100} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Typography variant="h2" weight="semibold">
          Dashboard
        </Typography>
        <Typography variant="body" color="secondary" className="mt-1">
          Overview of your portfolio and content
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Works" value={totalWorks} icon={FolderOpen} />
        <StatCard label="Videos" value={videos} icon={Video} />
        <StatCard label="Photos" value={photos} icon={Image} />
        <StatCard label="Banners" value={banners} icon={ImageIcon} />
        <StatCard label="Published" value={featured} icon={Star} />
      </div>

      <Card padding="md" shadow="sm">
        <Typography variant="h5" weight="medium" className="mb-4">
          Recent Activity
        </Typography>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <Typography color="secondary">
              No works yet. Start by uploading your first piece.
            </Typography>
          </div>
        ) : (
          <div className="space-y-3">
            {items.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-divider last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                    {item.category === 'video' ? (
                      <Video className="w-5 h-5 text-text-secondary" />
                    ) : item.category === 'photo' ? (
                      <Image className="w-5 h-5 text-text-secondary" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-text-secondary" />
                    )}
                  </div>
                  <div>
                    <Typography variant="body" weight="medium">
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="tertiary">
                      {item.category} • {item.status}
                    </Typography>
                  </div>
                </div>
                <Badge variant="outline">{item.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}