# 병원 마케팅 헬스체크 - 서비스 구조

## 서비스 개요

병원의 마케팅 현황을 3분 만에 진단하고, 즉시 실행 가능한 개선안을 제시하는 설문 기반 진단 도구

## 아키텍처

### 프론트엔드
- **Framework**: React + TypeScript + Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **상태 관리**: React Query
- **라우팅**: React Router

### 백엔드
- **Database**: PostgreSQL (Supabase)
- **인증**: Supabase Auth (선택적)
- **저장소**: Supabase Storage (PDF 리포트용)
- **이메일**: Supabase Edge Functions

## 디렉토리 구조

```
src/
├── components/
│   ├── survey/              # 설문 관련 컴포넌트
│   │   ├── SurveyStart.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── questions/       # 각 질문별 컴포넌트
│   ├── results/             # 결과 페이지 컴포넌트
│   │   ├── ScoreCard.tsx
│   │   ├── DiagnosisCard.tsx
│   │   ├── BestCaseComparison.tsx
│   │   └── SolutionCard.tsx
│   └── ui/                  # shadcn/ui 컴포넌트
├── lib/
│   ├── scoring/             # 점수 계산 로직
│   │   └── scoreCalculator.ts
│   ├── diagnosis/           # 진단 로직
│   │   ├── diagnosisEngine.ts
│   │   └── types.ts
│   └── supabase/           # Supabase 클라이언트
│       └── client.ts
├── pages/
│   ├── Index.tsx           # 랜딩 페이지
│   ├── Survey.tsx          # 설문 페이지
│   └── Results.tsx         # 결과 페이지
├── types/
│   └── survey.ts           # 타입 정의
└── data/
    ├── questions.ts        # 질문 데이터
    └── benchmarks.ts       # 벤치마크 데이터
```

## 데이터베이스 스키마

### surveys 테이블
설문 응답 저장
- id (uuid, primary key)
- created_at (timestamp)
- location (text)
- hospital_size (text)
- specialties (text[])
- budget (text)
- channels (jsonb)
- responses (jsonb) - 전체 응답 데이터

### survey_results 테이블
진단 결과 저장
- id (uuid, primary key)
- survey_id (uuid, foreign key)
- total_score (integer)
- category_scores (jsonb)
- primary_issue (text)
- secondary_issues (text[])
- market_characteristics (jsonb)
- created_at (timestamp)

### leads 테이블
리드 정보 관리
- id (uuid, primary key)
- survey_id (uuid, foreign key)
- name (text)
- email (text)
- phone (text)
- conversion_type (text) - consultation/download/later
- created_at (timestamp)

### benchmarks 테이블
벤치마크 데이터
- id (uuid, primary key)
- specialty (text)
- location (text)
- avg_score (integer)
- best_case_score (integer)
- best_case_story (jsonb)
- updated_at (timestamp)

## 핵심 모듈

### 1. 설문 엔진 (Survey Engine)
- 질문 순서 관리
- 조건부 분기 처리
- 응답 검증
- 진행률 추적

### 2. 스코어링 엔진 (Scoring Engine)
- 카테고리별 점수 계산
- 총점 산출
- 레벨 판정

### 3. 진단 엔진 (Diagnosis Engine)
- 주요 문제 유형 판정
- 부가 문제 식별
- 업종×지역 특성 분석
- 강점 영역 발견

### 4. 솔루션 매칭 (Solution Matching)
- 문제 유형별 솔루션 매핑
- 우선순위 결정
- 맞춤형 개선안 생성

### 5. 비교 분석 (Comparison Analysis)
- 업계 평균 계산
- BEST CASE 매칭
- 격차 분석

## 주요 기능

### Phase 1 (MVP)
✅ 기본 설문 시스템
✅ 7가지 진단 유형
✅ 결과 페이지
✅ 이메일 수집

### Phase 2 (계획)
- 업종별 분기 로직
- BEST CASE 비교
- 이메일 자동화
- 모바일 최적화

### Phase 3 (계획)
- 실시간 벤치마킹
- 맞춤형 리포트 생성
- CRM 연동
- A/B 테스트 시스템

## 개발 가이드라인

### 모듈 독립성
- 각 기능은 독립된 모듈로 개발
- 모듈 간 의존성 최소화
- 명확한 인터페이스 정의

### 코드 구조
- 기능별로 폴더 분리
- 타입 정의 분리
- 재사용 가능한 컴포넌트

### 데이터 관리
- 클라이언트 상태: React Query
- 로컬 상태: useState/useReducer
- 폼 상태: React Hook Form

## 배포

- **프론트엔드**: Lovable 자동 배포
- **데이터베이스**: Supabase 호스팅
- **도메인**: 커스텀 도메인 연결 가능
