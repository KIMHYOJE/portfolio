import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-guard'
import NotAdmin from '../../NotAdmin'
import ItemEditor from './ItemEditor'

export const dynamic = 'force-dynamic'

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const { data: item } = await supabase
    .from('portfolio_items')
    .select('*, item_attachments(*)')
    .eq('id', id)
    .single()
  if (!item) notFound()

  return <ItemEditor initial={item} />
}
