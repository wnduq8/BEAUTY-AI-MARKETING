// 워크스페이스 (브랜드/스토어 단위)
export interface Workspace {
  id: string;
  name: string;
  logo?: string;
  createdAt: Date;
  ownerId: string;
}

// 워크스페이스 설정
export interface WorkspaceSettings {
  id: string;
  workspaceId: string;
  brandTone: string; // 브랜드 톤 설명
  forbiddenWords: string[]; // 금칙어 목록
  requiredPhrases: string[]; // 필수 문구 목록
  primaryColor?: string;
  secondaryColor?: string;
}

// 상품
export interface Product {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  ingredients?: string[];
  benefits?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 캠페인
export interface Campaign {
  id: string;
  workspaceId: string;
  productId: string;
  name: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  type: 'sns' | 'ad' | 'email' | 'landing';
  versions: CampaignVersion[];
  createdAt: Date;
  updatedAt: Date;
}

// 캠페인 버전
export interface CampaignVersion {
  id: string;
  campaignId: string;
  version: number;
  content: CampaignContent;
  createdAt: Date;
  createdBy: string;
}

// 캠페인 콘텐츠
export interface CampaignContent {
  headline?: string;
  subHeadline?: string;
  bodyCopy?: string;
  cta?: string;
  hashtags?: string[];
  ugcScript?: string;
  visualDirection?: string;
}

// 소재 (Assets)
export interface Asset {
  id: string;
  workspaceId: string;
  campaignId?: string;
  type: 'image' | 'video' | 'copy' | 'template';
  name: string;
  url?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// 리포트
export interface Report {
  id: string;
  workspaceId: string;
  campaignId: string;
  metrics: ReportMetrics;
  generatedAt: Date;
}

export interface ReportMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cvr: number;
  roas?: number;
}

// 알림
export interface Notification {
  id: string;
  userId: string;
  workspaceId: string;
  type: 'campaign_complete' | 'export_ready' | 'version_created' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// 사용자 권한
export interface UserRole {
  userId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
}

// 재생성 요청
export interface RegenerateRequest {
  campaignId: string;
  versionId: string;
  sections: ('headline' | 'bodyCopy' | 'cta' | 'ugcScript' | 'hashtags')[];
}

// 온보딩 데이터
export interface OnboardingData {
  // Step 1: 기본 정보
  brandName: string;
  storeName?: string;
  targetRegions: string[];
  languages: string[];

  // Step 2: 브랜드 톤 & 가이드라인
  brandTone: 'expert' | 'friendly' | 'luxury' | 'natural' | 'trendy';
  brandToneDescription?: string;
  forbiddenWords: string[];
  requiredPhrases: string[];

  // Step 3: 운영 채널
  channels: {
    meta: boolean;
    google: boolean;
    naver: boolean;
    kakao: boolean;
    ownMall: boolean;
    email: boolean;
  };
  primaryChannel?: string;
}

// 브랜드 톤 옵션
export const BRAND_TONE_OPTIONS = [
  { value: 'expert', label: '전문가', description: '신뢰감 있고 전문적인 톤', emoji: '🔬' },
  { value: 'friendly', label: '친근한', description: '편안하고 다가가기 쉬운 톤', emoji: '😊' },
  { value: 'luxury', label: '럭셔리', description: '고급스럽고 프리미엄한 톤', emoji: '✨' },
  { value: 'natural', label: '내추럴', description: '자연스럽고 진정성 있는 톤', emoji: '🌿' },
  { value: 'trendy', label: '트렌디', description: 'MZ세대 타겟, 힙한 톤', emoji: '🔥' },
] as const;

// 지역 옵션
export const REGION_OPTIONS = [
  { value: 'kr', label: '한국', flag: '🇰🇷' },
  { value: 'jp', label: '일본', flag: '🇯🇵' },
  { value: 'us', label: '미국', flag: '🇺🇸' },
  { value: 'cn', label: '중국', flag: '🇨🇳' },
  { value: 'sea', label: '동남아시아', flag: '🌏' },
  { value: 'eu', label: '유럽', flag: '🇪🇺' },
] as const;

// 언어 옵션
export const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어' },
  { value: 'ja', label: '일본어' },
  { value: 'zh', label: '중국어' },
] as const;

// 채널 옵션
export const CHANNEL_OPTIONS = [
  { key: 'meta', label: 'Meta (Instagram/Facebook)', icon: 'meta', color: 'blue' },
  { key: 'google', label: 'Google Ads', icon: 'google', color: 'red' },
  { key: 'naver', label: '네이버', icon: 'naver', color: 'green' },
  { key: 'kakao', label: '카카오', icon: 'kakao', color: 'yellow' },
  { key: 'ownMall', label: '자사몰', icon: 'shop', color: 'violet' },
  { key: 'email', label: '이메일 마케팅', icon: 'mail', color: 'cyan' },
] as const;
