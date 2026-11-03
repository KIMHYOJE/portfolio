import { SectionHeader } from './FeaturedGrid'

const STACK = [
  'Python', 'C++', 'ROS', 'Physical AI', 'LLM', 'Prompt Engineering', 'Next.js', 'TypeScript',
  'Tailwind CSS', 'PostgreSQL', 'Supabase', 'RLS', 'SQL', 'Web Security', 'Algorithms', 'Vercel',
]

const SKILLS = [
  { code: 'AI/ML', title: 'AI · 머신러닝', items: ['Python', 'LLM', 'AI 파이프라인'], evidence: 'AI_TOP_100(카카오) · Upstage 연합 AI 대회 · 로컬 AI 메이커스랩' },
  { code: 'ROBOT', title: '로봇 · 임베디드', items: ['ROS', 'Physical AI', 'Sensor'], evidence: 'UOU 로봇OS 특강+ 피지컬AI 챌린지 3등' },
  { code: 'GAME', title: '게임 · 콘텐츠', items: ['Game Logic', 'Prototyping'], evidence: '울산 게임 콘텐츠 해커톤 대상 · 디지털 콘텐츠 공모전 우수상' },
  { code: 'SEC', title: '보안 · 알고리즘', items: ['Web/Network Sec', 'C++', 'Python'], evidence: '국정원 CCE 참가 · 프로그래밍 경진대회 1·2학기' },
  { code: 'DB', title: '데이터베이스', items: ['PostgreSQL', 'RLS', 'SQL'], evidence: 'SQLD 응시 예정(2026.11.14) · 이 사이트의 DB·보안 설계' },
  { code: 'WEB', title: '웹 · 풀스택', items: ['Next.js', 'TypeScript', 'Vercel'], evidence: '이 포트폴리오 웹사이트 직접 구축' },
]

export default function SkillsSection() {
  return (
    <section id="skills" className="border-t border-zinc-900">
      <div className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <SectionHeader code="03 / STACK" title="기술 스택" sub="모든 항목에 실제 대회·프로젝트 근거를 연결했습니다." />
      </div>

      <div className="group relative mt-10 overflow-hidden border-y border-zinc-900 py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex w-max gap-3">
          {[...STACK, ...STACK].map((s, i) => (
            <span key={i} aria-hidden={i >= STACK.length} className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 font-mono text-sm text-zinc-400">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3.5 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {SKILLS.map(s => (
          <div key={s.code} className="flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">{s.title}</h3>
              <span className="font-mono text-[11px] tracking-[0.16em] text-zinc-600">{s.code}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.items.map(i => (
                <span key={i} className="rounded-md bg-zinc-800/80 px-2 py-0.5 font-mono text-xs text-zinc-300">{i}</span>
              ))}
            </div>
            <p className="mt-4 border-t border-zinc-800/80 pt-3 text-xs leading-5 text-zinc-500">{s.evidence}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
