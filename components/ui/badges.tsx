import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { awardMeta, Status, STATUS_LABELS } from '@/types/portfolio'

const TIER_STYLE = {
  gold: 'border-amber-300/40 bg-gradient-to-r from-amber-300/20 via-yellow-200/10 to-amber-500/20 text-amber-200',
  silver: 'border-zinc-300/30 bg-zinc-300/10 text-zinc-200',
  bronze: 'border-orange-400/30 bg-orange-400/10 text-orange-200',
}

export function AwardBadge({ rank, className }: { rank: string | null; className?: string }) {
  const meta = awardMeta(rank)
  if (!meta) return null
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] font-semibold tracking-wider', TIER_STYLE[meta.tier], className)}>
      <Trophy className="h-3 w-3" aria-hidden />
      {meta.code}
      <span className="font-sans font-medium tracking-normal opacity-80">· {rank}</span>
    </span>
  )
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative inline-flex h-2 w-2', className)} aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
    </span>
  )
}

export function StatusBadge({ status }: { status: Status }) {
  if (status === 'IN_PROGRESS') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 font-mono text-[11px] font-semibold tracking-wider text-emerald-300">
        <LiveDot />
        LIVE
        <span className="font-sans font-medium tracking-normal opacity-80">· {STATUS_LABELS[status]}</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-700/80 bg-zinc-800/60 px-2 py-1 text-[11px] font-medium text-zinc-400">
      {STATUS_LABELS[status]}
    </span>
  )
}

export function MonoTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[11px] tracking-wide text-zinc-400', className)}>
      {children}
    </span>
  )
}
