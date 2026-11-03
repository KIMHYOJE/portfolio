'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import DomainVisual from './DomainVisual'
import { SectionHeader } from './FeaturedGrid'
import { LiveDot } from './ui/badges'
import { formatPeriod, hostOf, PortfolioItem } from '@/types/portfolio'

export default function ProjectsSection({ items, onSelect }: { items: PortfolioItem[]; onSelect: (i: PortfolioItem) => void }) {
  if (items.length === 0) return null

  return (
    <section id="projects" className="border-t border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeader code="02 / BUILD" title="개발 프로젝트" sub="대회 밖에서 직접 만들고 배포해 둔 것들입니다. 링크를 눌러 바로 써볼 수 있어요." />

        <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/70 transition-colors hover:border-zinc-700"
            >
              <button onClick={() => onSelect(item)} className="relative aspect-[16/9] overflow-hidden bg-zinc-900 text-left focus-visible:outline-none" aria-label={`${item.title} 자세히 보기`}>
                {item.thumbnail_url ? (
                  <Image src={item.thumbnail_url} alt="" fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
                ) : (
                  <DomainVisual domain={item.domain_tag} />
                )}
                {item.status === 'IN_PROGRESS' && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-zinc-950/80 px-2 py-1 font-mono text-[11px] text-emerald-300 backdrop-blur">
                    <LiveDot /> ACTIVE
                  </span>
                )}
              </button>

              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-xs text-zinc-500">{formatPeriod(item.start_date, item.end_date)}</p>
                <h3 className="mt-1.5 text-lg font-bold leading-snug text-white">
                  <button onClick={() => onSelect(item)} className="text-left hover:underline">{item.title}</button>
                </h3>
                {item.action_text && <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{item.action_text}</p>}

                {item.tech_stack && item.tech_stack.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {item.tech_stack.map(t => (
                      <li key={t} className="rounded-md bg-zinc-800/80 px-2 py-0.5 font-mono text-xs text-zinc-300">{t}</li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {item.demo_url && (
                    <a href={item.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200">
                      {hostOf(item.demo_url)} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  {item.github_url && (
                    <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-zinc-700 px-3 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white">
                      <Github className="h-4 w-4" /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
