import { Hero } from '@/components/portfolio/Hero'
import { FeaturedWork } from '@/components/portfolio/FeaturedWork'
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery'
import { About } from '@/components/portfolio/About'
import { Contact } from '@/components/portfolio/Contact'

export function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedWork />
      <PortfolioGallery />
      <About />
      <Contact />
    </div>
  )
}