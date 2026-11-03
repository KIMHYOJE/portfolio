-- =============================================
-- 003: 2026_대회활동_정리 폴더 증빙으로 기존 항목 보강 + 신규 4건 추가
-- 기존 STAR 칸에 이미 쓴 내용은 덮어쓰지 않습니다(coalesce). 여러 번 실행해도 안전합니다.
-- =============================================

-- 1. 겹치는 항목 보강 (상장·결과 PDF·신청서에서 확인된 사실만)

-- 게임 해커톤: 상장 제2026-958호 "대상 · 팀 RE:제로"
UPDATE public.portfolio_items SET
  organizer    = '울산정보산업진흥원(울산글로벌게임센터)·울산대 SW중심대학사업단',
  problem_text = coalesce(problem_text, '‘AI를 활용한 게임’을 주제로 팀별로 기획한 뒤 Unity로 게임 콘텐츠를 이틀 안에 완성하는 해커톤. 5인 팀 RE:제로의 팀원으로 참가했습니다.'),
  result_text  = coalesce(result_text, '대상 수상 (울산정보산업진흥원장상, 제2026-958호)')
WHERE title = '2026 울산 게임 콘텐츠 개발 해커톤 대회';

-- 디지털 콘텐츠 공모전: 심사 결과 PDF "기술 부문 우수 · 김효제 · 500,000원"
UPDATE public.portfolio_items SET
  problem_text = coalesce(problem_text, '‘디지털 기술을 활용하여 나를 표현한 창의적 콘텐츠’라는 주제의 교내 공모전. 출품작은 인터랙티브 자기소개 웹사이트 「효제의 디지털 자기소개 – 관찰하고, 만들고, 완성하는 사람」입니다.'),
  action_text  = coalesce(action_text, 'Next.js·React·TypeScript로 데스크톱과 모바일에 맞는 반응형 사이트를 만들고, 인터랙티브 사이드바와 프로젝트 탐색 화면에 실제 프로젝트 캡처와 수상·수료 기록을 연결했습니다.' || chr(10) || chr(10) || 'Potens AI Chat API로 제 프로젝트 기록에 답하는 AI 페르소나를 구현했습니다. AI가 확인되지 않은 내용을 지어내지 않도록, 프로젝트별 역할·사용 기술·수상 여부를 구분하는 시스템 프롬프트를 설계했습니다.'),
  result_text  = coalesce(result_text, '기술 부문 우수상 (시상금 500,000원)')
WHERE title = '2026학년도 디지털 콘텐츠 창작 공모전';

-- 로봇OS 챌린지: 상장 "3등 · 8조", 공식 안내(특강 5/9·5/23·5/30)
UPDATE public.portfolio_items SET
  start_date   = '2026-05-09',
  end_date     = '2026-05-30',
  problem_text = coalesce(problem_text, '3주 실습형 로봇OS 특강(5/9·5/23·5/30)과 연계된 피지컬 AI 챌린지. 9개 팀 약 54명이 6인 1팀으로 참가했고, 저는 8조였습니다. 본 대회는 5월 30일 울산대학교 AI·DX센터에서 열렸습니다.'),
  result_text  = coalesce(result_text, '3등 (8조) · 특강 수료증 취득')
WHERE title = '2026 UOU 로봇OS 특강+ 피지컬AI 챌린지';

-- 부울경 해커톤: 참가신청서 "팀장 김효제 · 4인 · 기획/프로그래머"
UPDATE public.portfolio_items SET
  organizer    = '부산·울산·경남 6개 대학 공동 주관 (국립부경대 대연캠퍼스)',
  problem_text = coalesce(problem_text, '‘AI + X’를 주제로 한 무박 2일 해커톤. 4인 팀의 팀장으로 참가해 기획과 프로그래밍을 맡았습니다.' || chr(10) || chr(10) || '아이템: Sea Clean Priority AI(OceanSnap) — 해양 쓰레기 사진을 AI로 분류하고 수거 우선순위를 추천하는 서비스')
WHERE title = '2026 제11회 [부·울·경] AI융합해커톤';

-- CCE: 공식 홈페이지 일정·분야
UPDATE public.portfolio_items SET
  organizer    = '국가정보원 주최 · 국가보안기술연구소 주관',
  problem_text = coalesce(problem_text, '온라인 예선(2026.08.22 09:00~18:00)에 참가했습니다. 출제 분야는 웹해킹, 포너블, 리버싱, 포렌식, 암호, AI입니다.')
WHERE title = '사이버공격방어대회 (CCE)';

-- 2. 신규 항목 (같은 제목이 있으면 건너뜀)
INSERT INTO public.portfolio_items
  (category, domain_tag, title, scope_type, organizer, start_date, end_date, status, is_awarded, award_rank, is_featured, is_published, problem_text, result_text)
SELECT * FROM (VALUES
  ('CERT', 'ALGO_SEC', 'TOPCIT 소프트웨어 역량 검정', '교외', '정보통신기획평가원(IITP)',
   '2026-05-16'::date, NULL::date, 'ANNOUNCED', false, NULL, false, true,
   '소프트웨어 개발, 데이터 관리, 시스템 아키텍처와 정보보안, IT비즈니스 4개 모듈로 소프트웨어 실무 역량을 평가하는 국가 검정입니다.',
   '수준 2 취득'),
  ('COMPETITION', 'OTHER', '2026학년도 학습 포트폴리오 공모전', '교내', '울산대 교수학습개발센터',
   '2026-10-07'::date, '2026-11-13'::date, 'IN_PROGRESS', false, NULL, false, true,
   '‘슬기로운 학습생활 공모전’의 하나로, 한 학기의 학습 목표·과정·성과를 STAR 기법으로 정리한 학습 포트폴리오를 제출했습니다.',
   NULL),
  ('COMPETITION', 'OTHER', '진로심리상담센터 프로그램 참여 후기 공모전', '교내', '울산대 진로심리상담센터',
   '2026-06-09'::date, NULL::date, 'COMPLETED', false, NULL, false, true,
   'MBTI 심리검사 DAY, 관계 성장 집단상담, 센터 특화 교육(타로)에 참여(2026.04.07~05.27)한 뒤, 내향적인 성격을 인정하면서도 먼저 말을 거는 용기를 얻은 과정을 에세이로 제출했습니다.',
   NULL),
  -- 신청서만 확인됨: 실제 일정·참가 여부를 /admin에서 채운 뒤 공개로 전환
  ('COMPETITION', 'AI_DATA', '[RISE] 울산대-인천대 초광역 지역문제 해결형 해커톤', '권역연합', 'RISE사업단 (울산대학교·인천대학교)',
   '2026-07-18'::date, NULL::date, 'COMPLETED', false, NULL, false, false,
   '울산광역시 지역 현안을 주제로 한 2박 3일 해커톤에 참가를 신청했습니다.',
   NULL)
) AS v(category, domain_tag, title, scope_type, organizer, start_date, end_date, status, is_awarded, award_rank, is_featured, is_published, problem_text, result_text)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_items p WHERE p.title = v.title);
