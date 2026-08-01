import {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageRead,
  deleteMessage,
} from '@/integrations/supabase/messages'
import type { Message } from '@/types/message'

export class MessagesRepository {
  async getAll() {
    return getMessages()
  }

  async getById(id: string) {
    return getMessageById(id)
  }

  async create(input: Omit<Message, 'id' | 'created_at' | 'read'>) {
    return createMessage(input)
  }

  async markAsRead(id: string, read: boolean) {
    return updateMessageRead(id, read)
  }

  async delete(id: string) {
    return deleteMessage(id)
  }
}

export const messagesRepository = new MessagesRepository()