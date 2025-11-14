import { Card } from "@/components/ui/card";
import { SurveyResponse } from "@/types/survey";
import { generateChecklist } from "@/lib/solutions/checklistGenerator";
import { Lightbulb } from "lucide-react";

interface ChecklistSectionProps {
  responses: SurveyResponse;
}

export const ChecklistSection = ({ responses }: ChecklistSectionProps) => {
  const allItems = generateChecklist(responses);

  // 우선순위 색상
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "시급":
        return "bg-red-100 text-red-700 border-red-300";
      case "개선권장":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "기회":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "유지":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <Card className="p-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">실행 체크리스트</h2>
        <p className="text-muted-foreground">
          우리 병원에 맞춤화된 {allItems.length}개의 액션 아이템입니다.
        </p>
      </div>

      {/* 체크리스트 항목 */}
      <div className="space-y-3">
        {allItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>체크리스트 항목이 없습니다.</p>
          </div>
        ) : (
          allItems.map((item) => (
            <div
              key={item.id}
              className="p-4 border-2 rounded-lg bg-background border-border"
            >
              <div className="space-y-2">
                {/* 제목 & 우선순위 */}
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border flex-shrink-0 ${getPriorityClass(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                </div>

                {/* 설명 */}
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>

                {/* 팁 */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800">{item.tip}</p>
                </div>

                {/* 카테고리 태그 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 안내 메시지 */}
      {allItems.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>📌 활용 팁:</strong> 시급한 항목부터 순서대로 실행하세요. 모든 항목을 한 번에 하려 하지 말고,
            주 1-2개씩 꾸준히 개선하는 것이 효과적입니다.
          </p>
        </div>
      )}
    </Card>
  );
};
