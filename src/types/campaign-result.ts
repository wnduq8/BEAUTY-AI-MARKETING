// 캠페인 결과 전체
export interface CampaignResult {
  id: string;
  campaignId: string;
  strategy: StrategyResult;
  ads: AdsResult;
  creative: CreativeResult;
  landing: LandingResult;
  experiment: ExperimentResult;
  compliance: ComplianceResult;
  createdAt: Date;
  updatedAt: Date;
}

// 캠페인 메타 정보 (별도)
export interface CampaignMeta {
  id: string;
  productName: string;
  category: string;
  status: 'completed' | 'processing' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

// 1. Strategy 탭
export interface StrategyResult {
  coreMessage: string;
  subMessages: string[];
  personas: Persona[];
  offers: OfferOption[];
  angles: MarketingAngle[];
}

export interface Persona {
  id: string;
  name: string;
  age: string;
  skinType: string;
  concerns: string[];
  situation: string;
  objections: string[];
  triggers: string[];
}

export interface OfferOption {
  id: number;
  type: string;
  value: string;
  description: string;
  margin: 'high' | 'medium' | 'low';
  label: 'recommended' | 'caution' | 'normal';
  reasoning: string;
}

export interface MarketingAngle {
  id: string;
  type: 'problem_solution' | 'ingredient_evidence' | 'review_trust';
  title: string;
  headline: string;
  description: string;
}

// 2. Ads 탭
export interface AdsResult {
  meta: MetaAdsContent;
  google: GoogleAdsContent;
  naver: NaverAdsContent;
  headlines: AdCopy[];
  bodyTexts: AdCopy[];
  ctas: AdCopy[];
}

export interface MetaAdsContent {
  campaignStructure: {
    topFunnel: string[];
    retarget: string[];
  };
  creativeRatio: { type: string; ratio: number }[];
  eventRecommendations: string[];
  adSets: AdSet[];
}

export interface GoogleAdsContent {
  keywordClusters: KeywordCluster[];
  headlines: string[];
  descriptions: string[];
}

export interface KeywordCluster {
  type: 'brand' | 'concern' | 'ingredient' | 'comparison';
  keywords: string[];
}

export interface NaverAdsContent {
  toneGuide: string;
  extensionAssets: string[];
  headlines: string[];
  descriptions: string[];
}

export interface AdSet {
  name: string;
  targeting: string;
  headlines: string[];
  descriptions: string[];
}

export interface AdCopy {
  id: string;
  text: string;
  isSafeMode: boolean;
  tone?: '20s' | '30s' | 'neutral';
  type?: 'review_based' | 'benefit_based' | 'urgency';
}

// 3. Creative 탭
export interface CreativeResult {
  ugcScripts: UGCScript[];
  textureDescriptions: TextureDescription[];
  beforeAfterTemplates: BeforeAfterTemplate[];
}

export interface UGCScript {
  id: string;
  title: string;
  duration: '15s' | '30s';
  cuts: ScriptCut[];
  hook: string;
  fullScript: string;
}

export interface ScriptCut {
  order: number;
  name: string;
  duration: string;
  description: string;
  voiceover?: string;
  visual?: string;
}

export interface TextureDescription {
  category: 'texture' | 'absorption' | 'scent' | 'finish';
  phrases: string[];
}

export interface BeforeAfterTemplate {
  id: string;
  title: string;
  beforeText: string;
  afterText: string;
  disclaimer: string;
}

// 4. Landing 탭
export interface LandingResult {
  heroSection: HeroSection;
  fullStructure: LandingSection[];
  reviewHighlights: ReviewCluster[];
}

export interface HeroSection {
  headline: string;
  subHeadline: string;
  evidence: string[];
  cta: string;
  variants?: HeroSection[];
}

export interface LandingSection {
  order: number;
  type: 'problem' | 'solution' | 'evidence' | 'review' | 'faq' | 'offer' | 'cta';
  title: string;
  content: string;
}

export interface ReviewCluster {
  category: string;
  count: number;
  highlights: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

// 5. Experiment 탭
export interface ExperimentResult {
  calendar: ExperimentCalendar;
  variables: ExperimentVariable[];
  priorities: ExperimentPriority[];
}

export interface ExperimentCalendar {
  duration: '2weeks' | '4weeks';
  phases: ExperimentPhase[];
}

export interface ExperimentPhase {
  week: number;
  focus: string;
  tests: string[];
  budget: number;
}

export interface ExperimentVariable {
  id: string;
  name: string;
  type: 'hook' | 'offer' | 'landing_hero' | 'ugc_opening' | 'target';
  variants: string[];
  currentWinner?: string;
}

export interface ExperimentPriority {
  id: string;
  testName: string;
  variable: string;
  impact: number;
  confidence: number;
  ease: number;
  iceScore: number;
  status: 'pending' | 'running' | 'completed';
}

// 6. Compliance 탭
export interface ComplianceResult {
  riskExpressions: RiskExpression[];
  platformWarnings: PlatformWarning[];
  overallScore: number;
}

export interface RiskExpression {
  id: string;
  original: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskType: string;
  reason: string;
  alternatives: string[];
  location: string;
}

export interface PlatformWarning {
  platform: string;
  warnings: string[];
  recommendation: string;
}
