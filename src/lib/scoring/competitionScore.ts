import { SurveyResponse } from "@/types/survey";

/**
 * 업종별 특성 정의
 */
interface SpecialtyCharacteristics {
  marketingImportance: "낮음" | "중간" | "높음" | "매우 높음"; // 마케팅 중요도
  distanceSensitivity: "낮음" | "중간" | "높음"; // 거리 민감도
  wordOfMouthDependency: "낮음" | "중간" | "높음" | "매우 높음"; // 입소문 의존도
  locationRelevance: boolean; // 지역 구분의 중요도 (강남 vs 비강남)
}

/**
 * 업종별 특성 맵핑
 */
const SPECIALTY_CHARACTERISTICS: Record<string, SpecialtyCharacteristics> = {
  "치과": {
    marketingImportance: "중간",
    distanceSensitivity: "중간",
    wordOfMouthDependency: "중간",
    locationRelevance: false,
  },
  "내과/가정의학과": {
    marketingImportance: "낮음",
    distanceSensitivity: "높음",
    wordOfMouthDependency: "낮음",
    locationRelevance: false,
  },
  "정형외과": {
    marketingImportance: "중간",
    distanceSensitivity: "중간",
    wordOfMouthDependency: "중간",
    locationRelevance: false,
  },
  "소아과": {
    marketingImportance: "낮음",
    distanceSensitivity: "높음",
    wordOfMouthDependency: "매우 높음",
    locationRelevance: false,
  },
  "비뇨기과": {
    marketingImportance: "높음",
    distanceSensitivity: "낮음",
    wordOfMouthDependency: "매우 높음",
    locationRelevance: true, // 강남/비강남 구분 필요
  },
  "피부과/성형외과": {
    marketingImportance: "매우 높음",
    distanceSensitivity: "낮음",
    wordOfMouthDependency: "높음",
    locationRelevance: true, // 강남/비강남 구분 필요
  },
  "한의원": {
    marketingImportance: "높음",
    distanceSensitivity: "중간",
    wordOfMouthDependency: "중간",
    locationRelevance: false,
  },
  "안과": {
    marketingImportance: "중간",
    distanceSensitivity: "높음",
    wordOfMouthDependency: "중간",
    locationRelevance: false,
  },
  "이비인후과": {
    marketingImportance: "중간",
    distanceSensitivity: "높음",
    wordOfMouthDependency: "중간",
    locationRelevance: false,
  },
  "정신과": {
    marketingImportance: "높음",
    distanceSensitivity: "낮음",
    wordOfMouthDependency: "높음",
    locationRelevance: false,
  },
};

/**
 * 경쟁 환경 평가 결과
 */
export interface CompetitionAssessment {
  // 시장 경쟁 환경 (Q13 기반)
  competitionLevel: {
    level: "낮음" | "보통" | "높음" | "매우 높음" | "알 수 없음";
    description: string;
    color: "green" | "yellow" | "orange" | "red" | "gray";
  };

  // 검색 노출 순위 (Q14 기반)
  searchRanking: {
    rank: "최상위" | "양호" | "개선 필요" | "시급" | "알 수 없음";
    description: string;
    color: "green" | "yellow" | "orange" | "red" | "gray";
  };

  // 종합 우선순위
  actionPriority: "시급" | "개선권장" | "유지" | "알 수 없음";
  priorityReason: string;

  // 업종×지역 맥락적 조언
  contextualAdvice: string[];
}

/**
 * 경쟁도 및 노출 순위 평가
 *
 * 중요: 경쟁도(시장 환경)와 검색 순위(성과 지표)는 별도로 평가됨
 * 2025-01-14: 업종×지역 맥락적 분석 추가
 */
export function assessCompetition(
  responses: SurveyResponse
): CompetitionAssessment {
  const { competition_count, naver_map_ranking } = responses;

  // 1. 경쟁 환경 평가 (Q13 기반)
  const competitionLevel = evaluateCompetitionLevel(competition_count);

  // 2. 검색 노출 순위 평가 (Q14 기반)
  const searchRanking = evaluateSearchRanking(naver_map_ranking);

  // 3. 종합 우선순위 결정
  const { actionPriority, priorityReason } = determineActionPriority(
    competitionLevel.level,
    searchRanking.rank
  );

  // 4. 업종×지역 맥락적 조언 생성
  const contextualAdvice = generateContextualAdvice(responses);

  return {
    competitionLevel,
    searchRanking,
    actionPriority,
    priorityReason,
    contextualAdvice,
  };
}

/**
 * 경쟁 환경 레벨 평가 (Q13 기반)
 */
