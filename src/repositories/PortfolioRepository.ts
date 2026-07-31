import {
  getPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '@/integrations/supabase/portfolio'
import type { PortfolioItemInput } from '@/types/portfolio'

export class PortfolioRepository {
  async getAll() {
    return getPortfolioItems()
  }

  async getById(id: string) {
    return getPortfolioItemById(id)
  }

  async create(input: PortfolioItemInput) {
    return createPortfolioItem(input)
  }

  async update(id: string, input: Partial<PortfolioItemInput>) {
    return updatePortfolioItem(id, input)
  }

  async delete(id: string) {
    return deletePortfolioItem(id)
  }
}

export const portfolioRepository = new PortfolioRepository()