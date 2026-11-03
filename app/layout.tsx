import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Noto_Sans_KR } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const geist = localFont({ src: './fonts/GeistVF.woff', variable: '--font-geist', weight: '100 900' })
const geistMono = localFont({ src: './fonts/GeistMonoVF.woff', variable: '--font-geist-mono', weight: '100 900' })
const noto = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700', '800'], variable: '--font-noto' })

export const metadata: Metadata = {
  title: 'KIMHYOJE | AI·SW 포트폴리오',
  description: '피지컬 AI와 로봇 제어부터 웹·보안까지 — 울산대학교 ICT융합학부 KIMHYOJE의 포트폴리오',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} ${geistMono.variable} ${noto.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  )
}
