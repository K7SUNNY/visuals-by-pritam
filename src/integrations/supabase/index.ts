export { supabase } from './client'
export { storage } from './storage'
export { signIn, signOut, getCurrentUser, getSession } from './auth'
export {
  getPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from './portfolio'
export { getSettings, updateSettings } from './settings'
export {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageRead,
  deleteMessage,
} from './messages'