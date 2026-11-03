export type Category = 'COMPETITION' | 'ACTIVITY' | 'RESEARCH' | 'CERT' | 'PROJECT'
export type DomainTag = 'AI_DATA' | 'GAME_CONTENT' | 'ROBOT_IOT' | 'ALGO_SEC' | 'OTHER'
export type Status = 'IN_PROGRESS' | 'COMPLETED' | 'ANNOUNCED'
export type ScopeType = '교내' | '교외' | '권역연합'
export type FileType = 'PUBLIC_IMAGE' | 'PRIVATE_PROOF'

export interface ItemAttachment {
  id: string
  item_id: string
  file_url: string
  file_type: FileType
  file_name: string
}

export interface PortfolioItem {
  id: string
  category: Category
  domain_tag: DomainTag
  title: string
  scope_type: ScopeType
  organizer: string
  start_date: string
  end_date: string | null
  status: Status
  is_awarded: boolean
  award_rank: string | null
  is_featured: boolean
  featured_rank?: number | null
  summary_md: string | null
  thumbnail_url?: string | null
  problem_text?: string | null
  action_text?: string | null
  result_text?: string | null
  github_url?: string | null
  demo_url?: string | null
  tech_stack?: string[] | null
  is_published: boolean
  created_at: string
  item_attachments?: ItemAttachment[]
}

export const DOMAIN_ORDER: DomainTag[] = ['AI_DATA', 'GAME_CONTENT', 'ALGO_SEC', 'ROBOT_IOT', 'OTHER']

export const DOMAIN_LABELS: Record<DomainTag, string> = {
  AI_DATA: 'AI·데이터',
  GAME_CONTENT: '게임·콘텐츠·연구',
  ALGO_SEC: '알고리즘·보안·DB',
  ROBOT_IOT: '로봇·대외활동',
  OTHER: '기타',
}

export const DOMAIN_CODES: Record<DomainTag, string> = {
  AI_DATA: 'AI/DATA',
  GAME_CONTENT: 'GAME/CONTENT',
  ALGO_SEC: 'ALGO/SEC',
  ROBOT_IOT: 'ROBOT/IOT',
  OTHER: 'MISC',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  COMPETITION: '공모전·대회',
  ACTIVITY: '대외활동',
  RESEARCH: '연구',
  CERT: '자격증',
  PROJECT: '개발 프로젝트',
}

export function hostOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

export const STATUS_LABELS: Record<Status, string> = {
  IN_PROGRESS: '준비·진행 중',
  COMPLETED: '참가 완료',
  ANNOUNCED: '결과 발표',
}

export const STATUS_OPTIONS: Status[] = ['IN_PROGRESS', 'COMPLETED', 'ANNOUNCED']

export type AwardTier = 'gold' | 'silver' | 'bronze'

export const AWARD_META: Record<string, { tier: AwardTier; code: string }> = {
  '대상': { tier: 'gold', code: 'GRAND PRIZE' },
  '최우수상': { tier: 'gold', code: 'EXCELLENCE' },
  '우수상': { tier: 'silver', code: 'MERIT' },
  '장려상': { tier: 'bronze', code: 'HONORABLE' },
  '3등': { tier: 'bronze', code: '3RD PLACE' },
}

export function awardMeta(rank: string | null) {
  if (!rank) return null
  return AWARD_META[rank] ?? { tier: 'bronze' as AwardTier, code: 'AWARD' }
}

export function formatDate(d: string) {
  return d.replaceAll('-', '.')
}

export function formatPeriod(start: string, end: string | null) {
  if (!end || end === start) return formatDate(start)
  const [sy] = start.split('-')
  const [ey, em, ed] = end.split('-')
  return `${formatDate(start)} – ${sy === ey ? `${em}.${ed}` : `${ey}.${em}.${ed}`}`
}

export function publicImages(item: PortfolioItem) {
  return (item.item_attachments ?? []).filter(a => a.file_type === 'PUBLIC_IMAGE')
}
