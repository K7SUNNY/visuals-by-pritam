import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import {
  FolderOpen,
  Video,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react'

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
    <div className="p-5 rounded-xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { portfolioItems: items, isLoading } = useDashboard()

  const totalWorks = items.length
  const videos = items.filter((i) => i.category === 'video').length
  const photos = items.filter((i) => i.category === 'photo').length
  const banners = items.filter((i) => i.category === 'banner').length
  const published = items.filter((i) => i.status === 'published').length

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton height={32} width={200} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={90} className="rounded-xl shadow-xs" />
          ))}
        </div>
        <Skeleton height={200} className="rounded-xl shadow-xs" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Overview of your portfolio and published content
          </p>
        </div>

        <Link
          to="/admin/upload"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Work</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Works" value={totalWorks} icon={FolderOpen} />
        <StatCard label="Videos" value={videos} icon={Video} />
        <StatCard label="Photos" value={photos} icon={ImageIcon} />
        <StatCard label="Banners" value={banners} icon={Layers} />
        <StatCard label="Published" value={published} icon={CheckCircle2} />
      </div>

      {/* Recent Activity Table Card */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-base">
            Recent Work
          </h2>
          {items.length > 0 && (
            <Link
              to="/admin/works"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FolderOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">No works uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Start building your portfolio by uploading your first piece.
            </p>
            <Link
              to="/admin/upload"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg mt-4 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Now</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200/60 flex items-center justify-center shrink-0">
                    {item.category === 'video' ? (
                      <Video className="w-4 h-4 text-gray-600" />
                    ) : item.category === 'photo' ? (
                      <ImageIcon className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Layers className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {item.category}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={item.status === 'published' ? 'default' : 'outline'}
                  className={
                    item.status === 'published'
                      ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs'
                      : 'text-gray-500 border-gray-200 text-xs'
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}