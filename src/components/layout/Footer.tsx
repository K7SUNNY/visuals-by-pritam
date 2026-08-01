import { Link } from 'react-router-dom'
import { useSettings } from '@/features/settings/hooks/useSettings'

export function Footer() {
  const { settings, isLoading } = useSettings()

  if (isLoading) {
    return (
      <footer className="relative z-10 border-t border-gray-200 bg-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-60" />
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-32" />
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  const socialLinks = {
    twitter: settings?.socialLinks?.twitter || 'https://x.com',
    instagram: settings?.socialLinks?.instagram || 'https://instagram.com',
    linkedin: settings?.socialLinks?.linkedin || 'https://linkedin.com',
    github: settings?.socialLinks?.github || 'https://github.com',
  }

  const siteName = settings?.siteName || 'Visuals by Pritam'
  const description =
    settings?.description ||
    'A premium creative portfolio showcasing visual work and creative projects.'

  return (
    <footer className="relative z-10 border-t border-gray-200 bg-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-base text-gray-900 mb-2">
              {siteName}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              {description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs mb-3 text-gray-400 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs mb-3 text-gray-400 uppercase tracking-wider">
              Connect
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  X / Twitter
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            &copy; <a href="https://github.com/K7SUNNY/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600 transition-colors">K7SUNNY</a>. All rights reserved.
          </p>
          <p>Built with Passion and Love ❤</p>
        </div>
      </div>
    </footer>
  )
}