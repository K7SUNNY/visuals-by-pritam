import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { useMessages } from '@/features/messages/hooks/useMessages'
import { messagesRepository } from '@/repositories'
import {
  Mail,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  Inbox,
  X,
  User,
  AtSign,
  Calendar,
  Loader2,
} from 'lucide-react'

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
]

function MessageRow({
  message,
  onMarkRead,
  onDelete,
  onClick,
}: {
  message: {
    id: string
    name: string
    email: string
    message: string
    read: boolean
    created_at: string
  }
  onMarkRead: (id: string, read: boolean) => void
  onDelete: (id: string) => void
  onClick: (message: { id: string; name: string; email: string; message: string; read: boolean; created_at: string }) => void
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await messagesRepository.delete(message.id)
      onDelete(message.id)
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
      setConfirmingDelete(false)
    }
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-start gap-3 cursor-pointer hover:shadow-md ${
        message.read
          ? 'bg-white border-gray-200/80 shadow-sm'
          : 'bg-blue-50/50 border-blue-200/60 shadow-sm'
      }`}
      onClick={() => onClick(message)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(message)
        }
      }}
      aria-label={`View message from ${message.name}`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-600">
        <Mail className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {message.name}
          </h4>
          {!message.read && (
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {message.email}
        </p>
        <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
          {message.message}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(message.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <Badge
            variant={message.read ? 'outline' : 'default'}
            className={
              message.read
                ? 'text-gray-500 border-gray-200 text-xs'
                : 'bg-blue-100 text-blue-700 border-blue-200 text-xs'
            }
          >
            {message.read ? 'Read' : 'Unread'}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        {!message.read ? (
          <button
            type="button"
            onClick={() => onMarkRead(message.id, true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Mark as read"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Read</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onMarkRead(message.id, false)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Mark as unread"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unread</span>
          </button>
        )}

        {confirmingDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="px-2 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
            >
              {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Yes
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => setConfirmingDelete(false)}
              className="px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded transition-colors cursor-pointer disabled:opacity-50"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            aria-label="Delete message"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
      </div>
    </div>
  )
}

export function MessagesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<{
    id: string
    name: string
    email: string
    message: string
    read: boolean
    created_at: string
  } | null>(null)

  const { messages, isLoading, isError, error } = useMessages()

  const filtered = messages.filter((msg) => {
    const matchesSearch =
      (msg.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (msg.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (msg.message || '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unread' && !msg.read) ||
      (statusFilter === 'read' && msg.read)

    return matchesSearch && matchesStatus
  })

  const unreadCount = messages.filter((m) => !m.read).length

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton height={32} width={200} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={80} className="rounded-xl" />
          ))}
        </div>
        <Skeleton height={200} className="rounded-xl" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <ErrorState
          title="Failed to load messages"
          message={error?.message}
          onRetry={() => queryClient.invalidateQueries({ queryKey: ['messages'] })}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Messages
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
              : 'All messages are read'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Messages
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {messages.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Unread
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {unreadCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <Mail className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Read
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {messages.length - unreadCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/80 rounded-lg text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
          />
        </div>

        <div className="relative flex-1 md:flex-none">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto appearance-none bg-white border border-gray-200/80 text-gray-700 text-sm font-medium rounded-lg px-3.5 py-2.5 pr-8 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all cursor-pointer"
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

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-12 text-center">
          <EmptyState
            title="No messages found"
            description={
              search || statusFilter !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'No messages have been sent yet.'
            }
            icon={<Mail className="w-10 h-10 text-gray-300" />}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <MessageRow
              key={msg.id}
              message={msg}
              onMarkRead={async (id, read) => {
                try {
                  await messagesRepository.markAsRead(id, read)
                  await queryClient.invalidateQueries({ queryKey: ['messages'] })
                } catch (err) {
                  console.error('Error marking as read:', err)
                }
              }}
              onDelete={() => {
                queryClient.invalidateQueries({ queryKey: ['messages'] })
              }}
              onClick={setSelectedMessage}
            />
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedMessage(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              className="relative z-10 w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {selectedMessage.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <AtSign className="w-3 h-3" />
                      {selectedMessage.email}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {new Date(selectedMessage.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  <span className="mx-2">·</span>
                  <Badge
                    variant={selectedMessage.read ? 'outline' : 'default'}
                    className={
                      selectedMessage.read
                        ? 'text-gray-500 border-gray-200 text-xs'
                        : 'bg-blue-100 text-blue-700 border-blue-200 text-xs'
                    }
                  >
                    {selectedMessage.read ? 'Read' : 'Unread'}
                  </Badge>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    messagesRepository.markAsRead(selectedMessage.id, true)
                    queryClient.invalidateQueries({ queryKey: ['messages'] })
                    setSelectedMessage(null)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as Read
                </button>
                <button
                  type="button"
                  onClick={() => {
                    messagesRepository.delete(selectedMessage.id)
                    queryClient.invalidateQueries({ queryKey: ['messages'] })
                    setSelectedMessage(null)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}