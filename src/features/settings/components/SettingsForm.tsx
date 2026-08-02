import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { siteSettingsSchema } from '@/lib/validations/settings'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/app/providers/ToastProvider'
import { useSettings } from '../hooks/useSettings'
import type { z } from 'zod'

type SettingsFormData = z.infer<typeof siteSettingsSchema>

export function SettingsForm() {
  const { success, error } = useToast()
  const { updateSettings } = useSettings()
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: '',
      tagline: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      theme: 'system',
    },
  })

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true)
    try {
      await updateSettings({
        siteName: data.siteName,
        tagline: data.tagline,
        description: data.description || '',
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || '',
        theme: data.theme,
        socialLinks: {},
      })
      success('Settings saved successfully')
    } catch {
      error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div>
        <label htmlFor="siteName" className="block text-sm font-medium mb-1">
          Site Name
        </label>
        <Input id="siteName" {...register('siteName')} />
        {errors.siteName && (
          <p className="text-sm text-destructive mt-1">{errors.siteName.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="tagline" className="block text-sm font-medium mb-1">
          Tagline
        </label>
        <Input id="tagline" {...register('tagline')} />
        {errors.tagline && (
          <p className="text-sm text-destructive mt-1">{errors.tagline.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
          Contact Email
        </label>
        <Input id="contactEmail" type="email" {...register('contactEmail')} />
        {errors.contactEmail && (
          <p className="text-sm text-destructive mt-1">{errors.contactEmail.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="theme" className="block text-sm font-medium mb-1">
          Theme
        </label>
        <select
          id="theme"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...register('theme')}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  )
}