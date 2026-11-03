'use client'
import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { Drawer } from 'vaul'
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/use-media-query'
import DomainVisual from './DomainVisual'
import { AwardBadge, MonoTag, StatusBadge } from './ui/badges'
import {
  CATEGORY_LABELS, DOMAIN_LABELS, formatPeriod, hostOf, PortfolioItem, publicImages,
} from '@/types/portfolio'

const STAR_TABS = [
  { key: 'problem_text', label: 'S·T 상황·과제', hint: '대회 배경 · 제약 조건 · 맡은 역할' },
  { key: 'action_text', label: 'A 해결 과정', hint: '원인 분석 → 시도한 방법 · 대안 비교 → 기술 선택 근거' },
  { key: 'result_text', label: 'R 결과·배운 점', hint: '정량적 성과 · 수상 결과 · 배운 점' },
] as const

export default function ItemDetail({ item, onClose }: { item: PortfolioItem | null; onClose: () => void }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const open = item !== null
  const onOpenChange = (o: boolean) => { if (!o) onClose() }

  if (isDesktop) {
    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-1/2 z-50 grid max-h-[86vh] w-[min(800px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 grid-cols-[1fr_1.15fr] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 focus:outline-none"
          >
            {item && (
              <>
                <Gallery key={item.id} item={item} className="min-h-[480px]" />
                <div className="overflow-y-auto p-6">
                  <Body key={item.id} item={item} Title={Dialog.Title} />
                </div>
                <Dialog.Close className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white" aria-label="닫기">
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Drawer.Content aria-describedby={undefined} className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] flex-col rounded-t-2xl border-t border-zinc-800 bg-zinc-950 focus:outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-zinc-700" aria-hidden />
          {item && (
            <div className="overflow-y-auto pb-[max(24px,env(safe-area-inset-bottom))]">
              <Gallery key={item.id} item={item} className="mx-4 mt-4 aspect-[16/10] rounded-xl" />
              <div className="px-4 pt-5">
                <Body key={item.id} item={item} Title={Drawer.Title} />
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function Gallery({ item, className }: { item: PortfolioItem; className?: string }) {
  const urls = [item.thumbnail_url, ...publicImages(item).map(a => a.file_url)].filter(
    (u, i, arr): u is string => !!u && arr.indexOf(u) === i,
  )
  const [idx, setIdx] = useState(0)
  const current = urls[idx]

  return (
    <div className={cn('relative overflow-hidden bg-zinc-900', className)}>
      {current ? (
        <Image src={current} alt={`${item.title} 사진 ${idx + 1}`} fill sizes="(min-width: 768px) 380px, 100vw" className="object-cover" />
      ) : (
        <DomainVisual domain={item.domain_tag} large />
      )}
      {urls.length > 1 && (
        <>
          <button onClick={() => setIdx((idx - 1 + urls.length) % urls.length)} className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70" aria-label="이전 사진">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => setIdx((idx + 1) % urls.length)} className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70" aria-label="다음 사진">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[11px] text-white/80 backdrop-blur">
            {String(idx + 1).padStart(2, '0')} / {String(urls.length).padStart(2, '0')}
          </div>
        </>
      )}
      {!current && (
        <p className="absolute inset-x-0 bottom-4 text-center font-mono text-[11px] tracking-wider text-zinc-500">NO MEDIA YET</p>
      )}
    </div>
  )
}

type TitleComponent = React.ComponentType<{ asChild?: boolean; children: React.ReactNode }>

function Body({ item, Title }: { item: PortfolioItem; Title: TitleComponent }) {
  const [tab, setTab] = useState(0)
  const active = STAR_TABS[tab]
  const text = item[active.key]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2 pr-10">
        {item.is_awarded && <AwardBadge rank={item.award_rank} />}
        <StatusBadge status={item.status} />
      </div>

      <div>
        <Title asChild>
          <h2 className="text-balance text-xl font-bold leading-snug text-white">{item.title}</h2>
        </Title>
        <dl className="mt-3 grid grid-cols-[72px_1fr] gap-x-3 gap-y-1.5 text-sm">
          <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 leading-5">Period</dt>
          <dd className="font-mono text-zinc-300">{formatPeriod(item.start_date, item.end_date)}</dd>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 leading-5">Host</dt>
          <dd className="text-zinc-300">{item.organizer} <span className="text-zinc-500">· {item.scope_type}</span></dd>
          <dt className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 leading-5">Type</dt>
          <dd className="text-zinc-300">{CATEGORY_LABELS[item.category]} <span className="text-zinc-500">· {DOMAIN_LABELS[item.domain_tag]}</span></dd>
        </dl>
      </div>

      <div>
        <div role="tablist" className="flex gap-1 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/70 p-1 no-scrollbar">
          {STAR_TABS.map((t, i) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={cn(
                'min-h-[40px] shrink-0 flex-1 whitespace-nowrap rounded-lg px-3 font-mono text-xs transition-colors',
                tab === i ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="mt-4 min-h-[140px]">
          {text ? (
            <p className="whitespace-pre-line text-[15px] leading-7 text-zinc-300">{text}</p>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-800 p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-600">// 작성 예정</p>
              <p className="mt-1.5 text-sm text-zinc-500">{active.hint}</p>
            </div>
          )}
        </div>
      </div>

      {item.tech_stack && item.tech_stack.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {item.tech_stack.map(t => <li key={t}><MonoTag>{t}</MonoTag></li>)}
        </ul>
      )}

      {(item.demo_url || item.github_url) && (
        <div className="flex flex-wrap gap-2">
          {item.demo_url && (
            <a href={item.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
              {hostOf(item.demo_url)} <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {item.github_url && (
            <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:text-white">
              <Github className="h-4 w-4" /> GitHub 저장소 <ArrowUpRight className="h-4 w-4 text-zinc-500" />
            </a>
          )}
        </div>
      )}
      <MonoTag className="self-start">id: {item.id.slice(0, 8)}</MonoTag>
    </div>
  )
}
