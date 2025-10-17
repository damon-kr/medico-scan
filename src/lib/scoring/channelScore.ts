import { SurveyResponse } from "@/types/survey";

/**
 * 채널 활용도 점수 계산 (30점 만점)
 * - 채널 수 점수: 10점
 * - 채널 다양성: 10점
 * - 플랫폼 활용도 (조건부): 10점
 */
export function calculateChannelScore(responses: SurveyResponse): number {
  let score = 0;

  // 1. 채널 수 점수 (10점)
  score += calculateChannelCountScore(responses);

  // 2. 채널 다양성 점수 (10점)
  score += calculateChannelDiversityScore(responses);

  // 3. 플랫폼 활용도 점수 (10점) - 피부과/성형외과만
  const specialtiesSelected = responses.specialties?.selected || [];
  if (
    specialtiesSelected.includes("피부과/성형외과")
  ) {
    score += calculatePlatformScore(responses);
  } else {
    // 다른 과는 채널 집중도로 평가
    score += calculateChannelFocusScore(responses);
  }

  return Math.min(30, score);
}

/**
 * 채널 수 평가 (10점)
 */
function calculateChannelCountScore(responses: SurveyResponse): number {
  const channels = responses.channels || [];
  const channelCount = channels.length;

  // 기본 점수
  let baseScore = 0;
  if (channelCount >= 3 && channelCount <= 5) {
    baseScore = 10;
  } else if (channelCount === 2) {
    baseScore = 7;
  } else if (channelCount === 1) {
    baseScore = 3;
  } else if (channelCount >= 6) {
    baseScore = 5;
  }

  // 보너스: 온라인/오프라인 균형
  const onlineChannels = channels.filter((c) => isOnlineChannel(c)).length;
  const offlineChannels = channelCount - onlineChannels;
  if (onlineChannels > 0 && offlineChannels > 0 && channelCount <= 5) {
    baseScore = Math.min(10, baseScore + 2);
  }

  // 페널티: 네이버만 여러 개 (실질적으로는 1개 채널)
  const naverChannels = channels.filter((c) => c.includes("네이버")).length;
  if (naverChannels >= 3 && channelCount === naverChannels) {
    baseScore = Math.max(0, baseScore - 3);
  }

  return baseScore;
}

/**
 * 채널 다양성 평가 (10점)
 */
function calculateChannelDiversityScore(responses: SurveyResponse): number {
  const channels = responses.channels || [];
  
  let score = 0;
  const channelTypes = {
    search: false, // 검색 (네이버/구글)
    social: false, // SNS (인스타/페북/유튜브/틱톡)
    map: false, // 지도 (플레이스/카카오맵)
    owned: false, // 자체 채널 (홈페이지/앱/블로그)
    offline: false, // 오프라인
  };

  channels.forEach((channel) => {
    if (channel.includes("검색광고") || channel.includes("구글 광고")) {
      channelTypes.search = true;
    }
    if (
      channel.includes("인스타") ||
      channel.includes("페이스북") ||
      channel.includes("유튜브") ||
      channel.includes("틱톡")
    ) {
      channelTypes.social = true;
    }
    if (channel.includes("플레이스") || channel.includes("카카오맵")) {
      channelTypes.map = true;
    }
    if (
      channel.includes("홈페이지") ||
      channel.includes("앱") ||
      channel.includes("블로그")
    ) {
      channelTypes.owned = true;
    }
    if (
      channel.includes("오프라인") ||
      channel.includes("신문") ||
      channel.includes("제휴")
    ) {
      channelTypes.offline = true;
    }
  });

  // 각 채널 유형당 2점
  score = Object.values(channelTypes).filter(Boolean).length * 2;

  return Math.min(10, score);
}

/**
 * 플랫폼 활용도 (10점) - 피부과/성형외과용
 */
function calculatePlatformScore(responses: SurveyResponse): number {
  const platform = responses.platformUsage;
  
  if (!platform) return 0;

  const scoreMap: Record<string, number> = {
    "인스타+유튜브": 10,
    "인스타만": 7,
    "유튜브만": 6,
    "페이스북만": 4,
    "안함": 0,
  };

  return scoreMap[platform] || 0;
}

/**
 * 채널 집중도 점수 (10점) - 피부과/성형외과 외
 */
function calculateChannelFocusScore(responses: SurveyResponse): number {
  const channelRatio = responses.channelRatio;
  
  if (!channelRatio) return 5; // 기본 점수

  const scoreMap: Record<string, number> = {
    "1개 집중": 8,
    "2-3개 분산": 10,
    "4개 이상 분산": 6,
    "골고루": 4,
  };

  return scoreMap[channelRatio] || 5;
}

/**
 * 온라인 채널 판별
 */
function isOnlineChannel(channel: string): boolean {
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
    "블로그",
  ];
  
  return onlineKeywords.some((keyword) => channel.includes(keyword));
}
