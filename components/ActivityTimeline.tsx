'use client'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Github, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeader } from './FeaturedGrid'
import { LiveDot, MonoTag } from './ui/badges'
import {
  awardMeta, DOMAIN_CODES, DOMAIN_LABELS, DOMAIN_ORDER, DomainTag, formatPeriod, PortfolioItem, STATUS_LABELS,
} from '@/types/portfolio'

type Filter = 'ALL' | DomainTag

export default function ActivityTimeline({ items, onSelect }: { items: PortfolioItem[]; onSelect: (i: PortfolioItem) => void }) {
  const [filter, setFilter] = useState<Filter>('ALL')

  // 0건 도메인은 칩 자체를 숨김
  const chips = useMemo(() => {
    const counts = DOMAIN_ORDER.map(d => ({ key: d as Filter, label: DOMAIN_LABELS[d], count: items.filter(i => i.domain_tag === d).length }))
    return [{ key: 'ALL' as Filter, label: '전체', count: items.length }, ...counts.filter(c => c.count > 0)]
  }, [items])

  const visible = filter === 'ALL' ? items : items.filter(i => i.domain_tag === filter)

  if (items.length === 0) return null

  return (
    <section id="archive" className="border-t border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeader code="02 / ARCHIVE" title="전체 활동 아카이브" sub="수상 이력은 각 대회 안에 통합했습니다. 진행 중인 항목은 결과가 나오는 대로 갱신됩니다." />

        <div role="tablist" aria-label="도메인 필터" className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          {chips.map(c => (
            <button
              key={c.key}
              role="tab"
              aria-selected={filter === c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                'inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border px-4 text-sm transition-colors',
                filter === c.key
                  ? 'border-zinc-200 bg-zinc-100 font-semibold text-zinc-950'
                  : 'border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
              )}
            >
              {c.label}
              <span className={cn('font-mono text-xs', filter === c.key ? 'text-zinc-500' : 'text-zinc-600')}>{c.count}</span>
            </button>
          ))}
        </div>

        <ol className="mt-6 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map(item => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-zinc-800/80 last:border-b-0"
              >
                <Row item={item} onSelect={onSelect} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </section>
  )
}

function Row({ item, onSelect }: { item: PortfolioItem; onSelect: (i: PortfolioItem) => void }) {
  const award = item.is_awarded ? awardMeta(item.award_rank) : null
  const live = item.status === 'IN_PROGRESS'

  return (
    <div className="group relative grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-4 transition-colors hover:bg-zinc-900 sm:grid-cols-[168px_1fr_auto] sm:items-center sm:px-5">
      <span className="font-mono text-xs text-zinc-500">{formatPeriod(item.start_date, item.end_date)}</span>

      <div className="min-w-0">
        <button onClick={() => onSelect(item)} className="text-left after:absolute after:inset-0 focus-visible:outline-none">
          <span className="text-[15px] font-semibold leading-snug text-zinc-100 group-hover:text-white">{item.title}</span>
        </button>
        <p className="mt-1 truncate text-sm text-zinc-500">
          {item.organizer} <span className="text-zinc-700">·</span> {item.scope_type}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {award && (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-xs font-semibold text-amber-200">
            <Trophy className="h-3 w-3" aria-hidden /> {item.award_rank}
          </span>
        )}
        {live ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
            <LiveDot /> {STATUS_LABELS.IN_PROGRESS}
          </span>
        ) : (
          !award && <span className="text-xs text-zinc-500">{STATUS_LABELS[item.status]}</span>
        )}
        {item.github_url && (
          <a
            href={item.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-[1] inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-[11px] text-zinc-300 hover:border-zinc-500 hover:text-white"
          >
            <Github className="h-3 w-3" aria-hidden /> CODE <ArrowUpRight className="h-3 w-3" aria-hidden />
          </a>
        )}
        <MonoTag className="hidden lg:inline-flex">{DOMAIN_CODES[item.domain_tag]}</MonoTag>
      </div>
    </div>
  )
}
