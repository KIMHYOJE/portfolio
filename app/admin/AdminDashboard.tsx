'use client'
import { useState } from 'react'
import { PortfolioItem, STATUS_LABELS, Status } from '@/types/portfolio'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS: Status[] = ['IN_PROGRESS', 'COMPLETED', 'ANNOUNCED']

export default function AdminDashboard({ initialItems }: { initialItems: PortfolioItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [saving, setSaving] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function updateStatus(id: string, status: Status) {
    setSaving(id)
    const { error } = await supabase
      .from('portfolio_items')
      .update({ status })
      .eq('id', id)
    if (!error) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
      router.refresh()
    }
    setSaving(null)
  }

  async function toggleFeatured(id: string, current: boolean) {
    setSaving(id)
    const { error } = await supabase
      .from('portfolio_items')
      .update({ is_featured: !current })
      .eq('id', id)
    if (!error) setItems(prev => prev.map(i => i.id === id ? { ...i, is_featured: !current } : i))
    setSaving(null)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">관리자 대시보드</h1>
          <p className="text-xs text-gray-500 mt-0.5">포트폴리오 이력 관리</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← 사이트 보기</a>
          <button onClick={logout} className="text-sm text-red-400 hover:text-red-300 transition-colors">로그아웃</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-300">전체 이력 ({items.length}건)</h2>
        </div>

        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-1">
                  {item.is_featured && (
                    <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded">⭐ 대표</span>
                  )}
                  {item.is_awarded && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded">🏆 {item.award_rank}</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{item.organizer} · {item.start_date}</p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                {/* Status dropdown */}
                <select
                  value={item.status}
                  onChange={e => updateStatus(item.id, e.target.value as Status)}
                  disabled={saving === item.id}
                  className="text-sm bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:border-indigo-500 min-h-[44px] text-base sm:text-sm"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>

                {/* Featured toggle */}
                <button
                  onClick={() => toggleFeatured(item.id, item.is_featured)}
                  disabled={saving === item.id}
                  className={`text-xs px-3 py-2 rounded-lg border transition-colors min-h-[44px] ${
                    item.is_featured
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10'
                      : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {saving === item.id ? '…' : item.is_featured ? '⭐ 대표' : '대표 설정'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
