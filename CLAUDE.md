# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**MedicoScan (병원 마케팅 진단 시스템)**은 10개 질문 설문조사를 통해 병원의 마케팅 현황을 진단하고 맞춤형 개선안을 제공하는 웹 애플리케이션입니다.

**핵심 목적**: 3분 안에 병원 마케팅을 100점 만점으로 평가하고, 7가지 유형별 맞춤 솔루션(즉시/단기/중장기)을 제공

## 주요 명령어

### 개발 환경
```bash
# 개발 서버 시작 (포트 8080)
npm run dev

# 프로덕션 빌드
npm run build

# 개발 환경 빌드
npm run build:dev

# 프로덕션 미리보기
npm run preview

# 린트 실행
npm run lint
```

### 테스트
- 현재 테스트 프레임워크 미설정
- 테스트 추가 시 Vitest 사용 권장 (Vite 기반 프로젝트)

## 아키텍처 & 핵심 개념

### 시스템 플로우
```
사용자 설문 → 스코어링 엔진 → 진단 엔진 → 솔루션 매칭 → 결과 표시
     ↓              ↓                ↓                ↓
  surveys     scoring modules   diagnosisEngine  actionGenerator
   (DB)       (30+25+25+20점)   (7가지 유형)     (3가지 기간)
```

### 핵심 아키텍처 원칙

1. **모듈 독립성**: 각 엔진(스코어링, 진단, 솔루션)은 독립적으로 동작
   - 스코어링: `src/lib/scoring/`의 순수 계산 함수
   - 진단: `src/lib/diagnosis/`의 가중치 우선순위 로직
   - 솔루션: `src/lib/solutions/`의 템플릿 기반 매칭

2. **4개 카테고리 스코어링 시스템** (총 100점):
   - 채널 활용도: 30점
   - 운영 관리: 25점
   - 성과 측정: 25점
   - 예산 규모: 20점

3. **7가지 진단 유형** (우선순위 순서):
   - Type 7: 원툴형 - 가중치 0.95
   - Type 1: 네이버 의존 과다형 - 가중치 0.9
   - Type 2: 디지털 사각지대형 - 가중치 0.9
   - Type 4: 방치 운영형 - 가중치 0.85
   - Type 5: 성과 맹목형 - 가중치 0.85
   - Type 3: 무분별 살포형 - 가중치 0.8
   - Type 6: 온라인 마케팅 소극형 - 가중치 0.75

### 핵심 비즈니스 로직

#### 피부과/성형외과 특별 처리
- Q2에서 **1순위와 2순위** 진료 분야를 ranking 타입으로 선택
- **중요**: 2순위가 "피부과/성형외과"인 경우도 1순위로 처리:
  - Q4-1 (상업적 플랫폼 활용) 질문 표시
  - Type 6 진단 로직 적용
  - 플랫폼 점수 계산 (10점)
- 데이터 구조: `specialties: { selected: string[], ranking: { [key: string]: number } }`

#### 진단 우선순위 로직
진단 엔진은 엄격한 순서로 조건 체크 (Type 7 → Type 1 → ... → Type 6). 가장 높은 가중치를 가진 첫 번째 매칭 조건이 주요 문제가 됩니다.

Type 7 (원툴형) 예시:
```typescript
channels.selected.length <= 2
&& top1Ratio === '70% 이상'
&& (channelReason === '이전에_이_채널에서_성과가_좋았음'
    || newChannelAttempt === '지금_채널만으로_충분해서_시도할_필요_없음')
```

#### 조건부 질문 표시
- Q4-1은 Q2에서 "피부과/성형외과"를 포함할 때만 표시 (`specialties.selected` 배열 확인)
- **주의**: 2순위가 "피부과/성형외과"인 경우도 이 조건을 충족함

## 데이터 스키마 핵심 사항

### SurveyResponse 타입 구조
```typescript
// Q1: 위치 AND 규모 (multi-select 타입)
location_and_size?: { location: string; hospital_size: string }

// Q2: 진료 분야 (ranking 타입, selected 배열 포함)
specialties?: { selected: string[]; ranking: { [key: string]: number } }

// Q4: 채널 (ranking 타입, selected 배열 포함)
channels?: { selected: string[]; ranking: { [key: string]: number } }

// Q8: 신규 환자 파악 방법 (checkbox - 배열)
trackingMethods?: string[]

// Q9: 온라인 현황 (checkbox - 2개 배열)
onlineStatusPositive?: string[]
onlineStatusNegative?: string[]
```

