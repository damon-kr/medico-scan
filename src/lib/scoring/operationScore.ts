import { SurveyResponse } from "@/types/survey";

/**
 * 운영 관리 점수 계산 (25점 만점)
 * - 업데이트 주기: 15점
 * - 관리 체계: 10점
 */
export function calculateOperationScore(responses: SurveyResponse): number {
  let score = 0;

  // 1. 업데이트 주기 점수 (15점)
  score += calculateUpdateFrequencyScore(responses);

  // 2. 관리 체계 점수 (10점)
  score += calculateManagementScore(responses);

  return Math.min(25, score);
}

/**
 * 업데이트 주기 평가 (15점)
 */
function calculateUpdateFrequencyScore(responses: SurveyResponse): number {
  const updateFrequency = responses.updateFrequency;
  
  if (!updateFrequency) return 0;

  const scoreMap: Record<string, number> = {
    "주 5회 이상": 15,
    "주 2-3회": 13,
    "주 1회": 10,
    "월 2-3회": 6,
    "월 1회 이하": 3,
    "거의 안함": 0,
  };

  return scoreMap[updateFrequency] || 0;
}

/**
 * 관리 체계 평가 (10점)
 */
function calculateManagementScore(responses: SurveyResponse): number {
  const management = responses.management;
  
  if (!management) return 0;

  const scoreMap: Record<string, number> = {
    "전담 직원": 10,
    "외부 위탁": 8,
    "혼합": 7,
    "원장 직접": 5,
    "직원 겸임": 3,
    "관리 부재": 0,
  };

  return scoreMap[management] || 0;
}
