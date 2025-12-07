import { BeautyProduct } from './product';

// 캠페인
export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  status: CampaignStatus;

  // 연결 상품
  productId: string;
  product?: BeautyProduct;

  // 캠페인 설정
  purpose: CampaignPurpose;
  period: {
    startDate: Date;
    endDate: Date;
  };
  budget: {
    min: number;
    max: number;
    currency: string;
  };

  // 오퍼
  offer: CampaignOffer;

  // 채널
  channels: CampaignChannel[];

  // 크리에이티브
  creativeTypes: CreativeType[];

  // 타겟
  targetSegments: TargetSegment[];

  // 가드레일
  guardrails: {
    forbiddenStrength: 'strict' | 'normal';
    referenceTone: 'emotional' | 'professional' | 'review';
  };

  // 생성물
  artifacts?: CampaignArtifacts;
  generationStatus?: GenerationStatus;

  createdAt: Date;
  updatedAt: Date;
}

// 캠페인 상태
export type CampaignStatus = 'draft' | 'generated' | 'running' | 'completed' | 'paused';

export const CAMPAIGN_STATUS_OPTIONS: { value: CampaignStatus; label: string; color: string }[] = [
  { value: 'draft', label: '작성중', color: 'gray' },
  { value: 'generated', label: '생성완료', color: 'blue' },
  { value: 'running', label: '진행중', color: 'green' },
  { value: 'completed', label: '완료', color: 'dark' },
  { value: 'paused', label: '일시중지', color: 'yellow' },
];

// 캠페인 목적
export type CampaignPurpose = 'acquisition' | 'cart_conversion' | 'repurchase' | 'subscription';

export const CAMPAIGN_PURPOSE_OPTIONS: {
  value: CampaignPurpose;
  label: string;
  description: string;
  emoji: string;
}[] = [
  { value: 'acquisition', label: '신규 획득', description: '새로운 고객 유입', emoji: '🎯' },
  {
    value: 'cart_conversion',
    label: '장바구니 전환',
    description: '장바구니 이탈 고객 전환',
    emoji: '🛒',
  },
  { value: 'repurchase', label: '재구매 유도', description: '기존 고객 재구매', emoji: '🔄' },
  { value: 'subscription', label: '구독 전환', description: '정기 구독 유도', emoji: '📦' },
];

// 오퍼 타입
export interface CampaignOffer {
  type: OfferType;
  value?: string; // 할인율, 증정품명 등
  description?: string;
}

export type OfferType =
  | 'discount'
  | 'gift'
  | 'set'
  | 'free_shipping'
  | 'first_purchase'
  | 'subscription';

export const OFFER_TYPE_OPTIONS: { value: OfferType; label: string; emoji: string }[] = [
  { value: 'discount', label: '할인', emoji: '💰' },
  { value: 'gift', label: '증정', emoji: '🎁' },
  { value: 'set', label: '세트', emoji: '📦' },
  { value: 'free_shipping', label: '무료배송', emoji: '🚚' },
  { value: 'first_purchase', label: '첫구매 혜택', emoji: '🌟' },
  { value: 'subscription', label: '구독 혜택', emoji: '🔁' },
];

// 채널
export type CampaignChannel =
  | 'meta'
  | 'google'
  | 'naver'
  | 'kakao'
  | 'youtube'
  | 'tiktok'
  | 'email';

export const CHANNEL_OPTIONS: {
  value: CampaignChannel;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: 'meta', label: 'Meta (Instagram/Facebook)', icon: 'meta', color: 'blue' },
  { value: 'google', label: 'Google Ads', icon: 'google', color: 'red' },
  { value: 'naver', label: '네이버', icon: 'naver', color: 'green' },
  { value: 'kakao', label: '카카오', icon: 'kakao', color: 'yellow' },
  { value: 'youtube', label: 'YouTube', icon: 'youtube', color: 'red' },
  { value: 'tiktok', label: 'TikTok', icon: 'tiktok', color: 'dark' },
  { value: 'email', label: '이메일', icon: 'mail', color: 'cyan' },
];

// 크리에이티브 타입
export type CreativeType =
  | 'ugc'
  | 'ingredient_card'
  | 'before_after'
  | 'comparison'
  | 'routine'
  | 'review';

export const CREATIVE_TYPE_OPTIONS: {
  value: CreativeType;
  label: string;
  description: string;
  emoji: string;
}[] = [
  { value: 'ugc', label: 'UGC', description: '유저 생성 콘텐츠 스타일', emoji: '📱' },
  { value: 'ingredient_card', label: '성분 카드', description: '성분 강조 카드뉴스', emoji: '🧪' },
  { value: 'before_after', label: '전후 비교', description: '사용 전후 변화', emoji: '✨' },
  { value: 'comparison', label: '비교', description: '경쟁사 비교', emoji: '⚖️' },
  { value: 'routine', label: '루틴', description: '스킨케어 루틴 가이드', emoji: '📋' },
  { value: 'review', label: '후기 중심', description: '실제 리뷰 활용', emoji: '⭐' },
];

// 타겟 세그먼트
export interface TargetSegment {
  id: string;
  name: string;
  description: string;
  isAiRecommended?: boolean;
}

// 캠페인 생성물
export interface CampaignArtifacts {
  briefSummary?: string;
  offerMessage?: OfferMessage;
  channelContents?: ChannelContent[];
  creatives?: Creative[];
  versions: CampaignVersion[];
}

export interface OfferMessage {
  headline: string;
  subHeadline: string;
  urgency?: string;
  cta: string;
}

export interface ChannelContent {
  channel: CampaignChannel;
  headlines: string[];
  descriptions: string[];
  hashtags?: string[];
  adCopies?: string[];
}

export interface Creative {
  type: CreativeType;
  title: string;
  script?: string;
  visualDirection?: string;
  hook?: string;
}

export interface CampaignVersion {
  id: string;
  version: number;
  artifacts: Partial<CampaignArtifacts>;
  createdAt: Date;
}

// 생성 상태
export interface GenerationStatus {
  currentStep: GenerationStep;
  steps: GenerationStepStatus[];
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export type GenerationStep = 'brief' | 'offer' | 'channel' | 'creative' | 'complete';

export interface GenerationStepStatus {
  step: GenerationStep;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  progress?: number;
}

export const GENERATION_STEPS: { step: GenerationStep; label: string; description: string }[] = [
  { step: 'brief', label: '브리프 분석', description: '캠페인 브리프 분석 중...' },
  { step: 'offer', label: '오퍼 메시지', description: '오퍼 메시지 생성 중...' },
  { step: 'channel', label: '채널 콘텐츠', description: '채널별 콘텐츠 생성 중...' },
  { step: 'creative', label: '크리에이티브', description: '크리에이티브 가이드 생성 중...' },
  { step: 'complete', label: '완료', description: '생성 완료!' },
];

// 필터 타입
export interface CampaignFilters {
  status?: CampaignStatus[];
  purpose?: CampaignPurpose[];
  channels?: CampaignChannel[];
  offerType?: OfferType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
