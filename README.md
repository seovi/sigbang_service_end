# 식방 서비스 종료 사이트

기존 API/Web npm workspace와 분리된 Next.js App Router 프로젝트입니다. 런타임 의존성은 Next.js, React, React DOM뿐입니다. 기존 앱/인프라를 삭제하거나 실제 도메인을 전환하지 않습니다.

독립 저장소: https://github.com/seovi/sigbang_service_end

로컬 경로: `C:\Repo\sigdang_service_end`. 앱 파일은 저장소 루트에 있습니다.

## 실행 및 검증

Node.js 22 LTS 이상을 사용합니다. 반드시 이 디렉터리에서 실행하세요.

```sh
npm ci
npm run build
npm run typecheck
node node_modules/next/dist/bin/next start --port 3100
# 다른 터미널에서
npm run test:http
curl -I http://localhost:3100/recipe/123
```

`test:http`는 GET/HEAD 상태, Location 헤더 부재, 410 HTML, robots 및 홈의 실제 Next.js 자산 응답을 확인합니다. 배포 후 `npm run test:http -- https://실제도메인`으로 동일하게 확인합니다. noindex 활성화 시 검증 명령의 환경 변수도 동일하게 지정하세요.

## 안내 설정

`.env.example`을 `.env.local`로 복사하거나 Vercel 프로젝트 환경 변수에 다음 **공개 안내 값만** 설정합니다.

| 변수 | 기본값 | 용도 |
| --- | --- | --- |
| SERVICE_NAME | 식방 | 브랜드명 |
| SERVICE_END_DATE | 2026년 XX월 XX일 | 종료일 표시 문자열 |
| CONTACT_EMAIL | 빈 값 | 실제 문의 이메일; 미설정이면 준비 중 안내 |
| SERVICE_END_PAGE_NOINDEX | false | true일 때 홈 noindex |

설정은 `config/service.ts`에 모여 있습니다. 전체 본문/버튼/푸터 문구도 이 파일에서 수정합니다. 환경 변수만 바꾸면 코드 수정은 필요 없지만 **홈이 정적 페이지이므로 변경 후 반드시 재배포**해야 합니다. 배포 전에 종료일과 수신 가능한 실제 문의 이메일을 확정하세요. 개인정보 처리 안내는 실제 처리 방침과 일치하는지 운영자가 확인해야 합니다.

## HTTP 및 색인 정책

- `/`: 정적 홈, 200. 기본 index/follow. title, description, 최소 Open Graph는 `config/metadata.ts`.
- `/robots.txt`: 200, `User-Agent: *`, `Allow: /`. 삭제 URL 크롤링 허용, sitemap 미기재.
- 제공하는 `/favicon.svg`, `/notice.css`와 실제 `/_next/*` 자산: 200.
- 나머지 서비스 URL: `app/[...path]/route.ts`에서 `Response`의 status를 **410**으로 직접 지정. GET/HEAD 및 일반 HTTP 메서드에 동일 정책. 별도 백엔드/미들웨어 없음.
- 410은 한국어 HTML, 홈 링크, `X-Robots-Tag: noindex, follow`를 함께 제공. 환경 변수 문자열은 HTML escape 처리.
- public 파일과 명시적 App Router 경로가 catch-all보다 우선합니다. 존재하지 않는 Next.js 내부 자산은 프레임워크의 오류 응답(일반적으로 404)을 유지합니다.
- 상세 URL을 홈으로 리다이렉트하지 않습니다. trailing slash 정규화 리다이렉트도 끕니다.
- sitemap은 생성하지 않으며 `/sitemap.xml`, 과거 sitemap 경로도 410. 기존 앱의 sitemap 코드/파일은 이 프로젝트에 포함되지 않습니다.
- 410 응답은 CDN에서 최대 1시간 캐시하도록 설정합니다. 내용 변경 시 재배포/캐시 갱신 후 확인하세요.

완전한 `output: export`는 사용하지 않습니다. 임의 경로에 실제 410을 반환하려면 Next.js Route Handler를 실행하는 Vercel 함수가 필요합니다.

## Vercel 배포

