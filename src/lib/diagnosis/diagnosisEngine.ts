import { SurveyResponse, SurveyResult, IssueType } from "@/types/survey";
import { ScoreResult } from "../scoring/scoreCalculator";
import {
  detectOneTrickPattern,
  detectNaverDependency,
  detectDigitalBlindSpot,
  detectNeglectedOperation,
  detectPerformanceBlindness,
  detectScatteredEfforts,
  detectOnlinePassive,
} from "./issueDetectors";

/**
 * 설문 응답 기반 종합 진단
 */
export function diagnoseSurvey(
  responses: SurveyResponse,
  scores: ScoreResult
): Partial<SurveyResult> {
  // 1. 주요 문제 유형 판별
  const primaryIssue = determinePrimaryIssue(responses, scores);

  // 2. 부가 문제 식별
  const secondaryIssues = identifySecondaryIssues(responses, scores);

  // 3. 강점 영역 발견
  const strengths = identifyStrengths(responses, scores);

  // 4. 시장 특성 매칭 (추후 구현)
  // const marketCharacteristics = getMarketCharacteristics(responses);

  return {
    primaryIssue: primaryIssue,
    secondaryIssues: [],
    strengths,
    totalScore: scores.totalScore,
    level: scores.level,
    channelScore: scores.categoryScores.channel,
    operationScore: scores.categoryScores.operation,
    measurementScore: scores.categoryScores.measurement,
    budgetScore: scores.categoryScores.budget,
  };
}

/**
 * 주요 문제 유형 결정
 * 가중치 기반으로 가장 심각한 문제 선택
 */
function determinePrimaryIssue(
  responses: SurveyResponse,
  scores: ScoreResult
): IssueType {
  const issues: Array<{ type: IssueType; weight: number }> = [];

  // 각 패턴 감지 및 가중치 부여
  if (detectOneTrickPattern(responses)) {
    issues.push({ type: "single_tool", weight: 0.95 });
  }
  if (detectNaverDependency(responses)) {
    issues.push({ type: "naver_dependent", weight: 0.9 });
  }
  if (detectPerformanceBlindness(responses)) {
    issues.push({ type: "performance_blind", weight: 0.85 });
  }
  if (detectNeglectedOperation(responses)) {
    issues.push({ type: "neglected_operation", weight: 0.8 });
  }
  if (detectScatteredEfforts(responses)) {
    issues.push({ type: "scattered_efforts", weight: 0.75 });
  }
  if (detectDigitalBlindSpot(responses)) {
    issues.push({ type: "digital_blind_spot", weight: 0.7 });
  }
  if (detectOnlinePassive(responses)) {
    issues.push({ type: "online_passive", weight: 0.65 });
  }

  // 가중치가 가장 높은 문제 반환
  const primary = issues.sort((a, b) => b.weight - a.weight)[0];
  
  // 아무 문제도 감지되지 않으면 기본값
  return primary?.type || "naver_dependent";
}

/**
 * 부가 문제 식별
 * 주요 문제 외에 개선이 필요한 영역들
 */
function identifySecondaryIssues(
  responses: SurveyResponse,
  scores: ScoreResult
): string[] {
  const issues: string[] = [];

  // 카테고리별 점수 기반 부가 문제 식별
  if (scores.categoryScores.channel < 15) {
    issues.push("채널 다양성 부족");
  }
  if (scores.categoryScores.operation < 12) {
    issues.push("운영 체계 미흡");
  }
  if (scores.categoryScores.measurement < 12) {
    issues.push("성과 측정 부재");
  }
  if (scores.categoryScores.budget < 10) {
    issues.push("예산 투자 부족");
  }

  // 의사결정 체계
  if (
    responses.decisionMaking === "직감" ||
    responses.decisionMaking === "정해진 예산"
  ) {
    issues.push("데이터 기반 의사결정 부족");
  }

  // LTV 인식 부족
  if (responses.patientLifetimeValue === "모르겠음") {
    issues.push("환자 가치 측정 부족");
  }

  return issues;
}

/**
 * 강점 영역 발견 (15+ 케이스)
 */
function identifyStrengths(
  responses: SurveyResponse,
  scores: ScoreResult
): string[] {
  const strengths: string[] = [];

  // 1. 카테고리별 강점 (4가지)
  if (scores.categoryScores.channel >= 20) {
    strengths.push("다양한 채널 포트폴리오");
  }
  if (scores.categoryScores.operation >= 18) {
    strengths.push("체계적인 운영 관리");
  }
  if (scores.categoryScores.measurement >= 18) {
    strengths.push("데이터 기반 의사결정");
  }
  if (scores.categoryScores.budget >= 15) {
    strengths.push("충분한 마케팅 예산");
  }

  // 2. 채널 관련 강점 (3가지)
  const channels = responses.channels || [];
  if (channels.length >= 5) {
    strengths.push("멀티채널 전략 구사");
  }
  if (channels.includes("인스타그램") && channels.includes("유튜브")) {
    strengths.push("SNS 콘텐츠 마케팅 활용");
  }
  if (responses.channelReason === "이전 성과" || responses.channelReason === "비용 효율") {
    strengths.push("성과 중심 채널 선택");
  }

  // 3. 온라인 기반 강점 (5가지)
  const positiveStatus = responses.onlineStatusPositive || [];
  if (positiveStatus.includes("검색 노출 우수")) {
    strengths.push("강력한 검색 노출");
  }
  if (positiveStatus.includes("높은 평점")) {
    strengths.push("우수한 고객 평가");
  }
  if (positiveStatus.includes("활발한 SNS")) {
    strengths.push("활발한 SNS 운영");
  }
  if (positiveStatus.includes("꾸준한 문의")) {
    strengths.push("높은 온라인 전환율");
  }
  if (positiveStatus.includes("브랜드 인지도")) {
    strengths.push("강한 브랜드 인지도");
  }

  // 4. 운영 체계 강점 (3가지)
  if (responses.updateFrequency === "주 5회 이상" || responses.updateFrequency === "주 2-3회") {
    strengths.push("꾸준한 콘텐츠 업데이트");
  }
  if (responses.management === "전담 직원" || responses.management === "혼합") {
    strengths.push("전문 마케팅 인력 확보");
  }
  if (responses.newChannelAttempt === "적극 테스트") {
    strengths.push("실험적 마케팅 문화");
  }

  // 5. 측정 및 분석 강점 (3가지)
  const tracking = responses.trackingMethods || [];
  if (tracking.includes("온라인 예약")) {
    strengths.push("체계적인 전환 추적");
  }
  if (responses.decisionMaking === "데이터 기반") {
    strengths.push("분석 기반 최적화");
  }
  if (
    responses.patientLifetimeValue &&
    responses.patientLifetimeValue !== "모르겠음" &&
    responses.patientLifetimeValue !== "50만원 미만"
  ) {
    strengths.push("환자 생애가치 인식");
  }

  // 6. 플랫폼/예산 활용 강점 (2가지)
  if (responses.commercialPlatform === "적극 활용") {
    strengths.push("상업적 플랫폼 활용");
  }
  if (responses.budget && 
      (responses.budget === "500-1,000만원" || 
       responses.budget === "1,000-2,000만원" || 
       responses.budget === "2,000만원 이상")) {
    strengths.push("적극적인 마케팅 투자");
  }

  // 중복 제거 및 상위 5개만 반환
  return [...new Set(strengths)].slice(0, 5);
}
