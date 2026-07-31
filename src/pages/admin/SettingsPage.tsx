import { useState, useEffect } from 'react'
import { Typography } from '@/components/ui/Typography'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { Save, Mail, Phone, Link } from 'lucide-react'

export function SettingsPage() {
  const { settings, isLoading, isError, updateSettings, isSaving } =
    useSettings()

  const [formData, setFormData] = useState<{
    siteName: string
    tagline: string
    description: string
    contactEmail: string
    contactPhone: string
    theme: string
    twitter: string
    linkedin: string
    github: string
  }>({
    siteName: '',
    tagline: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    theme: 'system',
    twitter: '',
    linkedin: '',
    github: '',
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName ?? '',
        tagline: settings.tagline ?? '',
        description: settings.description ?? '',
        contactEmail: settings.contactEmail ?? '',
        contactPhone: settings.contactPhone ?? '',
        theme: settings.theme ?? 'system',
        twitter: settings.socialLinks?.twitter ?? '',
        linkedin: settings.socialLinks?.linkedin ?? '',
        github: settings.socialLinks?.github ?? '',
      })
    }
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateSettings({
      siteName: formData.siteName,
      tagline: formData.tagline,
      description: formData.description,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      theme: formData.theme as 'light' | 'dark' | 'system',
      socialLinks: {
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        github: formData.github,
      },
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton height={32} width={200} className="mb-6" />
        <Skeleton height={400} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h2" weight="semibold" className="mb-6">
          Settings
        </Typography>
        <Card padding="lg" shadow="sm">
          <Typography color="secondary">
            Failed to load settings. Please refresh the page.
          </Typography>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Typography variant="h2" weight="semibold">
          Settings
        </Typography>
        <Typography variant="body" color="secondary" className="mt-1">
          Configure your portfolio brand and contact details
        </Typography>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card padding="lg" shadow="sm">
              <Typography variant="h5" weight="medium" className="mb-4">
                Brand Identity
              </Typography>

              <div className="space-y-4">
                <Input
                  label="Site Name"
                  placeholder="Visuals by Pritam"
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      siteName: e.target.value,
                    }))
                  }
                />

                <Input
                  label="Tagline"
                  placeholder="A premium creative portfolio"
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tagline: e.target.value,
                    }))
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-input bg-surface px-4 py-2.5 text-text placeholder:text-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Brief description of your portfolio"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </Card>

            <Card padding="lg" shadow="sm">
              <Typography variant="h5" weight="medium" className="mb-4">
                Contact Details
              </Typography>

              <div className="space-y-4">
                <Input
                  label="Contact Email"
                  type="email"
                  placeholder="hello@visualsbypritam.com"
                  leftAddon={<Mail className="w-4 h-4 text-text-tertiary" />}
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactEmail: e.target.value,
                    }))
                  }
                />

                <Input
                  label="Contact Phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  leftAddon={<Phone className="w-4 h-4 text-text-tertiary" />}
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPhone: e.target.value,
                    }))
                  }
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card padding="lg" shadow="sm">
              <Typography variant="h5" weight="medium" className="mb-4">
                Social Links
              </Typography>

              <div className="space-y-4">
                <Input
                  label="Twitter / X"
                  placeholder="https://twitter.com/yourhandle"
                  leftAddon={<Link className="w-4 h-4 text-text-tertiary" />}
                  value={formData.twitter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      twitter: e.target.value,
                    }))
                  }
                />

                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/yourprofile"
                  leftAddon={<Link className="w-4 h-4 text-text-tertiary" />}
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                />

                <Input
                  label="GitHub"
                  placeholder="https://github.com/yourusername"
                  leftAddon={<Link className="w-4 h-4 text-text-tertiary" />}
                  value={formData.github}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      github: e.target.value,
                    }))
                  }
                />
              </div>
            </Card>

            <Card padding="lg" shadow="sm">
              <Typography variant="h5" weight="medium" className="mb-4">
                Appearance
              </Typography>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Theme
                </label>
                <select
                  className="w-full rounded-lg border border-input bg-surface px-4 py-2.5 text-text focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  value={formData.theme}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      theme: e.target.value as 'light' | 'dark' | 'system',
                    }))
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSaving}
                loading={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}