import { SurveyResponse } from "@/types/survey";

/**
 * 예산 규모 점수 계산 (20점 만점)
 * - 기본 예산 점수: 15점
 * - LTV 인식 보너스: 5점
 */
export function calculateBudgetScore(responses: SurveyResponse): number {
  let score = 0;

  // 1. 기본 예산 점수 (15점)
  score += calculateBaseBudgetScore(responses);

  // 2. LTV 인식 보너스 (5점)
  score += calculateLTVBonusScore(responses);

  return Math.min(20, score);
}

/**
 * 기본 예산 평가 (15점)
 */
function calculateBaseBudgetScore(responses: SurveyResponse): number {
  const budget = responses.budget;
  
  if (!budget) return 0;

  const scoreMap: Record<string, number> = {
    "월 1000만원 이상": 15,
    "월 500-1000만원": 13,
    "월 200-500만원": 10,
    "월 100-200만원": 7,
    "월 50-100만원": 4,
    "월 50만원 미만": 2,
  };

  return scoreMap[budget] || 0;
}

/**
 * LTV 인식 보너스 (5점)
 * - LTV를 알고 있으면 예산 효율성 관리 가능
 */
function calculateLTVBonusScore(responses: SurveyResponse): number {
  const ltv = responses.patientLifetimeValue;
  
  if (!ltv) return 0;

  // "모르겠음" 선택 시 0점
  if (ltv === "모르겠음") return 0;

  // LTV 인식 자체에 3점
  let score = 3;

  // 높은 LTV 인식 시 추가 점수
  if (ltv === "500만원 이상") {
    score += 2;
  } else if (ltv === "300-500만원") {
    score += 1;
  }

  return score;
}
