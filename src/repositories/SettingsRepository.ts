import { getSettings, updateSettings } from '@/integrations/supabase/settings'
import type { SiteSettings } from '@/types/settings'

export class SettingsRepository {
  async get() {
    return getSettings()
  }

  async update(input: Partial<SiteSettings>) {
    return updateSettings(input)
  }
}

export const settingsRepository = new SettingsRepository()