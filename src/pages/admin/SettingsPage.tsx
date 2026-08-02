import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSettings } from '@/features/settings/hooks/useSettings'
import {
  Save,
  Mail,
  Phone,
  Globe,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react'

// Self-contained Instagram SVG Icon to avoid package import issues
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export function SettingsPage() {
  const { settings, isLoading, isError, updateSettings, isSaving } =
    useSettings()

  const [savedSuccess, setSavedSuccess] = useState(false)

  const [formData, setFormData] = useState({
    siteName: '',
    tagline: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    theme: 'light',
    twitter: '',
    instagram: '',
    linkedin: '',
    github: '',
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings?.siteName ?? '',
        tagline: settings?.tagline ?? '',
        description: settings?.description ?? '',
        contactEmail: settings?.contactEmail ?? '',
        contactPhone: settings?.contactPhone ?? '',
        theme: settings?.theme ?? 'light',
        twitter: settings?.socialLinks?.twitter ?? '',
        instagram: settings?.socialLinks?.instagram ?? '',
        linkedin: settings?.socialLinks?.linkedin ?? '',
        github: settings?.socialLinks?.github ?? '',
      })
    }
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateSettings({
        siteName: formData.siteName,
        tagline: formData.tagline,
        description: formData.description,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        theme: 'light',
        socialLinks: {
          twitter: formData.twitter,
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          github: formData.github,
        },
      })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch {
      // Error handling is managed by hook/toast
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton height={32} width={200} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton height={320} className="rounded-xl shadow-xs" />
          <Skeleton height={320} className="rounded-xl shadow-xs" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Settings
        </h1>
        <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Failed to load settings from server. Please refresh or try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Configure your portfolio branding and public contact details
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg">
            <Check className="w-4 h-4" />
            <span>Settings updated successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Brand & Contact */}
          <div className="space-y-6">
            {/* Brand Identity Card */}
            <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900">
                Brand Identity
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="siteName"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    Site Name
                  </label>
                  <input
                    id="siteName"
                    type="text"
                    placeholder="Visuals by Pritam"
                    value={formData.siteName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        siteName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tagline"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    Tagline
                  </label>
                  <input
                    id="tagline"
                    type="text"
                    placeholder="A premium creative portfolio"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tagline: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Brief studio description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900">
                Contact Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    Contact Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="contactEmail"
                      type="email"
                      placeholder="hello@visualsbypritam.com"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactEmail: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    Contact Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactPhone: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Social Links & Theme */}
          <div className="space-y-6">
            {/* Social Links Card */}
            <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900">
                Social Profiles
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="twitter"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    X / Twitter URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      id="twitter"
                      type="url"
                      placeholder="https://x.com/yourhandle"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          twitter: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="instagram"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    Instagram URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="instagram"
                      type="url"
                      placeholder="https://instagram.com/yourhandle"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          instagram: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    LinkedIn URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          linkedin: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="github"
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                  >
                    GitHub URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      id="github"
                      type="url"
                      placeholder="https://github.com/yourusername"
                      value={formData.github}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          github: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Card */}
            {/* <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900">
                Appearance
              </h2>

              <div>
                <label
                  htmlFor="theme"
                  className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2"
                >
                  Site Theme
                </label>
                <select
                  id="theme"
                  value={formData.theme}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      theme: e.target.value,
                    }))
                  }
                  className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all cursor-pointer"
                >
                  <option value="light">Light Mode (Default)</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">System Preference</option>
                </select>
              </div>
            </div> */}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}