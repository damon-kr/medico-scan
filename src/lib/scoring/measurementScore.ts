import { SurveyResponse } from "@/types/survey";

/**
 * 성과 측정 점수 계산 (25점 만점)
 * - 환자 추적: 10점
 * - 온라인 현황 (강점): 8점
 * - 의사결정 체계: 7점
 */
export function calculateMeasurementScore(responses: SurveyResponse): number {
  let score = 0;

  // 1. 환자 추적 점수 (10점)
  score += calculateTrackingScore(responses);

  // 2. 온라인 현황 점수 (8점)
  score += calculateOnlineStatusScore(responses);

  // 3. 의사결정 체계 점수 (7점)
  score += calculateDecisionMakingScore(responses);

  return Math.min(25, score);
}

/**
 * 환자 추적 평가 (10점)
 */
function calculateTrackingScore(responses: SurveyResponse): number {
  const tracking = responses.trackingMethods || [];
  
  let score = 0;

  // 각 항목당 점수
  const scoreMap: Record<string, number> = {
    "온라인 예약": 3,
    "직접 질문": 2,
    "전화 확인": 2,
    "이벤트 추적": 3,
    "대략 추정": 1,
  };

  tracking.forEach((item) => {
    score += scoreMap[item] || 0;
  });

  // "파악 안함" 선택 시 0점
  if (tracking.includes("파악 안함")) {
    score = 0;
  }

  return Math.min(10, score);
}

/**
 * 온라인 현황 평가 (8점)
 */
function calculateOnlineStatusScore(responses: SurveyResponse): number {
  const positive = responses.onlineStatusPositive || [];
  const negative = responses.onlineStatusNegative || [];

  let score = 0;

  // 강점 항목당 2점
  score += positive.length * 2;

  // 약점 항목당 -1점 (최대 -3점)
  score -= Math.min(3, negative.length);

  return Math.max(0, Math.min(8, score));
}

/**
 * 의사결정 체계 평가 (7점)
 */
function calculateDecisionMakingScore(responses: SurveyResponse): number {
  const decisionMaking = responses.decisionMaking;
  
  if (!decisionMaking) return 0;

  const scoreMap: Record<string, number> = {
    "데이터 기반": 7,
    "경쟁 분석": 5,
    "업체 제안": 3,
    "직감": 2,
    "정해진 예산": 1,
  };

  return scoreMap[decisionMaking] || 0;
}