1. GitHub의 **seovi/sigbang_service_end** 저장소를 Import합니다. Framework Preset: **Next.js**, Root Directory: **./** (기본값), Node.js: **22.x**. 하위 폴더를 지정하지 않습니다.
2. Install Command: `npm ci`, Build Command: `npm run build`. Output Directory는 기본값. 루트 외 소스 포함 옵션은 사용하지 않습니다.
3. 기존 서비스의 환경 변수를 가져오지 말고 위 공개 설정만 추가합니다. Analytics/Speed Insights 등 SDK도 추가하지 않습니다.
4. Preview에서 HTTP 검증 후 기존 도메인을 이 프로젝트로 연결합니다. 실제 배포/도메인 전환은 별도 운영 작업입니다.
5. 별도 `vercel.json` 상태 코드 규칙은 필요 없습니다. 기존 Vercel/CDN의 wildcard 리다이렉트, rewrite, 프록시, 캐시가 예전 앱으로 보내거나 홈 200으로 덮어쓰지 않는지 확인합니다.
6. 도메인 유지/DNS/TLS를 유지합니다. 도메인 정규화나 HTTP→HTTPS 이동이 있으면 최종 HTTPS의 각 상세 경로가 410인지 확인합니다.
7. Search Console 자산과 소유권 인증을 유지합니다. DNS 인증은 유지하고, 기존 HTML 인증 파일/메타태그 방식이면 해당 공개 인증 정보를 새 프로젝트에 옮겨야 합니다. 기존 sitemap 제출을 정리하고 색인 감소/404·410 상태를 모니터링합니다. 임시 삭제 기능에 의존하지 않습니다.

실제 Vercel 환경의 응답은 배포 후 다시 확인해야 합니다. 색인 제거 시점은 검색엔진 재크롤링 주기에 따라 달라집니다. Next.js 보안 업데이트는 정기적으로 확인하세요.

## 외부 의존성과 비밀정보

기존 React Query, Axios, 이미지 편집 라이브러리, Zod, Tailwind, 외부 폰트 패키지를 가져오지 않았습니다. API, DB, Supabase, 로그인, 세션, Analytics, 광고, Push 및 외부 폰트/이미지 호출이 없습니다. 기존 `.env`나 비밀정보를 복사하지 않습니다. 기존 API/DB/클라우드 자원의 실제 종료와 키 폐기는 이 프론트엔드 생성과 별도 작업입니다.

## 참고

- [Next.js Route Handler](https://nextjs.org/docs/app/api-reference/file-conventions/route)
- [Next.js trailing slash 설정](https://nextjs.org/docs/app/api-reference/config/next-config-js/skipTrailingSlashRedirect)
- [Google의 HTTP 오류 처리](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)

## 구현 시 검증 결과 (2026-09-16)

- Next.js 16.3.5 / React 19.3.0, Node.js 22.13.1에서 프로덕션 빌드 및 TypeScript 검사 통과.
- 로컬 프로덕션 서버 `http://localhost:3100`에서 `npm run test:http` 통과: 18개 경로의 GET/HEAD 36건 및 홈에 포함된 Next.js 자산 200 확인.
- `curl.exe -I` 실제 헤더는 `curl-results.txt` 참고. 홈/robots 200, recipe/menu/unknown/gone/sitemap 및 trailing slash 상세 URL 410. Location 헤더 없음.
- 홈 index/follow, 410 HTML과 홈 링크, X-Robots-Tag, robots 크롤링 허용 자동 확인.
- 신규 app/components/config/public 및 환경 변수 예제에서 JWT·AWS 키·개인 키·DB URL·기존 비밀 환경 변수 패턴 미검출. 기존 환경 파일은 복사하지 않음. 이 검사는 기존 저장소 전체 비밀정보 감사는 아님.
- 연결 가능한 브라우저가 없어 모바일/태블릿/PC 실제 화면의 시각 검증은 미수행. CSS는 유동 폭, clamp 글자/여백, 긴 문자열 줄바꿈 및 키보드 focus 스타일로 구성.
- 실제 Vercel 배포/도메인 전환은 미수행. 배포 후 최종 도메인에서 같은 검증 필요.

생성 파일: `.gitignore`, `.env.example`, `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/robots.ts`, `app/[...path]/route.ts`, `components/ServiceEnded.tsx`, `config/service.ts`, `config/metadata.ts`, `public/notice.css`, `public/favicon.svg`, `scripts/check-http.mjs`, `curl-results.txt`, `README.md`. 기존 파일 변경 없음.
