'use client';
import React, { useState } from 'react';

// Types
interface ChannelMetrics {
  channel: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  purchases: number;
  cvr: number;
  cpa: number;
  roas: number;
  spend: number;
  revenue: number;
}

interface ChangeEvent {
  id: string;
  type: 'offer' | 'landing' | 'creative' | 'targeting' | 'budget';
  date: string;
  description: string;
  channel: string;
  impact?: 'positive' | 'negative' | 'neutral';
}

interface Report {
  id: string;
  title: string;
  period: string;
  campaignName: string;
  status: 'draft' | 'completed';
  createdAt: string;
  metrics: ChannelMetrics[];
  events: ChangeEvent[];
  insights: string[];
  nextActions: string[];
}

// Sample Data
const sampleReports: Report[] = [
  {
    id: '1',
    title: '12월 1주차 성과 리포트',
    period: '2024-12-01 ~ 2024-12-07',
    campaignName: '겨울 보습 캠페인',
    status: 'completed',
    createdAt: '2024-12-08',
    metrics: [
      {
        channel: 'Meta',
        impressions: 450000,
        clicks: 12500,
        ctr: 2.78,
        cpc: 320,
        purchases: 285,
        cvr: 2.28,
        cpa: 14035,
        roas: 3.2,
        spend: 4000000,
        revenue: 12800000,
      },
      {
        channel: 'Google',
        impressions: 380000,
        clicks: 9800,
        ctr: 2.58,
        cpc: 280,
        purchases: 196,
        cvr: 2.0,
        cpa: 14000,
        roas: 2.8,
        spend: 2744000,
        revenue: 7683200,
      },
      {
        channel: 'Naver',
        impressions: 220000,
        clicks: 7200,
        ctr: 3.27,
        cpc: 350,
        purchases: 158,
        cvr: 2.19,
        cpa: 15949,
        roas: 2.5,
        spend: 2520000,
        revenue: 6300000,
      },
    ],
    events: [
      {
        id: '1',
        type: 'creative',
        date: '2024-12-03',
        description: '메인 소재 A/B 테스트 시작 (텍스처 vs 모델컷)',
        channel: 'Meta',
        impact: 'positive',
      },
      {
        id: '2',
        type: 'offer',
        date: '2024-12-05',
        description: '12% 할인 → 15% 할인으로 변경',
        channel: 'All',
        impact: 'positive',
      },
    ],
    insights: ['Meta CTR 전주 대비 15% 상승', 'Google CPA 개선 필요'],
    nextActions: ['텍스처 소재 전채널 확대', 'Google 타겟 오디언스 재설정'],
  },
];

const channels = ['Meta', 'Google', 'Naver', 'Kakao', 'TikTok'];
const eventTypes = [
  { id: 'offer', label: '오퍼 변경', icon: '🏷️' },
  { id: 'landing', label: '랜딩 변경', icon: '📄' },
  { id: 'creative', label: '소재 교체', icon: '🎨' },
  { id: 'targeting', label: '타겟 변경', icon: '🎯' },
  { id: 'budget', label: '예산 조정', icon: '💰' },
];

