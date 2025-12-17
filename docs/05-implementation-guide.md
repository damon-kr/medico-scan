# Layer 2: 구현 가이드 - 개발 순서 및 주의사항

> **문서 목적**: 기능 개발의 우선순위와 단계별 구현 방법을 안내합니다.  
> **참조 시점**: 새로운 기능 추가, 개발 계획 수립, 구현 방법 확인 시

---

## 1. 개발 우선순위

### Phase 1 (MVP) - 현재 진행 중
✅ 기본 설문 시스템  
✅ 7가지 진단 유형  
✅ 결과 페이지  
✅ 이메일 수집

### Phase 2 (고도화)
- [ ] 업종별 분기 로직
- [ ] BEST CASE 비교
- [ ] 이메일 자동화
- [ ] 모바일 최적화

### Phase 3 (확장)
- [ ] 실시간 벤치마킹
- [ ] 맞춤형 리포트 생성
- [ ] CRM 연동
- [ ] A/B 테스트 시스템

---

## 2. 핵심 모듈 구현 가이드

### 2.1 설문 엔진 (Survey Engine)

**위치**: `src/pages/Survey.tsx`, `src/components/survey/*`

**책임**:
- 질문 순서 관리
- 조건부 분기 처리
- 응답 검증
- 진행률 추적

**구현 체크리스트**:
- [ ] 질문 데이터 로드 (`questions.ts`)
- [ ] 현재 질문 상태 관리 (`currentQuestion`)
- [ ] 응답 객체 관리 (`responses`)
- [ ] 검증 로직 (`validateAnswer`)
- [ ] 조건부 로직 (피부과/성형외과 → Q4-1)
- [ ] 진행률 계산 (`progress`)
- [ ] 이전/다음 버튼 핸들링
- [ ] 로컬 저장 (localStorage)

**주의사항**:
- 질문 컴포넌트는 재사용 가능하도록 독립적으로 설계
- 응답 검증은 제출 전에 반드시 수행
- 조건부 질문은 동적으로 추가/제거

---

### 2.2 스코어링 엔진 (Scoring Engine)

**위치**: `src/lib/scoring/scoreCalculator.ts`

**책임**:
- 카테고리별 점수 계산
- 총점 산출
- 레벨 판정

**구현 체크리스트**:
- [ ] 채널 활용도 계산 (30점)
  - [ ] 채널 수 점수 (10점)
  - [ ] 채널 다양성 점수 (10점)
  - [ ] 플랫폼 활용도 점수 (10점)
- [ ] 운영 관리 계산 (25점)
  - [ ] 업데이트 주기 점수 (15점)
  - [ ] 관리 체계 점수 (10점)
- [ ] 성과 측정 계산 (25점)
  - [ ] 환자 추적 점수 (15점)
  - [ ] 온라인 현황 점수 (10점)
- [ ] 예산 규모 계산 (20점)
- [ ] 총점 합산 및 레벨 판정

**주의사항**:
- 모든 점수 계산 로직은 `02-domain-logic.md` 참조
- 피부과/성형외과는 플랫폼 점수 포함, 일반 진료과는 기본 10점
- 점수는 항상 0-100 범위 내에서 계산

---

### 2.3 진단 엔진 (Diagnosis Engine)

**위치**: `src/lib/diagnosis/diagnosisEngine.ts`

**책임**:
- 주요 문제 유형 판정
- 부가 문제 식별
- 업종×지역 특성 분석
- 강점 영역 발견

**구현 체크리스트**:
- [ ] 7가지 진단 유형 판정 로직
  - [ ] Type 1: 네이버 의존 과다형
  - [ ] Type 2: 디지털 사각지대형
  - [ ] Type 3: 무분별 살포형
  - [ ] Type 4: 방치 운영형
  - [ ] Type 5: 성과 맹목형
  - [ ] Type 6: 온라인 마케팅 소극형
  - [ ] Type 7: 원툴형
- [ ] 부가 문제 식별
- [ ] 시장 특성 매칭 (`getMarketCharacteristics`)

**주의사항**:
- 진단 로직의 우선순위 준수 (원툴형 > 네이버 의존 > ...)
- 가중치 기반으로 가장 심각한 문제를 주요 문제로 선정
- 부가 문제는 카테고리별 점수 기준으로 판단

---

### 2.4 솔루션 매칭 (Solution Matching)

**위치**: `src/lib/diagnosis/solutionMatcher.ts` (예정)

**책임**:
- 문제 유형별 솔루션 매핑
- 우선순위 결정
- 맞춤형 개선안 생성

