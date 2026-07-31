import { useState } from 'react'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePortfolio } from '@/features/portfolio/hooks/usePortfolio'
import { portfolioRepository } from '@/repositories'
import { Plus, Search, Edit, Trash2, Image, Video, ImageIcon, FolderOpen } from 'lucide-react'

const categoryOptions = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Videos' },
  { value: 'photo', label: 'Photos' },
  { value: 'banner', label: 'Banners' },
  { value: 'thumbnail', label: 'Thumbnails' },
]

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
]

function WorkCard({
  title,
  description,
  category,
  status,
  onEdit,
  onDelete,
}: {
  title: string
  description: string
  category: string
  status: string
  onEdit: () => void
  onDelete: () => void
}) {
  const CategoryIcon =
    category === 'video' ? Video : category === 'banner' ? ImageIcon : Image

  return (
    <Card padding="md" shadow="sm" hover>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
            <CategoryIcon className="w-5 h-5 text-text-secondary" />
          </div>
          <div>
            <Typography variant="body" weight="medium">
              {title}
            </Typography>
            <Typography variant="caption" color="tertiary">
              {category}
            </Typography>
          </div>
        </div>
        <Badge
          variant={
            status === 'published'
              ? 'success'
              : status === 'draft'
                ? 'warning'
                : 'outline'
          }
        >
          {status}
        </Badge>
      </div>
      <Typography variant="caption" color="secondary" className="mb-4">
        {description.length > 100
          ? description.slice(0, 100) + '...'
          : description}
      </Typography>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  )
}

export function WorksPage() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { items, isLoading, isError, error } = usePortfolio()

  const filtered = items.filter(
    (item: { title: string; description: string; category: string; status: string }) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDelete = async (id: string) => {
    try {
      await portfolioRepository.delete(id)
      setDeleteConfirm(null)
    } catch {
      // Error handling would go here with toast
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton height={32} width={200} className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={180} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Failed to load works"
          message={error?.message}
          onRetry={() => {}}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Typography variant="h2" weight="semibold">
            Works
          </Typography>
          <Typography variant="body" color="secondary" className="mt-1">
            Manage your portfolio items
          </Typography>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Work
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search works..."
            leftAddon={<Search className="w-4 h-4 text-text-tertiary" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-input bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-input bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No works found"
          description="Try adjusting your search or filter, or create a new work."
          icon={<FolderOpen className="w-12 h-12" />}
          action={{
            label: 'New Work',
            onClick: () => {},
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item: { id: string; title: string; description: string; category: string; status: string }) => (
            <WorkCard
              key={item.id}
              title={item.title}
              description={item.description}
              category={item.category}
              status={item.status}
              onEdit={() => {}}
              onDelete={() => setDeleteConfirm(item.id)}
            />
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-bg shadow-modal border border-border-light p-6">
            <Typography variant="h5" weight="medium" className="mb-2">
              Delete Work
            </Typography>
            <Typography variant="body" color="secondary" className="mb-6">
              Are you sure you want to delete this work? This action cannot be
              undone.
            </Typography>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}