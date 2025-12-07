// 뷰티 상품 타입
export interface BeautyProduct {
  id: string;
  workspaceId: string;

  // 기본 정보
  basic: {
    name: string;
    line?: string; // 제품 라인
    price: number;
    costPrice?: number; // 원가
    margin?: number; // 마진율
    volume: string; // 용량 (예: 50ml)
    usagePeriod?: string; // 사용기간 (예: 2개월)
    images: string[];
    description?: string;
  };

  // 피부 고민/효과 포지셔닝
  skinConcerns: {
    primary: SkinConcern[]; // 주요 고민
    secondary?: SkinConcern[]; // 부가 효과
    customConcerns?: string[]; // 자유 입력
  };

  // 성분/근거
  ingredients: {
    keyIngredients: KeyIngredient[]; // 핵심 성분
    clinicalData?: string; // 임상/시험 데이터 요약
    certifications?: string[]; // 인증/테스트 (민감성, 논코메도 등)
  };

  // 사용감/제형
  texture: {
    type: TextureType; // 제형
    scent?: string; // 향
    absorption?: string; // 흡수감
    stickiness?: 'none' | 'light' | 'medium' | 'heavy'; // 끈적임
    irritation?: 'none' | 'mild' | 'moderate'; // 자극감
    customTexture?: string;
  };

  // 타겟
  target: {
    skinTypes: SkinType[]; // 피부 타입
    ageGroups: AgeGroup[]; // 연령대
    routineStep?: RoutineStep; // 루틴 단계
  };

  // 경쟁/비교
  competition?: {
    competitors: Competitor[];
  };

  // 리뷰/FAQ 시드
  reviewsSeed?: {
    bestReviews: string[]; // 베스트 리뷰 3~10개
    faqs: FAQ[];
  };

  // 카테고리/상태
  category: ProductCategory;
  status: 'draft' | 'active' | 'archived';
  hasPromotion: boolean;
  inStock: boolean;

  // AI 생성물
  artifacts?: ProductArtifacts;

  createdAt: Date;
  updatedAt: Date;
}

// 피부 고민
export type SkinConcern =
  | 'trouble' // 트러블
  | 'calming' // 진정
  | 'redness' // 홍조
  | 'pore' // 모공
  | 'elasticity' // 탄력
  | 'wrinkle' // 주름
  | 'whitening' // 미백
  | 'hydration' // 보습
  | 'sebum' // 피지
  | 'darkspot' // 잡티
  | 'dullness' // 칙칙함
  | 'sensitivity'; // 민감

export const SKIN_CONCERN_OPTIONS: { value: SkinConcern; label: string; emoji: string }[] = [
  { value: 'trouble', label: '트러블', emoji: '🔴' },
  { value: 'calming', label: '진정', emoji: '💚' },
  { value: 'redness', label: '홍조', emoji: '🩷' },
  { value: 'pore', label: '모공', emoji: '🔵' },
  { value: 'elasticity', label: '탄력', emoji: '💪' },
  { value: 'wrinkle', label: '주름', emoji: '〰️' },
  { value: 'whitening', label: '미백', emoji: '✨' },
  { value: 'hydration', label: '보습', emoji: '💧' },
  { value: 'sebum', label: '피지', emoji: '💦' },
  { value: 'darkspot', label: '잡티', emoji: '🔘' },
  { value: 'dullness', label: '칙칙함', emoji: '🌫️' },
  { value: 'sensitivity', label: '민감', emoji: '🌸' },
];

// 핵심 성분
export interface KeyIngredient {
  name: string; // 성분명
  percentage?: string; // 함량
  benefit: string; // 효능
}

export const POPULAR_INGREDIENTS = [
  '나이아신아마이드',
  '레티놀',
  '비타민C',
  '시카/병풀',
  '세라마이드',
  '히알루론산',
  'AHA/BHA',
  '펩타이드',
  '콜라겐',
  '스쿠알란',
  '티트리',
  '프로폴리스',
];

// 제형
export type TextureType =
  | 'gel'
  | 'cream'
  | 'essence'
  | 'serum'
  | 'lotion'
  | 'oil'
  | 'mist'
  | 'foam'
  | 'balm'
  | 'pad'
  | 'mask';

