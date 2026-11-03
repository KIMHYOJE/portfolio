export default function FooterSection() {
  return (
    <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-white">KIMHYOJE</div>
          <div className="text-xs text-gray-600 mt-1">울산대학교 ICT융합학부 · hyoje.log@gmail.com</div>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/KIMHYOJE" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors text-sm">
            GitHub
          </a>
          {/* 관리자 숨김 진입점 */}
          <a href="/admin" className="text-gray-800 hover:text-gray-600 transition-colors text-xs select-none">
            🔒
          </a>
        </div>
      </div>
    </footer>
  )
}
