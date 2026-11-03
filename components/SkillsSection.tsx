const SKILLS = [
  {
    category: 'AI · 머신러닝',
    icon: '🧠',
    items: ['Python', 'LLM / Prompt Engineering', 'AI 파이프라인', 'pgvector'],
    evidence: 'AI_TOP_100 (카카오) · Upstage 연합 AI 대회 · 로컬 AI 메이커스랩',
  },
  {
    category: '로봇 · 임베디드',
    icon: '🤖',
    items: ['ROS (Robot OS)', 'Physical AI', 'Sensor Integration'],
    evidence: 'UOU 로봇OS 특강+ 피지컬AI 챌린지 3등',
  },
  {
    category: '게임 · 콘텐츠',
    icon: '🎮',
    items: ['Game Logic Design', '시연 / 프로토타이핑', 'Digital Content'],
    evidence: '울산 게임 콘텐츠 개발 해커톤 대상 · 디지털 콘텐츠 창작 공모전 우수상',
  },
  {
    category: '보안 · 알고리즘',
    icon: '🔐',
    items: ['Web / Network Security', 'C++ / Python 알고리즘', 'CTF 스타일 문제 해결'],
    evidence: '국가정보원 사이버공격방어대회(CCE) 참가 · 프로그래밍 경진대회 1·2학기',
  },
  {
    category: '데이터베이스',
    icon: '🗄️',
    items: ['PostgreSQL / Supabase', 'RLS 보안 설계', 'SQL'],
    evidence: 'SQLD 자격증 준비 중 (2026.11) · 포트폴리오 DB 설계',
  },
  {
    category: '웹 · 풀스택',
    icon: '🌐',
    items: ['Next.js (App Router)', 'TypeScript', 'Tailwind CSS', 'Vercel 배포'],
    evidence: '이 포트폴리오 웹사이트 직접 구축',
  },
]

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-4 bg-gray-950">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <span className="text-purple-400 text-sm font-semibold tracking-widest uppercase">Skills & Certs</span>
          <h2 className="text-3xl font-bold text-white mt-2">기술 스택 · 자격증</h2>
          <p className="text-gray-500 text-sm mt-2">모든 스킬 항목에는 실제 대회·프로젝트 근거를 연결했습니다.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SKILLS.map(skill => (
            <div key={skill.category} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{skill.icon}</span>
                <h3 className="font-bold text-white">{skill.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {skill.items.map(s => (
                  <span key={s} className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-lg border border-gray-700">
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{skill.evidence}</p>
            </div>
          ))}
        </div>

        {/* SQLD badge */}
        <div className="mt-6 flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
          <span className="text-2xl">📜</span>
          <div>
            <div className="text-sm font-bold text-yellow-400">SQLD (SQL 개발자)</div>
            <div className="text-xs text-gray-500 mt-0.5">한국데이터산업진흥원 · 2026.11.14 시험 예정 · 준비 중</div>
          </div>
        </div>
      </div>
    </section>
  )
}
