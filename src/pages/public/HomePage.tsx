import { Hero } from '@/components/portfolio/Hero'
import { FeaturedWork } from '@/components/portfolio/FeaturedWork'
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery'
import { About } from '@/components/portfolio/About'
import { Contact } from '@/components/portfolio/Contact'

export function HomePage() {
  return (
    <div className="w-full relative z-10 space-y-16 md:space-y-24 pb-16">
      <Hero />
      <FeaturedWork />
      <PortfolioGallery />
      <About />
      <Contact />
    </div>
  )
}