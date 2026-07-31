import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'

export function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-medium mb-8"></h1>
      <PortfolioGrid />
    </div>
  )
}