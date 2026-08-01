import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
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
  CheckSquare,
  Square,
  Loader2,
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
  id,
  title,
  description,
  category,
  status,
  isSelected,
  onToggleSelect,
  onDelete,
}: {
  id: string
  title: string
  description: string
  category: string
  status: string
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onDelete: () => void
}) {
  const CategoryIcon =
    category === 'video' ? Video : category === 'banner' ? Layers : ImageIcon

  return (
    <div
      className={`p-5 rounded-xl bg-white border transition-all flex flex-col justify-between relative ${isSelected
        ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-sm'
        : 'border-gray-200/80 shadow-sm hover:shadow-md'
        }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Checkbox for Selection */}
            <button
              type="button"
              onClick={() => onToggleSelect(id)}
              className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-blue-600 fill-blue-50" />
              ) : (
                <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
              )}
            </button>

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

        <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed pl-8">
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
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | string[] | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { items = [], isLoading, isError, error, refetch } = usePortfolio()

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

  // Toggle single item selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Toggle select all visible items
  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map((item: { id: string }) => item.id))
    }
  }

  // Handle single or bulk deletion with instant refresh & auto-close
  const handleDelete = async (target: string | string[]) => {
    setIsDeleting(true)
    try {
      if (Array.isArray(target)) {
        await Promise.all(target.map((id) => portfolioRepository.delete(id)))
        setSelectedIds([])
      } else {
        await portfolioRepository.delete(target)
        setSelectedIds((prev) => prev.filter((id) => id !== target))
      }

      // 1. Instantly invalidate cache and trigger re-fetch
      await queryClient.invalidateQueries({ queryKey: ['portfolio-items'] })
      await refetch()
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      // 2. GUARANTEED MODAL CLOSE
      setIsDeleting(false)
      setDeleteConfirm(null)
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
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const isAllSelected =
    filtered.length > 0 && selectedIds.length === filtered.length

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

      {/* Bulk Select Control Bar */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200/80 rounded-xl shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
            </button>
            {selectedIds.length > 0 && (
              <span className="text-xs font-medium text-gray-500 border-l border-gray-200 pl-3">
                {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''}{' '}
                selected
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setDeleteConfirm(selectedIds)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      )}

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
                id={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                status={item.status}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={handleToggleSelect}
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
            onClick={() => !isDeleting && setDeleteConfirm(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-xl bg-white shadow-xl border border-gray-200 p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {Array.isArray(deleteConfirm)
                  ? `Delete ${deleteConfirm.length} ${deleteConfirm.length === 1 ? 'Work' : 'Works'}`
                  : 'Delete Work'}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {Array.isArray(deleteConfirm)
                  ? `Are you sure you want to delete ${deleteConfirm.length === 1
                    ? 'this selected piece'
                    : `these ${deleteConfirm.length} selected pieces`
                  }? This action cannot be undone.`
                  : 'Are you sure you want to delete this piece? This action cannot be undone.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(deleteConfirm)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}