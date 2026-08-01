import { supabase } from './client'
import type { Message } from '@/types/message'

export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return ((data as Message[]) ?? [])
}

export async function getMessageById(id: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) throw error
  return data as Message
}

export async function createMessage(input: Omit<Message, 'id' | 'created_at' | 'read'>) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ ...input, read: false })
    .select()
    .single()

  if (error) throw error
  return data as Message
}

export async function updateMessageRead(id: string, read: boolean) {
  const { data, error } = await supabase
    .from('messages')
    .update({ read })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Message
}

export async function deleteMessage(id: string) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (error) throw error
}