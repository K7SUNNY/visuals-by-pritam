import { useQuery } from '@tanstack/react-query'
import { getPortfolioItems } from '@/services/portfolioService'

export function useDashboard() {
  const portfolioQuery = useQuery({
    queryKey: ['portfolio-items'],
    queryFn: getPortfolioItems,
  })

  return {
    portfolioItems: portfolioQuery.data ?? [],
    isLoading: portfolioQuery.isLoading,
    isError: portfolioQuery.isError,
    error: portfolioQuery.error,
  }
}