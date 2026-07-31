import { supabase } from './client'

const BUCKET_NAME = 'portfolio-media'

export const storage = {
  async uploadFile(
    path: string,
    file: File,
    options?: { cacheControl?: string; upsert?: boolean }
  ) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: options?.cacheControl ?? '3600',
        upsert: options?.upsert ?? false,
      })

    if (error) throw error
    return data
  },

  async getPublicUrl(path: string) {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
    return data.publicUrl
  },

  async downloadFile(path: string) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(path)

    if (error) throw error
    return data
  },

  async deleteFile(path: string) {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) throw error
  },

  async listFiles(path: string, options?: { limit?: number; offset?: number }) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(path, {
        limit: options?.limit ?? 100,
        offset: options?.offset ?? 0,
      })

    if (error) throw error
    return data
  },
}