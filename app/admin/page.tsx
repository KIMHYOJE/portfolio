import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: items } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('start_date', { ascending: false })

  return <AdminDashboard initialItems={items ?? []} />
}
