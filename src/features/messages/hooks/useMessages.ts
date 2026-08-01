import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMessages, createMessage, deleteMessage, markMessageAsRead } from '@/services/messagesService'
import type { Message } from '@/types/message'

export function useMessages() {
  const messagesQuery = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: getMessages,
  })

  return {
    messages: messagesQuery.data ?? [],
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    error: messagesQuery.error,
  }
}

export function useCreateMessage() {
  const queryClient = useQueryClient()

  return {
    mutate: (input: Omit<Message, 'id' | 'created_at' | 'read'>) =>
      createMessage(input).then(() => {
        queryClient.invalidateQueries({ queryKey: ['messages'] })
      }),
  }
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return {
    mutate: (id: string) =>
      deleteMessage(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ['messages'] })
      }),
  }
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient()

  return {
    mutate: (id: string, read: boolean) =>
      markMessageAsRead(id, read).then(() => {
        queryClient.invalidateQueries({ queryKey: ['messages'] })
      }),
  }
}