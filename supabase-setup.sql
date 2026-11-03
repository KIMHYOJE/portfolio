-- =============================================
-- 포트폴리오 DB 설정 SQL (Supabase SQL Editor에서 실행)
-- =============================================

-- 1. 메인 테이블 생성
CREATE TABLE public.portfolio_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category      varchar NOT NULL DEFAULT 'COMPETITION',
  domain_tag    varchar NOT NULL DEFAULT 'AI_DATA',
  title         varchar NOT NULL,
  scope_type    varchar NOT NULL DEFAULT '교내',
  organizer     varchar NOT NULL,
  start_date    date NOT NULL,
  end_date      date,
  status        varchar NOT NULL DEFAULT 'ANNOUNCED',
  is_awarded    boolean NOT NULL DEFAULT false,
  award_rank    varchar,
  is_featured   boolean NOT NULL DEFAULT false,
  summary_md    text,
  is_published  boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. 첨부파일 테이블
CREATE TABLE public.item_attachments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id    uuid NOT NULL REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  file_url   text NOT NULL,
  file_type  varchar NOT NULL DEFAULT 'PUBLIC_IMAGE',
  file_name  varchar NOT NULL DEFAULT ''
);

-- 3. RLS 활성화
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_attachments ENABLE ROW LEVEL SECURITY;

-- 4. 권한 설정
REVOKE ALL ON TABLE public.portfolio_items FROM anon, authenticated;
GRANT SELECT ON TABLE public.portfolio_items TO anon, authenticated;
GRANT ALL ON TABLE public.portfolio_items TO authenticated;

REVOKE ALL ON TABLE public.item_attachments FROM anon, authenticated;
GRANT SELECT ON TABLE public.item_attachments TO anon, authenticated;
GRANT ALL ON TABLE public.item_attachments TO authenticated;

-- 5. 공개 조회 정책 (방문자)
CREATE POLICY "Public can view published items"
  ON public.portfolio_items FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Public can view attachments"
  ON public.item_attachments FOR SELECT
  TO anon, authenticated
  USING (true);

-- 6. 인증된 사용자 전체 제어 정책 (관리자)
CREATE POLICY "Auth full access to items"
  ON public.portfolio_items FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth full access to attachments"
  ON public.item_attachments FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 7. 초기 데이터 삽입 (화면에서 추출한 14건)
INSERT INTO public.portfolio_items
  (category, domain_tag, title, scope_type, organizer, start_date, end_date, status, is_awarded, award_rank, is_featured)
VALUES
  ('COMPETITION','ROBOT_IOT','2026 UOU 로봇OS 특강+ 피지컬AI 챌린지','교내','SW중심대학(울산대)','2026-05-30',NULL,'ANNOUNCED',true,'3등',true),
  ('COMPETITION','AI_DATA','2026학년도 제1회 AI를 활용한 사회문제해결 공모전','교내','울산대학교 SW중심대학','2026-06-04',NULL,'ANNOUNCED',false,NULL,false),
  ('ACTIVITY','AI_DATA','2026년 로컬 AI 메이커스랩 (일 경험형 프로그램)','교외','주식회사 코멘토 (현대해상 지원)','2026-06-30','2026-08-10','COMPLETED',false,NULL,false),
  ('COMPETITION','AI_DATA','2026 제11회 [부·울·경] AI융합해커톤','권역연합','울산대·부경대·부산광역시 등','2026-07-09','2026-07-10','COMPLETED',false,NULL,false),
  ('COMPETITION','GAME_CONTENT','2026 울산 게임 콘텐츠 개발 해커톤 대회','교내','울산정보산업진흥원','2026-08-20','2026-08-21','ANNOUNCED',true,'대상',true),
  ('COMPETITION','ALGO_SEC','사이버공격방어대회 (CCE)','교외','국가정보원','2026-08-22',NULL,'ANNOUNCED',false,NULL,false),
  ('COMPETITION','GAME_CONTENT','2026학년도 디지털 콘텐츠 창작 공모전','교내','울산대 교수학습개발팀','2026-08-31',NULL,'ANNOUNCED',true,'우수상',true),
  ('COMPETITION','ROBOT_IOT','신입생 연구체험 프로그램','교내','울산대학교 ICT융합학부','2026-09-03','2026-09-30','ANNOUNCED',true,'최우수상',true),
  ('COMPETITION','ALGO_SEC','2026-1학기 프로그래밍 경진대회','교내','울산대학교 SW중심대학','2026-05-29',NULL,'ANNOUNCED',false,NULL,false),
  ('COMPETITION','ALGO_SEC','2026-2학기 프로그래밍 경진대회','교내','울산대학교 SW중심대학','2026-10-28',NULL,'COMPLETED',false,NULL,false),
  ('ACTIVITY','AI_DATA','2026-2학기 K-MOOC 기개발 모니터링단','교내','울산대 K-MOOC','2026-10-05','2026-11-17','IN_PROGRESS',false,NULL,false),
  ('COMPETITION','AI_DATA','대구·울산·경북 대학 연합 X Upstage AI 대회','교외','대구·울산·경북 대학 연합','2026-10-30','2026-11-13','IN_PROGRESS',false,NULL,false),
  ('COMPETITION','AI_DATA','AI_TOP_100','교외','카카오','2026-10-31','2026-11-14','IN_PROGRESS',false,NULL,false),
  ('CERT','ALGO_SEC','SQLD (SQL 개발자)','교외','한국데이터산업진흥원','2026-11-14',NULL,'IN_PROGRESS',false,NULL,false);
