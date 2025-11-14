import { Card } from "@/components/ui/card";
import { SurveyResponse } from "@/types/survey";
import { assessCompetition } from "@/lib/scoring/competitionScore";
import { TrendingDown, TrendingUp, MapPin, Search, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CompetitionSectionProps {
  responses: SurveyResponse;
}

export const CompetitionSection = ({ responses }: CompetitionSectionProps) => {
  const assessment = assessCompetition(responses);

  // 색상 매핑
  const colorClasses = {
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: "text-green-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      icon: "text-yellow-600",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      icon: "text-orange-600",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "text-red-600",
    },
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      icon: "text-gray-600",
    },
  };

  const competitionColors = colorClasses[assessment.competitionLevel.color];
  const rankingColors = colorClasses[assessment.searchRanking.color];

  // 우선순위 색상
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "시급":
        return "bg-red-100 text-red-700 border-red-300";
      case "개선권장":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "유지":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // 우선순위 아이콘
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "시급":
      case "개선권장":
        return <AlertTriangle className="w-5 h-5" />;
      case "유지":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6">경쟁 환경 및 노출 순위 분석</h2>

      {/* 종합 우선순위 배지 */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg border-2 border-muted">
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${getPriorityBadgeClass(assessment.actionPriority)}`}>
            {getPriorityIcon(assessment.actionPriority)}
            <span>우선순위: {assessment.actionPriority}</span>
          </div>
          <p className="text-sm text-muted-foreground flex-1">
            {assessment.priorityReason}
          </p>
        </div>
      </div>

      {/* 2개 박스: 경쟁 환경 / 검색 노출 순위 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 경쟁 환경 (시장 지표) */}
        <div className={`p-6 rounded-lg border-2 ${competitionColors.bg} ${competitionColors.border}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full ${competitionColors.bg} border-2 ${competitionColors.border} flex items-center justify-center`}>
              <MapPin className={`w-6 h-6 ${competitionColors.icon}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">시장 경쟁 환경</h3>
              <p className="text-sm text-muted-foreground">근처 경쟁 병원 수 기준</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {assessment.competitionLevel.level === "낮음" || assessment.competitionLevel.level === "보통" ? (
                <TrendingDown className={competitionColors.icon} />
              ) : (
                <TrendingUp className={competitionColors.icon} />
              )}
              <span className={`text-2xl font-bold ${competitionColors.text}`}>
                {assessment.competitionLevel.level}
              </span>
            </div>
            <p className={`text-sm ${competitionColors.text}`}>
              {assessment.competitionLevel.description}
            </p>
          </div>
        </div>

        {/* 검색 노출 순위 (성과 지표) */}
        <div className={`p-6 rounded-lg border-2 ${rankingColors.bg} ${rankingColors.border}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full ${rankingColors.bg} border-2 ${rankingColors.border} flex items-center justify-center`}>
              <Search className={`w-6 h-6 ${rankingColors.icon}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">검색 노출 순위</h3>
              <p className="text-sm text-muted-foreground">네이버 지도 검색 기준</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {assessment.searchRanking.rank === "최상위" || assessment.searchRanking.rank === "양호" ? (
                <TrendingUp className={rankingColors.icon} />
              ) : (
                <TrendingDown className={rankingColors.icon} />
              )}
              <span className={`text-2xl font-bold ${rankingColors.text}`}>
                {assessment.searchRanking.rank}
              </span>
            </div>
            <p className={`text-sm ${rankingColors.text}`}>
              {assessment.searchRanking.description}
            </p>
          </div>
        </div>
      </div>

      {/* 업종×지역 맞춤 조언 */}
      {assessment.contextualAdvice && assessment.contextualAdvice.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">🎯 우리 병원 맞춤 전략</h3>
          <div className="space-y-3">
            {assessment.contextualAdvice.map((advice, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg"
              >
                <p className="text-sm text-gray-800 leading-relaxed">{advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 추가 안내 */}
      {assessment.actionPriority !== "유지" && assessment.actionPriority !== "알 수 없음" && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>📌 참고:</strong> 아래 체크리스트에서 경쟁 환경과 노출 순위 개선을 위한 구체적인 액션 아이템을 확인하세요.
          </p>
        </div>
      )}
    </Card>
  );
};
