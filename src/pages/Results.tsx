import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Calendar, ArrowRight } from "lucide-react";

const Results = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="mb-4">
              마케팅 진단 결과
            </h1>
            <p className="text-xl text-muted-foreground">
              우리 병원의 마케팅 현황을 분석했습니다
            </p>
          </div>

          {/* Score Card - Placeholder */}
          <Card className="p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full gradient-primary mb-6">
                <span className="text-5xl font-bold text-white">45</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">종합 점수: 45점</h2>
              <p className="text-xl text-muted-foreground mb-4">
                업계 평균: 52점
              </p>
              <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full font-semibold">
                Level 2 (기본)
              </div>
            </div>
          </Card>

          {/* Diagnosis Card - Placeholder */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">진단 결과</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-destructive">
                  주요 문제: 네이버 의존 과다형
                </h3>
                <p className="text-muted-foreground">
                  전체 마케팅의 70% 이상이 네이버에 집중되어 있어 리스크가 큽니다.
                  채널 다각화가 시급합니다.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-accent">
                  부가 문제
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 콘텐츠 업데이트 부족 (월 1회)</li>
                  <li>• 성과 측정 체계 미비</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  강점 영역
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 충분한 마케팅 예산 확보</li>
                  <li>• 의료진 전문성 우수</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Solutions Card - Placeholder */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">맞춤형 개선 전략</h2>
            
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold">즉시 실행 (1주일 내)</h3>
                </div>
                <div className="space-y-3 ml-10">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">인스타그램 계정 개설 및 프로필 최적화</h4>
                    <p className="text-sm text-muted-foreground">예상 소요시간: 2시간 | 예상 효과: 월 20명 신규 유입</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">네이버 플레이스 리뷰 관리 시작</h4>
                    <p className="text-sm text-muted-foreground">매일 10분 투자 | 평점 0.3점 상승 기대</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold">단기 개선 (1개월)</h3>
                </div>
                <div className="space-y-3 ml-10">
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <h4 className="font-semibold mb-2">네이버 광고 효율화</h4>
                    <p className="text-sm text-muted-foreground">시간대별 입찰 조정 | 예상 비용 절감: 20%</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold">중장기 전략 (3-6개월)</h3>
                </div>
                <div className="space-y-3 ml-10">
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <h4 className="font-semibold mb-2">멀티채널 포트폴리오 구축</h4>
                    <p className="text-sm text-muted-foreground">네이버 50% + 인스타 30% + 기타 20% | 리스크 분산 효과</p>
                  </div>
                </div>
              </div>
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
              <Button className="w-full gradient-primary text-white gap-2">
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
              <Button variant="outline" className="w-full gap-2">
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
