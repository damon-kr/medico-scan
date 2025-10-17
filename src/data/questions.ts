import { Question } from "@/types/survey";

export const questions: Question[] = [
  // Q1: 병원 위치와 규모
  {
    id: "location_and_size",
    section: "basic",
    order: 1,
    title: "병원 위치와 규모를 선택해주세요",
    description: "지역과 규모를 각각 선택해주세요",
    type: "multi-select",
    validation: { required: true },
    subQuestions: [
      {
        id: "location",
        section: "basic",
        order: 1.1,
        title: "지역 선택",
        type: "dropdown",
        validation: { required: true },
        options: [
          { value: "서울 강남권", label: "서울 강남권 (강남/서초/송파)", emoji: "🏢" },
          { value: "서울 비강남권", label: "서울 비강남권", emoji: "🏙️" },
          { value: "경기/인천", label: "경기/인천", emoji: "🌆" },
          { value: "광역시", label: "광역시 (부산/대구/광주/대전/울산)", emoji: "🌃" },
          { value: "그 외 지역", label: "그 외 지역", emoji: "🏘️" },
        ],
      },
      {
        id: "hospital_size",
        section: "basic",
        order: 1.2,
        title: "규모 선택",
        type: "dropdown",
        validation: { required: true },
        options: [
          { value: "의원급", label: "의원급 (병상 없음 또는 30개 미만)" },
          { value: "병원급", label: "병원급 (병상 30-99개)" },
          { value: "종합병원급", label: "종합병원급 이상 (병상 100개 이상)" },
        ],
      },
    ],
  },

  // Q2: 주요 진료 분야 (1순위, 2순위 선택)
  {
    id: "specialties",
    section: "basic",
    order: 2,
    title: "주요 진료 분야를 선택해주세요",
    description: "1순위와 2순위를 순서대로 선택해주세요 (2순위는 선택사항)",
    type: "ranking",
    validation: { required: true, min: 1, max: 2 },
    options: [
      { value: "피부과/성형외과", label: "피부과/성형외과 (미용 중심)", emoji: "💆" },
      { value: "치과", label: "치과 (일반/교정/임플란트)", emoji: "🦷" },
      { value: "정형외과", label: "정형외과/통증의학과/재활의학과", emoji: "🦴" },
      { value: "내과", label: "내과/가정의학과 (일반 진료)", emoji: "🏥" },
      { value: "산부인과", label: "산부인과/소아청소년과", emoji: "👶" },
      { value: "안과", label: "안과/이비인후과", emoji: "👁️" },
      { value: "정신건강의학과", label: "정신건강의학과/신경과", emoji: "🧠" },
      { value: "기타", label: "기타 전문 진료과", emoji: "🏥" },
    ],
  },

  // Q3: 월 마케팅 예산
  {
    id: "budget",
    section: "basic",
    order: 3,
    title: "현재 월 평균 마케팅 예산은 어느 정도인가요?",
    type: "radio",
    validation: { required: true },
    options: [
      { value: "100만원 미만", label: "100만원 미만", emoji: "📍" },
      { value: "100-300만원", label: "100-300만원", emoji: "📍" },
      { value: "300-500만원", label: "300-500만원", emoji: "📍" },
      { value: "500-1,000만원", label: "500-1,000만원", emoji: "📍" },
      { value: "1,000-2,000만원", label: "1,000-2,000만원", emoji: "📍" },
      { value: "2,000만원 이상", label: "2,000만원 이상", emoji: "📍" },
      { value: "정확히 모르겠음", label: "정확히 모르겠음", emoji: "📍" },
    ],
  },

  // Q4: 사용 중인 마케팅 채널
  {
    id: "channels",
    section: "channels",
    order: 4,
    title: "현재 사용 중인 마케팅 채널을 모두 선택 후, 가장 비중이 큰 순서대로 3개를 선택해주세요",
    type: "ranking",
    validation: { required: true, min: 1, max: 3 },
    options: [
      { value: "네이버 검색광고", label: "네이버 검색광고/파워링크" },
      { value: "네이버 플레이스", label: "네이버 플레이스 (스마트플레이스)" },
      { value: "네이버 블로그", label: "네이버 블로그 (지식iN 포함)" },
      { value: "카카오 광고", label: "카카오/다음 검색광고" },
      { value: "카카오톡 채널", label: "카카오톡 채널 (플러스친구)" },
      { value: "구글 광고", label: "구글 검색광고/GDN" },
      { value: "인스타그램", label: "인스타그램 광고/운영" },
      { value: "페이스북", label: "페이스북 광고/운영" },
      { value: "유튜브", label: "유튜브 광고/채널 운영" },
      { value: "틱톡", label: "틱톡 광고/운영" },
      { value: "병원 홈페이지", label: "병원 홈페이지/블로그" },
      { value: "병원 앱", label: "자체 병원 앱" },
      { value: "의료 플랫폼", label: "의료 플랫폼 (굿닥/모두닥/똑닥 등)" },
      { value: "미용 플랫폼", label: "미용 전문 플랫폼 (강남언니/바비톡 등)" },
      { value: "지역 커뮤니티", label: "지역 커뮤니티 (맘카페/당근 등)" },
      { value: "오프라인", label: "오프라인 (현수막/전단지/신문 등)" },
      { value: "기타", label: "기타" },
    ],
  },

  // Q4-1: 상업적 플랫폼 활용 (조건부)
  {
    id: "commercial_platform",
    section: "channels",
    order: 4.1,
    title: "상업적 플랫폼(강남언니/바비톡 등) 활용 여부",
    type: "radio",
    validation: { required: true },
    conditional: {
      dependsOn: "specialties",
      values: ["피부과/성형외과"],
    },
    options: [
      { value: "적극 활용", label: "유료 광고 적극 활용 중" },
      { value: "기본 등록", label: "기본 정보만 등록" },
      { value: "미사용", label: "사용하지 않음" },
      { value: "모르겠음", label: "잘 모르겠음" },
    ],
  },

  // Q4-2: 채널 선택 이유
  {
    id: "channel_reason",
    section: "channels",
    order: 4.2,
    title: "현재 사용 중인 주력 채널을 선택한 이유는?",
    type: "radio",
    validation: { required: true },
    options: [
      { value: "이전 성과", label: "이전에 이 채널에서 성과가 좋았음", emoji: "📊" },
      { value: "새로운 시도", label: "새롭게 시도해보고 있음", emoji: "💡" },
      { value: "경쟁병원", label: "경쟁병원들이 많이 사용함", emoji: "👥" },
      { value: "비용 효율", label: "비용 대비 효율적임", emoji: "💰" },
      { value: "환자층 적합", label: "우리 환자층에 적합함", emoji: "🎯" },
      { value: "특별한 이유 없음", label: "특별한 이유 없음/관성적으로", emoji: "🤷" },
    ],
  },

  // Q4-3: 채널별 비중
  {
    id: "channel_ratio",
    section: "channels",
    order: 4.3,
    title: "각 채널별 비중을 대략적으로 선택해주세요",
    type: "multi-select",
    validation: { required: true },
    subQuestions: [
      {
        id: "top1_ratio",
        section: "channels",
        order: 5.1,
        title: "1순위 채널의 비중은?",
        type: "radio",
        validation: { required: true },
        options: [
          { value: "70% 이상", label: "70% 이상 (거의 대부분)", emoji: "⚫" },
          { value: "50-70%", label: "50-70% (절반 이상)", emoji: "⚫" },
          { value: "30-50%", label: "30-50% (적당히)", emoji: "⚫" },
          { value: "30% 미만", label: "30% 미만 (일부)", emoji: "⚫" },
        ],
      },
      {
        id: "online_ratio",
        section: "channels",
        order: 5.2,
        title: "온라인 vs 오프라인 비중은?",
        type: "radio",
        validation: { required: true },
        options: [
          { value: "온라인 100%", label: "온라인 100% : 오프라인 0%" },
          { value: "온라인 80%", label: "온라인 80% : 오프라인 20%" },
          { value: "온라인 60%", label: "온라인 60% : 오프라인 40%" },
          { value: "온라인 40%", label: "온라인 40% : 오프라인 60%" },
          { value: "온라인 20%", label: "온라인 20% : 오프라인 80%" },
          { value: "오프라인 100%", label: "온라인 0% : 오프라인 100%" },
        ],
      },
    ],
  },

  // Q4-4: 다른 채널 시도 경험
  {
    id: "new_channel_attempt",
    section: "channels",
    order: 4.4,
    title: "새로운 마케팅 채널 시도에 대한 생각은?",
    type: "radio",
    validation: { required: true },
    options: [
      { value: "적극 테스트", label: "적극적으로 여러 채널을 테스트해봤음" },
      { value: "시도했지만 중단", label: "한두 개 정도 시도해봤지만 효과가 없어서 중단" },
      { value: "현재로 충분", label: "지금 채널만으로 충분해서 시도할 필요 없음" },
      { value: "방법 모름", label: "시도하고 싶지만 방법을 모르겠음" },
      { value: "리소스 부족", label: "시도하고 싶지만 리소스(시간/예산)가 부족함" },
    ],
  },

  // Q4-5: 마케팅 관리 주체
  {
    id: "management",
    section: "operations",
    order: 4.5,
    title: "마케팅 관리는 누가 하고 있나요?",
    type: "radio",
    validation: { required: true },
    options: [
      { value: "원장 직접", label: "원장/병원장이 직접", emoji: "👤" },
      { value: "직원 겸임", label: "직원이 다른 업무와 함께", emoji: "👥" },
      { value: "전담 직원", label: "마케팅 전담 직원 있음", emoji: "👤" },
      { value: "외부 위탁", label: "외부 업체에 전체 위탁", emoji: "🏢" },
      { value: "혼합", label: "일부는 직접, 일부는 외부", emoji: "🤝" },
      { value: "관리 부재", label: "관리가 제대로 안되고 있음", emoji: "❓" },
    ],
  },

  // Q5-1: 신규 환자 파악 방법
  {
    id: "tracking_methods",
    section: "measurement",
    order: 5.5,
    title: "마케팅을 통한 신규 환자를 어떻게 파악하나요?",
    description: "복수 선택 가능합니다",
    type: "checkbox",
    validation: { required: true, min: 1 },
    options: [
      { value: "온라인 예약", label: "온라인 예약 시스템으로 자동 집계" },
      { value: "직접 질문", label: "첫 방문 시 '어떻게 오셨나요?' 질문" },
      { value: "전화 확인", label: "전화 예약 시 확인" },
      { value: "이벤트 추적", label: "특정 이벤트/쿠폰으로 추적" },
      { value: "대략 추정", label: "대략적으로 추정만 함" },
      { value: "파악 안함", label: "따로 파악하지 않음" },
    ],
  },

  // Q6: 콘텐츠 업데이트 주기
  {
    id: "update_frequency",
    section: "operations",
    order: 6,
    title: "마케팅 콘텐츠(포스팅, 광고 등)는 얼마나 자주 업데이트하시나요?",
    description: "메인으로 사용하는 채널 기준",
    type: "radio",
    validation: { required: true },
    options: [
      { value: "주 5회 이상", label: "거의 매일 (주 5회 이상)", emoji: "📅" },
      { value: "주 2-3회", label: "주 2-3회 정도", emoji: "📅" },
      { value: "주 1회", label: "주 1회 정도", emoji: "📅" },
      { value: "월 2-3회", label: "월 2-3회 정도", emoji: "📅" },
      { value: "월 1회 이하", label: "월 1회 이하", emoji: "📅" },
      { value: "거의 안함", label: "만들어놓고 거의 안함", emoji: "📅" },
    ],
  },

  // Q9: 온라인 현황 - 강점
  {
    id: "online_status_positive",
    section: "measurement",
    order: 9,
    title: "우리 병원의 온라인 강점은? (해당사항 모두 선택)",
    description: "강점이 있다면 선택해주세요",
    type: "checkbox",
    validation: { required: false },
    options: [
      { value: "검색 노출 우수", label: "네이버/구글 검색 시 1페이지 내 노출", emoji: "🔍" },
      { value: "높은 평점", label: "플레이스 평점 4.5점 이상", emoji: "⭐" },
      { value: "활발한 SNS", label: "SNS 팔로워 3,000명 이상 또는 좋아요 평균 100개 이상", emoji: "📱" },
      { value: "꾸준한 문의", label: "주당 온라인 문의 10건 이상", emoji: "💬" },
      { value: "브랜드 인지도", label: "병원명 직접 검색이 많음", emoji: "🏥" },
    ],
  },

  // Q9-2: 온라인 현황 - 약점
  {
    id: "online_status_negative",
    section: "measurement",
    order: 9.1,
    title: "우리 병원의 온라인 약점은? (해당사항 모두 선택)",
    description: "개선이 필요한 부분이 있다면 선택해주세요",
    type: "checkbox",
    validation: { required: false },
    options: [
      { value: "검색 안됨", label: "검색 시 2-3페이지 이후에나 나옴", emoji: "🔍" },
      { value: "리뷰 부족", label: "리뷰 10개 미만 또는 평점 4.0 미만", emoji: "⭐" },
      { value: "SNS 미비", label: "SNS 계정이 없거나 업데이트가 뜸함", emoji: "📱" },
      { value: "문의 없음", label: "온라인 문의가 월 5건 미만", emoji: "💬" },
      { value: "경쟁 열세", label: "주변 경쟁병원보다 온라인 활동이 적음", emoji: "🏥" },
    ],
  },

  // Q10: 가장 큰 문제
  {
    id: "main_problems",
    section: "needs",
    order: 10,
    title: "현재 마케팅에서 가장 큰 문제는 무엇인가요?",
    description: "최대 2개까지 선택 가능합니다",
    type: "checkbox",
    validation: { required: true, min: 1, max: 2 },
    options: [
      { value: "효과 없음", label: "광고비는 쓰는데 환자가 안 늘어남", emoji: "💭" },
      { value: "측정 불가", label: "효과가 있는지 없는지 모르겠음", emoji: "💭" },
      { value: "방법 모름", label: "어디에 어떻게 광고해야 할지 모르겠음", emoji: "💭" },
      { value: "채널 혼란", label: "너무 많은 채널이 있어 혼란스러움", emoji: "💭" },
      { value: "차별화 어려움", label: "경쟁 병원이 너무 많아 차별화가 어려움", emoji: "💭" },
      { value: "비용 부담", label: "광고 단가가 너무 비쌈", emoji: "💭" },
      { value: "시간 부족", label: "마케팅할 시간/인력이 부족함", emoji: "💭" },
      { value: "예산 부족", label: "예산이 부족함", emoji: "💭" },
    ],
  },

  // Q11: 마케팅 의사결정 프로세스
  {
    id: "decision_making",
    section: "measurement",
    order: 11,
    title: "마케팅 예산/채널을 어떻게 결정하시나요?",
    type: "radio",
    validation: { required: true },
    options: [
      { value: "데이터 기반", label: "데이터 분석 후 결정 (GA, 전환 추적 등)", emoji: "📊" },
      { value: "경쟁 분석", label: "경쟁 병원 분석 후 결정", emoji: "🔍" },
      { value: "업체 제안", label: "광고 업체 제안을 따름", emoji: "💼" },
      { value: "직감", label: "경험과 직감으로 결정", emoji: "💭" },
      { value: "정해진 예산", label: "작년과 비슷하게 유지", emoji: "📅" },
    ],
  },

  // Q12: 환자 생애가치(LTV) 인식
  {
    id: "patient_lifetime_value",
    section: "measurement",
    order: 12,
    title: "신규 환자 1명이 병원에 가져다주는 평균 매출(생애가치)은 얼마나 되나요?",
    description: "재방문, 추가 시술 등을 포함한 전체 매출",
    type: "radio",
    validation: { required: true },
    options: [
      { value: "500만원 이상", label: "500만원 이상", emoji: "💎" },
      { value: "300-500만원", label: "300-500만원", emoji: "💎" },
      { value: "100-300만원", label: "100-300만원", emoji: "💎" },
      { value: "50-100만원", label: "50-100만원", emoji: "💎" },
      { value: "50만원 미만", label: "50만원 미만", emoji: "💎" },
      { value: "모르겠음", label: "측정해본 적 없음/모르겠음", emoji: "❓" },
    ],
  },
];
