# 데이터베이스 스키마 설계

## 데이터 플로우

```
사용자 입력 (Survey) 
    ↓
설문 응답 저장 (surveys 테이블)
    ↓
스코어링 & 진단 (scoring/diagnosis 엔진)
    ↓
결과 저장 (survey_results 테이블)
    ↓
리드 수집 (leads 테이블)
```

## 테이블 상세 스키마

### 1. surveys (설문 응답)

```sql
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Q1: 병원 위치와 규모
  location TEXT NOT NULL,
  hospital_size TEXT NOT NULL,
  
  -- Q2: 주요 진료 분야 (최대 2개)
  specialties TEXT[] NOT NULL,
  
  -- Q3: 월 마케팅 예산
  budget TEXT NOT NULL,
  
  -- Q4: 사용 중인 마케팅 채널
  channels TEXT[] NOT NULL,
  top1_channel TEXT NOT NULL,
  top2_channel TEXT,
  top3_channel TEXT,
  
  -- Q4-1: (조건부) 상업적 플랫폼 활용
  commercial_platform TEXT,
  
  -- Q4-2: 채널 선택 이유
  channel_reason TEXT NOT NULL,
  
  -- Q4-3: 다른 채널 시도 경험
  new_channel_attempt TEXT NOT NULL,
  
  -- Q5: 채널별 비중
  top1_ratio TEXT NOT NULL,
  online_ratio TEXT NOT NULL,
  
  -- Q6: 콘텐츠 업데이트 주기
  update_frequency TEXT NOT NULL,
  
  -- Q7: 마케팅 관리 주체
  management TEXT NOT NULL,
  
  -- Q8: 신규 환자 파악 방법 (복수 선택)
  tracking_methods TEXT[] NOT NULL,
  
  -- Q9: 온라인 현황 (복수 선택)
  online_status_positive TEXT[],
  online_status_negative TEXT[],
  
  -- Q10: 가장 큰 문제 (최대 2개)
  main_problems TEXT[] NOT NULL,
  
  -- 완료 상태
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX idx_surveys_specialties ON surveys USING GIN(specialties);
CREATE INDEX idx_surveys_location ON surveys(location);
```

### 2. survey_results (진단 결과)

```sql
CREATE TABLE survey_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 점수 (100점 만점)
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  
  -- 카테고리별 점수
  channel_score INTEGER NOT NULL,      -- 채널 활용도 (30점)
  operation_score INTEGER NOT NULL,    -- 운영 관리 (25점)
  measurement_score INTEGER NOT NULL,  -- 성과 측정 (25점)
  budget_score INTEGER NOT NULL,       -- 예산 규모 (20점)
  
  -- 레벨 (1-4)
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 4),
  
  -- 진단 결과
  primary_issue TEXT NOT NULL,         -- 주요 문제 유형
  secondary_issues TEXT[],             -- 부가 문제 (1-2개)
  
  -- 업종×지역 특성
  market_characteristics JSONB NOT NULL,
  
  -- 강점 영역
  strengths TEXT[],
  
  -- 비교 분석
  industry_avg_score INTEGER,          -- 업계 평균 점수
  percentile INTEGER,                  -- 상위 몇 %
  
  -- BEST CASE 비교
  best_case_id UUID,
  gap_analysis JSONB,
  
  -- 맞춤형 솔루션
  immediate_actions JSONB,             -- 즉시 실행 (72시간)
  short_term_plan JSONB,               -- 단기 개선안 (1개월)
  long_term_strategy JSONB,            -- 중장기 전략 (3-6개월)
  
  UNIQUE(survey_id)
);

CREATE INDEX idx_survey_results_survey_id ON survey_results(survey_id);
CREATE INDEX idx_survey_results_primary_issue ON survey_results(primary_issue);
CREATE INDEX idx_survey_results_total_score ON survey_results(total_score DESC);
```

### 3. leads (리드 정보)

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 연락처 정보
  name TEXT,
  email TEXT,
  phone TEXT,
  hospital_name TEXT,
  
  -- 전환 유형
  conversion_type TEXT NOT NULL CHECK (
    conversion_type IN ('consultation', 'download', 'later', 'none')
  ),
  
  -- 상담 예약 정보 (consultation인 경우)
  consultation_date TIMESTAMP WITH TIME ZONE,
  consultation_status TEXT,
  
  -- 이메일 육성 상태
  nurture_stage INTEGER DEFAULT 0,     -- 0: 미시작, 1-7: Day 1-7
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  email_opens INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0,
  
  -- 메모
  notes TEXT,
  
  UNIQUE(survey_id)
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_conversion_type ON leads(conversion_type);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_nurture_stage ON leads(nurture_stage);
```

### 4. benchmarks (벤치마크 데이터)

```sql
CREATE TABLE benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 구분 기준
  specialty TEXT NOT NULL,             -- 진료과
  location TEXT NOT NULL,              -- 지역
  
  -- 평균 데이터
  avg_score INTEGER NOT NULL,
  avg_channel_count INTEGER,
  avg_budget TEXT,
  
  -- BEST CASE 데이터
  best_case_score INTEGER NOT NULL,
  best_case_story JSONB NOT NULL,      -- 성공 사례 스토리
  best_case_metrics JSONB NOT NULL,    -- 주요 지표
  best_case_strategies JSONB NOT NULL, -- 핵심 전략
  
  -- 통계
  sample_size INTEGER DEFAULT 0,       -- 표본 수
  
  UNIQUE(specialty, location)
);

CREATE INDEX idx_benchmarks_specialty ON benchmarks(specialty);
CREATE INDEX idx_benchmarks_location ON benchmarks(location);
```

## RLS 정책 (비활성화)

사용자 요청에 따라 RLS 정책은 비활성화합니다.

```sql
-- RLS 비활성화
ALTER TABLE surveys DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks DISABLE ROW LEVEL SECURITY;
```

## 초기 데이터

### benchmarks 초기 데이터 (예시)

```sql
INSERT INTO benchmarks (specialty, location, avg_score, best_case_score, best_case_story, best_case_metrics, best_case_strategies, sample_size)
VALUES 
(
  '피부과/성형외과',
  '서울 강남권',
  52,
  89,
  '{"title": "강남 피부과 A병원 성공 스토리", "description": "네이버 의존도를 85%→40%로 줄이고 미용 플랫폼과 SNS를 적극 활용한 결과..."}',
  '{"monthly_patients": {"before": 150, "after": 380}, "cac": {"before": 150000, "after": 70000}, "online_booking_rate": {"before": 15, "after": 65}}',
  '["강남언니 프리미엄 광고 + 이벤트", "인스타 릴스 주 5회 업로드", "의사 출연 유튜브 쇼츠", "네이버는 효율적인 키워드만 집중"]',
  150
);
```

## 마이그레이션 순서

1. surveys 테이블 생성
2. survey_results 테이블 생성
3. leads 테이블 생성
4. benchmarks 테이블 생성
5. 인덱스 생성
6. 초기 벤치마크 데이터 삽입
7. RLS 비활성화 확인
