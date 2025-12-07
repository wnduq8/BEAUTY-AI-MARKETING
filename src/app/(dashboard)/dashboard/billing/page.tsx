'use client';
import React, { useState } from 'react';

// Types
interface Plan {
  id: string;
  name: string;
  price: number;
  priceYearly: number;
  description: string;
  features: string[];
  limits: {
    aiGenerations: number;
    exports: number;
    projects: number;
    teamMembers: number;
    storage: string;
  };
  highlighted?: boolean;
  badge?: string;
}

interface UsageData {
  aiGenerations: { used: number; limit: number };
  exports: { used: number; limit: number };
  projects: { used: number; limit: number };
  teamMembers: { used: number; limit: number };
  storage: { used: number; limit: number; unit: string };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

// Plans Data
const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    description: '뷰티 마케팅을 시작하는 분들을 위한 무료 플랜',
    features: [
      'AI 카피 생성 10회/월',
      'PDF Export 3회/월',
      '프로젝트 2개',
      '기본 템플릿 접근',
      '커뮤니티 지원',
    ],
    limits: { aiGenerations: 10, exports: 3, projects: 2, teamMembers: 1, storage: '100MB' },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29000,
    priceYearly: 290000,
    description: '소규모 브랜드와 프리랜서를 위한 플랜',
    features: [
      'AI 카피 생성 100회/월',
      'PDF Export 20회/월',
      '프로젝트 10개',
      '모든 템플릿 접근',
      '컴플라이언스 체크',
      '이메일 지원',
    ],
    limits: { aiGenerations: 100, exports: 20, projects: 10, teamMembers: 2, storage: '1GB' },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79000,
    priceYearly: 790000,
    description: '성장하는 뷰티 브랜드를 위한 프로 플랜',
    features: [
      'AI 카피 생성 500회/월',
      'PDF Export 무제한',
      '프로젝트 무제한',
      '팀 멤버 5명',
      '고급 분석 리포트',
      'A/B 테스트 기능',
      '우선 지원',
      'API 접근',
    ],
    limits: { aiGenerations: 500, exports: -1, projects: -1, teamMembers: 5, storage: '10GB' },
    highlighted: true,
    badge: '인기',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: -1,
    priceYearly: -1,
    description: '대형 브랜드와 에이전시를 위한 맞춤 플랜',
    features: [
      'AI 카피 생성 무제한',
      '모든 기능 무제한',
      '팀 멤버 무제한',
      '전담 매니저',
      '맞춤 온보딩',
      'SLA 보장',
      '커스텀 인테그레이션',
      '화이트라벨 옵션',
    ],
    limits: { aiGenerations: -1, exports: -1, projects: -1, teamMembers: -1, storage: '무제한' },
    badge: '맞춤',
  },
];

// Sample Data
const currentPlan = plans[2]; // Pro plan
const billingCycle: 'monthly' | 'yearly' = 'monthly';
const nextBillingDate = '2024-02-15';

const usageData: UsageData = {
  aiGenerations: { used: 342, limit: 500 },
  exports: { used: 18, limit: -1 },
  projects: { used: 7, limit: -1 },
  teamMembers: { used: 3, limit: 5 },
  storage: { used: 2.4, limit: 10, unit: 'GB' },
};

const invoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    date: '2024-01-15',
    amount: 79000,
    status: 'paid',
    description: 'Pro 플랜 - 1월',
  },
  {
    id: 'INV-2023-012',
    date: '2023-12-15',
    amount: 79000,
    status: 'paid',
    description: 'Pro 플랜 - 12월',
  },
  {
    id: 'INV-2023-011',
    date: '2023-11-15',
    amount: 79000,
    status: 'paid',
    description: 'Pro 플랜 - 11월',
  },
  {
    id: 'INV-2023-010',
    date: '2023-10-15',
    amount: 29000,
    status: 'paid',
    description: 'Starter 플랜 - 10월',
  },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'invoices'>('overview');
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatCurrency = (amount: number) => {
    if (amount === -1) return '문의';
    return `₩${amount.toLocaleString()}`;
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-purple-500';
  };

  const openUpgradeModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const daysUntilBilling = Math.ceil(
    (new Date(nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">결제 및 플랜</h1>
            <p className="mt-1 text-sm text-gray-500">
              플랜 관리, 사용량 확인, 결제 내역을 관리하세요
            </p>
          </div>
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50">
            고객센터 문의
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-1">
          {[
            { id: 'overview', label: '개요', icon: '📊' },
            { id: 'plans', label: '플랜 비교', icon: '💎' },
            { id: 'invoices', label: '결제 내역', icon: '🧾' },
          ].map((tab) => (
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
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Plan Card */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-2xl">💎</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm">현재 플랜</span>
                  </div>
                  <h2 className="mb-1 text-3xl font-bold">{currentPlan.name}</h2>
                  <p className="text-white/80">{currentPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{formatCurrency(currentPlan.price)}</div>
                  <div className="text-sm text-white/70">/ 월</div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-6">
                <div>
                  <div className="text-sm text-white/70">다음 결제일</div>
                  <div className="font-semibold">
                    {nextBillingDate} ({daysUntilBilling}일 후)
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="rounded-lg px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    플랜 취소
                  </button>
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="rounded-lg bg-white px-4 py-2 font-medium text-purple-600 transition-colors hover:bg-white/90"
                  >
                    플랜 변경
                  </button>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">이번 달 사용량</h3>
                <span className="text-sm text-gray-500">리셋: {nextBillingDate}</span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* AI Generations */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✨</span>
                      <span className="font-medium text-gray-900">AI 생성</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageData.aiGenerations.used} /{' '}
                      {usageData.aiGenerations.limit === -1
                        ? '무제한'
                        : usageData.aiGenerations.limit}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${getUsageColor(getUsagePercentage(usageData.aiGenerations.used, usageData.aiGenerations.limit))} transition-all`}
                      style={{
                        width: `${getUsagePercentage(usageData.aiGenerations.used, usageData.aiGenerations.limit)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {usageData.aiGenerations.limit - usageData.aiGenerations.used}회 남음
                  </div>
                </div>

                {/* Exports */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📄</span>
                      <span className="font-medium text-gray-900">PDF Export</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageData.exports.used} /{' '}
                      {usageData.exports.limit === -1 ? '무제한' : usageData.exports.limit}
                    </span>
                  </div>
                  {usageData.exports.limit === -1 ? (
                    <div className="h-2 rounded-full bg-purple-200">
                      <div className="h-full w-full rounded-full bg-purple-500" />
                    </div>
                  ) : (
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full ${getUsageColor(getUsagePercentage(usageData.exports.used, usageData.exports.limit))}`}
                        style={{
                          width: `${getUsagePercentage(usageData.exports.used, usageData.exports.limit)}%`,
                        }}
                      />
                    </div>
                  )}
                  <div className="mt-2 text-xs text-purple-600">✓ 무제한 사용 가능</div>
                </div>

                {/* Projects */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📁</span>
                      <span className="font-medium text-gray-900">프로젝트</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageData.projects.used} /{' '}
                      {usageData.projects.limit === -1 ? '무제한' : usageData.projects.limit}
                    </span>
                  </div>
                  {usageData.projects.limit === -1 ? (
                    <div className="h-2 rounded-full bg-purple-200">
                      <div className="h-full w-full rounded-full bg-purple-500" />
                    </div>
                  ) : (
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full ${getUsageColor(getUsagePercentage(usageData.projects.used, usageData.projects.limit))}`}
                        style={{
                          width: `${getUsagePercentage(usageData.projects.used, usageData.projects.limit)}%`,
                        }}
                      />
                    </div>
                  )}
                  <div className="mt-2 text-xs text-purple-600">✓ 무제한 사용 가능</div>
                </div>

                {/* Team Members */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👥</span>
                      <span className="font-medium text-gray-900">팀 멤버</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageData.teamMembers.used} / {usageData.teamMembers.limit}명
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${getUsageColor(getUsagePercentage(usageData.teamMembers.used, usageData.teamMembers.limit))}`}
                      style={{
                        width: `${getUsagePercentage(usageData.teamMembers.used, usageData.teamMembers.limit)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {usageData.teamMembers.limit - usageData.teamMembers.used}명 추가 가능
                  </div>
                </div>

                {/* Storage */}
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💾</span>
                      <span className="font-medium text-gray-900">저장 공간</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {usageData.storage.used} / {usageData.storage.limit}
                      {usageData.storage.unit}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full ${getUsageColor(getUsagePercentage(usageData.storage.used, usageData.storage.limit))}`}
                      style={{
                        width: `${getUsagePercentage(usageData.storage.used, usageData.storage.limit)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {(usageData.storage.limit - usageData.storage.used).toFixed(1)}
                    {usageData.storage.unit} 남음
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            {currentPlan.id !== 'enterprise' && (
              <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">🚀</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">더 많은 기능이 필요하신가요?</h3>
                      <p className="text-sm text-gray-600">
                        Enterprise 플랜으로 업그레이드하고 무제한으로 사용하세요
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openUpgradeModal(plans[3])}
                    className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-yellow-600 hover:to-orange-600"
                  >
                    Enterprise 문의하기
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">결제 수단</h3>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-800 text-xs font-bold text-white">
                    VISA
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">•••• •••• •••• 4242</div>
                    <div className="text-sm text-gray-500">만료: 12/25</div>
                  </div>
                </div>
                <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                  변경
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-xl bg-gray-100 p-1">
                <button
                  onClick={() => setSelectedCycle('monthly')}
                  className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                    selectedCycle === 'monthly' ? 'bg-white text-gray-900 shadow' : 'text-gray-500'
                  }`}
                >
                  월간 결제
                </button>
                <button
                  onClick={() => setSelectedCycle('yearly')}
                  className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                    selectedCycle === 'yearly' ? 'bg-white text-gray-900 shadow' : 'text-gray-500'
                  }`}
                >
                  연간 결제
                  <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    2개월 무료
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border-2 bg-white p-6 transition-all ${
                    plan.highlighted
                      ? 'scale-105 border-purple-500 shadow-xl'
                      : plan.id === currentPlan.id
                        ? 'border-purple-300'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold ${
                        plan.highlighted ? 'bg-purple-600 text-white' : 'bg-gray-800 text-white'
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  {plan.id === currentPlan.id && (
                    <div className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                      현재 플랜
                    </div>
                  )}

                  <div className="mb-6 text-center">
                    <h3 className="mb-1 text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900">
                      {plan.price === -1
                        ? '맞춤'
                        : formatCurrency(
                            selectedCycle === 'monthly' ? plan.price : plan.priceYearly
                          )}
                    </div>
                    {plan.price !== -1 && (
                      <div className="text-sm text-gray-500">
                        / {selectedCycle === 'monthly' ? '월' : '년'}
                      </div>
                    )}
                  </div>

                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-purple-500">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => plan.id !== currentPlan.id && openUpgradeModal(plan)}
                    disabled={plan.id === currentPlan.id}
                    className={`w-full rounded-xl py-3 font-medium transition-colors ${
                      plan.id === currentPlan.id
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : plan.highlighted
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.id === currentPlan.id
                      ? '현재 플랜'
                      : plan.price === -1
                        ? '문의하기'
                        : plans.indexOf(plan) > plans.indexOf(currentPlan)
                          ? '업그레이드'
                          : '다운그레이드'}
                  </button>
                </div>
              ))}
            </div>

            {/* Feature Comparison */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">상세 기능 비교</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-medium text-gray-600">기능</th>
                      {plans.map((plan) => (
                        <th
                          key={plan.id}
                          className="px-4 py-3 text-center font-medium text-gray-900"
                        >
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-600">AI 생성</td>
                      <td className="px-4 py-3 text-center">10회/월</td>
                      <td className="px-4 py-3 text-center">100회/월</td>
                      <td className="px-4 py-3 text-center">500회/월</td>
                      <td className="px-4 py-3 text-center font-medium text-purple-600">무제한</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-600">PDF Export</td>
                      <td className="px-4 py-3 text-center">3회/월</td>
                      <td className="px-4 py-3 text-center">20회/월</td>
                      <td className="px-4 py-3 text-center font-medium text-purple-600">무제한</td>
                      <td className="px-4 py-3 text-center font-medium text-purple-600">무제한</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-600">프로젝트</td>
                      <td className="px-4 py-3 text-center">2개</td>
                      <td className="px-4 py-3 text-center">10개</td>
                      <td className="px-4 py-3 text-center font-medium text-purple-600">무제한</td>
                      <td className="px-4 py-3 text-center font-medium text-purple-600">무제한</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-600">팀 멤버</td>
                      <td className="px-4 py-3 text-center">1명</td>
                      <td className="px-4 py-3 text-center">2명</td>
                      <td className="px-4 py-3 text-center">5명</td>
                      <td className="px-4 py-3 text-center font-medium text-purple-600">무제한</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-600">A/B 테스트</td>
                      <td className="px-4 py-3 text-center text-gray-400">-</td>
                      <td className="px-4 py-3 text-center text-gray-400">-</td>
                      <td className="px-4 py-3 text-center text-purple-600">✓</td>
                      <td className="px-4 py-3 text-center text-purple-600">✓</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-600">API 접근</td>
                      <td className="px-4 py-3 text-center text-gray-400">-</td>
                      <td className="px-4 py-3 text-center text-gray-400">-</td>
                      <td className="px-4 py-3 text-center text-purple-600">✓</td>
                      <td className="px-4 py-3 text-center text-purple-600">✓</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-600">전담 매니저</td>
                      <td className="px-4 py-3 text-center text-gray-400">-</td>
                      <td className="px-4 py-3 text-center text-gray-400">-</td>
                      <td className="px-4 py-3 text-center text-gray-400">-</td>
                      <td className="px-4 py-3 text-center text-purple-600">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">결제 내역</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100'
                          : invoice.status === 'pending'
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                      }`}
                    >
                      <span>
                        {invoice.status === 'paid'
                          ? '✓'
                          : invoice.status === 'pending'
                            ? '⏳'
                            : '!'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{invoice.description}</div>
                      <div className="text-sm text-gray-500">
                        {invoice.id} · {invoice.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </div>
                      <div
                        className={`text-xs ${
                          invoice.status === 'paid'
                            ? 'text-green-600'
                            : invoice.status === 'pending'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {invoice.status === 'paid'
                          ? '결제 완료'
                          : invoice.status === 'pending'
                            ? '처리 중'
                            : '결제 실패'}
                      </div>
                    </div>
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      영수증
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">플랜 변경</h2>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="mb-3 text-4xl">🚀</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{selectedPlan.name} 플랜</h3>
                <p className="text-gray-500">{selectedPlan.description}</p>
              </div>

              {selectedPlan.price !== -1 ? (
                <div className="mb-6 rounded-xl bg-gray-50 p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">월 요금</span>
                    <span className="font-medium">{formatCurrency(selectedPlan.price)}</span>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-600">현재 플랜 차액</span>
                    <span className="font-medium text-green-600">
                      {selectedPlan.price > currentPlan.price ? '+' : ''}
                      {formatCurrency(selectedPlan.price - currentPlan.price)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-medium">오늘 결제 금액</span>
                    <span className="font-bold text-purple-600">
                      {formatCurrency(Math.max(0, selectedPlan.price - currentPlan.price))}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-xl bg-purple-50 p-4 text-center">
                  <p className="text-purple-700">Enterprise 플랜은 맞춤 견적이 필요합니다.</p>
                  <p className="mt-1 text-sm text-purple-600">담당자가 24시간 내에 연락드립니다.</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  alert(
                    selectedPlan.price === -1 ? '문의가 접수되었습니다!' : '플랜이 변경되었습니다!'
                  );
                }}
                className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
              >
                {selectedPlan.price === -1 ? '문의하기' : '변경하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">플랜 취소</h2>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 text-center">
                <div className="mb-3 text-4xl">😢</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">정말 떠나시나요?</h3>
                <p className="text-gray-500">플랜을 취소하면 다음 기능을 잃게 됩니다.</p>
              </div>

              <div className="mb-6 space-y-2">
                {currentPlan.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-600">
                    <span className="text-red-500">✗</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  취소 시 {nextBillingDate}까지 현재 플랜을 계속 사용할 수 있습니다.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              >
                플랜 유지하기
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  alert('플랜이 취소되었습니다. 결제 기간 종료 후 Free 플랜으로 전환됩니다.');
                }}
                className="rounded-lg px-4 py-2 text-red-600 hover:bg-red-50"
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