### 데이터베이스 테이블 (Supabase)
- `surveys`: 원시 설문 응답
- `survey_results`: 계산된 점수 및 진단 결과
- `leads`: 연락처 정보 및 전환 추적
- `benchmarks`: 업계 평균 및 베스트 케이스

**중요**: 요구사항에 따라 모든 테이블의 RLS (Row Level Security)가 **비활성화**되어 있습니다.

## 문서 구조 (4-Layer)

이 프로젝트는 엄격한 4-Layer 문서 시스템을 사용합니다. **변경사항 발생 시 관련 문서를 반드시 업데이트하세요**.

### Layer 1: Core Architecture (100% 정확도 필요)
- `docs/01-architecture.md`: 시스템 구조, 컴포넌트, 라우팅
- `docs/02-domain-logic.md`: **스코어링 공식 및 진단 로직** (비즈니스 로직 변경 시 필수 참조)
- `docs/03-data-schema.md`: 데이터베이스 스키마, TypeScript 타입, 질문 구조

### Layer 2: Process & Flow (90% 정확도)
- `docs/04-userflow.md`: 사용자 여정 및 UX 시나리오
- `docs/05-implementation-guide.md`: 개발 가이드라인 및 베스트 프랙티스

### Layer 3: Documentation (80% 정확도)
- `README.md`: 프로젝트 개요 및 시작 가이드

### Layer 4: Live Tracking
- `docs/06-progress.md`: 현재 작업 상태 및 히스토리

### 문서 업데이트 규칙 (중요)
코드 수정 시:
1. 비즈니스 로직, 타입, 아키텍처 변경 시 Layer 1 문서를 **동시에 업데이트**
2. 프로세스 변경 시 Layer 2 문서 업데이트 필요 여부 **확인**
3. 작업 완료 시 Layer 4 (progress)를 **항상 업데이트**
4. 문서의 코드 예시가 실제 구현과 **일치하는지 검증**

상세한 동기화 규칙은 `docs/REFERENCE_RULES.md` 참조

## 개발 가이드라인

### 모듈 구조
```
src/
├── components/     # 재사용 가능한 UI 컴포넌트 (설문 질문, 결과 표시)
│   ├── survey/    # RadioQuestion, CheckboxQuestion, RankingQuestion 등
│   └── ui/        # shadcn/ui 컴포넌트
├── pages/         # 라우트 페이지 (Index, Survey, Results, NotFound)
├── lib/           # 순수 비즈니스 로직 (UI 없음)
│   ├── scoring/   # 점수 계산 모듈 (scoreCalculator, channelScore 등)
│   ├── diagnosis/ # 진단 엔진 (diagnosisEngine, issueDetectors)
│   └── solutions/ # 솔루션 생성 (actionGenerator, actionTemplates)
├── types/         # TypeScript 타입 정의 (survey.ts)
└── data/          # 정적 데이터 (questions.ts)
```

### 상태 관리 전략
- **서버 상태**: React Query (Supabase 쿼리용)
- **로컬 상태**: useState/useReducer (설문 진행도, 현재 질문)
- **폼 상태**: React Hook Form + Zod (리드 캡처 폼)

### 스코어링 구현 패턴
각 카테고리는 `src/lib/scoring/`에 독립 모듈:
- `channelScore.ts` (30점): 채널 수 + 다양성 + 플랫폼 활용
- `operationScore.ts` (25점): 업데이트 빈도 + 관리 체계
- `measurementScore.ts` (25점): 추적 방법 + 온라인 현황
- `budgetScore.ts` (20점): 예산 규모별 매핑

모두 `scoreCalculator.ts`에서 import하여 총점(0-100) 계산 및 레벨(1-4) 결정

### 진단 구현 패턴
`src/lib/diagnosis/diagnosisEngine.ts`에 위치:
1. 7가지 이슈 타입을 우선순위 순서로 체크
2. 가중치와 함께 이슈 수집
3. 가장 높은 가중치를 가진 이슈를 주요 문제로 반환
4. 카테고리 점수 기반으로 부가 문제 반환

### 질문 타입 & 컴포넌트
- **radio**: 단일 선택 (RadioQuestion.tsx)
- **checkbox**: 다중 선택 (CheckboxQuestion.tsx)
- **ranking**: 순위 매기기 (RankingQuestion.tsx)
- **multi-select**: 메인 선택 + 하위 질문 (MultiSelectQuestion.tsx)
- **dropdown**: 드롭다운 선택 (DropdownQuestion.tsx)

