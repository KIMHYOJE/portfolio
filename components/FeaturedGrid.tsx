'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import DomainVisual from './DomainVisual'
import { AwardBadge, LiveDot, StatusBadge } from './ui/badges'
import { awardMeta, formatDate, formatPeriod, PortfolioItem } from '@/types/portfolio'

// 셀 크기 = 성과의 중요도 (featured_rank 순서). 4열 기준 3행이 빈칸 없이 채워지도록 배치.
const SPANS = [
  'row-span-2 md:col-span-2 md:row-span-2',
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-2',
]

const SPOT = {
  gold: 'rgb(252 211 77 / 0.7)',
  silver: 'rgb(228 228 231 / 0.5)',
  bronze: 'rgb(251 146 60 / 0.55)',
}

function track(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

function dday(end: string | null) {
  if (!end) return null
  const diff = Math.ceil((new Date(`${end}T23:59:59+09:00`).getTime() - Date.now()) / 86_400_000)
  if (diff < 0) return null
  return diff === 0 ? 'D-DAY' : `D-${diff}`
}

export default function FeaturedGrid({ items, live, onSelect }: {
  items: PortfolioItem[]
  live: PortfolioItem[]
  onSelect: (item: PortfolioItem) => void
}) {
  if (items.length === 0) return null

  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-20 sm:px-6">
      <SectionHeader code="01 / FEATURED" title="대표 프로젝트" sub="카드 크기는 성과의 무게입니다. 눌러서 STAR 케이스 스터디를 확인하세요." />

      <div className="mt-10 grid grid-flow-row-dense auto-rows-[190px] grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 5).map((item, i) => (
          <BentoCard key={item.id} item={item} index={i} onSelect={onSelect} />
        ))}
        {live.length > 0 && <LiveCard items={live} onSelect={onSelect} />}
      </div>
    </section>
  )
}

function BentoCard({ item, index, onSelect }: { item: PortfolioItem; index: number; onSelect: (i: PortfolioItem) => void }) {
  const hero = index === 0
  const tier = awardMeta(item.is_awarded ? item.award_rank : null)?.tier

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={track}
      onClick={() => onSelect(item)}
      style={{ '--spot': SPOT[tier ?? 'silver'] } as React.CSSProperties}
      className={cn(
        'spotlight group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-5 text-left transition-colors hover:border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60',
        SPANS[index],
      )}
    >
      {item.thumbnail_url ? (
        <>
          <Image
            src={item.thumbnail_url}
            alt=""
            fill
            sizes={hero ? '(min-width: 1024px) 560px, 100vw' : '(min-width: 1024px) 280px, 100vw'}
            className="object-cover opacity-60 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-75"
            priority={hero}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/10" aria-hidden />
        </>
      ) : (
        <DomainVisual domain={item.domain_tag} large={hero} />
      )}

      <div className="relative z-[1] flex flex-wrap items-start gap-2">
        {item.is_awarded ? <AwardBadge rank={item.award_rank} /> : <StatusBadge status={item.status} />}
      </div>

      <div className="relative z-[1]">
        <h3 className={cn('line-clamp-2 text-balance font-bold leading-snug text-white', hero ? 'text-2xl sm:text-3xl' : 'text-base')}>
          {item.title}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="truncate text-xs text-zinc-400">
            <span className="font-mono text-zinc-300">{hero ? formatPeriod(item.start_date, item.end_date) : formatDate(item.start_date)}</span>
            <span className="mx-1.5 text-zinc-600">/</span>
            {item.organizer}
          </p>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" aria-hidden />
        </div>
      </div>
    </motion.button>
  )
}

function LiveCard({ items, onSelect }: { items: PortfolioItem[]; onSelect: (i: PortfolioItem) => void }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 md:col-span-2">
      <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-emerald-300">
        <LiveDot /> NOW RUNNING · {String(items.length).padStart(2, '0')}
      </p>
      <ul className="mt-3 flex flex-1 flex-col justify-between">
        {items.slice(0, 4).map(item => (
          <li key={item.id}>
            <button onClick={() => onSelect(item)} className="flex w-full items-center justify-between gap-3 rounded-md py-1 text-left text-sm text-zinc-300 hover:text-white">
              <span className="truncate">{item.title}</span>
              <span className="shrink-0 font-mono text-xs text-emerald-300/80" suppressHydrationWarning>
                {dday(item.end_date ?? item.start_date) ?? formatDate(item.start_date)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SectionHeader({ code, title, sub }: { code: string; title: string; sub?: string }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-[0.18em] text-amber-300/80">{code}</p>
      <h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">{sub}</p>}
    </div>
  )
}
