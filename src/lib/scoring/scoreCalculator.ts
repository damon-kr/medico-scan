import { SurveyResponse } from "@/types/survey";
import { calculateChannelScore } from "./channelScore";
import { calculateOperationScore } from "./operationScore";
import { calculateMeasurementScore } from "./measurementScore";
import { calculateBudgetScore } from "./budgetScore";

export interface CategoryScores {
  channel: number;
  operation: number;
  measurement: number;
  budget: number;
}

export interface ScoreResult {
  totalScore: number;
  categoryScores: CategoryScores;
  level: 1 | 2 | 3 | 4;
  levelName: string;
}

/**
 * 총점 계산 및 레벨 결정
 * Level 1 (초급): 0-25점
 * Level 2 (기본): 26-50점
 * Level 3 (중급): 51-75점
 * Level 4 (고급): 76-100점
 */
export function calculateTotalScore(responses: SurveyResponse): ScoreResult {
  const categoryScores: CategoryScores = {
    channel: calculateChannelScore(responses),
    operation: calculateOperationScore(responses),
    measurement: calculateMeasurementScore(responses),
    budget: calculateBudgetScore(responses),
  };

  const totalScore = 
    categoryScores.channel +
    categoryScores.operation +
    categoryScores.measurement +
    categoryScores.budget;

  let level: 1 | 2 | 3 | 4;
  let levelName: string;

  if (totalScore >= 76) {
    level = 4;
    levelName = "고급";
  } else if (totalScore >= 51) {
    level = 3;
    levelName = "중급";
  } else if (totalScore >= 26) {
    level = 2;
    levelName = "기본";
  } else {
    level = 1;
    levelName = "초급";
  }

  return {
    totalScore,
    categoryScores,
    level,
    levelName,
  };
}
