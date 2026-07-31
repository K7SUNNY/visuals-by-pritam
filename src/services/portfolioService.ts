import { portfolioRepository } from '@/repositories'
import type { PortfolioItemInput } from '@/types/portfolio'

export async function getPortfolioItems() {
  return portfolioRepository.getAll()
}

export async function getPortfolioItemById(id: string) {
  return portfolioRepository.getById(id)
}

export async function createPortfolioItem(input: PortfolioItemInput) {
  return portfolioRepository.create(input)
}

export async function updatePortfolioItem(
  id: string,
  input: Partial<PortfolioItemInput>
) {
  return portfolioRepository.update(id, input)
}

export async function deletePortfolioItem(id: string) {
  return portfolioRepository.delete(id)
}