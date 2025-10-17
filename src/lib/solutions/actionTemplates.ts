import { Action, IssueType, SurveyResponse } from "@/types/survey";

/**
 * 진단 유형별 액션 템플릿
 */
export function getActionTemplates(
  issueType: IssueType,
  responses: SurveyResponse
): Action[] {
  const specialty = responses.specialties?.[0] || "";
  const budget = responses.budget || "";

  switch (issueType) {
    case "single_tool":
      return getSingleToolActions(specialty, budget);
    case "naver_dependent":
      return getNaverDependentActions(specialty, budget);
    case "digital_blind_spot":
      return getDigitalBlindSpotActions(specialty, budget);
    case "neglected_operation":
      return getNeglectedOperationActions(specialty, budget);
    case "performance_blind":
      return getPerformanceBlindActions(specialty, budget);
    case "scattered_efforts":
      return getScatteredEffortsActions(specialty, budget);
    case "online_passive":
      return getOnlinePassiveActions(specialty, budget);
    default:
      return getGeneralActions(specialty, budget);
  }
}

/**
 * 원툴형 액션
 */
function getSingleToolActions(specialty: string, budget: string): Action[] {
  return [
    {
      title: "채널 다각화 1단계: 인스타그램 계정 개설",
      description:
        "현재 사용 중인 채널 외에 인스타그램을 추가하여 리스크를 분산하세요. 프로필 최적화, 초기 콘텐츠 10개 업로드, 해시태그 전략 수립을 진행합니다.",
      timeline: "1주일",
      expectedOutcome: "월 20-30명 신규 유입, 브랜드 인지도 향상",
      priority: "high",
    },
    {
      title: "구글 마이 비즈니스 등록 및 최적화",
      description:
        "구글 검색 사용자를 위한 기본 정보 등록. 무료이며 네이버 외 유입 경로를 확보할 수 있습니다.",
      timeline: "3일",
      expectedOutcome: "구글 검색 유입 월 10-15명",
      priority: "high",
    },
    {
      title: "카카오톡 채널 개설 및 친구 확보",
      description:
        "기존 환자와의 커뮤니케이션 채널 확보. 재방문율 증대와 이벤트 알림에 활용 가능합니다.",
      timeline: "1주일",
      expectedOutcome: "재방문율 15% 증가",
      priority: "high",
    },
    {
      title: "멀티채널 포트폴리오 설계",
      description:
        "현재 채널 50% + 신규 채널 30% + 테스트 채널 20%로 비중 조정. 각 채널별 KPI 설정 및 모니터링 체계 구축.",
      timeline: "1개월",
      expectedOutcome: "채널 의존도 50% 이하로 감소",
      priority: "medium",
    },
    {
      title: "채널별 성과 비교 대시보드 구축",
      description:
        "각 채널의 유입, 전환, ROI를 한눈에 비교할 수 있는 시스템 구축. 구글 시트나 데이터 스튜디오 활용.",
      timeline: "2주",
      expectedOutcome: "데이터 기반 의사결정 가능",
      priority: "medium",
    },
    {
      title: "신규 채널 테스트 예산 확보",
      description:
        "전체 예산의 10-15%를 신규 채널 테스트에 할당. 유튜브, 틱톡, 지역 커뮤니티 등 실험.",
      timeline: "3개월",
      expectedOutcome: "신규 유망 채널 1-2개 발굴",
      priority: "low",
    },
  ];
}

/**
 * 네이버 의존형 액션
 */
function getNaverDependentActions(specialty: string, budget: string): Action[] {
  return [
    {
      title: "네이버 광고 효율 최적화",
      description:
        "현재 네이버 광고의 키워드, 소재, 타겟팅을 재점검하고 비효율 키워드 제거. 시간대별 입찰 조정으로 비용 절감.",
      timeline: "1주일",
      expectedOutcome: "광고비 20% 절감 또는 전환율 30% 개선",
      priority: "high",
    },
    {
      title: "인스타그램 마케팅 시작",
      description:
        specialty.includes("피부과")
          ? "전후 사진, 시술 과정 리얼 콘텐츠 제작. 강남언니/바비톡과 연계하여 신뢰도 확보."
          : "진료 정보, 건강 팁 콘텐츠로 신뢰 구축. 환자 후기 및 케이스 공유.",
      timeline: "2주",
      expectedOutcome: "월 30-50명 신규 유입, 젊은 층 환자 확보",
      priority: "high",
    },
    {
      title: "구글 검색광고 시작 (소규모)",
      description:
        "네이버에서 효과 있는 키워드를 구글에도 적용. 초기 예산 월 50-100만원으로 테스트.",
      timeline: "1개월",
      expectedOutcome: "네이버 대비 20-30% 저렴한 CPC, 월 15-20명 유입",
      priority: "medium",
    },
    {
      title: "카카오톡 채널 활용 재방문 전략",
      description:
        "기존 환자를 카카오톡 친구로 확보하여 재방문 유도. 생일 쿠폰, 정기 검진 알림 등.",
      timeline: "1개월",
      expectedOutcome: "재방문율 20% 증가, 신규 광고비 절감",
      priority: "medium",
    },
    {
      title: "네이버 외 채널 비중 40% 이상 확보",
      description:
        "3개월 내 네이버 비중을 60% 이하로 낮추고, 인스타그램 20%, 구글 15%, 기타 5%로 분산.",
      timeline: "3개월",
      expectedOutcome: "알고리즘 변화 리스크 50% 감소",
      priority: "low",
    },
  ];
}

