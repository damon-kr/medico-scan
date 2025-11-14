import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Calendar, AlertCircle } from "lucide-react";
import { SurveyResponse, SurveyResult } from "@/types/survey";
import { calculateTotalScore } from "@/lib/scoring/scoreCalculator";
import { diagnoseSurvey } from "@/lib/diagnosis/diagnosisEngine";
import { generateSolutions } from "@/lib/solutions/actionGenerator";
import { simulateROI } from "@/lib/solutions/roiSimulator";
import { CompetitionSection } from "@/components/results/CompetitionSection";
import { ChecklistSection } from "@/components/results/ChecklistSection";

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<Partial<SurveyResult> | null>(null);
  const [responses, setResponses] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 설문 응답 불러오기
    const storedResponses = localStorage.getItem(`survey_${id}`);
    
    if (!storedResponses) {
      // 응답이 없으면 홈으로 이동
      navigate("/");
      return;
    }

    try {
      const parsedResponses: SurveyResponse = JSON.parse(storedResponses);

      // 1. 스코어링
      const scores = calculateTotalScore(parsedResponses);

      // 2. 진단
      const diagnosis = diagnoseSurvey(parsedResponses, scores);

      // 3. 솔루션 생성
      const solutions = generateSolutions(diagnosis, parsedResponses);

      // 4. ROI 시뮬레이션
      const roi = simulateROI(scores.totalScore, parsedResponses);

      // 결과 통합
      const fullResult: Partial<SurveyResult> = {
        ...diagnosis,
        ...solutions,
        surveyId: id || "",
        createdAt: new Date().toISOString(),
      };

      setResult(fullResult);
      setResponses(parsedResponses);
      setLoading(false);
    } catch (error) {
      console.error("결과 생성 오류:", error);
      navigate("/");
    }
  }, [id, navigate]);

  if (loading || !result) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">결과를 분석하고 있습니다...</p>
        </div>
      </div>
    );
  }

  const getLevelText = (level?: number) => {
    switch (level) {
      case 1: return "초기 단계";
      case 2: return "기본 단계";
      case 3: return "중급 단계";
      case 4: return "고급 단계";
      default: return "평가 중";
    }
  };

  const getIssueTitle = (issue?: string) => {
    const issueMap: Record<string, string> = {
      single_tool: "원툴형 - 단일 채널 의존",
      naver_dependent: "네이버 의존 과다형",
      digital_blind_spot: "디지털 사각지대형",
      neglected_operation: "방치 운영형",
      performance_blind: "성과 맹목형",
      scattered_efforts: "무분별 살포형",
      online_passive: "온라인 마케팅 소극형",
      content_marketing_neglect: "콘텐츠 마케팅 미활용형",
      search_ranking_optimization: "검색 랭킹 최적화 필요형",
      platform_expansion_needed: "플랫폼 확장 필요형",
      local_marketing_weak: "지역 밀착 마케팅 부족형",
      budget_efficiency_low: "예산 대비 효율 저하형",
      general: "일반형",
    };
    return issue ? issueMap[issue] : "분석 중";
  };

  const getIssueDescription = (issue?: string) => {
    const descMap: Record<string, string> = {
      single_tool: "1-2개 채널에만 집중하여 리스크가 높습니다. 채널 다각화가 시급합니다.",
      naver_dependent: "전체 마케팅의 80% 이상이 네이버에 집중되어 있어 알고리즘 변화에 취약합니다.",
      digital_blind_spot: "온라인 채널 활용이 매우 부족합니다. 디지털 전환이 필요합니다.",
      neglected_operation: "마케팅 채널은 있지만 관리가 제대로 되지 않고 있습니다.",
      performance_blind: "마케팅 효과를 측정하지 못해 개선 방향을 찾기 어렵습니다.",
      scattered_efforts: "너무 많은 채널을 동시에 운영하여 효율이 떨어집니다.",
      online_passive: "온라인 마케팅에 소극적이어서 기회를 놓치고 있습니다.",
      content_marketing_neglect: "유튜브와 인스타그램 등 콘텐츠 마케팅이 부족합니다. 전문성과 신뢰를 보여주는 영상 콘텐츠가 필요합니다.",
      search_ranking_optimization: "경쟁이 치열한 환경에서 검색 노출 순위가 낮습니다. 1페이지 진입은 쉽지 않지만, 목표로 삼고 체계적인 SEO 전략을 수립하세요.",
      platform_expansion_needed: "미용 시장에서 상업적 플랫폼 활용이 부족합니다. 강남언니, 모두닥 등에서 테스트를 시작하세요.",
      local_marketing_weak: "지역 기반 마케팅이 미흡합니다. 동네 환자 확보를 위해 지도 검색 최적화가 필요합니다.",
      budget_efficiency_low: "예산은 충분하지만 성과 측정이나 채널 분산이 부족합니다. 예산을 효율적으로 활용하세요.",
      general: "전반적인 마케팅 체계 개선이 필요합니다.",
    };
    return issue ? descMap[issue] : "";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="mb-4">마케팅 진단 결과</h1>
            <p className="text-xl text-muted-foreground">
              우리 병원의 마케팅 현황을 분석했습니다
            </p>
          </div>

          {/* Score Card */}
          <Card className="p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-6 shadow-lg">
                <span className="text-5xl font-bold text-white">{result.totalScore}</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">종합 점수: {result.totalScore}점</h2>
              <p className="text-xl text-muted-foreground mb-4">
                {result.industryAvgScore ? `업계 평균: ${result.industryAvgScore}점` : ""}
              </p>
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-semibold">
                Level {result.level} ({getLevelText(result.level)})
              </div>
              
              {/* 카테고리별 점수 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">채널 다양성</p>
                  <p className="text-2xl font-bold">{result.channelScore}점</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">운영 관리</p>
                  <p className="text-2xl font-bold">{result.operationScore}점</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">성과 측정</p>
                  <p className="text-2xl font-bold">{result.measurementScore}점</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">예산 규모</p>
                  <p className="text-2xl font-bold">{result.budgetScore}점</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Diagnosis Card */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">진단 결과</h2>
            
            <div className="space-y-6">
              {/* 주요 문제 */}
              <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-destructive">
                      주요 문제: {getIssueTitle(result.primaryIssue)}
                    </h3>
                    <p className="text-muted-foreground">
                      {getIssueDescription(result.primaryIssue)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 강점 영역 */}
              {result.strengths && result.strengths.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary">강점 영역</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {result.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                        <span className="text-primary mt-0.5">✓</span>
                        <span className="text-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          {/* Competition & Ranking Section */}
          {responses && (
            <>
              <CompetitionSection responses={responses} />
              <ChecklistSection responses={responses} />
            </>
          )}

          {/* Solutions Card */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">맞춤형 개선 전략</h2>
            
            <div className="space-y-8">
              {/* 즉시 실행 */}
              {result.immediateActions && result.immediateActions.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-destructive to-destructive/60 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      1
                    </div>
                    <h3 className="text-xl font-semibold">즉시 실행 (1주일 내)</h3>
                  </div>
                  <div className="space-y-3 ml-13">
                    {result.immediateActions.map((action, idx) => (
                      <div key={idx} className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                        <h4 className="font-semibold mb-2">{action.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                        <p className="text-sm text-primary font-medium">
                          {action.timeline && `소요시간: ${action.timeline}`} 
                          {action.expectedOutcome && ` | ${action.expectedOutcome}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 단기 개선 */}
              {result.shortTermPlan && result.shortTermPlan.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      2
                    </div>
                    <h3 className="text-xl font-semibold">단기 개선 (1개월)</h3>
                  </div>
                  <div className="space-y-3 ml-13">
                    {result.shortTermPlan.map((action, idx) => (
                      <div key={idx} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">{action.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                        <p className="text-sm text-primary font-medium">
                          {action.timeline && `소요시간: ${action.timeline}`}
                          {action.expectedOutcome && ` | ${action.expectedOutcome}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 중장기 전략 */}
              {result.longTermStrategy && result.longTermStrategy.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-accent-foreground font-bold text-lg shadow-lg">
                      3
                    </div>
                    <h3 className="text-xl font-semibold">중장기 전략 (3-6개월)</h3>
                  </div>
                  <div className="space-y-3 ml-13">
                    {result.longTermStrategy.map((action, idx) => (
                      <div key={idx} className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                        <h4 className="font-semibold mb-2">{action.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                        <p className="text-sm text-accent-foreground font-medium">
                          {action.timeline && `소요시간: ${action.timeline}`}
                          {action.expectedOutcome && ` | ${action.expectedOutcome}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* CTA Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 text-center">
              <h3 className="text-xl font-bold mb-4">무료 상담 신청</h3>
              <p className="text-muted-foreground mb-6">
                전문 컨설턴트와 30분 무료 상담을 통해<br />
                맞춤형 전략을 더 자세히 알아보세요
              </p>
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 text-white gap-2 hover:shadow-lg transition-shadow">
                <Calendar className="w-4 h-4" />
                상담 예약하기
              </Button>
            </Card>

            <Card className="p-8 text-center">
              <h3 className="text-xl font-bold mb-4">상세 리포트 받기</h3>
              <p className="text-muted-foreground mb-6">
                이메일로 상세 리포트와<br />
                실행 가능한 체크리스트를 받아보세요
              </p>
              <Button variant="outline" className="w-full gap-2 hover:bg-muted">
                <Download className="w-4 h-4" />
                리포트 다운로드
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
