'use client';
import React, { useState } from 'react';

// Types
interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  tags: string[];
  popularity: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  briefDefaults: {
    targetAudience: string[];
    skinConcerns: string[];
    keyIngredients: string[];
    toneAndManner: string[];
    avoidKeywords: string[];
    recommendedChannels: string[];
    budgetRange: string;
    kpiTargets: { metric: string; target: string }[];
    creativeDirection: string[];
    complianceNotes: string[];
  };
  guardrails: {
    mustInclude: string[];
    mustAvoid: string[];
    legalNotes: string[];
  };
  sampleCopies: { type: string; text: string }[];
  bestPractices: string[];
}

const beautyTemplates: Template[] = [
  {
    id: 'trouble-calming',
    name: '트러블/진정 런칭',
    category: '스킨케어',
    description:
      '민감성 피부와 트러블 고민을 가진 타겟을 위한 진정 제품 런칭 캠페인. 자극 없는 순한 성분과 즉각적인 진정 효과를 강조합니다.',
    icon: '🌿',
    color: 'green',
    gradient: 'from-green-400 to-emerald-500',
    tags: ['민감성', '진정', '트러블', '저자극'],
    popularity: 94,
    difficulty: 'beginner',
    duration: '4-6주',
    briefDefaults: {
      targetAudience: [
        '20-35세 여성',
        '민감성/트러블 피부 고민자',
        '성분 중시 소비자',
        '피부과 시술 후 관리 필요자',
      ],
      skinConcerns: ['트러블', '붉은기', '자극', '민감성', '진정'],
      keyIngredients: ['시카(병풀추출물)', '판테놀', '마데카소사이드', '아줄렌', '알로에'],
      toneAndManner: ['신뢰감 있는', '전문적인', '부드러운', '공감하는'],
      avoidKeywords: ['완치', '치료', '100% 효과', '즉시 개선'],
      recommendedChannels: ['Instagram', 'Naver', 'YouTube'],
      budgetRange: '500만원 - 2,000만원',
      kpiTargets: [
        { metric: 'CTR', target: '2.5% 이상' },
        { metric: 'CVR', target: '2.0% 이상' },
        { metric: 'ROAS', target: '250% 이상' },
      ],
      creativeDirection: [
        '비포애프터 이미지(과장 금지)',
        '성분 강조 인포그래픽',
        '실제 사용 후기 활용',
        '피부과 전문의 추천',
      ],
      complianceNotes: ['의약품 오인 표현 금지', '치료/완치 표현 불가', '비포애프터 과장 주의'],
    },
    guardrails: {
      mustInclude: [
        '저자극 테스트 완료 문구',
        '사용 전 패치테스트 권장',
        '개인차 있을 수 있음 고지',
      ],
      mustAvoid: ['트러블 치료', '여드름 완치', '피부과급 효과', '100% 진정', '즉각 개선'],
      legalNotes: [
        '화장품법 제13조: 의약품 오인 광고 금지',
        '공정위 표시광고법: 객관적 근거 없는 효능 표현 금지',
      ],
    },
    sampleCopies: [
      { type: '헤드카피', text: '예민한 날에도 안심, 시카가 진정시켜 드릴게요' },
      { type: '서브카피', text: '피부 자극 테스트 완료, 민감성 피부도 OK' },
      { type: '해시태그', text: '#진정케어 #민감성피부 #시카크림 #트러블진정 #저자극' },
    ],
    bestPractices: [
      '실제 민감성 피부 사용자의 생생한 후기 활용',
      '성분 안전성 인증 마크 노출',
      '사용 전후 비교는 자연스러운 조명에서 촬영',
      '피부과 전문의 또는 약사 추천 멘트 활용',
    ],
  },
  {
    id: 'retinol-beginner',
    name: '레티놀 입문 캠페인',
    category: '안티에이징',
    description:
      '레티놀 성분에 대한 진입장벽을 낮추고, 순한 입문용 제품으로 안티에이징 시장에 진입하는 캠페인입니다.',
    icon: '✨',
    color: 'purple',
    gradient: 'from-purple-400 to-pink-500',
    tags: ['레티놀', '안티에이징', '입문', '주름개선'],
    popularity: 89,
    difficulty: 'intermediate',
    duration: '6-8주',
    briefDefaults: {
      targetAudience: [
        '28-45세 여성',
        '초기 노화 징후 고민자',
        '레티놀 초보자',
        '기능성 화장품 관심자',
      ],
      skinConcerns: ['주름', '탄력', '모공', '피부결', '안티에이징'],
      keyIngredients: ['레티놀', '바쿠치올', '펩타이드', '나이아신아마이드', '히알루론산'],
      toneAndManner: ['교육적인', '친근한', '전문적인', '안심시키는'],
      avoidKeywords: ['주름 제거', '동안 피부', '10살 어려보이는', '보톡스급'],
      recommendedChannels: ['YouTube', 'Instagram', 'Naver Blog'],
      budgetRange: '800만원 - 3,000만원',
      kpiTargets: [
        { metric: 'CTR', target: '2.0% 이상' },
        { metric: 'CVR', target: '1.8% 이상' },
        { metric: 'ROAS', target: '220% 이상' },
      ],
      creativeDirection: [
        '레티놀 교육 콘텐츠',
        '단계별 사용법 가이드',
        '순한 레티놀 강조',
        '장기 사용 후기',
      ],
      complianceNotes: ['기능성 화장품 심사 필수', '주름개선 문구는 식약처 인증 제품만 가능'],
    },
    guardrails: {
      mustInclude: [
        '사용법 안내(저녁, 소량부터)',
        '자외선 차단제 병행 권장',
        '기능성 화장품 인증 표시',
      ],
      mustAvoid: ['주름 제거/완전 개선', '보톡스/시술 대체', '즉각적 효과', '모든 피부에 적합'],
      legalNotes: [
        '기능성 화장품 표시광고 심의 필수',
        '주름개선 효능은 식약처 인증 범위 내에서만 표현',
      ],
    },
    sampleCopies: [
      { type: '헤드카피', text: '레티놀, 어렵지 않아요. 0.05%부터 시작하세요' },
      { type: '서브카피', text: '피부 적응 기간 2주, 당신의 첫 레티놀 파트너' },
      { type: '해시태그', text: '#레티놀입문 #순한레티놀 #안티에이징 #주름개선 #첫레티놀' },
    ],
    bestPractices: [
      '레티놀 농도와 사용법을 명확히 안내',
      '피부 적응 기간(레티놀 어글리)에 대한 솔직한 정보 제공',
      '자외선 차단의 중요성 강조',
      '순한 포뮬러/캡슐화 기술 등 차별점 강조',
    ],
  },
  {
    id: 'suncare-season',
    name: '선케어 시즌 캠페인',
    category: '선케어',
    description:
      '여름 시즌을 맞아 자외선 차단의 중요성과 제품 특장점을 알리는 시즈널 캠페인입니다.',
    icon: '☀️',
    color: 'yellow',
    gradient: 'from-yellow-400 to-orange-500',
    tags: ['선크림', '자외선차단', '여름', 'SPF'],
    popularity: 96,
    difficulty: 'beginner',
    duration: '8-12주 (5월-8월)',
    briefDefaults: {
      targetAudience: [
        '18-40세 남녀',
        '야외활동 많은 사람',
        '피부 광노화 걱정자',
        '가벼운 선크림 선호자',
      ],
      skinConcerns: ['자외선 차단', '백탁', '끈적임', '무거움', '광노화'],
      keyIngredients: ['징크옥사이드', '티타늄디옥사이드', '나이아신아마이드', '토코페롤'],
      toneAndManner: ['밝은', '활기찬', '신뢰감 있는', '시즈널'],
      avoidKeywords: ['완벽 차단', '100% 보호', '바르지 않아도 되는'],
      recommendedChannels: ['Instagram', 'TikTok', 'YouTube Shorts'],
      budgetRange: '1,000만원 - 5,000만원',
      kpiTargets: [
        { metric: 'CTR', target: '3.0% 이상' },
        { metric: 'CVR', target: '2.5% 이상' },
        { metric: 'ROAS', target: '300% 이상' },
      ],
      creativeDirection: [
        '야외 촬영 비주얼',
        '발림성/백탁 테스트 영상',
        '워터프루프 테스트',
        'SPF/PA 지수 강조',
      ],
      complianceNotes: ['SPF/PA 지수는 식약처 기준 표기', '자외선 차단 효과 과장 금지'],
    },
    guardrails: {
      mustInclude: ['SPF/PA 지수 명시', '2-3시간마다 덧바름 권장', '사용량 안내(500원 동전 크기)'],
      mustAvoid: ['완벽한 자외선 차단', '바르지 않아도 OK', '하루종일 보호', '피부암 예방'],
      legalNotes: ['SPF 수치는 식약처 시험 결과에 따름', '의약외품/기능성 화장품 구분 명확히'],
    },
    sampleCopies: [
      { type: '헤드카피', text: '가볍게 발리고, 단단하게 지켜주는 선크림' },
      { type: '서브카피', text: 'SPF50+ PA++++, 백탁 없이 산뜻하게' },
      { type: '해시태그', text: '#선크림추천 #여름필수템 #자외선차단 #데일리선크림 #무백탁' },
    ],
    bestPractices: [
      '실제 발림성 영상으로 백탁/끈적임 해소',
      '다양한 피부톤에서의 발색 테스트',
      '워터프루프/스웻프루프 테스트 영상',
      '시즌 한정 프로모션으로 긴급성 부여',
    ],
  },
  {
    id: 'brightening-toneup',
    name: '미백/톤업 캠페인',
    category: '미백',
    description:
      '피부 톤 개선과 미백 기능을 강조하는 캠페인. 표현 가드레일이 가장 엄격한 카테고리로, 규제 준수가 핵심입니다.',
    icon: '💎',
    color: 'pink',
    gradient: 'from-pink-400 to-rose-500',
    tags: ['미백', '톤업', '브라이트닝', '잡티'],
    popularity: 85,
    difficulty: 'advanced',
    duration: '6-8주',
    briefDefaults: {
      targetAudience: ['25-45세 여성', '피부톤 고민자', '잡티/기미 고민자', '화사한 피부 희망자'],
      skinConcerns: ['미백', '톤업', '잡티', '기미', '칙칙함', '피부톤'],
      keyIngredients: ['나이아신아마이드', '비타민C', '알부틴', '트라넥사믹애시드', '글루타치온'],
      toneAndManner: ['우아한', '고급스러운', '신뢰감 있는', '과학적인'],
      avoidKeywords: ['하얘지는', '표백', '백옥 피부', '완전 제거', '피부색 변화'],
      recommendedChannels: ['Instagram', 'Naver', 'YouTube'],
      budgetRange: '1,000만원 - 4,000만원',
      kpiTargets: [
        { metric: 'CTR', target: '2.2% 이상' },
        { metric: 'CVR', target: '1.8% 이상' },
        { metric: 'ROAS', target: '200% 이상' },
      ],
      creativeDirection: [
        '자연스러운 광채 표현',
        '성분 과학 인포그래픽',
        '장기 사용 다이어리',
        '전문가 인터뷰',
      ],
      complianceNotes: [
        '미백 기능성 인증 필수',
        '멜라닌 생성 억제 범위 내 표현',
        '인종차별적 표현 절대 금지',
      ],
    },
    guardrails: {
      mustInclude: [
        '기능성 화장품 인증 표시',
        '멜라닌 생성 억제에 도움 문구',
        '개인차 있음 고지',
        '자외선 차단 병행 권장',
      ],
      mustAvoid: [
        '하얘지는/백옥 피부',
        '잡티 완전 제거',
        '피부색 변화',
        '표백 효과',
        '인종 관련 표현',
        '백인 피부',
      ],
      legalNotes: [
        '기능성 화장품 심의 필수',
        '멜라닌 색소 침착 억제 범위 내 표현만 가능',
        '피부색 자체의 변화 표현 불가',
        '인종차별적 광고 금지(화장품법 시행규칙)',
      ],
    },
    sampleCopies: [
      { type: '헤드카피', text: '맑은 피부결, 나이아신아마이드가 도와드릴게요' },
      { type: '서브카피', text: '멜라닌 생성 억제, 칙칙함 케어에 도움을 주는 미백 기능성' },
      { type: '해시태그', text: '#미백기능성 #톤케어 #브라이트닝 #맑은피부 #나이아신아마이드' },
    ],
    bestPractices: [
      '기능성 화장품 인증 마크 필수 노출',
      '멜라닌 억제 메커니즘 과학적 설명',
      '비포애프터는 동일 조명/조건에서 촬영',
      '장기 사용 후기로 신뢰도 확보',
      '인종/피부색 다양성 존중하는 메시지',
    ],
  },
  {
    id: 'moisturizing-barrier',
    name: '보습/장벽 강화',
    category: '스킨케어',
    description:
      '건조한 피부와 손상된 피부 장벽 회복을 위한 보습 캠페인. 겨울 시즌에 특히 효과적입니다.',
    icon: '💧',
    color: 'blue',
    gradient: 'from-blue-400 to-cyan-500',
    tags: ['보습', '장벽강화', '세라마이드', '건조'],
    popularity: 91,
    difficulty: 'beginner',
    duration: '6-10주',
    briefDefaults: {
      targetAudience: [
        '20-50세 남녀',
        '건성/복합건성 피부',
        '환절기 피부 고민자',
        '피부 장벽 손상자',
      ],
      skinConcerns: ['건조', '당김', '각질', '피부장벽', '보습'],
      keyIngredients: ['세라마이드', '히알루론산', '스쿠알란', '판테놀', '글리세린'],
      toneAndManner: ['편안한', '신뢰감 있는', '따뜻한', '전문적인'],
      avoidKeywords: ['피부 치료', '완벽한 장벽', '영구적 보습'],
      recommendedChannels: ['Instagram', 'Naver', 'YouTube'],
      budgetRange: '600만원 - 2,500만원',
      kpiTargets: [
        { metric: 'CTR', target: '2.8% 이상' },
        { metric: 'CVR', target: '2.2% 이상' },
        { metric: 'ROAS', target: '280% 이상' },
      ],
      creativeDirection: [
        '수분 측정기 테스트 영상',
        '텍스처/발림성 강조',
        '24시간 보습 테스트',
        '피부 장벽 과학 설명',
      ],
      complianceNotes: ['보습 효과 측정 데이터 근거 필요', '피부장벽 회복 표현 주의'],
    },
    guardrails: {
      mustInclude: ['사용감 관련 정보', '피부 타입별 추천', '효과적인 사용법 안내'],
      mustAvoid: ['피부 장벽 치료', '영구적 보습', '모든 건조 해결', '피부과 대체'],
      legalNotes: ['보습 효과 관련 임상 데이터 근거 권장', '의약품적 효능 표현 금지'],
    },
    sampleCopies: [
      { type: '헤드카피', text: '세라마이드 3종, 무너진 장벽을 채워드려요' },
      { type: '서브카피', text: '바른 직후부터 24시간, 촉촉함이 다릅니다' },
      { type: '해시태그', text: '#세라마이드 #피부장벽 #보습크림 #건조피부 #수분장벽' },
    ],
    bestPractices: [
      '수분 측정기를 활용한 비포애프터 콘텐츠',
      '환절기/겨울 시즌에 집중 집행',
      '텍스처 ASMR 영상으로 사용감 전달',
      '피부 장벽 과학을 쉽게 설명하는 교육 콘텐츠',
    ],
  },
  {
    id: 'pore-care',
    name: '모공/피지 케어',
    category: '스킨케어',
    description:
      '모공과 피지 고민을 가진 지성/복합성 피부를 위한 캠페인. 여름 시즌과 궁합이 좋습니다.',
    icon: '🔬',
    color: 'teal',
    gradient: 'from-teal-400 to-green-500',
    tags: ['모공', '피지', '지성피부', 'BHA'],
    popularity: 87,
    difficulty: 'intermediate',
    duration: '6-8주',
    briefDefaults: {
      targetAudience: [
        '18-35세 남녀',
        '지성/복합성 피부',
        '모공/블랙헤드 고민자',
        '피지 과다 분비자',
      ],
      skinConcerns: ['모공', '피지', '블랙헤드', '번들거림', '각질'],
      keyIngredients: ['살리실산(BHA)', '나이아신아마이드', 'PHA', '티트리', '징크'],
      toneAndManner: ['상쾌한', '과학적인', '솔직한', '실용적인'],
      avoidKeywords: ['모공 축소', '모공 제거', '피지선 제거', '완전 매트'],
      recommendedChannels: ['Instagram', 'TikTok', 'YouTube'],
      budgetRange: '700만원 - 2,500만원',
      kpiTargets: [
        { metric: 'CTR', target: '2.5% 이상' },
        { metric: 'CVR', target: '2.0% 이상' },
        { metric: 'ROAS', target: '250% 이상' },
      ],
      creativeDirection: [
        '모공 확대 비포애프터',
        '피지 조절 타임랩스',
        'T존 케어 루틴',
        '성분 작용 원리 설명',
      ],
      complianceNotes: ['모공 축소 표현 불가', '일시적 개선 효과로 표현'],
    },
    guardrails: {
      mustInclude: ['모공 케어/관리 표현 사용', '꾸준한 사용 권장', '클렌징과 병행 안내'],
      mustAvoid: ['모공 축소/제거', '피지선 제거', '영구적 효과', '레이저급 효과'],
      legalNotes: [
        '모공은 물리적으로 축소 불가, 케어/관리 표현만 가능',
        '각질 제거 효과는 물리적 작용으로 표현',
      ],
    },
    sampleCopies: [
      { type: '헤드카피', text: 'BHA가 모공 속 피지를 녹여낼게요' },
      { type: '서브카피', text: '매일 쓰는 순한 BHA, 블랙헤드 고민 덜기' },
      { type: '해시태그', text: '#모공케어 #피지관리 #BHA #지성피부 #블랙헤드' },
    ],
    bestPractices: [
      '실제 모공 상태 변화를 담은 리얼 후기',
      '피지 측정 테스트 콘텐츠',
      '여름 시즌에 집중 마케팅',
      'T존/U존 나누어 설명하는 교육 콘텐츠',
    ],
  },
];

