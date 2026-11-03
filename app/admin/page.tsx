import { requireAdmin } from '@/lib/admin-guard'
import AdminDashboard from './AdminDashboard'
import NotAdmin from './NotAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!isAdmin) return <NotAdmin email={user.email} />

  const { data: items } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('start_date', { ascending: false })

  return <AdminDashboard initialItems={items ?? []} />
}
