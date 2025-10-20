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
 * - 네이버 채널 비중이 70% 이상
 */
export function detectNaverDependency(responses: SurveyResponse): boolean {
  const channelsData = responses.channels;
  const channels = channelsData?.selected || [];
  const top1Ratio = responses.top1Ratio;

  // 조건 1: 네이버 채널 비중 70% 이상
  const naverChannels = channels.filter((c) => c.includes("네이버")).length;
  const totalChannels = channels.length;
  
  if (totalChannels > 0 && naverChannels / totalChannels >= 0.7) return true;

  // 조건 2: "70% 이상" 선택 + 네이버 포함
  if (top1Ratio === "70% 이상" && naverChannels > 0) return true;

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