/**
 * 디지털 사각지대형 액션
 */
function getDigitalBlindSpotActions(specialty: string, budget: string): Action[] {
  return [
    {
      title: "네이버 플레이스 최적화 (기본 중의 기본)",
      description:
        "병원 기본 정보, 사진 10장 이상, 진료 시간, 주차 정보 등록. 리뷰 관리 시작.",
      timeline: "3일",
      expectedOutcome: "네이버 지도 검색 노출, 월 20-30명 유입",
      priority: "high",
    },
    {
      title: "구글 마이 비즈니스 등록",
      description: "무료 서비스로 구글 검색 및 구글 지도 노출. 기본 정보와 사진 등록.",
      timeline: "3일",
      expectedOutcome: "구글 검색 유입 월 10-15명",
      priority: "high",
    },
    {
      title: "온라인 예약 시스템 도입",
      description:
        "카카오톡 예약하기, 네이버 예약, 또는 전문 예약 솔루션 도입. 전화 예약 부담 감소.",
      timeline: "2주",
      expectedOutcome: "예약 편의성 증가, 신규 환자 20% 증가",
      priority: "high",
    },
    {
      title: "인스타그램 계정 개설 및 운영",
      description:
        "주 2-3회 포스팅으로 온라인 존재감 확보. 병원 소개, 의료진 소개, 건강 정보 공유.",
      timeline: "1개월",
      expectedOutcome: "브랜드 인지도 향상, 월 20-30명 유입",
      priority: "medium",
    },
    {
      title: "온라인 평판 관리 시작",
      description:
        "네이버 플레이스, 구글 리뷰 정기 모니터링. 긍정 리뷰 유도 및 부정 리뷰 대응 프로세스 구축.",
      timeline: "1개월",
      expectedOutcome: "평점 0.5점 상승, 신뢰도 증가",
      priority: "medium",
    },
    {
      title: "디지털 마케팅 기초 교육",
      description:
        "원장 또는 직원 대상 디지털 마케팅 기초 교육. 온라인 채널 이해, 콘텐츠 제작 실습.",
      timeline: "3개월",
      expectedOutcome: "자체 운영 능력 확보, 외부 의존도 감소",
      priority: "low",
    },
  ];
}

/**
 * 방치 운영형 액션
 */
function getNeglectedOperationActions(specialty: string, budget: string): Action[] {
  return [
    {
      title: "콘텐츠 업데이트 루틴 설정",
      description:
        "주 2회 고정 요일(예: 화/목) 콘텐츠 업로드. 간단한 건강 정보, 진료 사례, 이벤트 안내 등.",
      timeline: "1주일",
      expectedOutcome: "검색 노출 개선, 신규 유입 30% 증가",
      priority: "high",
    },
    {
      title: "리뷰 관리 프로세스 구축",
      description:
        "매일 10분 리뷰 확인 및 답변. 긍정 리뷰에 감사 표현, 부정 리뷰에 진솔한 대응.",
      timeline: "3일",
      expectedOutcome: "평점 0.3점 상승, 신뢰도 증가",
      priority: "high",
    },
    {
      title: "마케팅 담당자 지정 (또는 외부 위탁)",
      description:
        "마케팅 전담 직원 채용 또는 기존 직원에게 업무 배분. 외부 업체 위탁도 고려.",
      timeline: "1개월",
      expectedOutcome: "체계적인 마케팅 운영, 효율 50% 개선",
      priority: "high",
    },
    {
      title: "월간 콘텐츠 캘린더 작성",
      description:
        "매월 초 한 달 치 콘텐츠 주제 및 일정 계획. 계절별 질환, 이벤트, 건강 팁 등.",
      timeline: "1개월",
      expectedOutcome: "일관된 콘텐츠 제작, 업데이트 빈도 3배 증가",
      priority: "medium",
    },
    {
      title: "광고 캠페인 정기 점검",
      description:
        "월 1회 광고 성과 리뷰 및 최적화. 비효율 키워드 제거, 예산 재배분.",
      timeline: "1개월",
      expectedOutcome: "광고 효율 30% 개선, 비용 절감",
      priority: "medium",
    },
    {
      title: "마케팅 자동화 도구 도입",
      description:
        "카카오톡 자동 답변, 예약 알림, 생일 쿠폰 발송 등 자동화. 시간 절약 및 효율 증대.",
      timeline: "2개월",
      expectedOutcome: "운영 시간 50% 절감, 재방문율 20% 증가",
      priority: "low",
    },
  ];
}

