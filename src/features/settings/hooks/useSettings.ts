import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSettings, updateSettings } from '@/services/settingsService'
import type { SiteSettings } from '@/types/settings'

export function useSettings() {
  const queryClient = useQueryClient()

  const settingsQuery = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: getSettings,
  })

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    error: settingsQuery.error,
    updateSettings: updateSettingsMutation.mutateAsync,
    isSaving: updateSettingsMutation.isPending,
  }
}