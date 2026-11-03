import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from './supabase-server'

// RLS가 최종 방어선이고, 이건 화면 진입용 1차 확인. app_metadata는 서버에서만 수정 가능.
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  return { supabase, user, isAdmin: user.app_metadata?.role === 'admin' }
}
