import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { questions } from "@/data/questions";
import { SurveyResponse } from "@/types/survey";

const Survey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Partial<SurveyResponse>>({});

  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 설문 완료 - 결과 페이지로 이동
      navigate("/results/temp-id");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = questions[currentStep];

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

            {/* Question Content - Placeholder */}
            <div className="space-y-4 mb-12">
              <p className="text-muted-foreground">
                질문 타입: {currentQuestion.type}
              </p>
              <p className="text-sm text-muted-foreground">
                (각 질문 타입별 컴포넌트를 다음 단계에서 구현합니다)
              </p>
              
              {/* 옵션 표시 (임시) */}
              {currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div 
                      key={index}
                      className="p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      {option.emoji && <span className="mr-2">{option.emoji}</span>}
                      {option.label}
                    </div>
                  ))}
                </div>
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
