'use client'
import { useState } from 'react'
import { PortfolioItem, DomainTag, DOMAIN_LABELS, STATUS_LABELS } from '@/types/portfolio'

const FILTERS: { key: 'ALL' | DomainTag; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'AI_DATA', label: 'AI·데이터' },
  { key: 'GAME_CONTENT', label: '게임·콘텐츠' },
  { key: 'ALGO_SEC', label: '알고리즘·보안' },
  { key: 'ROBOT_IOT', label: '로봇·IoT' },
]

const STATUS_COLORS = {
  IN_PROGRESS: 'bg-green-500',
  COMPLETED: 'bg-blue-500',
  ANNOUNCED: 'bg-gray-500',
}

export default function ActivityTimeline({ items }: { items: PortfolioItem[] }) {
  const [filter, setFilter] = useState<'ALL' | DomainTag>('ALL')

  const filtered = filter === 'ALL' ? items : items.filter(i => i.domain_tag === filter)

  return (
    <section id="activities" className="py-20 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">All Activities</span>
          <h2 className="text-3xl font-bold text-white mt-2">전체 활동 아카이브</h2>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {f.label} {filter === f.key && f.key !== 'ALL' && `(${filtered.length})`}
            </button>
          ))}
        </div>

        {/* Timeline list */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="text-gray-600 text-center py-10">항목이 없습니다.</p>
          )}
          {filtered.map(item => (
            <div key={item.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Status dot */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_COLORS[item.status]} ${item.status === 'IN_PROGRESS' ? 'pulse-dot' : ''}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs text-gray-600 font-mono">
                    {item.start_date.slice(0, 7)}{item.end_date ? ` ~ ${item.end_date.slice(0, 7)}` : ''}
                  </span>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{item.scope_type}</span>
                  <span className="text-xs text-gray-600">{DOMAIN_LABELS[item.domain_tag]}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-200 truncate">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-0.5">{item.organizer}</p>
              </div>

              {/* Right badges */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                {item.is_awarded && item.award_rank && (
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-1 rounded-lg">
                    🏆 {item.award_rank}
                  </span>
                )}
                <span className="text-xs text-gray-500">{STATUS_LABELS[item.status]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