const categories = ['전체', '스킨케어', '안티에이징', '선케어', '미백'];
const difficultyLabels = { beginner: '입문', intermediate: '중급', advanced: '고급' };
const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function TemplatesGuide() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'guardrails' | 'samples' | 'best'>(
    'overview'
  );

  const filteredTemplates = beautyTemplates.filter((t) => {
    const matchesCategory = selectedCategory === '전체' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab('overview');
  };

  const applyTemplate = () => {
    setShowApplyModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">뷰티 캠페인 템플릿</h1>
            <p className="mt-1 text-sm text-gray-500">
              검증된 뷰티 마케팅 템플릿으로 캠페인을 빠르게 시작하세요
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="템플릿 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {!selectedTemplate ? (
          <>
            {/* Category Filter */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => openTemplate(template)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg"
                >
                  {/* Header Gradient */}
                  <div className={`h-32 bg-gradient-to-br ${template.gradient} relative p-5`}>
                    <span className="text-5xl">{template.icon}</span>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span
                        className={`rounded-full bg-white/90 px-2 py-1 text-xs font-medium ${
                          template.difficulty === 'beginner'
                            ? 'text-green-700'
                            : template.difficulty === 'intermediate'
                              ? 'text-yellow-700'
                              : 'text-red-700'
                        }`}
                      >
                        {difficultyLabels[template.difficulty]}
                      </span>
                    </div>
                    <div className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700">
                        자세히 보기 →
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs text-gray-500">{template.category}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{template.duration}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">{template.name}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                      {template.description}
                    </p>

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {template.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium text-gray-700">
                          {template.popularity}%
                        </span>
                        <span className="text-xs text-gray-400">추천율</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        채널 {template.briefDefaults.recommendedChannels.length}개 추천
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Template Detail View */
          <div className="mx-auto max-w-5xl">
            {/* Back Button */}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              ← 템플릿 목록으로
            </button>

            {/* Template Header */}
            <div className={`rounded-2xl bg-gradient-to-br ${selectedTemplate.gradient} mb-6 p-8`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{selectedTemplate.icon}</span>
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-700">
                        {selectedTemplate.category}
                      </span>
                      <span
                        className={`rounded-full bg-white/90 px-3 py-1 text-sm font-medium ${
                          selectedTemplate.difficulty === 'beginner'
                            ? 'text-green-700'
                            : selectedTemplate.difficulty === 'intermediate'
                              ? 'text-yellow-700'
                              : 'text-red-700'
                        }`}
                      >
                        {difficultyLabels[selectedTemplate.difficulty]}
                      </span>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-white">{selectedTemplate.name}</h1>
                    <p className="text-white/90">{selectedTemplate.description}</p>
                  </div>
                </div>
                <button
                  onClick={applyTemplate}
                  className="rounded-xl bg-white px-6 py-3 font-medium text-gray-900 shadow-lg transition-colors hover:bg-gray-100"
                >
                  이 템플릿 적용하기
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
              {[
                { id: 'overview', label: '📋 개요' },
                { id: 'guardrails', label: '⚠️ 가드레일' },
                { id: 'samples', label: '✍️ 샘플 카피' },
                { id: 'best', label: '💡 베스트 프랙티스' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 rounded-lg px-4 py-2.5 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Target Audience */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <span>👥</span> 타겟 오디언스
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.briefDefaults.targetAudience.map((t, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-purple-50 px-3 py-1.5 text-sm text-purple-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skin Concerns */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <span>🎯</span> 피부 고민 키워드
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.briefDefaults.skinConcerns.map((c, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-pink-50 px-3 py-1.5 text-sm text-pink-700"
                        >
                          #{c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Ingredients */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <span>🧪</span> 주요 성분
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.briefDefaults.keyIngredients.map((ing, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-green-50 px-3 py-1.5 text-sm text-green-700"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Channels */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <span>📱</span> 추천 채널
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedTemplate.briefDefaults.recommendedChannels.map((ch, i) => (
                        <span
                          key={i}
                          className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* KPI Targets */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <span>📊</span> 목표 KPI
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedTemplate.briefDefaults.kpiTargets.map((kpi, i) => (
                        <div key={i} className="rounded-xl bg-gray-50 p-4 text-center">
                          <div className="text-2xl font-bold text-gray-900">{kpi.target}</div>
                          <div className="text-sm text-gray-500">{kpi.metric}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tone & Manner */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <span>🎨</span> 톤앤매너
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.briefDefaults.toneAndManner.map((t, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-orange-50 px-3 py-1.5 text-sm text-orange-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'guardrails' && (
                <div className="space-y-8">
                  {/* Must Include */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700">
                      <span>✅</span> 필수 포함 사항
                    </h3>
                    <div className="space-y-2">
                      {selectedTemplate.guardrails.mustInclude.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                          <span className="mt-0.5 text-green-500">✓</span>
                          <span className="text-gray-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Must Avoid */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-red-700">
                      <span>🚫</span> 금지 표현
                    </h3>
                    <div className="space-y-2">
                      {selectedTemplate.guardrails.mustAvoid.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg bg-red-50 p-3">
                          <span className="mt-0.5 text-red-500">✗</span>
                          <span className="text-gray-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legal Notes */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-700">
                      <span>⚖️</span> 법적 유의사항
                    </h3>
                    <div className="space-y-2">
                      {selectedTemplate.guardrails.legalNotes.map((note, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4"
                        >
                          <span className="mt-0.5 text-blue-500">📌</span>
                          <span className="text-gray-800">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Notes */}
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-yellow-700">
                      <span>⚠️</span> 컴플라이언스 체크포인트
                    </h3>
                    <div className="space-y-2">
                      {selectedTemplate.briefDefaults.complianceNotes.map((note, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg bg-yellow-50 p-3">
                          <span className="mt-0.5 text-yellow-600">!</span>
                          <span className="text-gray-800">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'samples' && (
                <div className="space-y-6">
                  {selectedTemplate.sampleCopies.map((copy, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 p-5">
                      <div className="mb-2 text-sm font-medium text-purple-600">{copy.type}</div>
                      <p className="text-xl leading-relaxed text-gray-900">{copy.text}</p>
                      <button className="mt-3 text-sm text-gray-500 hover:text-purple-600">
                        복사하기 📋
                      </button>
                    </div>
                  ))}

                  {/* Avoid Keywords */}
                  <div className="mt-8 rounded-xl bg-red-50 p-5">
                    <h4 className="mb-3 font-semibold text-red-700">🚫 사용 금지 키워드</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.briefDefaults.avoidKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700 line-through"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'best' && (
                <div className="space-y-4">
                  {selectedTemplate.bestPractices.map((practice, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4"
                    >
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="pt-1 text-gray-800">{practice}</p>
                    </div>
                  ))}

                  {/* Creative Direction */}
                  <div className="mt-8">
                    <h4 className="mb-4 font-semibold text-gray-900">🎬 크리에이티브 방향</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedTemplate.briefDefaults.creativeDirection.map((dir, i) => (
                        <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                          • {dir}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Apply Template Modal */}
      {showApplyModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">템플릿 적용</h2>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                <span className="text-4xl">{selectedTemplate.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{selectedTemplate.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedTemplate.category} · {selectedTemplate.duration}
                  </div>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    다음 설정이 자동으로 적용됩니다:
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      타겟 오디언스 {selectedTemplate.briefDefaults.targetAudience.length}개 설정
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      피부 고민 키워드 {selectedTemplate.briefDefaults.skinConcerns.length}개 설정
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>
                      주요 성분 {selectedTemplate.briefDefaults.keyIngredients.length}개 설정
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>추천 채널 및 KPI 목표 설정</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>가드레일 및 컴플라이언스 규칙 적용</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-xl bg-yellow-50 p-4">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600">💡</span>
                  <p className="text-sm text-yellow-800">
                    템플릿을 적용한 후에도 모든 설정을 자유롭게 수정할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  alert('템플릿이 적용되었습니다! 캠페인 생성 화면으로 이동합니다.');
                }}
                className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
              >
                적용하고 캠페인 만들기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
