-- =============================================
-- 004: 2026 성과 이력서 반영 — 역할·팀·링크 보강, 개발 프로젝트 5건, 사진 연결
-- 이미 쓴 STAR 내용은 덮어쓰지 않습니다(coalesce). 여러 번 실행해도 안전합니다.
-- 사진은 저장소 public/media/ 에 있습니다 (생년월일·연락처가 보이는 수료증, AI_TOP_100 캡처는 제외).
-- =============================================

ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS demo_url   text,
  ADD COLUMN IF NOT EXISTS tech_stack text[];

-- 1. 기존 항목: 이력서의 역할·팀 정보와 증빙 링크
UPDATE public.portfolio_items SET
  action_text = coalesce(action_text, '5월 9·23·30일 세 차례 로봇OS 특강을 들은 뒤, 대회에서는 로봇이 물건을 얼마나 효율적으로 옮길 수 있을지 동작 방식을 고민하며 직접 작동시켰습니다.')
WHERE title = '2026 UOU 로봇OS 특강+ 피지컬AI 챌린지';

UPDATE public.portfolio_items SET
  action_text = coalesce(action_text, '맵·레벨 담당으로 스테이지 구성, 카드 설정, 스테이지 제작을 맡았습니다.'),
  demo_url    = coalesce(demo_url, 'https://www.ujnews.co.kr/news/newsview.php?ncode=1065587850204696')
WHERE title = '2026 울산 게임 콘텐츠 개발 해커톤 대회';

UPDATE public.portfolio_items SET
  problem_text = coalesce(problem_text, '2026학년도 대학혁신지원사업 ‘신입생 연구체험 프로그램’에 ICT융합학부 5인 팀 ‘생산관리팀’으로 참가했습니다 (지도교수 황규선).'),
  action_text  = coalesce(action_text, '지멘스(Siemens) 기반 환경에서 공정이 더 효율적으로 작동하는 방법을 고민하고, 직접 개선안을 만들어 적용해 봤습니다.'),
  result_text  = coalesce(result_text, '최우수상 (울산대학교 ICT융합학부장상, 제2026-30호)')
WHERE title = '신입생 연구체험 프로그램';

UPDATE public.portfolio_items SET
  action_text = coalesce(action_text, '3문제를 목표로 잡고, 그 3문제를 끝까지 깊이 있게 풀었습니다.'),
  result_text = coalesce(result_text, '미수상')
WHERE title = '2026-1학기 프로그래밍 경진대회';

UPDATE public.portfolio_items SET
  action_text = coalesce(action_text, '2문제를 목표로 두고, 2문제 풀이를 끝까지 완성했습니다.')
WHERE title = '2026-2학기 프로그래밍 경진대회';

UPDATE public.portfolio_items SET
  action_text = coalesce(action_text, 'AI로 해결할 수 있는 사회문제를 조사하고 아이디어로 정리했습니다.'),
  result_text = coalesce(result_text, '미수상')
WHERE title = '2026학년도 제1회 AI를 활용한 사회문제해결 공모전';

UPDATE public.portfolio_items SET
  demo_url = coalesce(demo_url, 'https://app.notion.com/p/SeaClean-Priority-AI-37b1053be6248099a5c1e2aa59c089f3')
WHERE title = '2026 제11회 [부·울·경] AI융합해커톤';

UPDATE public.portfolio_items SET
  action_text = coalesce(action_text, '1인 팀 ‘luc77y러키팀’의 팀장으로 참가해, 문제를 살펴보며 해킹 문제에 직접 도전해 봤습니다.'),
  result_text = coalesce(result_text, '미수상')
WHERE title = '사이버공격방어대회 (CCE)';

UPDATE public.portfolio_items SET
  title        = '대구·울산·경북 대학 연합 X Upstage AI Agent Hackathon V.2',
  problem_text = coalesce(problem_text, '5인 팀 ‘요미의 코딩’의 팀장으로 참가하고 있습니다.')
WHERE title = '대구·울산·경북 대학 연합 X Upstage AI 대회';

UPDATE public.portfolio_items SET
  action_text = coalesce(action_text, '주어진 조건에 맞는 AI 챗봇을 만들면서, 의문점과 추가 정보를 직접 찾아가며 답변 품질을 높이고 있습니다.')