**구현 체크리스트**:
- [ ] 진단 유형별 솔루션 데이터베이스
- [ ] 즉시 실행 과제 생성 (72시간)
- [ ] 단기 개선안 생성 (1개월)
- [ ] 중장기 전략 생성 (3-6개월)
- [ ] ROI 시뮬레이션 (`simulateROI`)

**주의사항**:
- 솔루션은 즉시 실행 가능하고 구체적이어야 함
- 각 진단 유형별로 3단계 솔루션 준비
- 업종/지역 특성 반영

---

### 2.5 비교 분석 (Comparison Analysis)

**위치**: `src/lib/analysis/comparisonAnalyzer.ts` (예정)

**책임**:
- 업계 평균 계산
- BEST CASE 매칭
- 격차 분석

**구현 체크리스트**:
- [ ] 업종별 평균 점수 조회
- [ ] 지역별 평균 점수 조회
- [ ] 규모별 평균 점수 조회
- [ ] 백분위 계산 (상위 몇 %)
- [ ] BEST CASE 매칭 (`findBestCase`)
- [ ] 격차 분석 (`calculateGap`)
- [ ] 기회비용 계산 (`calculateOpportunityCost`)

**주의사항**:
- benchmarks 테이블에서 실시간 데이터 조회
- 유사한 병원(업종+지역+규모) 우선 매칭
- 격차는 퍼센트로 표시

---

## 3. 데이터베이스 연동

### 3.1 Supabase 설정

