'use client'
import imageCompression from 'browser-image-compression'
import { createClient } from './supabase-browser'

export const BUCKET = 'public-media'

export async function compressAndUpload(file: File, itemId: string) {
  const webp = await imageCompression(file, {
    maxWidthOrHeight: 1920,
    maxSizeMB: 0.3,
    fileType: 'image/webp',
    initialQuality: 0.82,
    useWebWorker: true,
  })
  const path = `items/${itemId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`
  const supabase = createClient()
  const { error } = await supabase.storage.from(BUCKET).upload(path, webp, {
    contentType: 'image/webp',
    cacheControl: '31536000',
  })
  if (error) throw error
  return {
    url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
    name: file.name.replace(/\.[^.]+$/, '') + '.webp',
    sizeKB: Math.round(webp.size / 1024),
  }
}

export function storagePathFromUrl(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const i = url.indexOf(marker)
  return i === -1 ? null : url.slice(i + marker.length)
}
