import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WavyBackground } from '@/components/common/WavyBackground'

export function PublicLayout() {
  return (
    <div className="relative min-h-screen flex flex-col text-gray-900 antialiased overflow-x-hidden bg-white">
      {/* Background SVG / Canvas mesh */}
      <WavyBackground />

      <Header />

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* 
        Fix: Elevate Footer to z-10 and set explicit bg-white 
        to block the background blur from bleeding into it
      */}
      <div className="relative z-10 bg-white">
        <Footer />
      </div>
    </div>
  )
}