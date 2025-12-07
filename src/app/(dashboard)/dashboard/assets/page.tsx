'use client';
import React, { useState } from 'react';

// Types
interface Review {
  id: string;
  content: string;
  source: string;
  rating: number;
  tags: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  hookingSentences: string[];
  createdAt: string;
}

interface Reference {
  id: string;
  title: string;
  url: string;
  type: 'competitor_ad' | 'influencer' | 'benchmark' | 'inspiration';
  platform: string;
  notes: string;
  thumbnail?: string;
  createdAt: string;
}

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'copy' | 'template';
  url: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
  fileSize?: string;
  dimensions?: string;
  duration?: string;
  content?: string;
  thumbnail?: string;
}

const sampleAssets: Asset[] = [
  {
    id: '1',
    name: '제품 메인컷_정면',
    type: 'image',
    url: '',
    tags: ['제품컷', '메인'],
    usageCount: 12,
    createdAt: '2024-01-15',
    fileSize: '2.4MB',
    dimensions: '1920x1080',
  },
  {
    id: '2',
    name: '텍스처 샷_크림',
    type: 'image',
    url: '',
    tags: ['텍스처', '크림'],
    usageCount: 8,
    createdAt: '2024-01-14',
    fileSize: '1.8MB',
    dimensions: '1080x1080',
  },
  {
    id: '3',
    name: '발림성 시연 영상',
    type: 'video',
    url: '',
    tags: ['발림성', '시연'],
    usageCount: 5,
    createdAt: '2024-01-13',
    fileSize: '45MB',
    duration: '0:15',
  },
  {
    id: '4',
    name: '헤드카피 모음',
    type: 'copy',
    url: '',
    tags: ['헤드카피', '보습'],
    usageCount: 15,
    createdAt: '2024-01-12',
    content: '촉촉함이 24시간, 피부가 마시는 수분 에센스',
  },
  {
    id: '5',
    name: '카드뉴스 템플릿 A',
    type: 'template',
    url: '',
    tags: ['카드뉴스', '인스타'],
    usageCount: 7,
    createdAt: '2024-01-11',
    dimensions: '1080x1350',
  },
  {
    id: '6',
    name: '비포애프터 이미지',
    type: 'image',
    url: '',
    tags: ['비포애프터', '효과'],
    usageCount: 10,
    createdAt: '2024-01-10',
    fileSize: '3.1MB',
    dimensions: '1920x1080',
  },
];

// Sample Data
const sampleReviews: Review[] = [
  {
    id: '1',
    content:
      '바르자마자 흡수가 너무 빨라서 깜짝 놀랐어요! 끈적임 없이 촉촉하게 마무리되고, 다음날 아침까지 보습이 유지돼요. 민감성 피부인데 자극 하나도 없었습니다.',
    source: '올리브영',
    rating: 5,
    tags: ['흡수', '보습', '자극없음'],
    sentiment: 'positive',
    hookingSentences: [
      '바르자마자 흡수가 너무 빨라서 깜짝 놀랐어요!',
      '다음날 아침까지 보습이 유지돼요',
    ],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    content:
      '진정 효과가 확실해요. 트러블 났을 때 바르면 다음날 가라앉아 있어요. 가성비도 좋고 용량도 넉넉해서 팍팍 쓸 수 있어요.',
    source: '화해',
    rating: 5,
    tags: ['진정', '트러블', '가성비'],
    sentiment: 'positive',
    hookingSentences: ['트러블 났을 때 바르면 다음날 가라앉아 있어요'],
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    content:
      '향이 너무 강해서 좀 별로였어요. 보습력은 괜찮은데 예민한 날에는 따갑기도 했습니다. 가격 대비 용량이 적은 것 같아요.',
    source: '네이버',
    rating: 2,
    tags: ['향', '자극'],
    sentiment: 'negative',
    hookingSentences: [],
    createdAt: '2024-01-13',
  },
];