각 질문 타입에는 검증 로직이 내장되어 있습니다. 검증 규칙은 `docs/01-architecture.md` 섹션 6 참조

## 일반적인 개발 작업

### 새 질문 추가하기
1. `src/data/questions.ts`에 질문 객체 추가
2. `src/types/survey.ts`의 `SurveyResponse` 타입 업데이트
3. 점수에 영향을 준다면: `src/lib/scoring/`의 관련 scorer 업데이트
4. 진단에 영향을 준다면: `diagnosisEngine.ts` 로직 업데이트
5. `docs/03-data-schema.md`에 새 질문 상세 정보 **업데이트**
6. 점수/진단 변경 시 `docs/02-domain-logic.md` **업데이트**

### 스코어링 로직 수정하기
1. `docs/02-domain-logic.md` 섹션 4에서 현재 공식 **먼저 읽기**
2. `src/lib/scoring/`의 scorer 모듈 수정
3. 샘플 데이터로 테스트하여 점수 범위 확인 (channel 0-30, operations/measurement 0-25, budget 0-20)
4. 새 공식으로 `docs/02-domain-logic.md` **즉시 업데이트**
5. 예시와 코드 블록을 구현과 일치하도록 업데이트

### 새 진단 유형 추가하기
1. `docs/02-domain-logic.md` 섹션 1에서 기존 유형 **읽기**
2. `src/lib/diagnosis/diagnosisEngine.ts`에 조건 로직 추가
3. 우선순위 가중치 할당 (높을수록 먼저 체크)
4. `src/lib/solutions/actionTemplates.ts`에 솔루션 생성
5. 새 유형 정의로 `docs/02-domain-logic.md` **업데이트**
6. 문서의 진단 플로우 다이어그램 업데이트

### 조건부 질문 작업하기
- 질문 정의의 `conditional` 필드 확인
- Q4-1 예시: `specialties.selected`에 "피부과/성형외과" 포함 시만 표시
- 피부과/성형외과의 **1순위와 2순위 모두** 확인해야 함
- 조건부 렌더링은 `Survey.tsx` 페이지 로직에서 처리

## 중요한 제약사항 및 주의점

1. **피부과/성형외과 2순위**: 순위 위치와 관계없이 항상 `specialties.selected` 배열에 "피부과/성형외과"가 있는지 확인
2. **Ranking 타입 데이터**: `channels`와 `specialties`는 단순 배열이 아니라 `selected`(배열) 및 `ranking`(객체)을 포함하는 객체
3. **점수 경계**: 카테고리별 최대 점수(30/25/25/20)를 절대 초과하지 않도록
4. **진단 우선순위**: 타입 체크 순서가 중요 - 먼저 체크된 것이 우선
5. **문서 동기화**: 문서 업데이트 없는 코드 변경은 4-Layer 시스템을 파괴함
6. **RLS 비활성화**: 모든 Supabase 테이블은 RLS가 꺼져 있음 - 인증 불필요하지만 데이터 접근 주의

## 기술 스택 세부사항

- **React 18.3.1** + TypeScript
- **Vite** 빌드 도구 (개발 서버 포트 8080)
- **Tailwind CSS** + **shadcn/ui** 스타일링
- **React Router v6** 라우팅
- **React Query** 서버 상태 관리
- **Supabase** PostgreSQL 데이터베이스
- **React Hook Form + Zod** 폼 검증
- **Lucide React** 아이콘

## 디자인 시스템
- 컬러 스킴: 의료용 블루-그린 테마 (HSL 기반)
- 커스텀 그라데이션: `--gradient-primary`, `--gradient-secondary`, `--gradient-hero`
- `src/index.css`에 정의
- 컴포넌트 variants는 `class-variance-authority` (cva) 사용

## 향후 확장 관련 노트
- 업계 벤치마킹 시스템 준비 완료 (benchmarks 테이블 존재)
- 이메일 육성 단계 정의됨 (0-7) 하지만 자동화 미구현
- 베스트 케이스 비교 로직 설계되었으나 UI 구현 필요
- ROI 시뮬레이션 함수는 `src/lib/solutions/roiSimulator.ts`에 존재

## 확실하지 않을 때
1. **비즈니스 로직**: `docs/02-domain-logic.md` 확인
2. **데이터 구조**: `docs/03-data-schema.md` 확인
3. **컴포넌트 관계**: `docs/01-architecture.md` 확인
4. **구현 방법**: `docs/05-implementation-guide.md` 확인
5. **언어**: 모든 사용자 대면 텍스트, 질문, 결과는 한글
