# 병원 마케팅 진단 - 진단 유형 및 스코어링 시스템

## 1. 진단 유형 정의

### 1.1 주요 문제 유형 (7가지)

#### Type 1: 네이버 의존 과다형
- **정의**: 전체 마케팅의 70% 이상이 네이버 집중
- **스코어링**: 네이버 채널 1순위 + 비중 50% 이상
- **솔루션**: 채널 다각화, 리스크 분산

#### Type 2: 디지털 사각지대형
- **정의**: 온라인 마케팅 비중 30% 미만
- **스코어링**: 온라인 채널 3개 이하 사용
- **솔루션**: 디지털 전환 로드맵

#### Type 3: 무분별 살포형
- **정의**: 7개 이상 채널 사용하나 통합 관리 부재
- **스코어링**: 채널 7개 이상 + 측정 체계 미비
- **솔루션**: 채널 통합 관리 시스템

#### Type 4: 방치 운영형
- **정의**: 콘텐츠 업데이트 월 1회 이하
- **스코어링**: 업데이트 주기 월 1회 이하
- **솔루션**: 운영 체계 구축

#### Type 5: 성과 맹목형
- **정의**: 마케팅 효과 측정 불가
- **스코어링**: 성과 추적 "파악 안함" 선택
- **솔루션**: 측정 체계 구축

#### Type 6: 온라인 마케팅 소극형
- **정의**: 전반적 온라인 활동 미흡
- **스코어링**: 상업적 광고 미사용 + 콘텐츠 부족
- **솔루션**: 단계적 온라인 강화

#### Type 7: 원툴형
- **정의**: 과거 성과에 안주하며 단일 채널만 고집. "이것만 하면 된다"는 고정관념으로 시장 변화와 새로운 기회를 무시
- **스코어링**: 
  - 사용 채널 1-2개
  - 단일 채널 비중 80% 이상
  - "이전에 이 채널에서 성과가 좋았음" 또는 "지금 채널만으로 충분해서 시도할 필요 없음" 응답
- **솔루션**: 리스크 인식, 점진적 확장, 성과 비교 데이터 제시

## 2. 스코어링 시스템

### 2.1 점수 체계
- **총점**: 100점 만점
- **카테고리별 배점**:
  - 채널 활용도: 30점
  - 운영 관리: 25점
  - 성과 측정: 25점
  - 예산 규모: 20점

### 2.2 레벨 구분
- **Level 1 (초급)**: 0-25점
- **Level 2 (기본)**: 26-50점
- **Level 3 (중급)**: 51-75점
- **Level 4 (고급)**: 76-100점

### 2.3 상대 평가
- 업종별 평균 대비
- 지역별 평균 대비
- 규모별 평균 대비

## 3. 진단 로직

### 3.1 주요 문제 유형 판정 규칙

```python
def determine_primary_issue(responses):
    issues = []
    
    # 1. 원툴형 체크 (우선순위 높음)
    if (responses['channel_count'] <= 2 and 
        (responses['channel_reason'] == '이전에_이_채널에서_성과가_좋았음' or
         responses['new_channel_attempt'] == '지금_채널만으로_충분해서_시도할_필요_없음') and
        responses['top1_ratio'] == '70% 이상'):
        issues.append(('원툴형', 0.95))
    
    # 2. 네이버 의존도 체크
    elif responses['top1_channel'] == '네이버' and responses['top1_ratio'] == '70% 이상':
        issues.append(('네이버_의존_과다', 0.9))
    
    # 3. 디지털 부족 체크  
    elif responses['online_ratio'] == '온라인 20%':
        issues.append(('디지털_사각지대', 0.9))
    
    # 4. 관리 부실 체크
    elif responses['update_freq'] in ['월1회이하', '거의안함']:
        issues.append(('방치_운영형', 0.85))
    
    # 5. 측정 부재 체크
    elif '따로 파악하지 않음' in responses['tracking']:
        issues.append(('성과_맹목형', 0.85))
    
    # 6. 채널 과다 체크
    elif len(responses['channels']) >= 7 and responses['management'] == '관리가_제대로_안되고_있음':
        issues.append(('무분별_살포형', 0.8))
    
    # 7. 온라인 소극성 체크 (피부과/성형외과)
    elif responses['specialty'] in ['피부과', '성형외과']:
        if responses.get('commercial_platform') == '사용하지 않음' and responses['online_ratio'] != '온라인 100%':
            issues.append(('온라인_마케팅_소극형', 0.75))
    
    # 가장 높은 가중치의 문제를 주요 문제로 선정
    if issues:
        return max(issues, key=lambda x: x[1])[0] 
    return '일반형'
```

### 3.2 업종×지역 특성 매칭

```python
def get_market_characteristics(location, specialty):
    market_map = {
        ('서울 강남권', '피부과'): {
            'competition': '초고경쟁',
            'key_channels': ['미용플랫폼', '인스타그램', '네이버'],
            'avg_budget': '500-1000만원',
            'critical_success_factor': '차별화된 브랜딩'
        },
        ('서울 강남권', '치과'): {
            'competition': '고경쟁',
            'key_channels': ['네이버', '인스타그램', '유튜브'],
            'avg_budget': '300-500만원',
            'critical_success_factor': '전문성 강조'
        },
        # ... 기타 조합
    }
    return market_map.get((location, specialty), {})
```

