'use client'
import { useState } from 'react'
import { PortfolioItem, AWARD_TIER } from '@/types/portfolio'

const AWARD_COLORS = {
  gold: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400',
  silver: 'bg-gray-400/10 border-gray-400/40 text-gray-300',
  bronze: 'bg-amber-700/10 border-amber-700/40 text-amber-600',
  other: 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400',
}

const DOMAIN_ICONS: Record<string, string> = {
  ROBOT_IOT: '🤖',
  GAME_CONTENT: '🎮',
  AI_DATA: '🧠',
  ALGO_SEC: '🔐',
  OTHER: '⚡',
}

export default function FeaturedGrid({ items }: { items: PortfolioItem[] }) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  if (items.length === 0) return null

  return (
    <section id="projects" className="py-20 px-4 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">Featured Projects</span>
          <h2 className="text-3xl font-bold text-white mt-2">수상 및 대표 프로젝트</h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const tier = item.award_rank ? AWARD_TIER[item.award_rank] ?? 'other' : 'other'
            const isLarge = i === 0
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`text-left group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-gray-900/80 transition-all duration-200 ${isLarge ? 'sm:col-span-2' : ''}`}
              >
                {/* Domain icon */}
                <div className="text-3xl mb-4">{DOMAIN_ICONS[item.domain_tag] ?? '⚡'}</div>

                {/* Award badge */}
                {item.is_awarded && item.award_rank && (
                  <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border mb-3 ${AWARD_COLORS[tier]}`}>
                    🏆 {item.award_rank}
                  </span>
                )}

                <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">{item.organizer}</p>
                <p className="text-xs text-gray-600 mt-1">{item.start_date.slice(0, 7)}</p>

                {/* Hover arrow */}
                <span className="absolute bottom-4 right-4 text-gray-700 group-hover:text-indigo-400 transition-colors text-lg">→</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {selected.is_awarded && selected.award_rank && (
                    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border mb-2 ${AWARD_COLORS[AWARD_TIER[selected.award_rank] ?? 'other']}`}>
                      🏆 {selected.award_rank}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white">{selected.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{selected.organizer} · {selected.scope_type}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-2xl ml-4 flex-shrink-0">×</button>
              </div>
              <div className="text-sm text-gray-400 mb-4">
                📅 {selected.start_date}{selected.end_date ? ` ~ ${selected.end_date}` : ''}
              </div>
              {selected.summary_md ? (
                <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.summary_md}</div>
              ) : (
                <p className="text-sm text-gray-600 italic">상세 내용을 관리자 페이지에서 추가해주세요.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
