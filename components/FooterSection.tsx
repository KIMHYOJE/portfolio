import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function FooterSection() {
  return (
    <footer className="border-t border-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-bold text-white">KIMHYOJE</p>
          <p className="mt-1 text-sm text-zinc-500">
            울산대학교 ICT융합학부 · <span className="font-mono">hyoje.log@gmail.com</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com/KIMHYOJE" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center px-3 text-sm text-zinc-500 hover:text-white">
            GitHub
          </a>
          <Link href="/admin" className="inline-flex min-h-[44px] items-center gap-1.5 px-3 font-mono text-xs text-zinc-700 hover:text-zinc-400">
            <Lock className="h-3 w-3" aria-hidden /> Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
