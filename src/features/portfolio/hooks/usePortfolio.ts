import { useQuery } from '@tanstack/react-query'
import { getPortfolioItems, getPortfolioItemById } from '@/services/portfolioService'
import type { PortfolioItem } from '@/types/portfolio'

export function usePortfolio() {
  const itemsQuery = useQuery<PortfolioItem[]>({
    queryKey: ['portfolio-items'],
    queryFn: getPortfolioItems,
  })

  return {
    items: itemsQuery.data ?? [],
    isLoading: itemsQuery.isLoading,
    isError: itemsQuery.isError,
    error: itemsQuery.error,
    refetch: itemsQuery.refetch,
  }
}

export function usePortfolioItem(id: string) {
  const itemQuery = useQuery<PortfolioItem>({
    queryKey: ['portfolio-item', id],
    queryFn: () => getPortfolioItemById(id),
    enabled: !!id,
  })

  return {
    item: itemQuery.data ?? null,
    isLoading: itemQuery.isLoading,
    isError: itemQuery.isError,
    error: itemQuery.error,
  }
}