# 병원 마케팅 진단 시스템 (MedicoScan)

**3분만에 완료하는 병원 마케팅 현황 진단 및 맞춤형 개선안 제공**

## 프로젝트 개요

병원 마케팅 현황을 체계적으로 진단하고, 7가지 유형별 맞춤형 개선안을 제공하는 웹 애플리케이션입니다.

### 주요 기능
- **10개 질문 설문조사**: 마케팅 현황을 종합적으로 진단
- **7가지 진단 유형**: 네이버 의존형, 디지털 사각지대형, 원툴형 등
- **100점 스코어링**: 채널활용도, 운영관리, 성과측정, 예산규모 기준
- **맞춤형 솔루션**: 즉시실행(72시간), 단기(1개월), 중장기(3-6개월) 개선안

## 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS  
- **State**: React Query + useState
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6
- **Database**: PostgreSQL (Supabase)

## 프로젝트 구조

```
src/
├── components/
│   ├── survey/          # 설문 컴포넌트
│   ├── ui/              # shadcn/ui 컴포넌트
├── lib/
│   ├── scoring/         # 점수 계산 로직
│   ├── diagnosis/       # 진단 엔진
│   └── solutions/       # 솔루션 생성
├── pages/
│   ├── Index.tsx        # 랜딩 페이지
│   ├── Survey.tsx       # 설문 페이지
│   └── Results.tsx      # 결과 페이지
├── types/
│   └── survey.ts        # 타입 정의
└── data/
    └── questions.ts     # 설문 질문 데이터
```

## 시작하기

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 환경 변수
Lovable Cloud 사용 시 자동 설정됩니다.

## 문서 구조 (3-Layer)

### Layer 1 (Core Reference) - 핵심 참조
- `docs/01-architecture.md`: 시스템 구조 및 컴포넌트 관계
- `docs/02-domain-logic.md`: 스코어링 로직 및 진단 유형
- `docs/03-data-schema.md`: 데이터베이스 스키마 및 타입 정의

### Layer 2 (Process Documents) - 프로세스
- `docs/04-userflow.md`: 사용자 여정 및 UX 시나리오
- `docs/05-implementation-guide.md`: 개발 가이드 및 주의사항

### Layer 3 (Live Tracking) - 진행 상황
- `docs/06-progress.md`: 현재 작업 및 완료 내역

## 개발 원칙

1. **모듈 독립성**: 기능별 독립 모듈로 설계
2. **타입 안전성**: 엄격한 TypeScript 타입 정의
3. **문서 동기화**: 코드 변경 시 문서 동시 업데이트
4. **사용자 중심**: 모바일 퍼스트, 3분 완료 목표

## 배포

Lovable 플랫폼에서 자동 배포됩니다.

## 라이선스

MIT License
