import { SurveyResponse, SurveyResult, Action, IssueType } from "@/types/survey";
import { getActionTemplates } from "./actionTemplates";

/**
 * 맞춤형 액션 아이템 생성
 */
export function generateSolutions(
  diagnosis: Partial<SurveyResult>,
  responses: SurveyResponse
): {
  immediateActions: Action[];
  shortTermPlan: Action[];
  longTermStrategy: Action[];
} {
  const templates = getActionTemplates(
    diagnosis.primaryIssue || "general",
    responses
  );

  // 우선순위에 따라 필터링 및 정렬
  const immediate = templates
    .filter((action) => action.priority === "high")
    .slice(0, 3);

  const shortTerm = templates
    .filter((action) => action.priority === "medium")
    .slice(0, 3);

  const longTerm = templates
    .filter((action) => action.priority === "low")
    .slice(0, 2);

  return {
    immediateActions: immediate,
    shortTermPlan: shortTerm,
    longTermStrategy: longTerm,
  };
}

/**
 * 맞춤형 액션 우선순위 조정
 */
export function prioritizeActions(
  actions: Action[],
  responses: SurveyResponse
): Action[] {
  return actions.map((action) => {
    let adjustedPriority = action.priority || "medium";

    // 의사결정 방식에 따른 우선순위 조정
    if (responses.decisionMaking === "직감" || responses.decisionMaking === "정해진 예산") {
      if (action.title.includes("데이터") || action.title.includes("분석")) {
        adjustedPriority = "high";
      }
    }

    // LTV 인식에 따른 우선순위 조정
    if (responses.patientLifetimeValue === "모르겠음") {
      if (action.title.includes("고객") || action.title.includes("LTV")) {
        adjustedPriority = "high";
      }
    }

    // 예산 규모에 따른 우선순위 조정
    if (responses.budget === "100만원 미만" || responses.budget === "100-300만원") {
      if (action.title.includes("비용") || action.title.includes("무료")) {
        adjustedPriority = "high";
      }
    }

    return { ...action, priority: adjustedPriority as Action["priority"] };
  });
}
