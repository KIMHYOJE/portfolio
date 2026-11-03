import { Bot, Brain, Gamepad2, ShieldCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DOMAIN_CODES, DomainTag } from '@/types/portfolio'

const VISUAL: Record<DomainTag, { icon: typeof Brain; tint: string }> = {
  AI_DATA: { icon: Brain, tint: 'from-sky-500/25 via-indigo-500/10' },
  GAME_CONTENT: { icon: Gamepad2, tint: 'from-amber-400/25 via-rose-500/10' },
  ALGO_SEC: { icon: ShieldCheck, tint: 'from-emerald-400/20 via-teal-500/10' },
  ROBOT_IOT: { icon: Bot, tint: 'from-violet-500/25 via-fuchsia-500/10' },
  OTHER: { icon: Sparkles, tint: 'from-zinc-500/20 via-zinc-600/10' },
}

// 사진이 아직 없을 때 쓰는 도메인별 대체 비주얼
export default function DomainVisual({ domain, className, large }: { domain: DomainTag; className?: string; large?: boolean }) {
  const { icon: Icon, tint } = VISUAL[domain] ?? VISUAL.OTHER
  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-gradient-to-br to-transparent', tint, className)} aria-hidden>
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
      <Icon
        className={cn('absolute text-white/[0.07]', large ? '-right-6 -top-6 h-64 w-64' : '-right-4 -top-4 h-32 w-32')}
        strokeWidth={1}
      />
      <span className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-white/25">{DOMAIN_CODES[domain]}</span>
    </div>
  )
}
