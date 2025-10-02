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

## 컴포넌트 정의 및 코드 매핑

### 페이지 컴포넌트

#### Index.tsx - 랜딩 페이지 (`/`)
- **Hero Section**: 서비스 소개 및 CTA
- **Features Section**: 주요 기능 3가지 소개
- **Benefits Section**: 사용 효과
- **Trust Section**: 신뢰성 요소

#### Survey.tsx - 설문 페이지 (`/survey`)
질문 UI는 3가지 영역으로 구성:

**1. 질문 헤더 (Question Header)** - lines 150-168
- 섹션 배지 (Section Badge): 현재 섹션 표시
- 질문 제목 (Question Title): 메인 질문
- 질문 설명 (Question Description): 부연 설명

**2. 질문 서브 (Question Sub-header)** - lines 171-175
- 질문 타입 힌트 (Question Type Hint): 선택 방법 안내

**3. 선택지 (Question Options)** - lines 178+
- 질문 타입에 따라 동적으로 렌더링되는 영역

#### Results.tsx - 결과 페이지 (`/results/:id`)
- **Score Card**: 총점 및 레벨 표시
- **Diagnosis Card**: 진단 내용
- **Solutions Card**: 맞춤형 개선안
- **CTA Section**: 상담 신청 / 리포트 다운로드

### 설문 질문 컴포넌트

#### RadioQuestion.tsx
- **용도**: 단일 선택 질문
- **데이터**: `type: "radio"`
- **예시**: Q1(location), Q2(hospital_size), Q4(budget)

#### CheckboxQuestion.tsx
- **용도**: 다중 선택 질문
- **데이터**: `type: "checkbox"`
- **예시**: Q3(specialties)

#### RankingQuestion.tsx
- **용도**: 순위 매기기 질문
- **데이터**: `type: "ranking"`
- **예시**: Q10(main_problems)

#### MultiSelectQuestion.tsx
- **용도**: 복합 선택 질문 (메인 질문 + 서브 질문)
- **데이터**: `type: "multiselect"`, `subQuestions` 포함
- **구조**:
  - 메인 옵션 체크박스
  - 각 옵션별 서브 질문 (radio 또는 dropdown)
- **예시**: Q5(channels), Q6(content), Q7(management), Q8(tracking)

#### DropdownQuestion.tsx
- **용도**: 드롭다운 선택 질문
- **데이터**: `type: "dropdown"`
- **사용처**: MultiSelectQuestion의 서브 질문으로 주로 사용

### 질문 데이터 구조 (questions.ts)

#### 질문 ID 매핑
- **Q1**: location (지역)
- **Q2**: hospital_size (규모)
- **Q3**: specialties (진료과목)
- **Q4**: budget (예산)
- **Q5**: channels (마케팅 채널)
- **Q6**: content (콘텐츠 업데이트)
- **Q7**: management (관리 현황)
- **Q8**: tracking (환자 추적)
- **Q9**: online_status (온라인 현황)
- **Q10**: main_problems (주요 문제)

#### 질문 타입별 검증 규칙
- **radio**: 단일 값 필수
- **checkbox**: 최소 1개 이상 선택
- **multiselect**: 선택된 메인 옵션의 서브 질문 필수 응답
- **ranking**: 지정된 개수만큼 순위 선택

### 미구현 컴포넌트

#### 스코어링 시스템
- `lib/scoring/scoreCalculator.ts`: 점수 계산 로직 (예정)
- 카테고리별 점수 계산
- 총점 및 레벨 판정

#### 진단 엔진
- `lib/diagnosis/diagnosisEngine.ts`: 진단 로직 (예정)
- 문제 유형 판정
- 맞춤형 솔루션 생성

#### 데이터베이스 연동
- Supabase 클라이언트 설정
- surveys, survey_results, leads 테이블 CRUD
- 벤치마크 데이터 조회

#### 전환 기능
- 이메일 수집 폼
- 상담 신청 폼
- PDF 리포트 생성

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
