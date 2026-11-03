export type Category = 'COMPETITION' | 'ACTIVITY' | 'RESEARCH' | 'CERT'
export type DomainTag = 'AI_DATA' | 'GAME_CONTENT' | 'ROBOT_IOT' | 'ALGO_SEC' | 'OTHER'
export type Status = 'IN_PROGRESS' | 'COMPLETED' | 'ANNOUNCED'
export type ScopeType = '교내' | '교외' | '권역연합'

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
  summary_md: string | null
  is_published: boolean
  created_at: string
}

export interface ItemAttachment {
  id: string
  item_id: string
  file_url: string
  file_type: 'PUBLIC_IMAGE' | 'PRIVATE_PROOF'
  file_name: string
}

export const DOMAIN_LABELS: Record<DomainTag, string> = {
  AI_DATA: 'AI·데이터',
  GAME_CONTENT: '게임·콘텐츠',
  ROBOT_IOT: '로봇·IoT',
  ALGO_SEC: '알고리즘·보안',
  OTHER: '기타',
}

export const STATUS_LABELS: Record<Status, string> = {
  IN_PROGRESS: '준비·진행 중',
  COMPLETED: '참가 완료',
  ANNOUNCED: '결과 발표',
}

export const AWARD_TIER: Record<string, 'gold' | 'silver' | 'bronze' | 'other'> = {
  '대상': 'gold',
  '최우수상': 'gold',
  '우수상': 'silver',
  '장려상': 'bronze',
  '3등': 'bronze',
}