export const TEXTURE_OPTIONS: { value: TextureType; label: string }[] = [
  { value: 'gel', label: '젤' },
  { value: 'cream', label: '크림' },
  { value: 'essence', label: '에센스' },
  { value: 'serum', label: '세럼' },
  { value: 'lotion', label: '로션' },
  { value: 'oil', label: '오일' },
  { value: 'mist', label: '미스트' },
  { value: 'foam', label: '폼' },
  { value: 'balm', label: '밤' },
  { value: 'pad', label: '패드' },
  { value: 'mask', label: '마스크' },
];

// 피부 타입
export type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';

export const SKIN_TYPE_OPTIONS: { value: SkinType; label: string }[] = [
  { value: 'dry', label: '건성' },
  { value: 'oily', label: '지성' },
  { value: 'combination', label: '복합성' },
  { value: 'sensitive', label: '민감성' },
  { value: 'normal', label: '중성' },
];

// 연령대
export type AgeGroup = '10s' | '20s-early' | '20s-late' | '30s' | '40s' | '50s+';

export const AGE_GROUP_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: '10s', label: '10대' },
  { value: '20s-early', label: '20대 초반' },
  { value: '20s-late', label: '20대 후반' },
  { value: '30s', label: '30대' },
  { value: '40s', label: '40대' },
  { value: '50s+', label: '50대 이상' },
];

// 루틴 단계
export type RoutineStep =
  | 'cleanser'
  | 'toner'
  | 'essence'
  | 'serum'
  | 'ampoule'
  | 'cream'
  | 'sunscreen'
  | 'mask';

export const ROUTINE_STEP_OPTIONS: { value: RoutineStep; label: string; order: number }[] = [
  { value: 'cleanser', label: '클렌저', order: 1 },
  { value: 'toner', label: '토너', order: 2 },
  { value: 'essence', label: '에센스', order: 3 },
  { value: 'serum', label: '세럼', order: 4 },
  { value: 'ampoule', label: '앰플', order: 5 },
  { value: 'cream', label: '크림', order: 6 },
  { value: 'sunscreen', label: '선케어', order: 7 },
  { value: 'mask', label: '마스크', order: 8 },
];

// 상품 카테고리
export type ProductCategory =
  | 'skincare'
  | 'cleansing'
  | 'suncare'
  | 'makeup'
  | 'bodycare'
  | 'haircare'
  | 'tool';

export const CATEGORY_OPTIONS: { value: ProductCategory; label: string; emoji: string }[] = [
  { value: 'skincare', label: '스킨케어', emoji: '🧴' },
  { value: 'cleansing', label: '클렌징', emoji: '🫧' },
  { value: 'suncare', label: '선케어', emoji: '☀️' },
  { value: 'makeup', label: '메이크업', emoji: '💄' },
  { value: 'bodycare', label: '바디케어', emoji: '🛁' },
  { value: 'haircare', label: '헤어케어', emoji: '💇' },
  { value: 'tool', label: '뷰티툴', emoji: '🪥' },
];

// 경쟁사 제품
export interface Competitor {
  name: string;
  brand: string;
  price?: number;
  comparePoints: string; // 비교 포인트
}

// FAQ
export interface FAQ {
  question: string;
  answer: string;
}

// AI 생성물
export interface ProductArtifacts {
  messageHouse?: MessageHouse;
  landingOutline?: LandingOutline;
}

// 메시지 하우스
export interface MessageHouse {
  version: number;
  bigIdea: string;
  uspExpressions: string[]; // 핵심 USP 표현 10개
  safeCopies: string[]; // 금칙어 안전 카피 10개
  objectionHandling: { question: string; answer: string }[]; // 반론 처리 Q&A 10개
  createdAt: Date;
}

// 랜딩페이지 아웃라인
export interface LandingOutline {
  version: number;
  heroSection: string; // 상단 1스크롤
  evidenceSection: string; // 근거 섹션
  reviewSection: string; // 후기 섹션
  faqSection: string; // FAQ
  ctaSection: string; // CTA
  createdAt: Date;
}

// 가격대 필터
export const PRICE_RANGE_OPTIONS = [
  { value: '0-20000', label: '2만원 이하' },
  { value: '20000-50000', label: '2~5만원' },
  { value: '50000-100000', label: '5~10만원' },
  { value: '100000+', label: '10만원 이상' },
];