const sampleReferences: Reference[] = [
  {
    id: '1',
    title: '라네즈 워터뱅크 광고',
    url: 'https://youtube.com/watch?v=example1',
    type: 'competitor_ad',
    platform: 'YouTube',
    notes: '수분감 강조, 파란색 톤, 물방울 모션그래픽 활용',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    title: '뷰티 인플루언서 리뷰 - 이사배',
    url: 'https://youtube.com/watch?v=example2',
    type: 'influencer',
    platform: 'YouTube',
    notes: '솔직 리뷰 컨셉, 비포애프터 비교, 4분 분량',
    createdAt: '2024-01-08',
  },
];

const beautyTags = [
  '흡수',
  '보습',
  '진정',
  '자극없음',
  '가성비',
  '트러블',
  '향',
  '발림성',
  '지속력',
  '피부결',
  '톤업',
  '광채',
  '탄력',
  '모공',
  '각질',
];

export default function AssetsManagement() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'references' | 'assets'>('reviews');
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [references, setReferences] = useState<Reference[]>(sampleReferences);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalType, setAIModalType] = useState<'hooking' | 'faq'>('hooking');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReference, setNewReference] = useState({
    title: '',
    url: '',
    type: 'competitor_ad' as const,
    platform: '',
    notes: '',
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<
    'all' | 'positive' | 'negative' | 'neutral'
  >('all');

  // AI Generated Content
  const [generatedHookings, setGeneratedHookings] = useState<string[]>([]);
  const [generatedFAQs, setGeneratedFAQs] = useState<{ question: string; answer: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Asset States
  const [assets, setAssets] = useState<Asset[]>(sampleAssets);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showAssetDetailModal, setShowAssetDetailModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetTypeFilter, setAssetTypeFilter] = useState<
    'all' | 'image' | 'video' | 'copy' | 'template'
  >('all');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'copy'>('file');
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: 'image' as Asset['type'],
    tags: [] as string[],
    content: '',
    files: [] as File[],
  });
  const [dragActive, setDragActive] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const tabs = [
    { id: 'reviews', label: '리뷰 관리', icon: '💬', count: reviews.length },
    { id: 'references', label: '레퍼런스', icon: '🔗', count: references.length },
    { id: 'assets', label: '소재 라이브러리', icon: '📁', count: 12 },
  ];

  // Review Analysis
  const analyzeAndAddReviews = () => {
    if (!newReviewText.trim()) return;

    const reviewLines = newReviewText.split('\n').filter((line) => line.trim());
    const newReviews: Review[] = reviewLines.map((content, idx) => {
      const detectedTags = beautyTags.filter((tag) => content.includes(tag));
      const hasNegativeWords = ['별로', '아쉽', '실망', '안좋', '따갑', '자극'].some((word) =>
        content.includes(word)
      );

      return {
        id: `new-${Date.now()}-${idx}`,
        content,
        source: '직접입력',
        rating: hasNegativeWords ? 2 : 4,
        tags: detectedTags.length > 0 ? detectedTags : ['미분류'],
        sentiment: hasNegativeWords ? 'negative' : 'positive',
        hookingSentences: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
    });

    setReviews([...newReviews, ...reviews]);
    setNewReviewText('');
    setShowReviewModal(false);
  };

  // AI: Extract Hooking Sentences
  const generateHookingSentences = () => {
    setIsGenerating(true);
    setAIModalType('hooking');
    setShowAIModal(true);

    setTimeout(() => {
      const hookings = [
        '바르자마자 피부가 마시는 느낌!',
        '다음날 아침, 거울 보고 깜짝 놀랐어요',
        '트러블이 하룻밤 만에 잠잠해졌어요',
        '끈적임 제로, 흡수력 100점',
        '민감성인 제가 인정한 저자극 제품',
        '가성비 끝판왕, 팍팍 써도 아깝지 않아요',
        '피부결이 달라지는 게 눈에 보여요',
        '수분크림 10개 써봤지만 이게 1등',
        '건조함? 이제 그게 뭔지 모르겠어요',
        '화장이 들뜨던 피부가 촉촉 광채 피부로!',
        '자극 없이 진정되는 마법 같은 경험',
        '아침까지 촉촉함이 유지되는 건 처음이에요',
        '예민한 날에도 안심하고 바를 수 있어요',
        '용량 대비 가격, 이 정도면 혜자예요',
        '피부과 다녀온 것 같은 진정 효과',
      ];
      setGeneratedHookings(hookings);
      setIsGenerating(false);
    }, 1500);
  };

  // AI: Generate FAQ from Negative Reviews
  const generateFAQFromNegative = () => {
    setIsGenerating(true);
    setAIModalType('faq');
    setShowAIModal(true);

    setTimeout(() => {
      const faqs = [
        {
          question: '향이 강하다는 리뷰가 있던데, 실제로 그런가요?',
          answer:
            '자연 유래 성분의 은은한 허브향이 있습니다. 대부분의 고객님께서는 "향긋하다", "기분 좋은 향"이라고 평가해주셨어요. 향에 민감하신 분들을 위해 무향 라인도 준비 중입니다.',
        },
        {
          question: '민감한 피부에 자극이 있을 수 있나요?',
          answer:
            '저자극 테스트를 완료한 제품입니다. 다만 개인 피부 상태에 따라 반응이 다를 수 있어요. 처음 사용 시 소량으로 패치 테스트 후 사용을 권장드립니다.',
        },
        {
          question: '용량 대비 가격이 비싸다는 의견이 있어요.',
          answer:
            '고농축 포뮬러로 소량만 사용해도 충분한 효과를 느끼실 수 있습니다. 실제 사용 기간으로 계산하면 오히려 가성비가 좋다는 후기가 많아요. 1회 사용량 기준 약 3개월 사용 가능합니다.',
        },
        {
          question: '흡수가 느리다는 리뷰도 보이는데요?',
          answer:
            '피부 타입에 따라 흡수 속도가 다를 수 있습니다. 지성 피부의 경우 가볍게 두드려 흡수시키면 더 빠르게 흡수됩니다. 토너 사용 직후 바르시면 흡수가 더 잘 됩니다.',
        },
      ];
      setGeneratedFAQs(faqs);
      setIsGenerating(false);
    }, 2000);
  };

  // Add Reference
  const addReference = () => {
    if (!newReference.title || !newReference.url) return;

    const ref: Reference = {
      id: `ref-${Date.now()}`,
      ...newReference,
      type: newReference.type as Reference['type'],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReferences([ref, ...references]);
    setNewReference({ title: '', url: '', type: 'competitor_ad', platform: '', notes: '' });
    setShowReferenceModal(false);
  };

  // Filter Reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = sentimentFilter === 'all' || review.sentiment === sentimentFilter;
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => review.tags.includes(tag));
    return matchesSearch && matchesSentiment && matchesTags;
  });

  const positiveCount = reviews.filter((r) => r.sentiment === 'positive').length;
  const negativeCount = reviews.filter((r) => r.sentiment === 'negative').length;

  // Asset Functions
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    if (validFiles.length > 0) {
      const firstFile = validFiles[0];
      const fileType = firstFile.type.startsWith('video/') ? 'video' : 'image';
      setNewAsset((prev) => ({
        ...prev,
        files: validFiles,
        type: fileType,
        name: prev.name || firstFile.name.replace(/\.[^/.]+$/, ''),
      }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const addAssetTag = () => {
    if (newTagInput.trim() && !newAsset.tags.includes(newTagInput.trim())) {
      setNewAsset((prev) => ({ ...prev, tags: [...prev.tags, newTagInput.trim()] }));
      setNewTagInput('');
    }
  };

  const removeAssetTag = (tag: string) => {
    setNewAsset((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const uploadAssets = () => {
    if (uploadType === 'file') {
      if (newAsset.files.length === 0) return;

      const newAssets: Asset[] = newAsset.files.map((file, idx) => ({
        id: `asset-${Date.now()}-${idx}`,
        name: newAsset.files.length === 1 ? newAsset.name : `${newAsset.name}_${idx + 1}`,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        tags: newAsset.tags,
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        fileSize: formatFileSize(file.size),
        dimensions: newAsset.type === 'image' ? '자동 감지 중...' : undefined,
        duration: newAsset.type === 'video' ? '자동 감지 중...' : undefined,
      }));

      setAssets([...newAssets, ...assets]);
    } else {
      if (!newAsset.name || !newAsset.content) return;

      const copyAsset: Asset = {
        id: `asset-${Date.now()}`,
        name: newAsset.name,
        type: newAsset.type as 'copy' | 'template',
        url: '',
        tags: newAsset.tags,
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        content: newAsset.content,
      };

      setAssets([copyAsset, ...assets]);
    }

    setNewAsset({ name: '', type: 'image', tags: [], content: '', files: [] });
    setShowAssetModal(false);
  };

  const openAssetDetail = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAssetDetailModal(true);
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
    setShowAssetDetailModal(false);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesType = assetTypeFilter === 'all' || asset.type === assetTypeFilter;
    const matchesSearch =
      asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(assetSearchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const assetTypeStats = {
    image: assets.filter((a) => a.type === 'image').length,
    video: assets.filter((a) => a.type === 'video').length,
    copy: assets.filter((a) => a.type === 'copy').length,
    template: assets.filter((a) => a.type === 'template').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">소재/자산 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              리뷰, 레퍼런스, 크리에이티브 소재를 한곳에서 관리하세요
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={generateHookingSentences}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
            >
              <span>✨</span>
              후킹 문장 추출
            </button>
            <button
              onClick={generateFAQFromNegative}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
            >
              <span>💡</span>
              FAQ 생성
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="p-6">
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Stats & Filters */}
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
                <div className="text-sm text-gray-500">전체 리뷰</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-bold text-green-600">{positiveCount}</div>
                <div className="text-sm text-gray-500">긍정 리뷰</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-bold text-red-500">{negativeCount}</div>
                <div className="text-sm text-gray-500">부정 리뷰</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {reviews.reduce((acc, r) => acc + r.hookingSentences.length, 0)}
                </div>
                <div className="text-sm text-gray-500">후킹 문장</div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-[200px] flex-1">
                  <input
                    type="text"
                    placeholder="리뷰 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'positive', 'negative'].map((sentiment) => (
                    <button
                      key={sentiment}
                      onClick={() => setSentimentFilter(sentiment as any)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        sentimentFilter === sentiment
                          ? sentiment === 'positive'
                            ? 'bg-green-100 text-green-700'
                            : sentiment === 'negative'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sentiment === 'all' ? '전체' : sentiment === 'positive' ? '긍정' : '부정'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                >
                  + 리뷰 추가
                </button>
              </div>

              {/* Tag Filter */}
              <div className="mt-4 flex flex-wrap gap-2">
                {beautyTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedTags(
                        selectedTags.includes(tag)
                          ? selectedTags.filter((t) => t !== tag)
                          : [...selectedTags, tag]
                      )
                    }
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            review.sentiment === 'positive'
                              ? 'bg-green-100 text-green-700'
                              : review.sentiment === 'negative'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {review.sentiment === 'positive'
                            ? '😊 긍정'
                            : review.sentiment === 'negative'
                              ? '😞 부정'
                              : '😐 중립'}
                        </span>
                        <span className="text-sm text-gray-500">{review.source}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{review.createdAt}</span>
                      </div>
                      <p className="leading-relaxed text-gray-800">{review.content}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-purple-50 px-2 py-1 text-xs text-purple-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {review.hookingSentences.length > 0 && (
                        <div className="mt-3 rounded-lg bg-yellow-50 p-3">
                          <div className="mb-1 text-xs font-medium text-yellow-700">
                            ✨ 추출된 후킹 문장
                          </div>
                          {review.hookingSentences.map((sentence, idx) => (
                            <div key={idx} className="text-sm text-yellow-800">
                              "{sentence}"
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'references' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">레퍼런스 라이브러리</h2>
              <button
                onClick={() => setShowReferenceModal(true)}
                className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
              >
                + 레퍼런스 추가
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {references.map((ref) => (
                <div
                  key={ref.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <span className="text-4xl">
                      {ref.type === 'competitor_ad'
                        ? '📺'
                        : ref.type === 'influencer'
                          ? '👤'
                          : '💡'}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          ref.type === 'competitor_ad'
                            ? 'bg-blue-100 text-blue-700'
                            : ref.type === 'influencer'
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {ref.type === 'competitor_ad'
                          ? '경쟁사 광고'
                          : ref.type === 'influencer'
                            ? '인플루언서'
                            : '벤치마크'}
                      </span>
                      <span className="text-xs text-gray-500">{ref.platform}</span>
                    </div>
                    <h3 className="mb-2 font-medium text-gray-900">{ref.title}</h3>
                    <p className="line-clamp-2 text-sm text-gray-600">{ref.notes}</p>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                    >
                      링크 열기 →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-6">
            {/* Asset Stats */}
            <div className="grid grid-cols-5 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-2xl font-bold text-gray-900">{assets.length}</div>
                <div className="text-sm text-gray-500">전체 소재</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🖼️</span>
                  <div className="text-2xl font-bold text-blue-600">{assetTypeStats.image}</div>
                </div>
                <div className="text-sm text-gray-500">이미지</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎬</span>
                  <div className="text-2xl font-bold text-red-500">{assetTypeStats.video}</div>
                </div>
                <div className="text-sm text-gray-500">비디오</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  <div className="text-2xl font-bold text-green-600">{assetTypeStats.copy}</div>
                </div>
                <div className="text-sm text-gray-500">카피</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  <div className="text-2xl font-bold text-purple-600">
                    {assetTypeStats.template}
                  </div>
                </div>
                <div className="text-sm text-gray-500">템플릿</div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-[200px] flex-1">
                  <input
                    type="text"
                    placeholder="소재 검색 (이름, 태그)..."
                    value={assetSearchQuery}
                    onChange={(e) => setAssetSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: '전체', icon: '📁' },
                    { id: 'image', label: '이미지', icon: '🖼️' },
                    { id: 'video', label: '비디오', icon: '🎬' },
                    { id: 'copy', label: '카피', icon: '📝' },
                    { id: 'template', label: '템플릿', icon: '📋' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setAssetTypeFilter(type.id as any)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        assetTypeFilter === type.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{type.icon}</span>
                      {type.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAssetModal(true)}
                  className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                >
                  + 소재 업로드
                </button>
              </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => openAssetDetail(asset)}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg"
                >
                  <div
                    className={`relative flex h-32 items-center justify-center ${
                      asset.type === 'image'
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100'
                        : asset.type === 'video'
                          ? 'bg-gradient-to-br from-red-50 to-red-100'
                          : asset.type === 'copy'
                            ? 'bg-gradient-to-br from-green-50 to-green-100'
                            : 'bg-gradient-to-br from-purple-50 to-purple-100'
                    }`}
                  >
                    {asset.url ? (
                      asset.type === 'video' ? (
                        <div className="relative h-full w-full">
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <span className="text-4xl">▶️</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <span className="text-4xl">
                        {asset.type === 'image'
                          ? '🖼️'
                          : asset.type === 'video'
                            ? '🎬'
                            : asset.type === 'copy'
                              ? '📝'
                              : '📋'}
                      </span>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          asset.type === 'image'
                            ? 'bg-blue-500 text-white'
                            : asset.type === 'video'
                              ? 'bg-red-500 text-white'
                              : asset.type === 'copy'
                                ? 'bg-green-500 text-white'
                                : 'bg-purple-500 text-white'
                        }`}
                      >
                        {asset.type === 'image'
                          ? '이미지'
                          : asset.type === 'video'
                            ? '비디오'
                            : asset.type === 'copy'
                              ? '카피'
                              : '템플릿'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="truncate text-sm font-medium text-gray-900">{asset.name}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-purple-50 px-1.5 py-0.5 text-xs text-purple-600"
                          >
                            #{tag}
                          </span>
                        ))}
                        {asset.tags.length > 2 && (
                          <span className="text-xs text-gray-400">+{asset.tags.length - 2}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">사용 {asset.usageCount}회</span>
                    </div>
                    {asset.fileSize && (
                      <div className="mt-1 text-xs text-gray-400">{asset.fileSize}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredAssets.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <div className="mb-3 text-4xl">📭</div>
                  <div className="text-gray-500">검색 결과가 없습니다</div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Review Add Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">리뷰 추가</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  리뷰 붙여넣기 (줄바꿈으로 구분)
                </label>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="리뷰를 붙여넣으세요. 각 줄이 하나의 리뷰로 인식됩니다.&#10;&#10;예시:&#10;바르자마자 흡수가 너무 빨라요!&#10;보습력이 정말 좋아요, 하루종일 촉촉해요."
                  className="h-48 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="mb-2 flex items-center gap-2 font-medium text-purple-700">
                  <span>✨</span> AI 자동 분석
                </div>
                <p className="text-sm text-purple-600">
                  리뷰 추가 시 자동으로 감성 분석, 키워드 태깅, 후킹 문장 추출이 진행됩니다.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={analyzeAndAddReviews}
                className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700"
              >
                분석 및 추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reference Add Modal */}
      {showReferenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">레퍼런스 추가</h2>
                <button
                  onClick={() => setShowReferenceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">제목</label>
                <input
                  type="text"
                  value={newReference.title}
                  onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="레퍼런스 제목"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={newReference.url}
                  onChange={(e) => setNewReference({ ...newReference, url: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">유형</label>
                  <select
                    value={newReference.type}
                    onChange={(e) =>
                      setNewReference({ ...newReference, type: e.target.value as any })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="competitor_ad">경쟁사 광고</option>
                    <option value="influencer">인플루언서</option>
                    <option value="benchmark">벤치마크</option>
                    <option value="inspiration">영감</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">플랫폼</label>
                  <input
                    type="text"
                    value={newReference.platform}
                    onChange={(e) => setNewReference({ ...newReference, platform: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="YouTube, Instagram..."
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">메모</label>
                <textarea
                  value={newReference.notes}
                  onChange={(e) => setNewReference({ ...newReference, notes: e.target.value })}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="참고할 포인트, 특징 등"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowReferenceModal(false)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={addReference}
                className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generated Content Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {aiModalType === 'hooking' ? '✨ AI 후킹 문장 추출' : '💡 AI FAQ/반박 카피 생성'}
                </h2>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                  <p className="text-gray-600">AI가 분석 중입니다...</p>
                </div>
              ) : aiModalType === 'hooking' ? (
                <div className="space-y-3">
                  <p className="mb-4 text-sm text-gray-500">
                    총 {generatedHookings.length}개의 후킹 문장이 추출되었습니다.
                  </p>
                  {generatedHookings.map((sentence, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between rounded-lg bg-yellow-50 p-3"
                    >
                      <span className="text-gray-800">"{sentence}"</span>
                      <button className="rounded bg-purple-600 px-3 py-1 text-sm text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-purple-700">
                        복사
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="mb-4 text-sm text-gray-500">
                    부정 리뷰 기반 {generatedFAQs.length}개의 FAQ가 생성되었습니다.
                  </p>
                  {generatedFAQs.map((faq, idx) => (
                    <div key={idx} className="rounded-lg bg-orange-50 p-4">
                      <div className="mb-2 font-medium text-orange-800">Q. {faq.question}</div>
                      <div className="text-sm text-gray-700">A. {faq.answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowAIModal(false)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                닫기
              </button>
              {!isGenerating && (
                <button className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700">
                  전체 복사
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Asset Upload Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">소재 업로드</h2>
                <button
                  onClick={() => setShowAssetModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Upload Type Toggle */}
              <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setUploadType('file')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    uploadType === 'file' ? 'bg-white text-gray-900 shadow' : 'text-gray-500'
                  }`}
                >
                  🖼️ 파일 업로드
                </button>
                <button
                  onClick={() => setUploadType('copy')}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    uploadType === 'copy' ? 'bg-white text-gray-900 shadow' : 'text-gray-500'
                  }`}
                >
                  📝 카피/템플릿
                </button>
              </div>

              {uploadType === 'file' ? (
                <>
                  {/* Drag & Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="mb-3 text-4xl">📤</div>
                      <div className="mb-1 font-medium text-gray-700">
                        파일을 드래그하거나 클릭하여 업로드
                      </div>
                      <div className="text-sm text-gray-500">
                        이미지 (JPG, PNG, GIF) 또는 비디오 (MP4, MOV) 지원
                      </div>
                    </label>
                  </div>

                  {/* Selected Files */}
                  {newAsset.files.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">
                        선택된 파일 ({newAsset.files.length}개)
                      </div>
                      <div className="max-h-32 space-y-2 overflow-auto">
                        {newAsset.files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">
                                {file.type.startsWith('video/') ? '🎬' : '🖼️'}
                              </span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                <div className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setNewAsset((prev) => ({
                                  ...prev,
                                  files: prev.files.filter((_, i) => i !== idx),
                                }))
                              }
                              className="text-gray-400 hover:text-red-500"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Copy/Template Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">유형</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewAsset((prev) => ({ ...prev, type: 'copy' }))}
                        className={`flex-1 rounded-lg border-2 px-4 py-3 transition-colors ${
                          newAsset.type === 'copy'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="mb-1 text-xl">📝</div>
                        <div className="font-medium">카피</div>
                        <div className="text-xs text-gray-500">헤드카피, 바디카피</div>
                      </button>
                      <button
                        onClick={() => setNewAsset((prev) => ({ ...prev, type: 'template' }))}
                        className={`flex-1 rounded-lg border-2 px-4 py-3 transition-colors ${
                          newAsset.type === 'template'
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="mb-1 text-xl">📋</div>
                        <div className="font-medium">템플릿</div>
                        <div className="text-xs text-gray-500">카드뉴스, 광고 템플릿</div>
                      </button>
                    </div>
                  </div>

                  {/* Content Input */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">내용</label>
                    <textarea
                      value={newAsset.content}
                      onChange={(e) =>
                        setNewAsset((prev) => ({ ...prev, content: e.target.value }))
                      }
                      placeholder={
                        newAsset.type === 'copy'
                          ? '예: 촉촉함이 24시간, 피부가 마시는 수분 에센스'
                          : '템플릿 설명 또는 구조를 입력하세요...'
                      }
                      className="h-32 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </>
              )}

              {/* Asset Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">소재 이름</label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="소재 이름을 입력하세요"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">태그</label>
                <div className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAssetTag())}
                    placeholder="태그 입력 후 Enter"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={addAssetTag}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newAsset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
                    >
                      #{tag}
                      <button onClick={() => removeAssetTag(tag)} className="hover:text-purple-900">
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                {/* Quick Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="mr-2 text-xs text-gray-500">추천:</span>
                  {[
                    '제품컷',
                    '텍스처',
                    '모델',
                    '성분',
                    '효과',
                    '비포애프터',
                    '카드뉴스',
                    '인스타',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        !newAsset.tags.includes(tag) &&
                        setNewAsset((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
                      }
                      disabled={newAsset.tags.includes(tag)}
                      className={`rounded-full px-2 py-1 text-xs transition-colors ${
                        newAsset.tags.includes(tag)
                          ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => {
                  setShowAssetModal(false);
                  setNewAsset({ name: '', type: 'image', tags: [], content: '', files: [] });
                }}
                className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={uploadAssets}
                disabled={
                  (uploadType === 'file' && newAsset.files.length === 0) ||
                  (uploadType === 'copy' && !newAsset.content)
                }
                className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Detail Modal */}
      {showAssetDetailModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-lg px-3 py-1 text-sm font-medium ${
                      selectedAsset.type === 'image'
                        ? 'bg-blue-100 text-blue-700'
                        : selectedAsset.type === 'video'
                          ? 'bg-red-100 text-red-700'
                          : selectedAsset.type === 'copy'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {selectedAsset.type === 'image'
                      ? '🖼️ 이미지'
                      : selectedAsset.type === 'video'
                        ? '🎬 비디오'
                        : selectedAsset.type === 'copy'
                          ? '📝 카피'
                          : '📋 템플릿'}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">{selectedAsset.name}</h2>
                </div>
                <button
                  onClick={() => setShowAssetDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Preview */}
              <div
                className={`flex h-64 items-center justify-center rounded-xl ${
                  selectedAsset.type === 'image'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100'
                    : selectedAsset.type === 'video'
                      ? 'bg-gradient-to-br from-red-50 to-red-100'
                      : selectedAsset.type === 'copy'
                        ? 'bg-gradient-to-br from-green-50 to-green-100'
                        : 'bg-gradient-to-br from-purple-50 to-purple-100'
                }`}
              >
                {selectedAsset.url ? (
                  selectedAsset.type === 'video' ? (
                    <video src={selectedAsset.url} controls className="max-h-full rounded-lg" />
                  ) : (
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.name}
                      className="max-h-full rounded-lg object-contain"
                    />
                  )
                ) : selectedAsset.content ? (
                  <div className="p-6 text-center">
                    <div className="text-lg text-gray-800 italic">"{selectedAsset.content}"</div>
                  </div>
                ) : (
                  <span className="text-6xl">
                    {selectedAsset.type === 'image'
                      ? '🖼️'
                      : selectedAsset.type === 'video'
                        ? '🎬'
                        : selectedAsset.type === 'copy'
                          ? '📝'
                          : '📋'}
                  </span>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-1 text-sm text-gray-500">등록일</div>
                  <div className="font-medium">{selectedAsset.createdAt}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-1 text-sm text-gray-500">사용 횟수</div>
                  <div className="font-medium">{selectedAsset.usageCount}회</div>
                </div>
                {selectedAsset.fileSize && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-1 text-sm text-gray-500">파일 크기</div>
                    <div className="font-medium">{selectedAsset.fileSize}</div>
                  </div>
                )}
                {selectedAsset.dimensions && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-1 text-sm text-gray-500">해상도</div>
                    <div className="font-medium">{selectedAsset.dimensions}</div>
                  </div>
                )}
                {selectedAsset.duration && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-1 text-sm text-gray-500">재생 시간</div>
                    <div className="font-medium">{selectedAsset.duration}</div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <div className="mb-2 text-sm font-medium text-gray-700">태그</div>
                <div className="flex flex-wrap gap-2">
                  {selectedAsset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between border-t border-gray-200 p-6">
              <button
                onClick={() => deleteAsset(selectedAsset.id)}
                className="rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
              >
                삭제
              </button>
              <div className="flex gap-3">
                <button className="rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100">
                  수정
                </button>
                <button className="rounded-lg bg-purple-600 px-6 py-2 text-white transition-colors hover:bg-purple-700">
                  캠페인에 사용
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