### 3.3 점수 계산 상세

#### 채널 활용도 (30점)
- 사용 채널 수: 10점
  - 3-5개: 10점 (최적)
  - 2개: 7점
  - 1개: 3점
  - 6개 이상: 5점 (관리 부담)
- 채널 다양성: 10점
  - 온라인/오프라인 균형: 10점
  - 한쪽 편중 (80% 이상): 5점
- 플랫폼 활용도: 10점
  - 상업적 플랫폼 적극 활용: 10점
  - 기본 등록: 5점
  - 미사용: 0점

#### 운영 관리 (25점)
- 업데이트 주기: 15점
  - 주 5회 이상: 15점
  - 주 2-3회: 12점
  - 주 1회: 9점
  - 월 2-3회: 6점
  - 월 1회 이하: 3점
- 관리 체계: 10점
  - 전담 직원: 10점
  - 외부 위탁: 8점
  - 겸임: 5점
  - 원장 직접: 3점
  - 관리 부재: 0점

#### 성과 측정 (25점)
- 신규 환자 추적: 15점
  - 자동 집계: 15점
  - 수동 집계: 10점
  - 대략 추정: 5점
  - 미파악: 0점
- 온라인 현황 파악: 10점
  - 긍정 신호 4개 이상: 10점
  - 긍정 신호 2-3개: 7점
  - 긍정 신호 1개: 4점
  - 부정 신호만: 0점

#### 예산 규모 (20점)
- 2,000만원 이상: 20점
- 1,000-2,000만원: 17점
- 500-1,000만원: 14점
- 300-500만원: 11점
- 100-300만원: 8점
- 100만원 미만: 5점
- 모르겠음: 3점

### 3.4 부가 문제 식별

주요 문제 외에 다음 조건을 만족하면 부가 문제로 표시:
- 채널 활용도 < 20점 → "채널 다각화 필요"
- 운영 관리 < 15점 → "운영 체계 미흡"
- 성과 측정 < 15점 → "측정 체계 부재"
- 예산 규모 < 10점 → "투자 확대 필요"

## 4. BEST CASE 비교 로직

### 4.1 유사 병원 매칭
```python
def find_best_case(responses):
    # 업종, 지역, 규모가 유사한 성공 사례 검색
    similar_cases = filter_cases(
        specialty=responses['specialty'],
        location_type=responses['location_type'],
        size_range=responses['size_range']
    )
    
    # 문제 유형이 유사했던 병원 우선
    matched_cases = [c for c in similar_cases 
                     if c['previous_issue'] == responses['diagnosed_issue']]
    
    if matched_cases:
        return matched_cases[0]  # 가장 최근 성공 사례
    return similar_cases[0] if similar_cases else None
```

### 4.2 격차 분석
```python
def calculate_gap(current, best_case):
    gaps = {
        '채널수': (best_case['channels'] - current['channels']) / best_case['channels'],
        '콘텐츠': (best_case['content_freq'] - current['content_freq']) / best_case['content_freq'],
        '플랫폼': (best_case['platform_score'] - current['platform_score']) / best_case['platform_score'],
        '측정': (best_case['tracking_score'] - current['tracking_score']) / best_case['tracking_score'],
        '자동화': (best_case['automation_score'] - current['automation_score']) / best_case['automation_score']
    }
    return gaps
```

## 5. ROI 시뮬레이션

### 5.1 기대 효과 계산
```python
def simulate_roi(current_state, improvement_plan):
    baseline = {
        'monthly_new_patients': current_state['estimated_patients'],
        'cac': current_state['estimated_cac'],  # Customer Acquisition Cost
        'conversion_rate': current_state['estimated_conversion']
    }
    
    # 3개월 후 예상
    month_3 = {
        'monthly_new_patients': baseline['monthly_new_patients'] * 1.3,
        'cac': baseline['cac'] * 0.85,
        'conversion_rate': baseline['conversion_rate'] * 1.2
    }
    
    # 6개월 후 예상
    month_6 = {
        'monthly_new_patients': baseline['monthly_new_patients'] * 1.6,
        'cac': baseline['cac'] * 0.7,
        'conversion_rate': baseline['conversion_rate'] * 1.4
    }
    
    return {
        'baseline': baseline,
        '3_months': month_3,
        '6_months': month_6
    }
```

### 5.2 기회비용 계산
```python
def calculate_opportunity_cost(current_score, best_case_score, avg_patient_value):
    # 현재 대비 BEST CASE의 성과 차이
    performance_gap = (best_case_score['patients'] - current_score['patients']) / current_score['patients']
    
    # 월간 기회비용
    monthly_loss = current_score['patients'] * performance_gap * avg_patient_value
    
    # 연간 기회비용
    annual_loss = monthly_loss * 12
    
    return {
        'monthly': monthly_loss,
        'annual': annual_loss,
        'gap_percentage': performance_gap * 100
    }
```
