import { messagesRepository } from '@/repositories'
import type { Message } from '@/types/message'

export async function getMessages() {
  return messagesRepository.getAll()
}

export async function getMessageById(id: string) {
  return messagesRepository.getById(id)
}

export async function createMessage(input: Omit<Message, 'id' | 'created_at' | 'read'>) {
  return messagesRepository.create(input)
}

export async function markMessageAsRead(id: string, read: boolean) {
  return messagesRepository.markAsRead(id, read)
}

export async function deleteMessage(id: string) {
  return messagesRepository.delete(id)
}