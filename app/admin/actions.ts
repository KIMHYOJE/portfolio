'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-guard'

export async function revalidateHome() {
  const { isAdmin } = await requireAdmin()
  if (isAdmin) revalidatePath('/')
}