function evaluateCompetitionLevel(competition_count?: string) {
  switch (competition_count) {
    case "거의 없음":
      return {
        level: "낮음" as const,
        description: "경쟁이 적은 환경입니다. 시장 선점의 기회가 있습니다.",
        color: "green" as const,
      };

    case "보통":
      return {
        level: "보통" as const,
        description: "적정 수준의 경쟁 환경입니다. 차별화 전략이 필요합니다.",
        color: "yellow" as const,
      };

    case "많음":
      return {
        level: "높음" as const,
        description: "경쟁이 치열한 환경입니다. 적극적인 마케팅이 필수적입니다.",
        color: "orange" as const,
      };

    case "매우 많음":
      return {
        level: "매우 높음" as const,
        description: "매우 치열한 경쟁 환경입니다. 전문적인 마케팅 전략이 필요합니다.",
        color: "red" as const,
      };

    case "모르겠음":
    default:
      return {
        level: "알 수 없음" as const,
        description: "경쟁 환경을 파악해보시는 것을 권장합니다.",
        color: "gray" as const,
      };
  }
}

/**
 * 검색 노출 순위 평가 (Q14 기반)
 */
function evaluateSearchRanking(naver_map_ranking?: string) {
  switch (naver_map_ranking) {
    case "최상위":
      return {
        rank: "최상위" as const,
        description: "우수한 검색 노출입니다. 현재 전략을 유지하세요.",
        color: "green" as const,
      };

    case "1페이지":
      return {
        rank: "양호" as const,
        description: "양호한 노출 순위입니다. 상위권 진입을 목표로 하세요.",
        color: "yellow" as const,
      };

    case "2페이지":
      return {
        rank: "개선 필요" as const,
        description: "노출 순위 개선이 필요합니다. SEO 최적화를 시작하세요.",
        color: "orange" as const,
      };

    case "3페이지 이후":
      return {
        rank: "시급" as const,
        description: "노출 순위가 매우 낮습니다. 즉시 개선이 필요합니다.",
        color: "red" as const,
      };

    case "확인 안함":
    default:
      return {
        rank: "알 수 없음" as const,
        description: "검색 노출 순위를 확인해보시는 것을 권장합니다.",
        color: "gray" as const,
      };
  }
}

/**
 * 종합 우선순위 결정
 *
 * 규칙:
 * - 경쟁 치열(많음/매우 많음) + 노출 낮음(2페이지/3페이지 이후) = 시급
 * - 경쟁 치열 OR 노출 낮음 = 개선권장
 * - 그 외 = 유지
 */
function determineActionPriority(
  competitionLevel: string,
  searchRank: string
): { actionPriority: "시급" | "개선권장" | "유지" | "알 수 없음"; priorityReason: string } {
  // 데이터 부족
  if (competitionLevel === "알 수 없음" || searchRank === "알 수 없음") {
    return {
      actionPriority: "알 수 없음",
      priorityReason: "경쟁 환경과 노출 순위를 파악한 후 적절한 전략을 수립하세요.",
    };
  }

  const isHighCompetition = competitionLevel === "높음" || competitionLevel === "매우 높음";
  const isLowRanking = searchRank === "개선 필요" || searchRank === "시급";

  // 시급: 경쟁 치열 + 노출 낮음
  if (isHighCompetition && isLowRanking) {
    return {
      actionPriority: "시급",
      priorityReason:
        "경쟁이 치열한 지역에서 노출 순위가 낮아 즉각적인 조치가 필요합니다. 검색 최적화와 차별화 전략을 동시에 진행하세요.",
    };
  }

  // 개선권장: 경쟁 치열 OR 노출 낮음
  if (isHighCompetition || isLowRanking) {
    if (isHighCompetition && !isLowRanking) {
      return {
        actionPriority: "개선권장",
        priorityReason:
          "경쟁이 치열한 환경입니다. 현재 노출 순위를 유지하면서 차별화 전략을 강화하세요.",
      };
    }
    if (!isHighCompetition && isLowRanking) {
      return {
        actionPriority: "개선권장",
        priorityReason:
          "경쟁이 심하지 않은 환경에서 노출이 낮습니다. SEO 개선만으로도 큰 효과를 볼 수 있습니다.",
      };
    }
  }

  // 유지: 양호한 상태
  return {
    actionPriority: "유지",
    priorityReason:
      "현재 경쟁 환경과 노출 순위가 양호합니다. 지속적인 모니터링과 함께 현재 전략을 유지하세요.",
  };
}

/**
 * 업종×지역 맥락적 조언 생성
 *
 * 업종별 특성과 지역 특성을 고려하여 구체적인 조언 제공
 */
