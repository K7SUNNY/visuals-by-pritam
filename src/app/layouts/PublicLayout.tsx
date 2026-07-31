import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WavyBackground } from '@/components/common/WavyBackground'

export function PublicLayout() {
  return (
    <div className="relative min-h-screen flex flex-col text-gray-900 antialiased overflow-x-hidden bg-white">
      {/* Zoho SVG Wavy Mesh Background */}
      <WavyBackground />

      <Header />

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}