/**
 * 성과 맹목형 액션
 */
function getPerformanceBlindActions(specialty: string, budget: string): Action[] {
  return [
    {
      title: "신규 환자 추적 시스템 구축",
      description:
        '첫 방문 시 "어떻게 오셨나요?" 질문 및 기록. 온라인 예약 시스템 활용 시 자동 집계.',
      timeline: "1주일",
      expectedOutcome: "채널별 유입 현황 파악, 데이터 기반 의사결정 가능",
      priority: "high",
    },
    {
      title: "구글 애널리틱스(GA) 설치",
      description:
        "홈페이지 및 예약 페이지에 GA 설치. 유입 경로, 전환율, 이탈률 등 기본 지표 파악.",
      timeline: "3일",
      expectedOutcome: "온라인 행동 데이터 수집, 최적화 기회 발견",
      priority: "high",
    },
    {
      title: "채널별 전환 추적 코드 설치",
      description:
        "네이버, 구글, 페이스북 등 각 채널의 전환 추적 픽셀 설치. 어느 채널이 실제로 환자를 데려오는지 파악.",
      timeline: "1주일",
      expectedOutcome: "채널별 ROI 측정, 예산 최적화",
      priority: "high",
    },
    {
      title: "월간 성과 리포트 작성",
      description:
        "매월 초 전월 데이터 정리: 신규 환자 수, 채널별 유입, 광고비, ROI 등. 엑셀 또는 구글 시트 활용.",
      timeline: "1개월",
      expectedOutcome: "트렌드 파악, 의사결정 근거 확보",
      priority: "medium",
    },
    {
      title: "환자 생애가치(LTV) 측정",
      description:
        "신규 환자의 평균 재방문 횟수, 객단가, 총 매출 계산. LTV를 알아야 적정 광고비 산정 가능.",
      timeline: "1개월",
      expectedOutcome: "적정 CAC(고객획득비용) 산정, 예산 효율화",
      priority: "medium",
    },
    {
      title: "A/B 테스트 문화 정착",
      description:
        "광고 소재, 타겟팅, 키워드 등을 2가지 버전으로 테스트. 데이터로 최선의 방법 찾기.",
      timeline: "3개월",
      expectedOutcome: "전환율 20-30% 개선",
      priority: "low",
    },
  ];
}

/**
 * 무분별 살포형 액션
 */
function getScatteredEffortsActions(specialty: string, budget: string): Action[] {
  return [
    {
      title: "채널별 성과 분석 및 우선순위 설정",
      description:
        "지난 3개월 데이터를 기반으로 채널별 ROI 계산. 하위 20% 채널은 과감히 중단.",
      timeline: "1주일",
      expectedOutcome: "비효율 채널 제거, 예산 효율 30% 개선",
      priority: "high",
    },
    {
      title: "핵심 채널 3개로 집중",
      description:
        "가장 효과적인 3개 채널에 80% 예산 집중. 나머지 20%는 신규 테스트용.",
      timeline: "1개월",
      expectedOutcome: "관리 부담 50% 감소, ROI 40% 개선",
      priority: "high",
    },
    {
      title: "채널별 명확한 KPI 설정",
      description:
        "각 채널의 역할 정의: 네이버는 신규 유입, 인스타는 브랜드 구축, 카카오톡은 재방문 등.",
      timeline: "1주일",
      expectedOutcome: "채널별 명확한 목표, 혼선 제거",
      priority: "high",
    },
    {
      title: "월간 예산 배분 프로세스 확립",
      description:
        "전월 성과를 기반으로 차월 예산 배분. 잘되는 채널에는 추가 투자, 안 되는 채널은 축소.",
      timeline: "1개월",
      expectedOutcome: "예산 낭비 30% 감소",
      priority: "medium",
    },
    {
      title: "콘텐츠 재사용 전략",
      description:
        "한 가지 콘텐츠를 여러 채널에 맞게 변형 활용. 블로그 글 → 인스타 카드뉴스 → 유튜브 쇼츠.",
      timeline: "1개월",
      expectedOutcome: "콘텐츠 제작 시간 50% 절감",
      priority: "medium",
    },
    {
      title: "분기별 채널 포트폴리오 재검토",
      description:
        "3개월마다 전체 채널 포트폴리오 재평가. 시장 변화 반영 및 신규 채널 테스트.",
      timeline: "3개월",
      expectedOutcome: "지속적인 최적화",
      priority: "low",
    },
  ];
}