WHERE title = 'AI_TOP_100';

UPDATE public.portfolio_items SET
  problem_text = coalesce(problem_text, '고용노동부 청년 일경험 지원사업(ESG지원형)으로 진행된 7주 프로젝트형 인턴십. ‘현대해상 2팀’(5인)으로 참가해 현대해상 상품개발팀의 문제점을 파악했습니다.'),
  action_text  = coalesce(action_text, '파악한 문제를 해결하는 AI와 웹사이트, 자료 정리용 AI를 제작했습니다.'),
  result_text  = coalesce(result_text, '청년 일경험 수료 (2026.06.30 – 08.10, 7주)'),
  github_url   = coalesce(github_url, 'https://github.com/KIMHYOJE/2026local-ai-makers-lab-hyundai2')
WHERE title = '2026년 로컬 AI 메이커스랩 (일 경험형 프로그램)';

UPDATE public.portfolio_items SET
  action_text = coalesce(action_text, 'K-MOOC 강좌 홍보와 강좌 내 오류·오타 검수를 맡아, 주차별 활동일지를 제출하고 있습니다.')
WHERE title = '2026-2학기 K-MOOC 기개발 모니터링단';

-- 2. 개발 프로젝트 (같은 제목이 있으면 건너뜀)
INSERT INTO public.portfolio_items
  (category, domain_tag, title, scope_type, organizer, start_date, end_date, status, is_awarded, is_featured, is_published,
   problem_text, action_text, result_text, github_url, demo_url, tech_stack)
SELECT * FROM (VALUES
  ('PROJECT', 'ALGO_SEC', 'problem-solving — 알고리즘 풀이 아카이브', '교외', '개인 프로젝트 (GitHub)',
   '2026-01-06'::date, NULL::date, 'IN_PROGRESS', false, false, true,
   '알고리즘 실력을 꾸준히 쌓고 풀이 과정을 남기기 위해 만든 개인 저장소입니다.',
   '백준·프로그래머스·SWEA·구름레벨에서 푼 문제를 BaekjoonHub로 자동 커밋해 기록합니다.',
   '커밋 191개 · Star 44개 (2026.11 기준)',
   'https://github.com/KIMHYOJE/problem-solving', NULL, ARRAY['C', 'Python', 'C++']),
  ('PROJECT', 'OTHER', 'mealpick — 오늘의 식단', '교내', '동아리 공식 프로젝트 · 가온의 스프린트 (8인)',
   '2026-08-01'::date, '2026-09-10'::date, 'COMPLETED', false, false, true,
   '8인 동아리 팀 ‘가온의 스프린트’에서 식단 정보를 보여주는 웹앱을 만들었습니다.',
   '프론트엔드를 맡아, 날짜별·식사별 메뉴를 사용자가 한눈에 이해할 수 있는 화면으로 구조화했습니다.',
   NULL, NULL, 'https://www.mealpick.store', ARRAY['React', 'TypeScript']),
  ('PROJECT', 'OTHER', 'SW-ICT-notice — 학교 공지 디스코드 알리미', '교외', '개인 프로젝트 (GitHub Actions)',
   '2026-08-10'::date, NULL::date, 'IN_PROGRESS', false, false, true,
   'SW중심대학사업단·ICT학과 게시판·U-STEP 공지를 매번 직접 확인하는 게 번거로워서 만들었습니다.',
   'GitHub Actions가 주기적으로 학교 사이트를 읽고, 새 글이 올라오면 디스코드 채널로 알려 줍니다.',
   '배포·운영 중', 'https://github.com/KIMHYOJE/SW-ICT-notice', 'https://discord.gg/APtaSSc3E', ARRAY['Python', 'GitHub Actions', 'AWS']),
  ('PROJECT', 'GAME_CONTENT', 'NEON RIFT — 3D 웹 사격 게임', '교외', '개인 프로젝트',
   '2026-11-02'::date, NULL::date, 'IN_PROGRESS', false, false, true,
   '브라우저에서 바로 플레이할 수 있는 3D 사격 게임입니다.',
   '이동, 사격, 명중 판정, 점수, 봇 AI를 직접 구현했습니다.',
   '배포·운영 중', NULL, 'https://gamegun.vercel.app/', ARRAY['Next.js', 'Three.js', 'JavaScript']),
  ('PROJECT', 'OTHER', 'AI·SW 포트폴리오 (이 사이트)', '교외', '개인 프로젝트',
   '2026-11-03'::date, NULL::date, 'IN_PROGRESS', false, false, true,
   '대회·활동 이력을 한곳에 모으고, 결과가 나올 때마다 휴대폰으로 바로 갱신할 수 있는 포트폴리오가 필요했습니다.',
   '성과의 무게에 따라 크기가 달라지는 벤토 그리드, STAR 상세 보기, 사진 업로드 관리자 화면을 만들었습니다. 관리자 권한은 Supabase RLS와 app_metadata 역할로 서버에서 검증합니다.',
   '배포·운영 중', 'https://github.com/KIMHYOJE/portfolio', 'https://portfolio-one-rouge-50.vercel.app/', ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'])
) AS v(category, domain_tag, title, scope_type, organizer, start_date, end_date, status, is_awarded, is_featured, is_published,
       problem_text, action_text, result_text, github_url, demo_url, tech_stack)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_items p WHERE p.title = v.title);