export default function ReportsManagement() {
  const [currentView, setCurrentView] = useState<'list' | 'new' | 'detail'>('list');
  const [reports, setReports] = useState<Report[]>(sampleReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // New Report Form State
  const [newReport, setNewReport] = useState({
    title: '',
    periodStart: '',
    periodEnd: '',
    campaignName: '',
  });

  const [channelMetrics, setChannelMetrics] = useState<ChannelMetrics[]>(
    channels.map((ch) => ({
      channel: ch,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpc: 0,
      purchases: 0,
      cvr: 0,
      cpa: 0,
      roas: 0,
      spend: 0,
      revenue: 0,
    }))
  );

  const [changeEvents, setChangeEvents] = useState<ChangeEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    type: 'creative' as const,
    date: '',
    description: '',
    channel: 'All',
  });

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<{
    hypotheses: string[];
    nextActions: string[];
    experiments: { title: string; description: string; priority: 'high' | 'medium' | 'low' }[];
  } | null>(null);

  // Calculate derived metrics
  const updateDerivedMetrics = (channelIndex: number, field: string, value: number) => {
    setChannelMetrics((prev) => {
      const updated = [...prev];
      const m = { ...updated[channelIndex], [field]: value };

      // Auto-calculate
      if (m.impressions > 0 && m.clicks > 0) {
        m.ctr = Number(((m.clicks / m.impressions) * 100).toFixed(2));
      }
      if (m.clicks > 0 && m.spend > 0) {
        m.cpc = Math.round(m.spend / m.clicks);
      }
      if (m.clicks > 0 && m.purchases > 0) {
        m.cvr = Number(((m.purchases / m.clicks) * 100).toFixed(2));
      }
      if (m.purchases > 0 && m.spend > 0) {
        m.cpa = Math.round(m.spend / m.purchases);
      }
      if (m.spend > 0 && m.revenue > 0) {
        m.roas = Number((m.revenue / m.spend).toFixed(2));
      }

      updated[channelIndex] = m;
      return updated;
    });
  };

  // Add change event
  const addChangeEvent = () => {
    if (!newEvent.date || !newEvent.description) return;
    const event: ChangeEvent = {
      id: `event-${Date.now()}`,
      ...newEvent,
      type: newEvent.type as ChangeEvent['type'],
    };
    setChangeEvents([...changeEvents, event]);
    setNewEvent({ type: 'creative', date: '', description: '', channel: 'All' });
  };

  // AI Analysis
  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAiInsights({
        hypotheses: [
          '소재 교체(12/03) 이후 Meta CTR 15% 상승 → 텍스처 소재가 더 높은 관심 유도',
          '할인율 상향(12/05) 이후 전체 CVR 8% 개선 → 가격 민감도가 높은 타겟층 확인',
          'Google CPA가 타 채널 대비 높음 → 키워드 또는 랜딩 페이지 최적화 필요',
          'Naver CTR 최고치 기록 → 검색 의도가 높은 유저 유입, 전환 최적화 집중 필요',
        ],
        nextActions: [
          '텍스처 중심 소재를 Google, Naver에도 확대 적용',
          'Google 검색 캠페인 키워드 재검토 및 부정 키워드 추가',
          'Naver 랜딩 페이지 A/B 테스트 (현재 vs 리뷰 강조 버전)',
          '15% 할인 유지하되, 구매 2개 시 추가 할인 번들 오퍼 테스트',
          'Meta 리타게팅 세그먼트 세분화 (장바구니 이탈 vs 상품 조회)',
        ],
        experiments: [
          {
            title: '텍스처 소재 전채널 확대',
            description:
              'Meta에서 검증된 텍스처 중심 소재를 Google, Naver에 적용하여 CTR 개선 확인',
            priority: 'high',
          },
          {
            title: 'Google 키워드 최적화',
            description: '전환율 낮은 키워드 제외, 브랜드+성분 조합 키워드 추가',
            priority: 'high',
          },
          {
            title: 'Naver 랜딩 리뷰 강조 버전',
            description: '실제 후기와 비포애프터를 상단에 배치한 랜딩 페이지 테스트',
            priority: 'medium',
          },
          {
            title: '번들 오퍼 테스트',
            description: '2개 구매 시 20% 할인 vs 현재 15% 단일 할인 비교',
            priority: 'medium',
          },
          {
            title: 'Meta 리타게팅 세분화',
            description: '장바구니 이탈자 전용 크리에이티브 제작 및 테스트',
            priority: 'low',
          },
        ],
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  // Save Report
  const saveReport = () => {
    const report: Report = {
      id: `report-${Date.now()}`,
      title: newReport.title || `${newReport.periodStart} ~ ${newReport.periodEnd} 리포트`,
      period: `${newReport.periodStart} ~ ${newReport.periodEnd}`,
      campaignName: newReport.campaignName,
      status: aiInsights ? 'completed' : 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      metrics: channelMetrics.filter((m) => m.impressions > 0),
      events: changeEvents,
      insights: aiInsights?.hypotheses || [],
      nextActions: aiInsights?.nextActions || [],
    };
    setReports([report, ...reports]);
    setSelectedReport(report);
    setCurrentView('detail');
  };

  // View Report
  const viewReport = (report: Report) => {
    setSelectedReport(report);
    setCurrentView('detail');
  };

  // Format number
  const formatNumber = (num: number) => num.toLocaleString();
  const formatCurrency = (num: number) => `₩${num.toLocaleString()}`;

  // Total metrics calculation
  const totalMetrics = channelMetrics.reduce(
    (acc, m) => ({
      impressions: acc.impressions + m.impressions,
      clicks: acc.clicks + m.clicks,
      spend: acc.spend + m.spend,
      revenue: acc.revenue + m.revenue,
      purchases: acc.purchases + m.purchases,
    }),
    { impressions: 0, clicks: 0, spend: 0, revenue: 0, purchases: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              {currentView !== 'list' && (
                <button
                  onClick={() => setCurrentView('list')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ← 목록
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {currentView === 'list'
                  ? '성과 리포트'
                  : currentView === 'new'
                    ? '새 리포트 작성'
                    : selectedReport?.title}
              </h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {currentView === 'list'
                ? '캠페인 성과를 기록하고 AI 인사이트를 받아보세요'
                : currentView === 'new'
                  ? '채널별 지표와 변경 이벤트를 입력하세요'
                  : selectedReport?.period}
            </p>
          </div>
          {currentView === 'list' && (
            <button
              onClick={() => setCurrentView('new')}
              className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              + 새 리포트
            </button>
          )}
          {currentView === 'detail' && (
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
              <span>📄</span> PDF 내보내기
              <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">PRO</span>
            </button>
          )}
        </div>
      </header>

      <main className="p-6">
        {/* Report List View */}
        {currentView === 'list' && (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => viewReport(report)}
                className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${
                          report.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {report.status === 'completed' ? '완료' : '작성중'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {report.campaignName} · {report.period}
                    </p>
                    <div className="mt-3 flex gap-4 text-sm">
                      <span className="text-gray-600">채널 {report.metrics.length}개</span>
                      <span className="text-gray-600">이벤트 {report.events.length}개</span>
                      <span className="text-purple-600">인사이트 {report.insights.length}개</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{report.createdAt}</div>
                    <div className="mt-1 text-lg font-bold text-green-600">
                      ROAS{' '}
                      {(
                        report.metrics.reduce((a, m) => a + m.revenue, 0) /
                          report.metrics.reduce((a, m) => a + m.spend, 0) || 0
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="py-12 text-center">
                <div className="mb-3 text-4xl">📊</div>
                <div className="text-gray-500">아직 작성된 리포트가 없습니다</div>
                <button
                  onClick={() => setCurrentView('new')}
                  className="mt-4 text-purple-600 hover:underline"
                >
                  첫 리포트 작성하기 →
                </button>
              </div>
            )}
          </div>
        )}

        {/* New Report Form */}
        {currentView === 'new' && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">기본 정보</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    리포트 제목
                  </label>
                  <input
                    type="text"
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    placeholder="12월 1주차 성과 리포트"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">캠페인명</label>
                  <input
                    type="text"
                    value={newReport.campaignName}
                    onChange={(e) => setNewReport({ ...newReport, campaignName: e.target.value })}
                    placeholder="겨울 보습 캠페인"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">시작일</label>
                  <input
                    type="date"
                    value={newReport.periodStart}
                    onChange={(e) => setNewReport({ ...newReport, periodStart: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">종료일</label>
                  <input
                    type="date"
                    value={newReport.periodEnd}
                    onChange={(e) => setNewReport({ ...newReport, periodEnd: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Channel Metrics */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">채널별 성과 지표</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-2 py-3 text-left font-medium text-gray-600">채널</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">노출</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">클릭</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">CTR(%)</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">광고비</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">CPC</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">구매</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">CVR(%)</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">매출</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">CPA</th>
                      <th className="px-2 py-3 text-right font-medium text-gray-600">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channelMetrics.map((m, idx) => (
                      <tr key={m.channel} className="border-b border-gray-100">
                        <td className="px-2 py-3 font-medium">{m.channel}</td>
                        <td className="px-1 py-2">
                          <input
                            type="number"
                            value={m.impressions || ''}
                            onChange={(e) =>
                              updateDerivedMetrics(idx, 'impressions', Number(e.target.value))
                            }
                            className="w-20 rounded border border-gray-200 px-2 py-1 text-right"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-1 py-2">
                          <input
                            type="number"
                            value={m.clicks || ''}
                            onChange={(e) =>
                              updateDerivedMetrics(idx, 'clicks', Number(e.target.value))
                            }
                            className="w-20 rounded border border-gray-200 px-2 py-1 text-right"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-1 py-2 text-right text-gray-500">{m.ctr}%</td>
                        <td className="px-1 py-2">
                          <input
                            type="number"
                            value={m.spend || ''}
                            onChange={(e) =>
                              updateDerivedMetrics(idx, 'spend', Number(e.target.value))
                            }
                            className="w-24 rounded border border-gray-200 px-2 py-1 text-right"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-1 py-2 text-right text-gray-500">
                          {formatCurrency(m.cpc)}
                        </td>
                        <td className="px-1 py-2">
                          <input
                            type="number"
                            value={m.purchases || ''}
                            onChange={(e) =>
                              updateDerivedMetrics(idx, 'purchases', Number(e.target.value))
                            }
                            className="w-16 rounded border border-gray-200 px-2 py-1 text-right"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-1 py-2 text-right text-gray-500">{m.cvr}%</td>
                        <td className="px-1 py-2">
                          <input
                            type="number"
                            value={m.revenue || ''}
                            onChange={(e) =>
                              updateDerivedMetrics(idx, 'revenue', Number(e.target.value))
                            }
                            className="w-24 rounded border border-gray-200 px-2 py-1 text-right"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-1 py-2 text-right text-gray-500">
                          {formatCurrency(m.cpa)}
                        </td>
                        <td className="px-1 py-2 text-right font-medium text-green-600">
                          {m.roas}x
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-2 py-3">합계</td>
                      <td className="px-2 py-3 text-right">
                        {formatNumber(totalMetrics.impressions)}
                      </td>
                      <td className="px-2 py-3 text-right">{formatNumber(totalMetrics.clicks)}</td>
                      <td className="px-2 py-3 text-right">
                        {totalMetrics.impressions > 0
                          ? ((totalMetrics.clicks / totalMetrics.impressions) * 100).toFixed(2)
                          : 0}
                        %
                      </td>
                      <td className="px-2 py-3 text-right">{formatCurrency(totalMetrics.spend)}</td>
                      <td className="px-2 py-3 text-right">
                        {totalMetrics.clicks > 0
                          ? formatCurrency(Math.round(totalMetrics.spend / totalMetrics.clicks))
                          : '-'}
                      </td>
                      <td className="px-2 py-3 text-right">
                        {formatNumber(totalMetrics.purchases)}
                      </td>
                      <td className="px-2 py-3 text-right">
                        {totalMetrics.clicks > 0
                          ? ((totalMetrics.purchases / totalMetrics.clicks) * 100).toFixed(2)
                          : 0}
                        %
                      </td>
                      <td className="px-2 py-3 text-right">
                        {formatCurrency(totalMetrics.revenue)}
                      </td>
                      <td className="px-2 py-3 text-right">
                        {totalMetrics.purchases > 0
                          ? formatCurrency(Math.round(totalMetrics.spend / totalMetrics.purchases))
                          : '-'}
                      </td>
                      <td className="px-2 py-3 text-right text-green-600">
                        {totalMetrics.spend > 0
                          ? (totalMetrics.revenue / totalMetrics.spend).toFixed(2)
                          : 0}
                        x
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Change Events */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">변경 이벤트</h2>
              <div className="mb-4 flex flex-wrap gap-3">
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  {eventTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
                <select
                  value={newEvent.channel}
                  onChange={(e) => setNewEvent({ ...newEvent, channel: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="All">전체 채널</option>
                  {channels.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="변경 내용을 입력하세요"
                  className="min-w-[200px] flex-1 rounded-lg border border-gray-300 px-3 py-2"
                />
                <button
                  onClick={addChangeEvent}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  추가
                </button>
              </div>

              {changeEvents.length > 0 ? (
                <div className="space-y-2">
                  {changeEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span>{eventTypes.find((t) => t.id === event.type)?.icon}</span>
                        <span className="text-sm text-gray-500">{event.date}</span>
                        <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                          {event.channel}
                        </span>
                        <span className="text-gray-800">{event.description}</span>
                      </div>
                      <button
                        onClick={() =>
                          setChangeEvents(changeEvents.filter((e) => e.id !== event.id))
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-400">
                  기간 내 오퍼, 랜딩, 소재 등의 변경 사항을 기록하세요
                </div>
              )}
            </div>

            {/* AI Analysis Button */}
            <div className="flex justify-center">
              <button
                onClick={runAIAnalysis}
                disabled={isAnalyzing || totalMetrics.impressions === 0}
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    AI 분석 중...
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span>
                    AI 인사이트 생성
                  </>
                )}
              </button>
            </div>

            {/* AI Insights */}
            {aiInsights && (
              <div className="space-y-6">
                {/* Hypotheses */}
                <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-purple-900">
                    <span>🔍</span> 원인 추정 (가설)
                  </h3>
                  <div className="space-y-3">
                    {aiInsights.hypotheses.map((h, idx) => (
                      <div key={idx} className="flex gap-3 rounded-lg bg-white/70 p-3">
                        <span className="font-bold text-purple-500">{idx + 1}</span>
                        <span className="text-gray-800">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Actions */}
                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-900">
                    <span>🎯</span> 다음 액션
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.nextActions.map((a, idx) => (
                      <div key={idx} className="flex items-center gap-3 rounded-lg bg-white/70 p-3">
                        <input type="checkbox" className="h-4 w-4 rounded text-blue-600" />
                        <span className="text-gray-800">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experiments */}
                <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-900">
                    <span>🧪</span> 다음 주 실험 플랜
                  </h3>
                  <div className="grid gap-4">
                    {aiInsights.experiments.map((exp, idx) => (
                      <div key={idx} className="rounded-lg bg-white/70 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-gray-900">{exp.title}</span>
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              exp.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : exp.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {exp.priority === 'high'
                              ? '높음'
                              : exp.priority === 'medium'
                                ? '중간'
                                : '낮음'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={saveReport}
                    className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
                  >
                    리포트 저장
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report Detail View */}
        {currentView === 'detail' && selectedReport && (
          <div className="space-y-6">
            {/* Summary 1-Pager */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">📋 요약 (1-Pager)</h2>

              {/* Key Metrics */}
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedReport.metrics.reduce((a, m) => a + m.spend, 0))}
                  </div>
                  <div className="text-sm text-gray-500">총 광고비</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedReport.metrics.reduce((a, m) => a + m.revenue, 0))}
                  </div>
                  <div className="text-sm text-gray-500">총 매출</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(
                      selectedReport.metrics.reduce((a, m) => a + m.revenue, 0) /
                      selectedReport.metrics.reduce((a, m) => a + m.spend, 0)
                    ).toFixed(2)}
                    x
                  </div>
                  <div className="text-sm text-gray-500">평균 ROAS</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedReport.metrics.reduce((a, m) => a + m.purchases, 0)}
                  </div>
                  <div className="text-sm text-gray-500">총 구매</div>
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="mb-6 flex h-48 items-center justify-center rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                <span className="text-gray-400">📈 채널별 성과 차트</span>
              </div>

              {/* Quick Summary */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">✅ 주요 성과</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {selectedReport.insights.slice(0, 3).map((insight, idx) => (
                      <li key={idx}>• {insight}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">⚡ 핵심 액션</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {selectedReport.nextActions.slice(0, 3).map((action, idx) => (
                      <li key={idx}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Channel Insights */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">📊 채널별 인사이트</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedReport.metrics.map((m) => (
                  <div key={m.channel} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-medium text-gray-900">{m.channel}</span>
                      <span
                        className={`text-lg font-bold ${m.roas >= 3 ? 'text-green-600' : m.roas >= 2 ? 'text-yellow-600' : 'text-red-500'}`}
                      >
                        {m.roas}x
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">CTR</div>
                      <div className="text-right">{m.ctr}%</div>
                      <div className="text-gray-500">CVR</div>
                      <div className="text-right">{m.cvr}%</div>
                      <div className="text-gray-500">CPA</div>
                      <div className="text-right">{formatCurrency(m.cpa)}</div>
                      <div className="text-gray-500">매출</div>
                      <div className="text-right">{formatCurrency(m.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Experiments */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">🧪 다음 실험 5개</h2>
              <div className="space-y-3">
                {[
                  { title: '텍스처 소재 전채널 확대', priority: 'high', status: 'pending' },
                  { title: 'Google 키워드 최적화', priority: 'high', status: 'pending' },
                  { title: 'Naver 랜딩 리뷰 강조 버전', priority: 'medium', status: 'pending' },
                  { title: '번들 오퍼 테스트', priority: 'medium', status: 'pending' },
                  { title: 'Meta 리타게팅 세분화', priority: 'low', status: 'pending' },
                ].map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-gray-900">{exp.title}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          exp.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : exp.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {exp.priority === 'high'
                          ? '높음'
                          : exp.priority === 'medium'
                            ? '중간'
                            : '낮음'}
                      </span>
                    </div>
                    <button className="rounded px-3 py-1 text-sm text-purple-600 hover:bg-purple-50">
                      실험 시작 →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
