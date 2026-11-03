-- =============================================
-- 002: 리빌딩 마이그레이션 (supabase-setup.sql 실행 후, SQL Editor에서 1회 실행)
-- 기존 14건 데이터는 유지됩니다. 여러 번 실행해도 안전합니다.
-- =============================================

-- 1. STAR 케이스 스터디 / 썸네일 / 대표작 순위 컬럼
ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS problem_text  text,
  ADD COLUMN IF NOT EXISTS action_text   text,
  ADD COLUMN IF NOT EXISTS result_text   text,
  ADD COLUMN IF NOT EXISTS github_url    text,
  ADD COLUMN IF NOT EXISTS featured_rank smallint;

ALTER TABLE public.item_attachments
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- 2. 관리자 판별 함수 (app_metadata는 서버에서만 수정 가능 → 클라이언트 조작 불가)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 3. 기존 정책 교체: "로그인만 하면 전부 수정" → "admin 역할만 수정"
DROP POLICY IF EXISTS "Auth full access to items"        ON public.portfolio_items;
DROP POLICY IF EXISTS "Auth full access to attachments"  ON public.item_attachments;
DROP POLICY IF EXISTS "Public can view attachments"      ON public.item_attachments;
DROP POLICY IF EXISTS "Admin full access to items"       ON public.portfolio_items;
DROP POLICY IF EXISTS "Admin full access to attachments" ON public.item_attachments;
DROP POLICY IF EXISTS "Public can view public images"    ON public.item_attachments;

CREATE POLICY "Admin full access to items"
  ON public.portfolio_items FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "Admin full access to attachments"
  ON public.item_attachments FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- 방문자는 공개 항목의 PUBLIC_IMAGE만 조회 (PRIVATE_PROOF는 숨김)
CREATE POLICY "Public can view public images"
  ON public.item_attachments FOR SELECT
  TO anon, authenticated
  USING (
    file_type = 'PUBLIC_IMAGE'
    AND EXISTS (
      SELECT 1 FROM public.portfolio_items p
      WHERE p.id = item_id AND p.is_published = true
    )
  );

CREATE INDEX IF NOT EXISTS item_attachments_item_id_idx ON public.item_attachments(item_id);

-- 4. 사진 스토리지 버킷 (공개 읽기, 5MB 제한, 이미지만)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('public-media', 'public-media', true, 5242880,
        ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif'])
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read public-media"   ON storage.objects;
DROP POLICY IF EXISTS "Admin insert public-media"  ON storage.objects;
DROP POLICY IF EXISTS "Admin update public-media"  ON storage.objects;
DROP POLICY IF EXISTS "Admin delete public-media"  ON storage.objects;

CREATE POLICY "Public read public-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'public-media');

CREATE POLICY "Admin insert public-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-media' AND (SELECT public.is_admin()));

CREATE POLICY "Admin update public-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-media' AND (SELECT public.is_admin()));

CREATE POLICY "Admin delete public-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'public-media' AND (SELECT public.is_admin()));

-- 5. 도메인 재분류 (필터: AI·데이터 5 / 게임·콘텐츠·연구 3 / 알고리즘·보안·DB 4 / 로봇·대외활동 2)
UPDATE public.portfolio_items SET domain_tag = 'GAME_CONTENT' WHERE title = '신입생 연구체험 프로그램';
UPDATE public.portfolio_items SET domain_tag = 'ROBOT_IOT'    WHERE title = '2026-2학기 K-MOOC 기개발 모니터링단';

-- 6. 대표작 순위 (벤토 그리드 셀 크기 = 중요도)
UPDATE public.portfolio_items SET is_featured = false, featured_rank = NULL;
UPDATE public.portfolio_items SET is_featured = true, featured_rank = 1 WHERE title = '2026 울산 게임 콘텐츠 개발 해커톤 대회';
UPDATE public.portfolio_items SET is_featured = true, featured_rank = 2 WHERE title = '신입생 연구체험 프로그램';
UPDATE public.portfolio_items SET is_featured = true, featured_rank = 3 WHERE title = '2026 UOU 로봇OS 특강+ 피지컬AI 챌린지';
UPDATE public.portfolio_items SET is_featured = true, featured_rank = 4 WHERE title = '2026학년도 디지털 콘텐츠 창작 공모전';
UPDATE public.portfolio_items SET is_featured = true, featured_rank = 5 WHERE title = '2026년 로컬 AI 메이커스랩 (일 경험형 프로그램)';

-- 7. 관리자 역할 부여 — 신규 가입이 꺼져 있어 auth.users에는 관리자 계정만 있다는 전제입니다.
--    실행 후 /admin 에서 로그아웃 → 다시 로그인해야 새 JWT에 role이 반영됩니다.
UPDATE auth.users
SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;