-- 3. 사진 연결 (사람이 나온 사진은 올리지 않음)
INSERT INTO public.item_attachments (item_id, file_url, file_type, file_name)
SELECT p.id, v.url, 'PUBLIC_IMAGE', v.name
FROM (VALUES
  ('2026 UOU 로봇OS 특강+ 피지컬AI 챌린지', '/media/robot-os-award.webp', '3등 상장'),
  ('2026 울산 게임 콘텐츠 개발 해커톤 대회', '/media/game-hackathon-award.webp', '대상 상장'),
  ('2026학년도 디지털 콘텐츠 창작 공모전', '/media/digital-content-result.webp', '심사 결과'),
  ('신입생 연구체험 프로그램', '/media/freshman-research-award.webp', '최우수상 상장'),
  ('2026 제11회 [부·울·경] AI융합해커톤', '/media/bukyung-hackathon-badge.webp', '참가 명찰'),
  ('2026-2학기 K-MOOC 기개발 모니터링단', '/media/kmooc-logs.webp', '주차별 활동일지'),
  ('problem-solving — 알고리즘 풀이 아카이브', '/media/problem-solving.webp', 'GitHub 저장소'),
  ('mealpick — 오늘의 식단', '/media/mealpick.webp', '앱 화면'),
  ('SW-ICT-notice — 학교 공지 디스코드 알리미', '/media/sw-ict-notice.webp', '디스코드 알림'),
  ('NEON RIFT — 3D 웹 사격 게임', '/media/neon-rift.webp', '게임 메인 화면')
) AS v(title, url, name)
JOIN public.portfolio_items p ON p.title = v.title
WHERE NOT EXISTS (SELECT 1 FROM public.item_attachments a WHERE a.item_id = p.id AND a.file_url = v.url);

UPDATE public.portfolio_items p SET thumbnail_url = v.url
FROM (VALUES
  ('2026 UOU 로봇OS 특강+ 피지컬AI 챌린지', '/media/robot-os-award.webp'),
  ('2026 울산 게임 콘텐츠 개발 해커톤 대회', '/media/game-hackathon-award.webp'),
  ('2026 제11회 [부·울·경] AI융합해커톤', '/media/bukyung-hackathon-badge.webp'),
  ('2026학년도 디지털 콘텐츠 창작 공모전', '/media/digital-content-result.webp'),
  ('신입생 연구체험 프로그램', '/media/freshman-research-award.webp'),
  ('2026-2학기 K-MOOC 기개발 모니터링단', '/media/kmooc-logs.webp'),
  ('problem-solving — 알고리즘 풀이 아카이브', '/media/problem-solving.webp'),
  ('mealpick — 오늘의 식단', '/media/mealpick.webp'),
  ('SW-ICT-notice — 학교 공지 디스코드 알리미', '/media/sw-ict-notice.webp'),
  ('NEON RIFT — 3D 웹 사격 게임', '/media/neon-rift.webp')
) AS v(title, url)
WHERE p.title = v.title AND p.thumbnail_url IS NULL;
