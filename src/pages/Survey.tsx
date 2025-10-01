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

  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = questions[currentStep];

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
      // 설문 완료 - 결과 페이지로 이동
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
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const getQuestionTypeLabel = (type: string): string => {
    switch (type) {
      case "multi-select":
        return "해당하는 항목을 전부 선택해 주세요";
      case "checkbox":
        return "해당하는 항목을 선택해 주세요";
      case "radio":
        return "해당하는 항목을 하나만 선택해 주세요";
      case "ranking":
        return "사용하는 채널을 선택하고 순위를 매겨주세요";
      case "dropdown":
        return "항목을 선택해 주세요";
      default:
        return "";
    }
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

            {/* Question Type Hint */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground italic">
                {getQuestionTypeLabel(currentQuestion.type)}
              </p>
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
