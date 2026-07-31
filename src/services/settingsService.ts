import { settingsRepository } from '@/repositories'
import type { SiteSettings } from '@/types/settings'

export async function getSettings() {
  return settingsRepository.get()
}

export async function updateSettings(input: Partial<SiteSettings>) {
  return settingsRepository.update(input)
}