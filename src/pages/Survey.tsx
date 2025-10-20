import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { questions } from "@/data/questions";
import { SurveyResponse } from "@/types/survey";
import { RadioQuestion } from "@/components/survey/RadioQuestion";
import { CheckboxQuestion } from "@/components/survey/CheckboxQuestion";
import { RankingQuestion } from "@/components/survey/RankingQuestion";
import { MultiSelectQuestion } from "@/components/survey/MultiSelectQuestion";
import { useToast } from "@/hooks/use-toast";

const Survey = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Partial<SurveyResponse>>({});

  // 조건부 질문 필터링 및 순서 정렬
  const getFilteredQuestions = () => {
    return questions
      .filter((question) => {
        if (!question.conditional) return true;
        
        const { dependsOn, values } = question.conditional;
        const dependentValue = responses[dependsOn];
        
        // specialties 필드에 대한 특별 처리 (ranking 타입)
        if (dependsOn === "specialties" && dependentValue) {
          const rankingValue = dependentValue as { selected: string[]; ranking: { [key: string]: number } };
          
          // 2순위가 '피부과/성형외과'인 경우, 1순위로 처리
          const selectedSpecialties = rankingValue.selected || [];
          const hasBeautyAs2nd = selectedSpecialties.length === 2 && 
            selectedSpecialties[1] === "피부과/성형외과";
          
          if (hasBeautyAs2nd) {
            // 1순위로 처리하기 위해 조건 충족으로 간주
            return values.some((v) => selectedSpecialties.includes(v));
          }
          
          // 일반 케이스: selected 배열에 포함되어 있는지 확인
          return values.some((v) => selectedSpecialties.includes(v));
        }
        
        // 다른 타입의 dependsOn 처리
        if (Array.isArray(dependentValue)) {
          return values.some((v) => dependentValue.includes(v));
        }
        
        return values.includes(dependentValue);
      })
      .sort((a, b) => a.order - b.order); // order 기준 정렬 추가
  };

  const filteredQuestions = getFilteredQuestions();
  const totalSteps = filteredQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = filteredQuestions[currentStep];

  const validateCurrentQuestion = (): boolean => {
    const currentValue = responses[currentQuestion.id];
    
    // Check if required
    if (currentQuestion.validation?.required) {
      if (!currentValue) {
        toast({
          title: "필수 항목입니다",
          description: "질문에 답변해주세요.",
          variant: "destructive",
        });
        return false;
      }

      // Validate multi-select (subQuestions)
      if (currentQuestion.type === "multi-select" && currentQuestion.subQuestions) {
        const multiValue = currentValue as { [key: string]: any };
        for (const subQ of currentQuestion.subQuestions) {
          if (subQ.validation?.required && !multiValue[subQ.id]) {
            toast({
              title: "필수 항목입니다",
              description: `"${subQ.title}"에 답변해주세요.`,
              variant: "destructive",
            });
            return false;
          }
        }
      }

      // Validate checkbox min/max
      if (currentQuestion.type === "checkbox") {
        const checkboxValue = currentValue as string[];
        if (currentQuestion.validation?.min && checkboxValue.length < currentQuestion.validation.min) {
          toast({
            title: "선택 개수 부족",
            description: `최소 ${currentQuestion.validation.min}개를 선택해주세요.`,
            variant: "destructive",
          });
          return false;
        }
      }

      // Validate ranking
      if (currentQuestion.type === "ranking") {
        const rankingValue = currentValue as { selected: string[]; ranking: { [key: string]: number } };
        if (!rankingValue.selected || rankingValue.selected.length === 0) {
          toast({
            title: "필수 항목입니다",
            description: "최소 1개 이상 선택해주세요.",
            variant: "destructive",
          });
          return false;
        }
        
        // 선택된 모든 항목에 순위가 지정되었는지 확인
        const hasIncompleteRanking = rankingValue.selected.some(
          (item) => !rankingValue.ranking || !rankingValue.ranking[item]
        );
        if (hasIncompleteRanking) {
          toast({
            title: "순위를 선택해 주세요",
            description: "선택한 모든 항목에 순위를 지정해주세요.",
            variant: "destructive",
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) {
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 설문 완료 - localStorage에 저장 후 결과 페이지로 이동
      const surveyId = `survey_${Date.now()}`;
      localStorage.setItem(`survey_temp-id`, JSON.stringify(responses));
      console.log("Survey responses:", responses);
      navigate("/results/temp-id");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => {
      const updated = {
        ...prev,
        [questionId]: value,
      };
      
      // specialties 응답 변경 시, 조건부 질문의 응답 초기화
      if (questionId === "specialties") {
        const rankingValue = value as { selected: string[]; ranking: { [key: string]: number } };
        const selectedSpecialties = rankingValue?.selected || [];
        
        // 피부과/성형외과가 선택되지 않았으면 commercialPlatform 응답 제거
        if (!selectedSpecialties.includes("피부과/성형외과")) {
          delete updated.commercialPlatform;
        }
      }
      
      return updated;
    });
  };


  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header with Progress */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                질문 {currentStep + 1} / {totalSteps}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}% 완료
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-md border border-border p-8 md:p-12">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {currentQuestion.section === "basic" && "기본 정보"}
                {currentQuestion.section === "channels" && "마케팅 채널"}
                {currentQuestion.section === "operations" && "운영 관리"}
                {currentQuestion.section === "measurement" && "성과 측정"}
                {currentQuestion.section === "needs" && "개선 니즈"}
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {currentQuestion.title}
              </h2>
              
              {currentQuestion.description && (
                <p className="text-muted-foreground">
                  {currentQuestion.description}
                </p>
              )}
            </div>


            {/* Question Content */}
            <div className="space-y-4 mb-12">
              {currentQuestion.type === "radio" && (
                <RadioQuestion
                  question={currentQuestion}
                  value={responses[currentQuestion.id] as string}
                  onChange={(value) => handleResponseChange(currentQuestion.id, value)}
                />
              )}

              {currentQuestion.type === "checkbox" && (
                <CheckboxQuestion
                  question={currentQuestion}
                  value={responses[currentQuestion.id] as string[]}
                  onChange={(value) => handleResponseChange(currentQuestion.id, value)}
                />
              )}

              {currentQuestion.type === "ranking" && (
                <RankingQuestion
                  question={currentQuestion}
                  value={responses[currentQuestion.id] as { selected: string[]; ranking: { [key: string]: number } }}
                  onChange={(value) => handleResponseChange(currentQuestion.id, value)}
                />
              )}

              {currentQuestion.type === "multi-select" && (
                <MultiSelectQuestion
                  question={currentQuestion}
                  value={responses[currentQuestion.id] as { [key: string]: any }}
                  onChange={(value) => handleResponseChange(currentQuestion.id, value)}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </Button>

              <Button
                onClick={handleNext}
                className="gradient-primary text-white gap-2"
              >
                {currentStep === totalSteps - 1 ? "결과 보기" : "다음"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
