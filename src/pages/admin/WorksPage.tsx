import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { usePortfolio } from '@/features/portfolio/hooks/usePortfolio'
import { portfolioRepository } from '@/repositories'
import {
  Plus,
  Search,
  Trash2,
  Image as ImageIcon,
  Video,
  Layers,
  FolderOpen,
  Filter,
} from 'lucide-react'

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'video', label: 'Videos' },
  { value: 'photo', label: 'Photos' },
  { value: 'banner', label: 'Banners' },
  { value: 'thumbnail', label: 'Thumbnails' },
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
]

function WorkCard({
  title,
  description,
  category,
  status,
  onDelete,
}: {
  title: string
  description: string
  category: string
  status: string
  onDelete: () => void
}) {
  const CategoryIcon =
    category === 'video' ? Video : category === 'banner' ? Layers : ImageIcon

  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 shrink-0">
              <CategoryIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {title}
              </h3>
              <p className="text-xs text-gray-400 capitalize">{category}</p>
            </div>
          </div>

          <Badge
            variant={status === 'published' ? 'default' : 'outline'}
            className={
              status === 'published'
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs shrink-0'
                : 'text-gray-500 border-gray-200 text-xs shrink-0'
            }
          >
            {status}
          </Badge>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {description || 'No description provided.'}
        </p>
      </div>

      <div className="flex items-center justify-end pt-3 border-t border-gray-100">
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}

export function WorksPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { items = [], isLoading, isError, error } = usePortfolio()

  const filtered = items.filter(
    (item: { title: string; description: string; category: string; status: string }) => {
      const matchesSearch =
        (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        categoryFilter === 'all' || item.category === categoryFilter
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    }
  )

  const handleDelete = async (id: string) => {
    try {
      await portfolioRepository.delete(id)
      setDeleteConfirm(null)
    } catch {
      // Handled by toast or mutation error
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton height={32} width={200} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={180} className="rounded-xl shadow-xs" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <ErrorState
          title="Failed to load works"
          message={error?.message}
          onRetry={() => { }}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Works
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Manage and organize your portfolio entries
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/upload')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Work</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search works..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-lg text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="flex gap-2.5">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white border border-gray-200/80 text-gray-700 text-sm font-medium rounded-lg px-3.5 py-2.5 pr-8 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white border border-gray-200/80 text-gray-700 text-sm font-medium rounded-lg px-3.5 py-2.5 pr-8 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-12 text-center">
          <EmptyState
            title="No works found"
            description="Try adjusting your search or filters, or upload a new work."
            icon={<FolderOpen className="w-10 h-10 text-gray-300" />}
            action={{
              label: 'Upload Work',
              onClick: () => navigate('/admin/upload'),
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(
            (item: {
              id: string
              title: string
              description: string
              category: string
              status: string
            }) => (
              <WorkCard
                key={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                status={item.status}
                onDelete={() => setDeleteConfirm(item.id)}
              />
            )
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white shadow-xl border border-gray-200 p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Delete Work
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Are you sure you want to delete this piece? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}