/**
 * 온라인 소극형 액션 (피부과 특화)
 */
function getOnlinePassiveActions(specialty: string, budget: string): Action[] {
  return [
    {
      title: "인스타그램 전후 사진 콘텐츠 제작",
      description:
        "환자 동의 하에 전후 사진 공유. 실제 케이스로 신뢰도와 관심 유도. 주 2-3회 업로드.",
      timeline: "1주일",
      expectedOutcome: "인스타 팔로워 월 200명 증가, 문의 30% 증가",
      priority: "high",
    },
    {
      title: "강남언니/바비톡 프로필 최적화",
      description:
        "상세한 시술 정보, 가격, 전후 사진 등록. 이벤트 및 할인 정보 업데이트.",
      timeline: "3일",
      expectedOutcome: "플랫폼 유입 월 20-30명",
      priority: "high",
    },
    {
      title: "리뷰 이벤트 진행",
      description:
        "시술 후 리뷰 작성 시 소정의 혜택 제공. 네이버, 구글, 강남언니 등 다양한 플랫폼 활용.",
      timeline: "1개월",
      expectedOutcome: "리뷰 20개 이상 확보, 평점 향상",
      priority: "high",
    },
    {
      title: "시술 과정 숏폼 영상 제작",
      description:
        "인스타그램 릴스, 유튜브 쇼츠로 간단한 시술 과정 또는 Q&A 영상 제작. 60초 이내.",
      timeline: "2주",
      expectedOutcome: "영상 조회수 누적 10만+, 브랜드 인지도 상승",
      priority: "medium",
    },
    {
      title: "온라인 상담 시스템 구축",
      description:
        "카카오톡 채널, 인스타 DM, 홈페이지 챗봇 등을 통한 실시간 상담. 방문 장벽 낮추기.",
      timeline: "1개월",
      expectedOutcome: "상담 문의 50% 증가, 전환율 20% 개선",
      priority: "medium",
    },
    {
      title: "인플루언서 협업",
      description:
        "마이크로 인플루언서(팔로워 1만-10만)와 협업. 시술 체험 및 후기 콘텐츠 제작.",
      timeline: "2개월",
      expectedOutcome: "신규 환자 50-100명 유입, 브랜드 신뢰도 증가",
      priority: "low",
    },
  ];
}

/**
 * 일반형 액션
 */
function getGeneralActions(specialty: string, budget: string): Action[] {
  return [
    {
      title: "네이버 플레이스 최적화",
      description: "기본 정보 보완, 사진 추가, 리뷰 관리 강화로 검색 노출 개선.",
      timeline: "1주일",
      expectedOutcome: "네이버 검색 유입 20% 증가",
      priority: "high",
    },
    {
      title: "인스타그램 시작하기",
      description: "계정 개설, 프로필 최적화, 초기 콘텐츠 10개 제작 및 업로드.",
      timeline: "2주",
      expectedOutcome: "월 20-30명 신규 유입",
      priority: "high",
    },
    {
      title: "신규 환자 추적 시스템",
      description: '첫 방문 시 "어떻게 오셨나요?" 질문 및 기록.',
      timeline: "3일",
      expectedOutcome: "채널별 성과 파악 가능",
      priority: "high",
    },
    {
      title: "콘텐츠 업데이트 루틴 설정",
      description: "주 2회 고정 요일 콘텐츠 업로드.",
      timeline: "1개월",
      expectedOutcome: "검색 노출 30% 개선",
      priority: "medium",
    },
    {
      title: "구글 마이 비즈니스 등록",
      description: "구글 검색 및 지도 노출을 위한 무료 서비스 등록.",
      timeline: "3일",
      expectedOutcome: "구글 검색 유입 월 10-15명",
      priority: "medium",
    },
    {
      title: "광고 효율 점검",
      description: "현재 진행 중인 광고의 키워드, 타겟팅, 예산 재검토.",
      timeline: "1개월",
      expectedOutcome: "광고 효율 20% 개선",
      priority: "low",
    },
  ];
}
