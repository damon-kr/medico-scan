// 설문 응답 타입 정의

export interface SurveyResponse {
  // Q1: 병원 위치와 규모
  location_and_size?: {
    location: string;
    hospital_size: string;
  };

  // Q2: 주요 진료 분야 (ranking 타입)
  specialties?: {
    selected: string[];
    ranking: { [key: string]: number };
  };

  // Q3: 월 마케팅 예산
  budget?: string;

  // Q4: 사용 중인 마케팅 채널
  channels?: string[];
  top1Channel?: string;
  top2Channel?: string;
  top3Channel?: string;

  // Q4-1: (조건부) 상업적 플랫폼 활용
  commercialPlatform?: string;

  // Q4-2: 채널 선택 이유
  channelReason?: string;

  // Q4-3: 다른 채널 시도 경험
  newChannelAttempt?: string;

  // Q5: 채널별 비중
  top1Ratio?: string;
  onlineRatio?: string;

  // Q6: 콘텐츠 업데이트 주기
  updateFrequency?: string;

  // Q7: 마케팅 관리 주체
  management?: string;

  // Q8: 신규 환자 파악 방법 (복수 선택)
  trackingMethods?: string[];

  // Q9: 온라인 현황 (복수 선택)
  onlineStatusPositive?: string[];
  onlineStatusNegative?: string[];

  // Q10: 가장 큰 문제 (최대 2개)
  mainProblems?: string[];

  // 추가 질문들 (미래 확장용)
  decisionMaking?: string;
  patientLifetimeValue?: string;
  channelRatio?: string;
  platformUsage?: string;
  performanceTracking?: string[];
}

export interface SurveyResult {
  id: string;
  surveyId: string;
  createdAt: string;

  // 점수
  totalScore: number;
  channelScore: number;
  operationScore: number;
  measurementScore: number;
  budgetScore: number;

  // 레벨
  level: 1 | 2 | 3 | 4;

  // 진단 결과
  primaryIssue: IssueType;
  secondaryIssues: IssueType[];

  // 업종×지역 특성
  marketCharacteristics: {
    competitionLevel: string;
    marketType: string;
    recommendations: string[];
  };

  // 강점 영역
  strengths: string[];

  // 비교 분석
  industryAvgScore?: number;
  percentile?: number;

  // BEST CASE 비교
  bestCaseId?: string;
  gapAnalysis?: {
    channelGap: number;
    contentGap: number;
    platformGap: number;
    measurementGap: number;
    automationGap: number;
  };

  // 맞춤형 솔루션
  immediateActions: Action[];
  shortTermPlan: Action[];
  longTermStrategy: Action[];
}

export type IssueType =
  | "naver_dependent"      // 네이버 의존 과다형
  | "digital_blind_spot"   // 디지털 사각지대형
  | "scattered_efforts"    // 무분별 살포형
  | "neglected_operation"  // 방치 운영형
  | "performance_blind"    // 성과 맹목형
  | "online_passive"       // 온라인 마케팅 소극형
  | "single_tool"          // 원툴형
  | "general";             // 일반형

export interface Action {
  title: string;
  description: string;
  timeline?: string;
  expectedOutcome?: string;
  priority?: "high" | "medium" | "low";
}

export interface Lead {
  id?: string;
  surveyId: string;
  name?: string;
  email?: string;
  phone?: string;
  hospitalName?: string;
  conversionType: "consultation" | "download" | "later" | "none";
  consultationDate?: string;
  createdAt?: string;
}

export interface Benchmark {
  id: string;
  specialty: string;
  location: string;
  avgScore: number;
  bestCaseScore: number;
  bestCaseStory: {
    title: string;
    description: string;
    hospitalName?: string;
  };
  bestCaseMetrics: {
    monthlyPatients?: { before: number; after: number };
    cac?: { before: number; after: number };
    onlineBookingRate?: { before: number; after: number };
  };
  bestCaseStrategies: string[];
  sampleSize: number;
}

// 질문 타입
export type QuestionType = 
  | "radio" 
  | "checkbox" 
  | "dropdown" 
  | "multi-select" 
  | "ranking"
  | "slider";

export interface QuestionOption {
  value: string;
  label: string;
  emoji?: string;
}

export interface Question {
  id: string;
  section: "basic" | "channels" | "operations" | "measurement" | "needs";
  order: number;
  title: string;
  description?: string;
  type: QuestionType;
  options?: QuestionOption[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
  conditional?: {
    dependsOn: string;
    values: string[];
  };
  subQuestions?: Question[];
}

// 설문 상태
export interface SurveyState {
  currentStep: number;
  totalSteps: number;
  responses: Partial<SurveyResponse>;
  isComplete: boolean;
  surveyId?: string;
}
