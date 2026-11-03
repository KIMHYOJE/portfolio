export default function HeroSection({ awardCount, totalCount }: { awardCount: number; totalCount: number }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 pt-24 pb-20 px-4">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 pulse-dot" />
          <span className="text-indigo-300 text-sm font-medium">울산대학교 ICT융합학부</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
          <span className="text-white">피지컬 AI부터</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            웹 서비스까지
          </span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl text-balance">
          문제를 코드로 해결하는 개발자 <strong className="text-gray-200">KIMHYOJE</strong>의 포트폴리오입니다.
          ROS, 게임 개발, 보안, 알고리즘 등 다양한 도메인에서 성장 중입니다.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 mb-16">
          <a
            href="https://github.com/KIMHYOJE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a
            href="mailto:hyoje.log@gmail.com"
            className="flex items-center gap-2 border border-gray-700 text-gray-300 px-5 py-2.5 rounded-lg font-semibold text-sm hover:border-gray-500 hover:text-white transition-colors"
          >
            ✉ 이메일 문의
          </a>
        </div>

        {/* Metrics bar */}
        <div className="grid grid-cols-3 gap-px bg-gray-800 rounded-2xl overflow-hidden">
          {[
            { value: `${totalCount}+`, label: '총 프로젝트·대회' },
            { value: `${awardCount}회`, label: '수상 실적' },
            { value: '2026', label: '학번 (신입생)' },
          ].map((m) => (
            <div key={m.label} className="bg-gray-900 px-4 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-400 tabular-nums">{m.value}</div>
              <div className="text-xs text-gray-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
