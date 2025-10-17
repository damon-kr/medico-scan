import { SurveyResponse } from "@/types/survey";

export interface ROIProjection {
  currentMonthlyPatients: number;
  projectedPatients3M: number;
  projectedPatients6M: number;
  currentROI: number;
  projectedROI3M: number;
  projectedROI6M: number;
  opportunityCost: string;
}

/**
 * ROI 시뮬레이션
 * - 현재 대비 3개월/6개월 후 예상 효과
 */
export function simulateROI(
  currentScore: number,
  responses: SurveyResponse
): ROIProjection {
  const ltv = extractLTV(responses.patientLifetimeValue);
  const monthlyBudget = extractBudget(responses.budget);

  // 현재 월간 신규 환자 추정 (예산 기반 역산)
  const currentCPA = monthlyBudget / Math.max(currentScore, 10); // 점수가 낮을수록 CPA 높음
  const currentMonthlyPatients = Math.floor(monthlyBudget / currentCPA);

  // 개선 후 예상 (점수 향상 가정)
  const improvedScore3M = Math.min(100, currentScore + 15); // 3개월 후 15점 향상
  const improvedScore6M = Math.min(100, currentScore + 30); // 6개월 후 30점 향상

  const improvedCPA3M = currentCPA * 0.8; // 20% 효율 개선
  const improvedCPA6M = currentCPA * 0.65; // 35% 효율 개선

  const projectedPatients3M = Math.floor(monthlyBudget / improvedCPA3M);
  const projectedPatients6M = Math.floor(monthlyBudget / improvedCPA6M);

  // ROI 계산 (LTV / CPA)
  const currentROI = ltv / currentCPA;
  const projectedROI3M = ltv / improvedCPA3M;
  const projectedROI6M = ltv / improvedCPA6M;

  // 기회비용 (현재 비효율로 인한 손실)
  const missedPatients = projectedPatients6M - currentMonthlyPatients;
  const opportunityCost = `월 ${missedPatients}명 (${(
    missedPatients *
    ltv /
    10000
  ).toFixed(0)}만원)`;

  return {
    currentMonthlyPatients,
    projectedPatients3M,
    projectedPatients6M,
    currentROI: Math.round(currentROI * 10) / 10,
    projectedROI3M: Math.round(projectedROI3M * 10) / 10,
    projectedROI6M: Math.round(projectedROI6M * 10) / 10,
    opportunityCost,
  };
}

/**
 * LTV 추출 (중간값)
 */
function extractLTV(ltvString?: string): number {
  if (!ltvString || ltvString === "모르겠음") return 1000000; // 기본값 100만원

  const ltvMap: Record<string, number> = {
    "500만원 이상": 6000000,
    "300-500만원": 4000000,
    "100-300만원": 2000000,
    "50-100만원": 750000,
    "50만원 미만": 300000,
  };

  return ltvMap[ltvString] || 1000000;
}

/**
 * 예산 추출 (중간값)
 */
function extractBudget(budgetString?: string): number {
  if (!budgetString || budgetString === "정확히 모르겠음") return 2000000; // 기본값 200만원

  const budgetMap: Record<string, number> = {
    "100만원 미만": 500000,
    "100-300만원": 2000000,
    "300-500만원": 4000000,
    "500-1,000만원": 7500000,
    "1,000-2,000만원": 15000000,
    "2,000만원 이상": 25000000,
  };

  return budgetMap[budgetString] || 2000000;
}