**위치**: `src/lib/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**체크리스트**:
- [ ] Lovable Cloud 활성화
- [ ] 환경 변수 설정 (자동)
- [ ] 테이블 생성 (`03-data-schema.md` 참조)
- [ ] RLS 정책 비활성화
- [ ] 초기 벤치마크 데이터 삽입

---

### 3.2 CRUD 작업

#### 설문 응답 저장

```typescript
async function saveSurvey(responses: SurveyResponse) {
  const { data, error } = await supabase
    .from('surveys')
    .insert({
      ...responses,
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
```

#### 결과 저장

```typescript
async function saveSurveyResult(result: SurveyResult) {
  const { data, error } = await supabase
    .from('survey_results')
    .insert(result)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
```

#### 결과 조회

```typescript
async function getSurveyResult(surveyId: string) {
  const { data, error } = await supabase
    .from('survey_results')
    .select('*')
    .eq('survey_id', surveyId)
    .single();
    
  if (error) throw error;
  return data;
}
```

#### 리드 저장

```typescript
async function saveLead(lead: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
```

---

## 4. 개발 가이드라인

### 4.1 모듈 독립성

**원칙**: 각 기능은 독립된 모듈로 개발

**예시**:
```
❌ 나쁜 예:
- Survey.tsx 안에 스코어링 로직 포함
- Results.tsx 안에 진단 로직 포함

✅ 좋은 예:
- Survey.tsx → 설문 UI만 담당
- scoreCalculator.ts → 점수 계산만 담당
- diagnosisEngine.ts → 진단만 담당
```

**장점**:
- 독립적 테스트 가능
- 유지보수 용이
- 재사용 가능

---

### 4.2 코드 구조

**원칙**: 기능별로 폴더 분리, 타입 정의 분리, 재사용 가능한 컴포넌트

**디렉토리 규칙**:
```
src/
├── components/      # UI 컴포넌트 (재사용 가능)
├── pages/           # 페이지 컴포넌트 (라우팅)
├── lib/             # 비즈니스 로직 (순수 함수)
├── types/           # 타입 정의
├── data/            # 정적 데이터
└── hooks/           # 커스텀 훅
```

**명명 규칙**:
- 컴포넌트: PascalCase (`RadioQuestion.tsx`)
- 함수/변수: camelCase (`calculateScore`)
- 상수: UPPER_SNAKE_CASE (`MAX_SELECTIONS`)
- 타입/인터페이스: PascalCase (`SurveyResponse`)

---

### 4.3 데이터 관리

상태 관리 전략의 상세 내용은 [01-architecture.md 섹션 9](./01-architecture.md#9-상태-관리-전략)를 참조하세요.

**요약**:
- **서버 상태**: React Query (캐싱, 자동 갱신)
- **로컬 UI 상태**: useState/useReducer
- **폼 상태**: React Hook Form (검증, 에러 처리)

**원칙**: 적절한 상태 관리 도구 선택

---

## 5. 주의사항 및 베스트 프랙티스

### 5.1 성능 최적화

- [ ] 컴포넌트 메모이제이션 (`React.memo`)
- [ ] 콜백 메모이제이션 (`useCallback`)
- [ ] 불필요한 리렌더링 방지
- [ ] 이미지 lazy loading
- [ ] 코드 스플리팅 (페이지별)

---

### 5.2 에러 처리

```typescript
// ✅ 좋은 예
try {
  const result = await saveSurvey(responses);
  toast.success('설문이 저장되었습니다');
} catch (error) {
  console.error('Survey save error:', error);
  toast.error('저장에 실패했습니다. 다시 시도해주세요.');
}

// ❌ 나쁜 예
const result = await saveSurvey(responses); // 에러 처리 없음
```

---

### 5.3 로딩 상태 관리

```typescript
// ✅ 좋은 예
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await saveSurvey(responses);
  } finally {
    setIsLoading(false); // 성공/실패와 관계없이 로딩 해제
  }
};

return (
  <Button disabled={isLoading}>
    {isLoading ? '저장 중...' : '제출하기'}
  </Button>
);
```

---

### 5.4 검증 로직

```typescript
// ✅ 좋은 예: 명확한 에러 메시지
function validateCheckbox(value: string[], maxSelections?: number): string | true {
  if (!value || value.length === 0) {
    return '최소 1개를 선택해주세요.';
  }
  if (maxSelections && value.length > maxSelections) {
    return `최대 ${maxSelections}개까지 선택 가능합니다.`;
  }
  return true;
}

// ❌ 나쁜 예: 불명확한 에러
function validateCheckbox(value: string[]): boolean {
  return value && value.length > 0; // 에러 메시지 없음
}
```

---

### 5.5 타입 안전성

```typescript
// ✅ 좋은 예: 엄격한 타입
interface SurveyResponse {
  location: string; // 특정 값만 허용하려면 Union 타입 사용
  specialties: string[];
  // ...
}

// ❌ 나쁜 예: any 사용
const responses: any = {}; // 타입 안전성 상실
```

---

## 6. 테스트 전략

### 6.1 단위 테스트

**대상**: 순수 함수 (스코어링, 진단 로직)

```typescript
// scoreCalculator.test.ts
describe('calculateChannelScore', () => {
  it('should return 10 points for 3-5 channels', () => {
    expect(calculateChannelCountScore(3)).toBe(10);
    expect(calculateChannelCountScore(5)).toBe(10);
  });
  
  it('should return 7 points for 2 channels', () => {
    expect(calculateChannelCountScore(2)).toBe(7);
  });
});
```

---

### 6.2 통합 테스트

**대상**: 컴포넌트 + API 호출

```typescript
// Survey.test.tsx
describe('Survey Page', () => {
  it('should save survey and navigate to results', async () => {
    render(<Survey />);
    
    // Fill out the survey
    // ...
    
    // Submit
    fireEvent.click(screen.getByText('제출하기'));
    
    // Wait for API call
    await waitFor(() => {
      expect(screen.getByText('결과 페이지')).toBeInTheDocument();
    });
  });
});
```

---

## 7. 배포 전 체크리스트

### 7.1 기능 검증
- [ ] 모든 질문 정상 표시
- [ ] 조건부 로직 정상 작동 (피부과/성형외과)
- [ ] 응답 검증 정상 작동
- [ ] 점수 계산 정확성 확인
- [ ] 진단 결과 정확성 확인
- [ ] DB 저장 정상 작동

### 7.2 UX 검증
- [ ] 모바일 반응형 확인
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 진행률 표시 정확성
- [ ] 버튼 비활성화 로직

### 7.3 성능 검증
- [ ] 초기 로딩 시간 < 3초
- [ ] 페이지 전환 부드러움
- [ ] 이미지 최적화
- [ ] 불필요한 API 호출 제거

---

## 8. 문제 해결 가이드

### 8.1 자주 발생하는 문제

**문제**: Supabase 연결 실패
```
해결: 
1. Lovable Cloud 활성화 여부 확인
2. 환경 변수 자동 설정 확인
3. RLS 정책 비활성화 확인
```

**문제**: 타입 에러
```
해결:
1. types/survey.ts 파일 확인
2. 모든 필드가 올바른 타입인지 확인
3. optional 필드는 ? 표시
```

**문제**: 점수 계산 오류
```
해결:
1. 02-domain-logic.md의 계산 로직 확인
2. 각 카테고리 점수가 최댓값을 넘지 않는지 확인
3. 피부과/성형외과 분기 로직 확인
```

---

## 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|-----------|--------|
| 2025-01-XX | 초기 문서 작성 (3-Layer 구조 전환) | - |