function generateContextualAdvice(responses: SurveyResponse): string[] {
  const advice: string[] = [];

  // 업종 정보 추출
  const specialtiesArray = responses.specialties?.selected || [];
  const primarySpecialty = specialtiesArray[0]; // 1순위 업종

  // 지역 정보 추출
  const location = responses.location_and_size?.location || "";
  const isGangnam = location.includes("강남");
  const isMetro = location.includes("광역시");

  // 경쟁 및 순위 정보
  const competitionCount = responses.competition_count;
  const naverMapRanking = responses.naver_map_ranking;

  // 채널 정보
  const channelsData = responses.channels;
  const channels = channelsData?.selected || [];

  if (!primarySpecialty) {
    return advice;
  }

  // 업종별 특성 조회
  const characteristics = SPECIALTY_CHARACTERISTICS[primarySpecialty];

  if (!characteristics) {
    return advice;
  }

  // === 1. 성형외과/피부과 특화 조언 ===
  if (primarySpecialty === "피부과/성형외과") {
    // 강남/광역시 + 경쟁 치열
    if ((isGangnam || isMetro) && (competitionCount === "많음" || competitionCount === "매우 많음")) {
      advice.push(
        "💡 강남/광역시 미용 시장은 초경쟁 지역입니다. 네이버 플레이스 랭킹에 너무 집착하지 마세요. 대신 상업적 플랫폼(강남언니, 모두닥)과 브랜딩에 집중하세요."
      );

      // 플랫폼 미활용 시
      if (responses.commercialPlatform === "관심 없음" || responses.commercialPlatform === "고려 중") {
        advice.push(
          "🎯 강남언니, 모두닥 등 플랫폼에서 테스트를 시작하세요. 지도 검색보다 플랫폼 후기가 더 중요합니다."
        );
      }

      // SNS 미활용 시
      const hasInstagram = channels.some(c => c.includes("인스타그램"));
      const hasYoutube = channels.some(c => c.includes("유튜브"));
      if (!hasInstagram || !hasYoutube) {
        advice.push(
          "📱 인스타그램과 유튜브는 필수입니다. 시술 전후 사진과 전문성을 보여주는 영상 콘텐츠로 신뢰를 구축하세요."
        );
      }
    } else {
      // 비강남/비광역시
      advice.push(
        "📍 지역 기반 마케팅이 중요합니다. 네이버 플레이스 최적화와 지역 내 브랜딩을 우선하세요."
      );
    }
  }

  // === 2. 내과/가정의학과 특화 조언 ===
  if (primarySpecialty === "내과/가정의학과") {
    // 거리 민감도가 높은 업종
    advice.push(
      "🏥 내과/가정의학과는 워크인 비중이 높고 거리가 매우 중요합니다. 반경 500m 내 환자가 60-70%를 차지합니다."
    );

    // 비강남 지역
    if (!isGangnam) {
      advice.push(
        "📍 네이버 플레이스 랭킹이 매우 중요합니다. 지도 검색 1페이지 진입을 최우선 목표로 하세요."
      );

      // 검색 순위 낮을 때
      if (naverMapRanking === "2페이지" || naverMapRanking === "3페이지 이후") {
        advice.push(
          "⚠️ 현재 검색 노출이 낮습니다. 네이버 스마트플레이스 정보 보강, 리뷰 관리, 정기 포스팅으로 즉시 개선하세요."
        );
      }
    }

    // 검색광고 활용 체크
    const hasNaverAd = channels.some(c => c.includes("네이버") && c.includes("검색광고"));
    if (!hasNaverAd) {
      advice.push(
        "💰 네이버 검색광고로 '강남역 내과', '○○동 가정의학과' 등 지역 키워드를 선점하세요."
      );
    }
  }

  // === 3. 치과 특화 조언 ===
  if (primarySpecialty === "치과") {
    advice.push(
      "🦷 치과는 라이프사이클 마케팅이 효과적입니다. 첫 방문 후 정기 검진으로 이어지는 관계를 구축하세요."
    );

    // 경쟁 환경에 따른 차별화
    if (competitionCount === "많음" || competitionCount === "매우 많음") {
      advice.push(
        "🎯 경쟁이 치열한 지역입니다. 특화 진료(임플란트, 교정, 심미) 중 하나를 선택하여 브랜딩하세요."
      );
    }

    // 네이버 예약 활용 체크
    const hasNaverBooking = channels.some(c => c.includes("네이버") && (c.includes("예약") || c.includes("플레이스")));
    if (!hasNaverBooking) {
      advice.push(
        "📅 네이버 예약 시스템을 도입하세요. 예약 편의성이 전환율을 크게 높입니다."
      );
    }
  }

  // === 4. 소아과 특화 조언 ===
  if (primarySpecialty === "소아과") {
    advice.push(
      "👶 소아과는 입소문이 가장 중요합니다. 마케팅보다 진료 만족도와 후기 관리에 집중하세요."
    );

    // 경쟁이 매우 높아도 마케팅 우선순위는 낮음
    if (competitionCount === "매우 많음") {
      advice.push(
        "💡 경쟁은 치열하지만 과도한 마케팅 투자는 지양하세요. 네이버 플레이스 평점 관리와 지역 커뮤니티 평판이 핵심입니다."
      );
    }

    // 지역 밀착 전략
    advice.push(
      "🏘️ 반경 700m 내 지역 밀착 마케팅에 집중하세요. 네이버 플레이스와 카카오맵 정보를 꼼꼼히 관리하세요."
    );
  }

  // === 5. 비뇨기과 특화 조언 ===
  if (primarySpecialty === "비뇨기과") {
    advice.push(
      "🔐 비뇨기과는 프라이버시가 중요하여 환자들이 거리를 두고 방문합니다. 지역보다 신뢰 구축이 우선입니다."
    );

    // 유튜브 중요성
    const hasYoutube = channels.some(c => c.includes("유튜브"));
    if (!hasYoutube) {
      advice.push(
        "📹 유튜브로 전문성을 보여주세요. 비뇨기과는 익명성과 전문가 신뢰가 결합된 유튜브 마케팅이 매우 효과적입니다."
      );
    }

    // 입소문 강화
    advice.push(
      "⭐ 후기와 입소문이 매우 중요합니다. 만족도 높은 환자의 자발적 추천을 유도할 수 있는 경험을 제공하세요."
    );
  }

  // === 6. 정형외과 특화 조언 ===
  if (primarySpecialty === "정형외과") {
    // 경쟁 치열 + 검색 순위 낮음
    if ((competitionCount === "많음" || competitionCount === "매우 많음") &&
        (naverMapRanking === "2페이지" || naverMapRanking === "3페이지 이후")) {
      advice.push(
        "⚠️ 정형외과는 경쟁이 치열한 업종입니다. 검색 1페이지 진입은 쉽지 않지만, 꾸준한 SEO 최적화를 목표로 하세요."
      );
    }

    // 특화 진료 브랜딩
    advice.push(
      "🎯 특화 분야(척추, 관절, 스포츠 재활 등)를 명확히 하고, 해당 분야 키워드로 검색 노출을 강화하세요."
    );
  }

  // === 7. 한의원 특화 조언 ===
  if (primarySpecialty === "한의원") {
    advice.push(
      "🌿 한의원은 분포도가 높고 마케팅 중요도도 높은 업종입니다. 지역 기반 전략과 온라인 마케팅을 병행하세요."
    );

    // 특화 진료
    advice.push(
      "💡 특화 진료(다이어트, 여드름, 통증 치료 등)를 전면에 내세워 차별화하세요."
    );
  }

  // === 8. 안과/이비인후과 특화 조언 ===
  if (primarySpecialty === "안과" || primarySpecialty === "이비인후과") {
    advice.push(
      "👁️ 지역 밀착형 업종입니다. 네이버 플레이스와 카카오맵 정보를 최신으로 유지하고, 지역 검색광고를 활용하세요."
    );

    // 검색 순위 확인 안함
    if (naverMapRanking === "확인 안함") {
      advice.push(
        "📊 네이버 지도 검색 순위를 확인하세요. 지역 기반 업종은 지도 검색이 신환 유입의 핵심입니다."
      );
    }
  }

  // === 9. 정신과 특화 조언 ===
  if (primarySpecialty === "정신과") {
    advice.push(
      "🧠 정신과는 프라이버시와 신뢰가 가장 중요합니다. 콘텐츠 마케팅으로 전문성을 보여주세요."
    );

    const hasYoutube = channels.some(c => c.includes("유튜브"));
    const hasBlog = channels.some(c => c.includes("블로그"));

    if (!hasYoutube && !hasBlog) {
      advice.push(
        "📝 블로그나 유튜브로 정신건강 정보를 제공하세요. 신뢰 구축이 가장 효과적인 마케팅입니다."
      );
    }
  }

  // === 10. 공통: 경쟁 환경별 조언 ===
  if (competitionCount === "거의 없음") {
    advice.push(
      "🌟 경쟁이 적은 환경입니다. 선점 효과를 극대화하기 위해 네이버 플레이스와 구글 비즈니스 프로필을 먼저 최적화하세요."
    );
  }

  // === 11. 공통: 검색 순위별 조언 ===
  if (naverMapRanking === "최상위" || naverMapRanking === "1페이지") {
    advice.push(
      "✅ 우수한 검색 노출을 유지하고 있습니다. 리뷰 관리와 정기 포스팅으로 현재 순위를 지키세요."
    );
  }

  return advice;
}
