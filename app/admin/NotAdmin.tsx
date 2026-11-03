'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

export default function NotAdmin({ email }: { email?: string }) {
  const router = useRouter()
  async function relogin() {
    await createClient().auth.signOut()
    router.push('/admin/login')
  }
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
        <p className="font-mono text-xs tracking-[0.16em] text-amber-300">403 · ROLE REQUIRED</p>
        <h1 className="mt-3 text-lg font-bold text-white">관리자 역할이 없는 계정입니다</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          <span className="font-mono text-zinc-300">{email}</span> 계정의 JWT에 <code className="font-mono text-zinc-300">app_metadata.role = &quot;admin&quot;</code>이 없습니다.
          Supabase SQL Editor에서 <code className="font-mono text-zinc-300">supabase/migrations/002_rebuild.sql</code>을 실행했다면, 로그아웃 후 다시 로그인하세요.
        </p>
        <button onClick={relogin} className="mt-5 min-h-[44px] w-full rounded-xl bg-white text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
          로그아웃 후 다시 로그인
        </button>
      </div>
    </div>
  )
}
