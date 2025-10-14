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
 * 강점 영역 발견
 */
function identifyStrengths(
  responses: SurveyResponse,
  scores: ScoreResult
): string[] {
  const strengths: string[] = [];

  // 카테고리별 강점
  if (scores.categoryScores.channel >= 20) {
    strengths.push("다양한 채널 활용");
  }
  if (scores.categoryScores.operation >= 18) {
    strengths.push("체계적 운영 관리");
  }
  if (scores.categoryScores.measurement >= 18) {
    strengths.push("데이터 기반 의사결정");
  }
  if (scores.categoryScores.budget >= 15) {
    strengths.push("충분한 예산 투자");
  }

  // 온라인 강점
  const positiveStatus = responses.onlineStatusPositive || [];
  if (positiveStatus.length >= 3) {
    strengths.push("탄탄한 온라인 기반");
  }

  // LTV 인식
  if (
    responses.patientLifetimeValue &&
    responses.patientLifetimeValue !== "모르겠음"
  ) {
    strengths.push("환자 가치 인식");
  }

  return strengths;
}
