import { ArrowDown, Github, Mail } from 'lucide-react'
import { LiveDot } from './ui/badges'

interface Metrics { total: number; awards: number; live: number; domains: number }

export default function HeroSection({ metrics }: { metrics: Metrics }) {
  const cards = [
    { label: '총 수행 활동', value: metrics.total, unit: '건', code: 'TOTAL' },
    { label: '공모전·해커톤 수상', value: metrics.awards, unit: '관왕', code: 'AWARDS' },
    { label: '진행 중인 챌린지', value: metrics.live, unit: '건', code: 'LIVE', live: true },
    { label: '보유 기술 도메인', value: metrics.domains, unit: '개 분야', code: 'DOMAINS' },
  ]

  return (
    <section className="relative overflow-hidden border-b border-zinc-900">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] max-w-[100vw] -translate-x-1/2 rounded-full bg-amber-500/[0.07] blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pt-32">
        <p className="font-mono text-xs tracking-[0.18em] text-zinc-500">
          <span className="text-amber-300/90">~/kimhyoje</span> $ whoami
        </p>
        <h1 className="mt-5 max-w-4xl text-balance text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
          피지컬 AI와 로봇 제어부터 웹·보안까지,{' '}
          <br className="hidden md:block" />
          <span className="text-zinc-500">문제를 코드로 해결하는 엔지니어</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          울산대학교 ICT융합학부 2026학번 <strong className="font-semibold text-zinc-200">KIMHYOJE</strong>.
          입학 첫해에만 해커톤 대상을 포함해 {metrics.total}개의 대회·활동에 직접 부딪혀 왔습니다.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#work" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
            대표 프로젝트 보기 <ArrowDown className="h-4 w-4" />
          </a>
          <a href="https://github.com/KIMHYOJE" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 text-sm font-semibold text-zinc-200 hover:border-zinc-600">
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a href="mailto:hyoje.log@gmail.com" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 font-mono text-sm text-zinc-300 hover:border-zinc-600">
            <Mail className="h-4 w-4" /> hyoje.log@gmail.com
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {cards.map(c => (
            <div key={c.code} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-5">
              <dt className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-zinc-500">
                {c.live && <LiveDot />}
                {c.code}
              </dt>
              <dd className="mt-4 flex items-baseline gap-1.5">
                <span className={`font-mono text-4xl font-semibold tabular-nums ${c.live ? 'text-emerald-300' : 'text-white'}`}>
                  {String(c.value).padStart(2, '0')}
                </span>
                <span className="text-sm text-zinc-500">{c.unit}</span>
              </dd>
              <p className="mt-1 text-sm text-zinc-400">{c.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
