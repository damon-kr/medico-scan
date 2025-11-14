import { SurveyResponse } from "@/types/survey";

/**
 * 원툴형 (Single Tool Type)
 * - 1개 채널에만 의존
 */
export function detectOneTrickPattern(responses: SurveyResponse): boolean {
  const channelsData = responses.channels;
  const channels = channelsData?.selected || [];
  const channelCount = channels.length;

  // 조건: 채널 1개만 사용
  if (channelCount === 1) return true;

  // 네이버만 여러 개 사용하는 경우도 원툴형
  const naverChannels = channels.filter((c) => c.includes("네이버")).length;
  if (naverChannels >= 2 && naverChannels === channelCount) return true;

  return false;
}

/**
 * 네이버 의존형 (Naver Dependent Type)
 * - 네이버 채널 비중이 80% 이상 (2025-01-14 기준 강화)
 */
export function detectNaverDependency(responses: SurveyResponse): boolean {
  const channelsData = responses.channels;
  const channels = channelsData?.selected || [];
  const top1Ratio = responses.top1Ratio;

  // 네이버 관련 채널 카운트 (플레이스, 블로그, 검색광고)
  const naverChannels = channels.filter((c) => c.includes("네이버")).length;
  const totalChannels = channels.length;

  // 조건 1: 네이버 채널 비중 80% 이상
  if (totalChannels > 0 && naverChannels / totalChannels >= 0.8) return true;

  // 조건 2: "70% 이상" 선택 + 네이버 채널만 3개 사용 (플레이스+블로그+검색광고)
  if (top1Ratio === "70% 이상" && naverChannels >= 3 && totalChannels === naverChannels) {
    return true;
  }

  return false;
}

/**
 * 디지털 사각지대형 (Digital Blind Spot Type)
 * - 온라인 채널이 거의 없음
 */
export function detectDigitalBlindSpot(responses: SurveyResponse): boolean {
  const channelsData = responses.channels;
  const channels = channelsData?.selected || [];
  
  const onlineKeywords = [
    "네이버",
    "구글",
    "인스타",
    "페이스북",
    "유튜브",
    "틱톡",
    "카카오",
    "홈페이지",
    "앱",
  ];

  const onlineChannelCount = channels.filter((channel) =>
    onlineKeywords.some((keyword) => channel.includes(keyword))
  ).length;

  // 조건 1: 온라인 채널 1개 이하
  if (onlineChannelCount <= 1) return true;

  // 조건 2: 오프라인 채널만 사용
  const offlineOnly = channels.every(
    (channel) =>
      channel.includes("오프라인") ||
      channel.includes("신문") ||
      channel.includes("제휴")
  );
  if (offlineOnly && channels.length > 0) return true;

  return false;
}

/**
 * 방치 운영형 (Neglected Operation Type)
 * - 업데이트가 거의 없고 관리 체계 미흡
 */
export function detectNeglectedOperation(responses: SurveyResponse): boolean {
  const updateFrequency = responses.updateFrequency;
  const management = responses.management;

  // 조건: 업데이트 월 1회 이하 + 관리 안함 or 직원 겸임
  if (
    (updateFrequency === "월 1회 이하" || updateFrequency === "거의 안함") &&
    (management === "관리 부재" || management === "직원 겸임")
  ) {
    return true;
  }

  return false;
}

/**
 * 성과 맹목형 (Performance Blind Type)
 * - 성과 측정을 전혀 하지 않음
 */
export function detectPerformanceBlindness(responses: SurveyResponse): boolean {
  const tracking = Array.isArray(responses.trackingMethods) ? responses.trackingMethods : [];
  const decisionMaking = responses.decisionMaking;

  // 조건 1: 추적 안함 선택
  if (tracking.includes("파악 안함")) return true;

  // 조건 2: 추적 항목 0-1개 + 직감 의존
  if (tracking.length <= 1 && decisionMaking === "직감") return true;

  // 조건 3: 가장 큰 고민이 "효과 측정 어려움"
  const mainProblems = Array.isArray(responses.mainProblems) ? responses.mainProblems : [];
  if (mainProblems.includes("측정 불가")) return true;

  return false;
}

/**
 * 무분별 살포형 (Scattered Efforts Type)
 * - 너무 많은 채널을 관리 없이 운영
 */
export function detectScatteredEfforts(responses: SurveyResponse): boolean {
  const channelsData = responses.channels;
  const channels = channelsData?.selected || [];
  const channelCount = channels.length;
  const management = responses.management;

  // 조건: 6개 이상 채널 + 관리 체계 미흡
  if (
    channelCount >= 6 &&
    (management === "직원 겸임" || management === "관리 부재")
  ) {
    return true;
  }

  return false;
}

/**
 * 온라인 소극형 (Online Passive Type) - 피부과/성형외과 특화
 * - SNS 플랫폼을 안 하거나 소극적
 */
export function detectOnlinePassive(responses: SurveyResponse): boolean {
  const specialtiesArray = responses.specialties?.selected || [];
  const platform = responses.platformUsage;
  const negativeStatus = Array.isArray(responses.onlineStatusNegative) ? responses.onlineStatusNegative : [];

  // 피부과/성형외과만 해당
  if (
    !specialtiesArray.includes("피부과/성형외과")
  ) {
    return false;
  }

  // 조건 1: SNS 안함
  if (platform === "안함") return true;

  // 조건 2: SNS 미비 약점 + 페이스북만 사용
  if (
    negativeStatus.includes("SNS 미비") &&
    platform === "페이스북만"
  ) {
    return true;
  }

  return false;
}

