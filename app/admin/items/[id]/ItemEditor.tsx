'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, ImagePlus, Loader2, Lock, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase-browser'
import { compressAndUpload, BUCKET, storagePathFromUrl } from '@/lib/upload'
import { revalidateHome } from '../../actions'
import {
  Category, CATEGORY_LABELS, DOMAIN_LABELS, DOMAIN_ORDER, DomainTag, FileType, ItemAttachment,
  PortfolioItem, ScopeType, Status, STATUS_LABELS, STATUS_OPTIONS,
} from '@/types/portfolio'

const FIELD = 'w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-base text-zinc-100 placeholder:text-zinc-600 focus:border-amber-300/60 focus:outline-none'
const LABEL = 'mb-1.5 block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500'

type Form = Omit<PortfolioItem, 'id' | 'created_at' | 'item_attachments'>

export default function ItemEditor({ initial }: { initial: PortfolioItem }) {
  const { id, created_at: _c, item_attachments, ...rest } = initial
  const [form, setForm] = useState<Form>(rest)
  const [attachments, setAttachments] = useState<ItemAttachment[]>(item_attachments ?? [])
  const [saving, setSaving] = useState(false)
  const [stackText, setStackText] = useState((rest.tech_stack ?? []).join(', '))
  const router = useRouter()
  const supabase = createClient()

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => ({ ...f, [k]: v }))
  const text = (k: keyof Form) => ({
    value: (form[k] as string | null | undefined) ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, (e.target.value || null) as never),
  })

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('portfolio_items').update({
      ...form,
      award_rank: form.is_awarded ? form.award_rank : null,
      featured_rank: form.is_featured ? form.featured_rank : null,
    }).eq('id', id)
    setSaving(false)
    if (error) return toast.error(`저장 실패: ${error.message}`)
    await revalidateHome()
    toast.success('저장했습니다 — 사이트에 반영됨')
    router.refresh()
  }

  async function setThumbnail(url: string | null) {
    const { error } = await supabase.from('portfolio_items').update({ thumbnail_url: url }).eq('id', id)
    if (error) return toast.error(error.message)
    set('thumbnail_url', url)
    await revalidateHome()
  }

  async function addAttachment(url: string, name: string, fileType: FileType) {
    const { data, error } = await supabase
      .from('item_attachments')
      .insert({ item_id: id, file_url: url, file_name: name, file_type: fileType })
      .select()
      .single()
    if (error) throw error
    setAttachments(a => [...a, data])
  }

  async function removeAttachment(att: ItemAttachment) {
    const { error } = await supabase.from('item_attachments').delete().eq('id', att.id)
    if (error) return toast.error(error.message)
    const path = storagePathFromUrl(att.file_url)
    if (path) await supabase.storage.from(BUCKET).remove([path])
    setAttachments(a => a.filter(x => x.id !== att.id))
    if (form.thumbnail_url === att.file_url) await setThumbnail(null)
    else await revalidateHome()
    toast.success('사진을 삭제했습니다')
  }

  async function onFiles(files: File[], fileType: FileType) {
    for (const file of files) {
      const t = toast.loading(`${file.name} 압축 중…`)
      try {
        const res = await compressAndUpload(file, id)
        await addAttachment(res.url, res.name, fileType)
        if (fileType === 'PUBLIC_IMAGE' && !form.thumbnail_url) await setThumbnail(res.url)
        toast.success(`업로드 완료 · WebP ${res.sizeKB}KB`, { id: t })
      } catch (err) {
        toast.error(`업로드 실패: ${err instanceof Error ? err.message : String(err)}`, { id: t })
      }
    }
    await revalidateHome()
  }

  const publicImgs = attachments.filter(a => a.file_type === 'PUBLIC_IMAGE')
  const privateImgs = attachments.filter(a => a.file_type === 'PRIVATE_PROOF')

  return (
    <div className="min-h-screen pb-32">
      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> 목록
          </Link>
          <p className="truncate font-mono text-xs tracking-[0.16em] text-zinc-500">EDIT · {id.slice(0, 8)}</p>
        </div>
      </header>

      <form onSubmit={save} className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-8">
        <Section title="기본 정보">
          <div>
            <label className={LABEL} htmlFor="title">제목</label>
            <input id="title" required className={FIELD} {...text('title')} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="organizer">주최</label>
              <input id="organizer" required className={FIELD} {...text('organizer')} />
            </div>
            <div>
              <label className={LABEL} htmlFor="scope">범위</label>
              <select id="scope" className={FIELD} value={form.scope_type} onChange={e => set('scope_type', e.target.value as ScopeType)}>
                {(['교내', '교외', '권역연합'] as ScopeType[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="start">시작일</label>
              <input id="start" type="date" required className={FIELD} {...text('start_date')} />
            </div>
            <div>
              <label className={LABEL} htmlFor="end">종료일 (선택)</label>
              <input id="end" type="date" className={FIELD} {...text('end_date')} />
            </div>
            <div>
              <label className={LABEL} htmlFor="category">분류</label>
              <select id="category" className={FIELD} value={form.category} onChange={e => set('category', e.target.value as Category)}>
                {(Object.keys(CATEGORY_LABELS) as Category[]).map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="domain">도메인</label>
              <select id="domain" className={FIELD} value={form.domain_tag} onChange={e => set('domain_tag', e.target.value as DomainTag)}>
                {DOMAIN_ORDER.map(d => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
              </select>
            </div>
          </div>
        </Section>

        <Section title="상태 · 노출">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="status">진행 상태</label>
              <select id="status" className={FIELD} value={form.status} onChange={e => set('status', e.target.value as Status)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="award">수상 등급 (예: 대상, 우수상, 3등)</label>
              <input id="award" className={FIELD} placeholder="수상 없으면 비워두기" value={form.award_rank ?? ''}
                onChange={e => setForm(f => ({ ...f, award_rank: e.target.value || null, is_awarded: !!e.target.value }))} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Toggle label="사이트에 공개" checked={form.is_published} onChange={v => set('is_published', v)} />
            <Toggle label="대표작 (벤토 그리드)" checked={form.is_featured} onChange={v => set('is_featured', v)} />
            {form.is_featured && (
              <label className="flex min-h-[44px] items-center gap-2 rounded-xl border border-zinc-800 px-3 text-sm text-zinc-300">
                순위
                <input type="number" min={1} max={5} className="w-16 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-base"
                  value={form.featured_rank ?? ''} onChange={e => set('featured_rank', e.target.value ? Number(e.target.value) : null)} />
              </label>
            )}
          </div>
          <p className="text-xs leading-5 text-zinc-500">순위 1 = 2×2 대형 셀, 2·5 = 가로 2칸, 3·4 = 1칸. 대표작은 5개까지 그리드에 표시됩니다.</p>
        </Section>

        <Section title="사진" hint="JPG/PNG/GIF를 놓으면 브라우저에서 최대 1920px · WebP · 300KB 이하로 압축 후 업로드합니다.">
          <Dropzone onFiles={f => onFiles(f, 'PUBLIC_IMAGE')} label="공개 사진 추가 (갤러리·썸네일)" />
          <ImageGrid
            items={publicImgs}
            thumbnail={form.thumbnail_url ?? null}
            onThumb={url => setThumbnail(url).then(() => toast.success('대표 썸네일로 지정'))}
            onRemove={removeAttachment}
          />
          <div className="rounded-2xl border border-zinc-800 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-zinc-300"><Lock className="h-3.5 w-3.5" /> 비공개 증빙 (상장 원본 등)</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">방문자 목록에는 노출되지 않습니다. 단, 파일은 공개 버킷에 저장되므로 URL을 아는 사람은 열 수 있습니다 — 주민번호 등 민감 정보가 있는 원본은 올리지 마세요.</p>
            <div className="mt-3"><Dropzone onFiles={f => onFiles(f, 'PRIVATE_PROOF')} label="증빙 추가" compact /></div>
            <ImageGrid items={privateImgs} onRemove={removeAttachment} />
          </div>
        </Section>

        <Section title="STAR 케이스 스터디" hint="면접관이 가장 먼저 읽는 부분입니다. 줄바꿈은 그대로 표시됩니다.">
          <div>
            <label className={LABEL} htmlFor="p">S·T — Situation & Task</label>
            <textarea id="p" rows={5} className={FIELD} placeholder="대회 배경, 제약 조건, 내가 맡은 역할" {...text('problem_text')} />
          </div>
          <div>
            <label className={LABEL} htmlFor="a">A — Action (Troubleshooting)</label>
            <textarea id="a" rows={7} className={FIELD} placeholder="문제 원인 분석 → 시도한 방법과 대안 비교 → 기술 선택 근거" {...text('action_text')} />
          </div>
          <div>
            <label className={LABEL} htmlFor="r">R — Result & Learned</label>
            <textarea id="r" rows={5} className={FIELD} placeholder="정량적 성과, 수상 결과, 배운 점" {...text('result_text')} />
          </div>
          <div>
            <label className={LABEL} htmlFor="gh">GitHub URL</label>
            <input id="gh" type="url" inputMode="url" className={FIELD} placeholder="https://github.com/KIMHYOJE/..." {...text('github_url')} />
          </div>
          <div>
            <label className={LABEL} htmlFor="demo">배포·기사·증빙 링크</label>
            <input id="demo" type="url" inputMode="url" className={FIELD} placeholder="https://..." {...text('demo_url')} />
          </div>
          <div>
            <label className={LABEL} htmlFor="stack">기술 스택 (쉼표로 구분)</label>
            <input id="stack" className={FIELD} placeholder="Next.js, TypeScript, Supabase"
              value={stackText}
              onChange={e => {
                setStackText(e.target.value)
                const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                set('tech_stack', list.length ? list : null)
              }} />
          </div>
        </Section>

        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
            <button type="submit" disabled={saving} className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-50">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} 저장
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {hint && <p className="mt-1 text-sm text-zinc-500">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="flex min-h-[44px] items-center gap-3 rounded-xl border border-zinc-800 px-3 text-sm text-zinc-300">
      <span className={cn('relative h-6 w-10 rounded-full transition-colors', checked ? 'bg-emerald-500' : 'bg-zinc-700')}>
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform', checked ? 'translate-x-[18px]' : 'translate-x-0.5')} />
      </span>
      {label}
    </button>
  )
}

function Dropzone({ onFiles, label, compact }: { onFiles: (f: File[]) => void; label: string; compact?: boolean }) {
  const ref = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const pick = (list: FileList | null) => {
    const files = Array.from(list ?? []).filter(f => f.type.startsWith('image/'))
    if (files.length) onFiles(files)
  }
  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files) }}
      className={cn('rounded-2xl border border-dashed transition-colors', over ? 'border-amber-300/70 bg-amber-300/5' : 'border-zinc-700')}
    >
      <button type="button" onClick={() => ref.current?.click()} className={cn('flex w-full flex-col items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white', compact ? 'min-h-[64px]' : 'min-h-[120px]')}>
        <ImagePlus className="h-5 w-5" />
        {label}
        {!compact && <span className="font-mono text-[11px] text-zinc-600">DRAG & DROP · TAP TO SELECT</span>}
      </button>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={e => { pick(e.target.files); e.target.value = '' }} />
    </div>
  )
}

function ImageGrid({ items, thumbnail, onThumb, onRemove }: {
  items: ItemAttachment[]
  thumbnail?: string | null
  onThumb?: (url: string) => void
  onRemove: (a: ItemAttachment) => void
}) {
  if (items.length === 0) return null
  return (
    <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map(a => {
        const isThumb = thumbnail === a.file_url
        return (
          <li key={a.id} className={cn('overflow-hidden rounded-xl border bg-zinc-900', isThumb ? 'border-amber-300/60' : 'border-zinc-800')}>
            <div className="relative aspect-[4/3]">
              <Image src={a.file_url} alt={a.file_name} fill sizes="240px" className="object-cover" />
              {isThumb && <span className="absolute left-2 top-2 rounded bg-amber-300 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-950">THUMB</span>}
            </div>
            <div className="flex">
              {onThumb && !isThumb && (
                <button type="button" onClick={() => onThumb(a.file_url)} className="min-h-[44px] flex-1 text-xs text-zinc-400 hover:text-white">썸네일 지정</button>
              )}
              <button type="button" onClick={() => onRemove(a)} className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 text-xs text-zinc-500 hover:text-red-300" aria-label={`${a.file_name} 삭제`}>
                <Trash2 className="h-3.5 w-3.5" /> 삭제
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
