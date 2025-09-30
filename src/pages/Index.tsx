import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, TrendingUp, Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/survey");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">3분이면 충분합니다</span>
            </div>
            
            <h1 className="mb-6 bg-gradient-hero bg-clip-text text-transparent">
              3분만에 우리 병원<br />마케팅 진단받기
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed">
              10개의 간단한 질문으로<br />
              우리 병원 마케팅의 <span className="text-primary font-semibold">문제점과 해결책</span>을 찾아드립니다
            </p>

            <Button 
              onClick={handleStart}
              size="lg"
              className="gradient-primary text-white hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 rounded-xl group"
            >
              무료 진단 시작하기
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">
              ✓ 회원가입 불필요 &nbsp;&nbsp; ✓ 즉시 결과 확인
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-16 text-foreground">
            왜 마케팅 헬스체크가 필요한가요?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">정확한 문제 진단</h3>
              <p className="text-muted-foreground">
                7가지 유형 분석으로 우리 병원의 정확한 마케팅 문제를 파악합니다
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent border border-secondary/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl gradient-secondary flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">경쟁병원 비교</h3>
              <p className="text-muted-foreground">
                업계 평균과 BEST CASE를 비교하여 우리의 위치를 객관적으로 파악합니다
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-4">맞춤형 솔루션</h3>
              <p className="text-muted-foreground">
                즉시 실행 가능한 단계별 개선안을 제시하여 빠른 성과를 돕습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-16">
              진단 후 받을 수 있는 것들
            </h2>

            <div className="space-y-6">
              {[
                "우리 병원 마케팅 종합 점수 (100점 만점)",
                "주요 문제점과 부가 문제 진단",
                "업계 평균 대비 우리의 위치",
                "BEST CASE 성공 사례와 격차 분석",
                "즉시 실행 가능한 72시간 과제",
                "단기(1개월) & 중장기(3-6개월) 개선 전략",
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-lg pt-1">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button 
                onClick={handleStart}
                size="lg"
                className="gradient-primary text-white hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 rounded-xl group"
              >
                지금 바로 시작하기
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6">이미 많은 병원이<br />마케팅 헬스체크로<br />성과를 만들었습니다</h2>
            <p className="text-lg text-muted-foreground mb-8">
              정확한 진단과 실행 가능한 전략으로<br />
              월 평균 신규 환자 30% 이상 증가
            </p>
            
            <div className="inline-flex items-center gap-2 text-primary font-semibold">
              <CheckCircle className="w-5 h-5" />
              <span>무료로 시작해보세요</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