/**
 * 콘텐츠 마케팅 미활용형 (Content Marketing Neglect Type)
 * - 유튜브/인스타그램 미활용 (피부과/성형외과/비뇨기과/정신과 특화)
 * - 신뢰와 후기가 중요한 업종에서 콘텐츠 마케팅 부족
 */
export function detectContentMarketingNeglect(responses: SurveyResponse): boolean {
  const specialtiesArray = responses.specialties?.selected || [];
  const channelsData = responses.channels;
  const channels = channelsData?.selected || [];
  const updateFrequency = responses.updateFrequency;

  // 대상 업종: 피부과/성형외과, 비뇨기과, 정신과
  const targetSpecialties = ["피부과/성형외과", "비뇨기과", "정신과"];
  const isTargetSpecialty = specialtiesArray.some(s => targetSpecialties.includes(s));

  if (!isTargetSpecialty) return false;

  // 조건 1: 유튜브와 인스타그램 둘 다 미사용
  const hasYoutube = channels.some(c => c.includes("유튜브"));
  const hasInstagram = channels.some(c => c.includes("인스타그램"));

  if (!hasYoutube && !hasInstagram) return true;

  // 조건 2: 유튜브 OR 인스타그램은 있지만 업데이트 월 1회 이하
  if (
    (hasYoutube || hasInstagram) &&
    (updateFrequency === "월 1회 이하" || updateFrequency === "거의 안함")
  ) {
    return true;
  }

  return false;
}

/**
 * 검색 랭킹 최적화 필요형 (Search Ranking Optimization Type)
 * - 경쟁 치열 + 네이버 지도 검색 순위 낮음 (정형외과/내과/치과 특화)
 */
export function detectSearchRankingOptimization(responses: SurveyResponse): boolean {
  const specialtiesArray = responses.specialties?.selected || [];
  const competitionCount = responses.competition_count;
  const naverMapRanking = responses.naver_map_ranking;

  // 대상 업종: 정형외과, 내과/가정의학과, 치과
  const targetSpecialties = ["정형외과", "내과/가정의학과", "치과"];
  const isTargetSpecialty = specialtiesArray.some(s => targetSpecialties.includes(s));

  if (!isTargetSpecialty) return false;

  // 조건: 경쟁 치열 + 검색 순위 낮음
  const isHighCompetition = competitionCount === "많음" || competitionCount === "매우 많음";
  const isLowRanking = naverMapRanking === "2페이지" || naverMapRanking === "3페이지 이후";

  return isHighCompetition && isLowRanking;
}

/**
 * 플랫폼 확장 필요형 (Platform Expansion Needed Type)
 * - 피부과/성형외과 + 강남/광역시 + 상업적 플랫폼 미활용
 */
export function detectPlatformExpansionNeeded(responses: SurveyResponse): boolean {
  const specialtiesArray = responses.specialties?.selected || [];
  const location = responses.location_and_size?.location || "";
  const commercialPlatform = responses.commercialPlatform;

  // 조건 1: 피부과/성형외과만 해당
  if (!specialtiesArray.includes("피부과/성형외과")) return false;

  // 조건 2: 강남 OR 광역시
  const isHighCompetitionArea =
    location.includes("강남") ||
    location.includes("광역시");

  if (!isHighCompetitionArea) return false;

  // 조건 3: 상업적 플랫폼 관심 없음
  return commercialPlatform === "관심 없음";
}

/**
 * 지역 밀착 마케팅 부족형 (Local Marketing Weak Type)
 * - 소아과/내과/안과/이비인후과 + 로컬 SEO 미흡
 */
export function detectLocalMarketingWeak(responses: SurveyResponse): boolean {
  const specialtiesArray = responses.specialties?.selected || [];
  const location = responses.location_and_size?.location || "";
  const channelsData = responses.channels;
  const channels = channelsData?.selected || [];
  const naverMapRanking = responses.naver_map_ranking;

  // 대상 업종: 소아과, 내과/가정의학과, 안과, 이비인후과
  const targetSpecialties = ["소아과", "내과/가정의학과", "안과", "이비인후과"];
  const isTargetSpecialty = specialtiesArray.some(s => targetSpecialties.includes(s));

  // 대상 지역: 비강남, 지방
  const isTargetLocation =
    !location.includes("강남") ||
    location.includes("경기") ||
    location.includes("그 외");

  // 업종 또는 지역 조건 충족 필요
  if (!isTargetSpecialty && !isTargetLocation) return false;

  // 조건 1: GBP 또는 네이버 플레이스 미사용
  const hasGBP = channels.some(c => c.includes("구글") && c.includes("비즈니스"));
  const hasNaverPlace = channels.some(c => c.includes("네이버") && c.includes("플레이스"));

  if (!hasGBP || !hasNaverPlace) return true;

  // 조건 2: 네이버 지도 순위 확인 안함
  if (naverMapRanking === "확인 안함") return true;

  return false;
}

/**
 * 예산 대비 효율 저하형 (Budget Efficiency Low Type)
 * - 예산 500만원 이상 + 추적 미흡 OR 채널 집중도 과다
 */
export function detectBudgetEfficiencyLow(responses: SurveyResponse): boolean {
  const budget = responses.budget;
  const tracking = Array.isArray(responses.trackingMethods) ? responses.trackingMethods : [];
  const top1Ratio = responses.top1Ratio;

  // 조건 1: 예산 500만원 이상
  const isHighBudget =
    budget === "500-1,000만원" ||
    budget === "1,000-2,000만원" ||
    budget === "2,000만원 이상";

  if (!isHighBudget) return false;

  // 조건 2: 추적 방법 1개 이하
  const hasWeakTracking = tracking.length <= 1;

  // 조건 3: 채널 집중도 70% 이상
  const isOverConcentrated = top1Ratio === "70% 이상";

  return hasWeakTracking || isOverConcentrated;
}
