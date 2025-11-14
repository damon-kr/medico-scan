import { SurveyResponse } from "@/types/survey";

/**
 * 체크리스트 항목
 */
export interface ChecklistItem {
  id: string;
  category: "채널" | "운영" | "측정" | "예산" | "통합";
  title: string;
  description: string;
  priority: "시급" | "개선권장" | "기회" | "유지";
  tip: string;
  checked: boolean;
}

/**
 * 설문 응답 기반 동적 체크리스트 생성
 *
 * 총 39개 항목 (35개 개별 조건 + 4개 조합 조건)
 * 모든 조건은 설문을 통해 수집 가능한 데이터만 사용
 */
export function generateChecklist(responses: SurveyResponse): ChecklistItem[] {
  const checklist: ChecklistItem[] = [];

  // ==================== 채널 관련 (12개) ====================

  // 1. 네이버 블로그 활성화
  if (
    responses.channels?.selected.includes("네이버 블로그") &&
    responses.updateFrequency &&
    ["주 5회 이상", "주 2-3회"].includes(responses.updateFrequency)
  ) {
    checklist.push({
      id: "channel-1",
      category: "채널",
      title: "네이버 블로그 꾸준한 발행",
      description: "네이버 블로그를 사용 중이며 주 2회 이상 업데이트하고 있습니다.",
      priority: "유지",
      tip: "현재 주기를 유지하며 검색 키워드를 분석하여 콘텐츠 품질을 개선하세요.",
      checked: true,
    });
  }

  // 2. 네이버 블로그 저활동
  if (
    responses.channels?.selected.includes("네이버 블로그") &&
    responses.updateFrequency &&
    ["주 1회", "월 1-2회", "거의 안함"].includes(responses.updateFrequency)
  ) {
    checklist.push({
      id: "channel-2",
      category: "채널",
      title: "네이버 블로그 업데이트 주기 개선",
      description: "네이버 블로그 업데이트가 불규칙하거나 드뭅니다.",
      priority: "개선권장",
      tip: "주 2회 이상 업데이트를 목표로 하세요. 스마트블록/에디터3.0로 템플릿을 만들면 작성 시간을 줄일 수 있습니다.",
      checked: false,
    });
  }

  // 3. 인스타그램 활성화
  if (
    responses.channels?.selected.includes("인스타그램") &&
    responses.updateFrequency &&
    ["주 5회 이상", "주 2-3회"].includes(responses.updateFrequency)
  ) {
    checklist.push({
      id: "channel-3",
      category: "채널",
      title: "인스타그램 꾸준한 운영",
      description: "인스타그램을 주 2회 이상 운영하고 있습니다.",
      priority: "유지",
      tip: "릴스와 스토리를 활용하여 도달률을 높이고, 해시태그 전략을 최적화하세요.",
      checked: true,
    });
  }

  // 4. 인스타그램 저활동
  if (
    responses.channels?.selected.includes("인스타그램") &&
    responses.updateFrequency &&
    ["주 1회", "월 1-2회", "거의 안함"].includes(responses.updateFrequency)
  ) {
    checklist.push({
      id: "channel-4",
      category: "채널",
      title: "인스타그램 콘텐츠 발행 주기 개선",
      description: "인스타그램 업데이트가 불규칙합니다.",
      priority: "개선권장",
      tip: "하루 1개의 릴스를 목표로 시작하세요. Canva나 CapCut으로 쉽게 제작할 수 있습니다.",
      checked: false,
    });
  }

  // 5. 유튜브 활성화
  if (
    responses.channels?.selected.includes("유튜브") &&
    responses.updateFrequency &&
    ["주 5회 이상", "주 2-3회", "주 1회"].includes(responses.updateFrequency)
  ) {
    checklist.push({
      id: "channel-5",
      category: "채널",
      title: "유튜브 정기 업로드",
      description: "유튜브 채널을 정기적으로 운영하고 있습니다.",
      priority: "유지",
      tip: "쇼츠와 긴 영상을 병행하고, 썸네일과 제목 A/B 테스트로 클릭률을 높이세요.",
      checked: true,
    });
  }

  // 6. 유튜브 저활동
  if (
    responses.channels?.selected.includes("유튜브") &&
    responses.updateFrequency &&
    ["월 1-2회", "거의 안함"].includes(responses.updateFrequency)
  ) {
    checklist.push({
      id: "channel-6",
      category: "채널",
      title: "유튜브 업로드 빈도 증가",
      description: "유튜브 업로드가 매우 드뭅니다.",
      priority: "개선권장",
      tip: "유튜브 쇼츠부터 시작하세요. 진료 전후 사진, 시술 과정 등 짧은 영상으로 꾸준히 노출하세요.",
      checked: false,
    });
  }

  // 7. 채널 수 부족 (1-2개)
  if (responses.channels?.selected && responses.channels.selected.length <= 2) {
    checklist.push({
      id: "channel-7",
      category: "채널",
      title: "마케팅 채널 확장",
      description: "현재 1-2개의 채널만 사용하고 있습니다.",
      priority: "시급",
      tip: "최소 3개 이상의 채널을 운영하세요. 네이버 블로그, 인스타그램, 구글 비즈니스 프로필(GBP)을 기본으로 시작하는 것을 권장합니다.",
      checked: false,
    });
  }

  // 8. 채널 포트폴리오 우수 (5개 이상)
  if (responses.channels?.selected && responses.channels.selected.length >= 5) {
    checklist.push({
      id: "channel-8",
      category: "채널",
      title: "멀티채널 전략 운영",
      description: "5개 이상의 다양한 채널을 사용하고 있습니다.",
      priority: "유지",
      tip: "각 채널별 성과를 측정하고, 효율이 낮은 채널은 과감히 정리하세요.",
      checked: true,
    });
  }

  // 9. 구글 비즈니스 프로필 미사용
  if (
    responses.channels?.selected &&
    !responses.channels.selected.includes("구글 비즈니스 프로필")
  ) {
    checklist.push({
      id: "channel-9",
      category: "채널",
      title: "구글 비즈니스 프로필(GBP) 등록",
      description: "구글 비즈니스 프로필을 사용하지 않고 있습니다.",
      priority: "개선권장",
      tip: "GBP는 무료이며 구글 지도/검색 노출에 필수입니다. 30분이면 등록 가능합니다.",
      checked: false,
    });
  }

  // 10. 네이버 플레이스 미사용
  if (
    responses.channels?.selected &&
    !responses.channels.selected.includes("네이버 플레이스")
  ) {
    checklist.push({
      id: "channel-10",
      category: "채널",
      title: "네이버 플레이스 등록",
      description: "네이버 플레이스를 사용하지 않고 있습니다.",
      priority: "시급",
      tip: "네이버 검색/지도에서 필수입니다. 스마트플레이스에서 즉시 등록하세요.",
      checked: false,
    });
  }

  // 11. 상업적 플랫폼 미활용 (피부과/성형외과)
  if (
    responses.specialties?.selected.includes("피부과/성형외과") &&
    responses.commercialPlatform === "관심 없음"
  ) {
    checklist.push({
      id: "channel-11",
      category: "채널",
      title: "상업적 플랫폼 테스트",
      description: "피부/성형 분야인데 상업적 플랫폼을 사용하지 않습니다.",
      priority: "기회",
      tip: "강남언니, 모두닥 등에서 소액 테스트를 진행하여 ROI를 검증해보세요.",
      checked: false,
    });
  }

  // 12. 신규 채널 시도 경험 부족
  if (responses.newChannelAttempt === "지금 채널만으로 충분해서 시도할 필요 없음") {
    checklist.push({
      id: "channel-12",
      category: "채널",
      title: "새로운 채널 실험",
      description: "새로운 채널 시도 경험이 없습니다.",
      priority: "개선권장",
      tip: "분기별 1개 채널씩 테스트하세요. 유튜브 쇼츠, 카카오 채널 등을 권장합니다.",
      checked: false,
    });
  }

  // ==================== 운영 관련 (10개) ====================

  // 13. 전담 인력 확보
  if (responses.management === "전담 직원" || responses.management === "혼합") {
    checklist.push({
      id: "operation-1",
      category: "운영",
      title: "전문 마케팅 인력 보유",
      description: "전담 직원 또는 혼합 체계로 운영하고 있습니다.",
      priority: "유지",
      tip: "마케팅 담당자에게 정기적인 교육 기회를 제공하고, 최신 트렌드를 학습하도록 지원하세요.",
      checked: true,
    });
  }

  // 14. 외주 의존
  if (responses.management === "외부 업체") {
    checklist.push({
      id: "operation-2",
      category: "운영",
      title: "내부 역량 구축",
      description: "마케팅을 외부 업체에만 의존하고 있습니다.",
      priority: "개선권장",
      tip: "외주사는 유지하되, 병원 내 1명이라도 마케팅 기초 지식을 갖추도록 하세요. 업체 성과를 제대로 평가할 수 있습니다.",
      checked: false,
    });
  }

  // 15. 원장 혼자 운영
  if (responses.management === "원장 본인") {
    checklist.push({
      id: "operation-3",
      category: "운영",
      title: "마케팅 업무 분담",
      description: "원장님이 직접 모든 마케팅을 담당하고 있습니다.",
      priority: "시급",
      tip: "콘텐츠 기획은 원장이, 실행은 직원/대행사가 담당하는 구조를 만드세요. 본업에 집중할 시간을 확보하는 것이 중요합니다.",
      checked: false,
    });
  }

  // 16. 업데이트 주기 우수
  if (
    responses.updateFrequency &&
    ["주 5회 이상", "주 2-3회"].includes(responses.updateFrequency)
  ) {
    checklist.push({
      id: "operation-4",
      category: "운영",
      title: "꾸준한 콘텐츠 발행",
      description: "주 2회 이상 콘텐츠를 업데이트하고 있습니다.",
      priority: "유지",
      tip: "발행 주기는 유지하되, 성과가 좋은 콘텐츠 유형을 분석하여 품질을 높이세요.",
      checked: true,
    });
  }

  // 17. 업데이트 주기 저조
  if (
    responses.updateFrequency &&
    ["월 1-2회", "거의 안함"].includes(responses.updateFrequency)
  ) {
    checklist.push({
      id: "operation-5",
      category: "운영",
      title: "콘텐츠 업데이트 주기 개선",
      description: "콘텐츠 업데이트가 거의 이루어지지 않습니다.",
      priority: "시급",
      tip: "처음엔 주 1회부터 시작하세요. 템플릿을 만들어두면 제작 시간을 크게 단축할 수 있습니다.",
      checked: false,
    });
  }

  // 18. 실험적 마케팅 문화
  if (responses.newChannelAttempt === "적극 테스트") {
    checklist.push({
      id: "operation-6",
      category: "운영",
      title: "적극적인 테스트 문화",
      description: "새로운 채널을 적극적으로 시도하는 문화가 있습니다.",
      priority: "유지",
      tip: "테스트 결과를 체계적으로 기록하고, 학습한 인사이트를 다른 채널에도 적용하세요.",
      checked: true,
    });
  }

  // 19. 채널 선택 근거 부족
  if (
    responses.channelReason === "다른 병원이 하니까" ||
    responses.channelReason === "직관"
  ) {
    checklist.push({
      id: "operation-7",
      category: "운영",
      title: "데이터 기반 채널 선택",
      description: "채널 선택이 직관이나 벤치마킹에만 의존하고 있습니다.",
      priority: "개선권장",
      tip: "각 채널별로 3개월 테스트 후 CAC(고객획득비용)를 비교하여 의사결정하세요.",
      checked: false,
    });
  }

  // 20. 성과 기반 채널 선택
  if (
    responses.channelReason === "이전 성과" ||
    responses.channelReason === "비용 효율"
  ) {
    checklist.push({
      id: "operation-8",
      category: "운영",
      title: "성과 중심 채널 운영",
      description: "성과 데이터를 기반으로 채널을 선택하고 있습니다.",
      priority: "유지",
      tip: "월별 채널별 ROI를 추적하고, 분기별로 포트폴리오를 재조정하세요.",
      checked: true,
    });
  }

  // 21. 1개 채널 집중 (70% 이상)
  if (responses.top1Ratio === "70% 이상") {
    checklist.push({
      id: "operation-9",
      category: "운영",
      title: "채널 리스크 분산",
      description: "1개 채널에 70% 이상 의존하고 있습니다.",
      priority: "시급",
      tip: "주력 채널 비중을 50% 이하로 낮추세요. 알고리즘 변화나 정책 변경으로 인한 리스크를 줄일 수 있습니다.",
      checked: false,
    });
  }

  // 22. 균형잡힌 채널 비중
  if (
    responses.top1Ratio &&
    ["30-50%", "50-70%"].includes(responses.top1Ratio)
  ) {
    checklist.push({
      id: "operation-10",
      category: "운영",
      title: "채널 포트폴리오 균형",
      description: "채널별 비중이 적절하게 분산되어 있습니다.",
      priority: "유지",
      tip: "현재 균형을 유지하며, 각 채널의 강점을 살린 콘텐츠 전략을 구사하세요.",
      checked: true,
    });
  }

  // ==================== 측정 관련 (9개) ====================

  // 23. 신규 환자 추적 체계 우수
  if (
    responses.trackingMethods &&
    responses.trackingMethods.length >= 3
  ) {
    checklist.push({
      id: "measurement-1",
      category: "측정",
      title: "다층 추적 시스템",
      description: "3개 이상의 추적 방법을 사용하고 있습니다.",
      priority: "유지",
      tip: "각 추적 방법의 정확도를 검증하고, 데이터를 통합하여 대시보드를 만드세요.",
      checked: true,
    });
  }

  // 24. 신규 환자 추적 미흡
  if (
    !responses.trackingMethods ||
    responses.trackingMethods.length === 0 ||
    responses.trackingMethods.includes("추적 안함")
  ) {
    checklist.push({
      id: "measurement-2",
      category: "측정",
      title: "신규 환자 추적 체계 구축",
      description: "신규 환자를 추적하지 않고 있습니다.",
      priority: "시급",
      tip: "최소한 '어디서 알고 오셨어요?' 질문을 접수 시 필수로 물어보세요. 스프레드시트로 기록하는 것부터 시작하세요.",
      checked: false,
    });
  }

  // 25. 온라인 예약 시스템 사용
  if (
    responses.trackingMethods &&
    responses.trackingMethods.includes("온라인 예약")
  ) {
    checklist.push({
      id: "measurement-3",
      category: "측정",
      title: "자동화된 전환 추적",
      description: "온라인 예약 시스템으로 전환을 추적하고 있습니다.",
      priority: "유지",
      tip: "예약 시스템과 광고 플랫폼을 연동하여 채널별 전환율을 자동으로 측정하세요.",
      checked: true,
    });
  }

  // 26. 데이터 기반 의사결정
  if (responses.decisionMaking === "데이터 기반") {
    checklist.push({
      id: "measurement-4",
      category: "측정",
      title: "분석 기반 최적화",
      description: "데이터를 기반으로 의사결정하고 있습니다.",
      priority: "유지",
      tip: "Google Analytics, 네이버 애널리틱스 등을 활용하여 더 정교한 분석을 시도하세요.",
      checked: true,
    });
  }

  // 27. 직관 기반 의사결정
  if (responses.decisionMaking === "직감" || responses.decisionMaking === "정해진 예산") {
    checklist.push({
      id: "measurement-5",
      category: "측정",
      title: "데이터 기반 의사결정 전환",
      description: "직감이나 고정 예산으로 의사결정하고 있습니다.",
      priority: "개선권장",
      tip: "간단한 스프레드시트로 채널별 비용과 신규 환자 수를 기록하는 것부터 시작하세요.",
      checked: false,
    });
  }

  // 28. LTV 인식 우수
  if (
    responses.patientLifetimeValue &&
    responses.patientLifetimeValue !== "모르겠음" &&
    responses.patientLifetimeValue !== "50만원 미만"
  ) {
    checklist.push({
      id: "measurement-6",
      category: "측정",
      title: "환자 생애가치 인식",
      description: "환자 생애가치(LTV)를 인식하고 있습니다.",
      priority: "유지",
      tip: "LTV를 기준으로 CAC(고객획득비용) 목표치를 설정하세요. 일반적으로 LTV의 1/3 이하가 적정합니다.",
      checked: true,
    });
  }

  // 29. LTV 미인식
  if (responses.patientLifetimeValue === "모르겠음") {
    checklist.push({
      id: "measurement-7",
      category: "측정",
      title: "환자 생애가치 계산",
      description: "환자 생애가치를 파악하지 못하고 있습니다.",
      priority: "개선권장",
      tip: "최근 1년간 재방문 환자의 평균 매출을 계산하세요. 이를 기준으로 마케팅 예산을 산정할 수 있습니다.",
      checked: false,
    });
  }

  // 30. 우수한 온라인 평가
  if (
    responses.onlineStatusPositive &&
    responses.onlineStatusPositive.includes("높은 평점")
  ) {
    checklist.push({
      id: "measurement-8",
      category: "측정",
      title: "강력한 온라인 평판",
      description: "높은 평점을 유지하고 있습니다.",
      priority: "유지",
      tip: "리뷰에 정성스럽게 답글을 달고, 만족도 높은 환자에게 자연스럽게 리뷰를 요청하세요.",
      checked: true,
    });
  }

  // 31. 낮은 평점
  if (
    responses.onlineStatusNegative &&
    responses.onlineStatusNegative.includes("낮은 평점")
  ) {
    checklist.push({
      id: "measurement-9",
      category: "측정",
      title: "온라인 평판 개선",
      description: "평점이 낮은 상태입니다.",
      priority: "시급",
      tip: "부정적 리뷰의 공통 패턴을 분석하고, 서비스 개선 후 만족한 환자에게 리뷰를 요청하세요. 평점 3.5 이상을 목표로 하세요.",
      checked: false,
    });
  }

  // ==================== 예산 관련 (4개) ====================

  // 32. 충분한 마케팅 예산
  if (
    responses.budget &&
    ["500-1,000만원", "1,000-2,000만원", "2,000만원 이상"].includes(
      responses.budget
    )
  ) {
    checklist.push({
      id: "budget-1",
      category: "예산",
      title: "적극적인 마케팅 투자",
      description: "월 500만원 이상의 마케팅 예산을 사용하고 있습니다.",
      priority: "유지",
      tip: "예산을 늘리기보다 현재 예산의 효율을 높이는 데 집중하세요. 채널별 ROAS를 측정하여 재분배하세요.",
      checked: true,
    });
  }

  // 33. 최소한의 예산
  if (responses.budget && responses.budget === "100만원 미만") {
    checklist.push({
      id: "budget-2",
      category: "예산",
      title: "마케팅 예산 증액",
      description: "월 100만원 미만의 예산을 사용하고 있습니다.",
      priority: "개선권장",
      tip: "무료 채널(네이버 블로그, 인스타그램, GBP)부터 활성화하고, 성과가 검증되면 광고 예산을 단계적으로 늘리세요.",
      checked: false,
    });
  }

  // 34. 적정 예산 (100-500만원)
  if (
    responses.budget &&
    ["100-300만원", "300-500만원"].includes(responses.budget)
  ) {
    checklist.push({
      id: "budget-3",
      category: "예산",
      title: "예산 효율 극대화",
      description: "월 100-500만원의 적정 예산을 사용하고 있습니다.",
      priority: "유지",
      tip: "예산의 70%는 검증된 채널에, 30%는 신규 채널 테스트에 배분하세요.",
      checked: true,
    });
  }

  // 35. 예산 정보 없음
  if (!responses.budget) {
    checklist.push({
      id: "budget-4",
      category: "예산",
      title: "마케팅 예산 책정",
      description: "마케팅 예산이 책정되어 있지 않습니다.",
      priority: "시급",
      tip: "월 매출의 5-10%를 마케팅에 투자하는 것이 일반적입니다. 우선 최소 예산을 정하고 시작하세요.",
      checked: false,
    });
  }

  // ==================== 통합 조건 (4개) ====================

  // 36. 경쟁 치열 + 노출 낮음 (시급)
  if (
    (responses.competition_count === "많음" ||
      responses.competition_count === "매우 많음") &&
    (responses.naver_map_ranking === "2페이지" ||
      responses.naver_map_ranking === "3페이지 이후")
  ) {
    checklist.push({
      id: "integrated-1",
      category: "통합",
      title: "검색 노출 최적화 긴급 대응",
      description: "경쟁이 치열한 지역인데 검색 노출이 낮습니다.",
      priority: "시급",
      tip: "네이버 플레이스 정보를 완벽하게 채우고(사진 30장 이상, 리뷰 관리), 블로그 키워드 전략을 재검토하세요. 필요시 전문 SEO 대행사의 도움을 받으세요.",
      checked: false,
    });
  }

  // 37. 채널 다양 + 추적 미흡
  if (
    responses.channels?.selected &&
    responses.channels.selected.length >= 4 &&
    (!responses.trackingMethods || responses.trackingMethods.length <= 1)
  ) {
    checklist.push({
      id: "integrated-2",
      category: "통합",
      title: "멀티채널 성과 측정 체계 구축",
      description: "다양한 채널을 운영하지만 추적 체계가 부족합니다.",
      priority: "개선권장",
      tip: "각 채널마다 고유 전화번호(070)나 UTM 파라미터를 부여하여 유입 경로를 추적하세요.",
      checked: false,
    });
  }

  // 38. 높은 예산 + 추적 미흡
  if (
    responses.budget &&
    ["500-1,000만원", "1,000-2,000만원", "2,000만원 이상"].includes(
      responses.budget
    ) &&
    (!responses.trackingMethods || responses.trackingMethods.length <= 1)
  ) {
    checklist.push({
      id: "integrated-3",
      category: "통합",
      title: "ROI 측정 시스템 구축",
      description: "높은 예산을 사용하지만 성과 추적이 미흡합니다.",
      priority: "시급",
      tip: "광고비 대비 신규 환자 수, CAC, ROAS를 측정할 수 있는 시스템을 즉시 구축하세요. 돈을 낭비하고 있을 가능성이 높습니다.",
      checked: false,
    });
  }

  // 39. 우수한 운영 + 낮은 예산
  if (
    responses.updateFrequency &&
    ["주 5회 이상", "주 2-3회"].includes(responses.updateFrequency) &&
    responses.budget &&
    ["100만원 미만", "100-300만원"].includes(responses.budget)
  ) {
    checklist.push({
      id: "integrated-4",
      category: "통합",
      title: "운영 역량 대비 예산 부족",
      description: "콘텐츠 운영 역량은 우수하나 예산이 부족합니다.",
      priority: "기회",
      tip: "현재 운영 수준이라면 광고 예산을 투입했을 때 큰 효과를 볼 수 있습니다. 월 300만원 이상으로 증액을 검토하세요.",
      checked: false,
    });
  }

  // 우선순위 정렬: 시급 > 개선권장 > 기회 > 유지
  const priorityOrder = { 시급: 1, 개선권장: 2, 기회: 3, 유지: 4 };
  return checklist.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
