import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export function useRealtimeSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const messagesChannel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('Realtime message change:', payload)
          queryClient.invalidateQueries({ queryKey: ['messages'] })
        }
      )
      .subscribe()

    const portfolioChannel = supabase
      .channel('portfolio-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_items' },
        (payload) => {
          console.log('Realtime portfolio change:', payload)
          queryClient.invalidateQueries({ queryKey: ['portfolio-items'] })
        }
      )
      .subscribe()

    const settingsChannel = supabase
      .channel('settings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
          console.log('Realtime settings change:', payload)
          queryClient.invalidateQueries({ queryKey: ['settings'] })
        }
      )
      .subscribe()

    const categoriesChannel = supabase
      .channel('categories-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('Realtime categories change:', payload)
          queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(portfolioChannel)
      supabase.removeChannel(settingsChannel)
      supabase.removeChannel(categoriesChannel)
    }
  }, [queryClient])
}
