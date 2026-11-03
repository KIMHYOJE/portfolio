'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, ChevronRight, Eye, EyeOff, Loader2, LogOut, Plus, Star, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase-browser'
import { revalidateHome } from './actions'
import { formatDate, PortfolioItem, Status, STATUS_LABELS, STATUS_OPTIONS } from '@/types/portfolio'

export default function AdminDashboard({ initialItems }: { initialItems: PortfolioItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [saving, setSaving] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function patch(id: string, values: Partial<PortfolioItem>, msg: string) {
    setSaving(id)
    const { error } = await supabase.from('portfolio_items').update(values).eq('id', id)
    setSaving(null)
    if (error) return toast.error(`저장 실패: ${error.message}`)
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...values } : i)))
    toast.success(msg)
    revalidateHome()
  }

  async function createItem() {
    setCreating(true)
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({ title: '새 활동', organizer: '주최 기관', start_date: new Date().toISOString().slice(0, 10), status: 'IN_PROGRESS', is_published: false })
      .select('id')
      .single()
    setCreating(false)
    if (error) return toast.error(`생성 실패: ${error.message}`)
    router.push(`/admin/items/${data.id}`)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> 사이트
          </Link>
          <p className="font-mono text-xs tracking-[0.16em] text-zinc-500">ADMIN · {items.length} ITEMS</p>
          <button onClick={logout} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-zinc-500 hover:text-red-300">
            <LogOut className="h-4 w-4" /> 로그아웃
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">이력 관리</h1>
            <p className="mt-1 text-sm text-zinc-500">상태는 선택 즉시 저장됩니다. 사진·STAR 내용은 항목을 눌러 편집하세요.</p>
          </div>
          <button onClick={createItem} disabled={creating} className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-50">
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} 추가
          </button>
        </div>

        <ul className="mt-6 flex flex-col gap-3">
          {items.map(item => (
            <li key={item.id} className={cn('rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4', !item.is_published && 'opacity-60')}>
              <Link href={`/admin/items/${item.id}`} className="group flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-zinc-500">
                    <span>{formatDate(item.start_date)}</span>
                    {item.is_featured && <span className="text-amber-300">★ FEATURED{item.featured_rank ? ` #${item.featured_rank}` : ''}</span>}
                    {item.is_awarded && <span className="inline-flex items-center gap-1 text-amber-200"><Trophy className="h-3 w-3" />{item.award_rank}</span>}
                    {!item.is_published && <span className="text-zinc-400">HIDDEN</span>}
                  </div>
                  <p className="mt-1 font-semibold leading-snug text-white group-hover:underline">{item.title}</p>
                  <p className="mt-0.5 truncate text-sm text-zinc-500">{item.organizer}</p>
                </div>
                <ChevronRight className="mt-5 h-5 w-5 shrink-0 text-zinc-600 group-hover:text-white" />
              </Link>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={item.status}
                  onChange={e => patch(item.id, { status: e.target.value as Status }, `상태 → ${STATUS_LABELS[e.target.value as Status]}`)}
                  disabled={saving === item.id}
                  aria-label="진행 상태"
                  className="min-h-[44px] flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 text-base text-zinc-200 focus:border-amber-300/60 focus:outline-none sm:flex-none"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
                <button
                  onClick={() => patch(item.id, { is_featured: !item.is_featured }, item.is_featured ? '대표작 해제' : '대표작 지정')}
                  disabled={saving === item.id}
                  aria-pressed={item.is_featured}
                  className={cn('inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border', item.is_featured ? 'border-amber-300/40 bg-amber-300/10 text-amber-300' : 'border-zinc-700 bg-zinc-800 text-zinc-500')}
                  aria-label="대표작"
                >
                  <Star className={cn('h-4 w-4', item.is_featured && 'fill-current')} />
                </button>
                <button
                  onClick={() => patch(item.id, { is_published: !item.is_published }, item.is_published ? '비공개로 전환' : '공개로 전환')}
                  disabled={saving === item.id}
                  aria-pressed={item.is_published}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400"
                  aria-label="공개 여부"
                >
                  {item.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                {saving === item.id && <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
