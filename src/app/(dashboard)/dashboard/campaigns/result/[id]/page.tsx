'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Stack,
  Tabs,
  Card,
  Text,
  Group,
  Badge,
  Button,
  ThemeIcon,
  Switch,
  Loader,
  Center,
  Alert,
  Breadcrumbs,
  Anchor,
  ActionIcon,
  Tooltip,
  Menu,
} from '@mantine/core';
import {
  IconTarget,
  IconBrandMeta,
  IconVideo,
  IconFileText,
  IconFlask,
  IconShieldCheck,
  IconDownload,
  IconRefresh,
  IconArrowLeft,
  IconDots,
  IconShare,
  IconCopy,
  IconTrash,
  IconClock,
  IconCheck,
  IconAlertTriangle,
} from '@tabler/icons-react';

// 탭 컴포넌트
import StrategyTab from '@/components/campaign-result/StrategyTab';
import AdsTab from '@/components/campaign-result/AdsTab';
import CreativeTab from '@/components/campaign-result/CreativeTab';
import LandingTab from '@/components/campaign-result/LandingTab';
import ExperimentTab from '@/components/campaign-result/ExperimentTab';
import ComplianceTab from '@/components/campaign-result/ComplianceTab';

// 타입 & 데이터
import type { CampaignResult, CampaignMeta } from '@/types/campaign-result';

// mock data
export const mockCampaignMeta: CampaignMeta = {
  id: 'camp_001',
  productName: '글로우 세럼 프로',
  category: '스킨케어 > 세럼',
  status: 'completed',
  createdAt: new Date('2024-12-06T14:30:00'),
  updatedAt: new Date('2024-12-06T15:45:00'),
};

// ============ 캠페인 결과 전체 ============
export const mockCampaignResult: CampaignResult = {
  id: 'result_001',
  campaignId: 'camp_001',
  createdAt: new Date('2024-12-06T14:30:00'),
  updatedAt: new Date('2024-12-06T15:45:00'),

  // ============ 1. Strategy ============
  strategy: {
    coreMessage: '3주 만에 칙칙함이 사라지고, 매일 아침 거울 보는 게 설레는 피부로',
    subMessages: [
      '비타민C 15%가 잡티의 근본 원인인 멜라닌 생성을 억제합니다',
      '저분자 히알루론산이 피부 속부터 채워 24시간 촉촉함을 유지합니다',
      '피부과 전문의 94%가 추천하는 검증된 포뮬러',
    ],
    personas: [
      {
        id: 'persona_1',
        name: '칙칙 고민 직장인',
        age: '28-35세',
        skinType: '복합성',
        concerns: ['칙칙한 피부톤', '잡티', '피로한 인상'],
        situation: '아침 출근 전 거울을 보며 한숨, 화장이 잘 안 먹는 느낌',
        objections: ['세럼으로 정말 달라질까?', '비싼 돈 주고 효과 없으면?'],
        triggers: ['동료의 "요즘 피부 좋아 보인다" 한마디', '셀카가 잘 나올 때'],
      },
      {
        id: 'persona_2',
        name: '성분 덕후 MZ',
        age: '24-30세',
        skinType: '지성/민감성',
        concerns: ['효과 없는 제품에 돈 낭비', '자극적인 성분'],
        situation: '성분 리스트 꼼꼼히 확인, 화해/글로우픽 리뷰 탐색',
        objections: ['비타민C 농도가 너무 높으면 자극적이지 않을까?', '가성비가 맞을까?'],
        triggers: ['임상 데이터', '피부과 전문의 추천', '성분 분석 유튜브'],
      },
      {
        id: 'persona_3',
        name: '결혼 준비 예비 신부',
        age: '29-34세',
        skinType: '건성',
        concerns: ['D-day까지 확실한 피부 개선', '웨딩 촬영 피부'],
        situation: '웨딩 촬영 D-30, 집중 케어 필요',
        objections: ['시간이 부족한데 효과가 있을까?', '피부과 시술이 더 낫지 않을까?'],
        triggers: ['3주 집중 케어 프로그램', '웨딩 후기', '신부 피부 관리 콘텐츠'],
      },
    ],
    offers: [
      {
        id: 1,
        type: '증정',
        value: '본품 + 미니어처 3종 세트',
        description: '정가 구매 시 여행용 미니어처 세트 증정',
        margin: 'high',
        label: 'recommended',
        reasoning: '객단가 유지하면서 체험 기회 제공, 재구매 유도 효과',
      },
      {
        id: 2,
        type: '번들',
        value: '2+1 번들',
        description: '2개 구매 시 1개 추가 증정',
        margin: 'low',
        label: 'caution',
        reasoning: '마진율 낮음, 재고 소진 또는 신규 고객 대량 유입 시에만 권장',
      },
      {
        id: 3,
        type: '할인',
        value: '첫 구매 30% 할인',
        description: '신규 고객 한정 30% 할인 쿠폰',
        margin: 'medium',
        label: 'recommended',
        reasoning: '신규 고객 유입에 효과적, CPA 최적화에 유리',
      },
    ],
    angles: [
      {
        id: 'angle_1',
        type: 'problem_solution',
        title: '문제해결형',
        headline: '"칙칙한 피부톤 때문에 아침마다 한숨?"',
        description: '타겟의 일상적 고민에서 시작 → 공감 형성 → 솔루션 제시 흐름',
      },
      {
        id: 'angle_2',
        type: 'ingredient_evidence',
        title: '성분근거형',
        headline: '"비타민C 15%, 왜 이 농도일까?"',
        description: '과학적 근거와 성분 스토리 → 신뢰 구축 → 전문성 어필',
      },
      {
        id: 'angle_3',
        type: 'review_trust',
        title: '후기신뢰형',
        headline: '"3주 써봤습니다, 솔직 후기"',
        description: 'UGC 스타일의 진정성 있는 후기 → 또래 증언 효과',
      },
    ],
  },

  // ============ 2. Ads ============
  ads: {
    meta: {
      campaignStructure: {
        topFunnel: ['관심사 타겟팅: 스킨케어, 뷰티', '유사 타겟: 기존 구매자 1-3%'],
        retarget: ['영상 50% 시청자', '장바구니 이탈자', '상세페이지 방문자'],
      },
      creativeRatio: [
        { type: '이미지', ratio: 40 },
        { type: '영상', ratio: 45 },
        { type: '캐러셀', ratio: 15 },
      ],
      eventRecommendations: ['Purchase 최적화', 'AddToCart 보조 이벤트', 'ViewContent 상단 퍼널'],
      adSets: [
        {
          name: '상단 퍼널 - 인지',
          targeting: '관심사: 스킨케어, K-뷰티, 25-40 여성',
          headlines: ['3주 만에 달라지는 피부톤', '비타민C 15% 고농축 세럼'],
          descriptions: ['매일 아침 세럼 한 방울로 시작하는 광채 루틴'],
        },
        {
          name: '중간 퍼널 - 고려',
          targeting: '영상 50% 시청자, 참여자',
          headlines: ['피부과 전문의 94% 추천', '3만 리뷰가 증명하는 효과'],
          descriptions: ['왜 비타민C 15%일까요? 피부과학이 찾은 황금 비율'],
        },
        {
          name: '하단 퍼널 - 전환',
          targeting: '장바구니 이탈, 상세페이지 방문',
          headlines: ['지금 첫 구매 30% 할인', '오늘만 무료배송'],
          descriptions: ['장바구니에 담아두신 세럼, 지금 할인 중이에요'],
        },
      ],
    },
    google: {
      keywordClusters: [
        { type: 'brand', keywords: ['글로우세럼', '글로우세럼프로', '글로우 세럼 후기'] },
        { type: 'concern', keywords: ['칙칙한 피부 세럼', '피부톤 개선 세럼', '잡티 세럼 추천'] },
        {
          type: 'ingredient',
          keywords: ['비타민C 세럼 추천', '비타민C 15% 세럼', '히알루론산 세럼'],
        },
        { type: 'comparison', keywords: ['세럼 추천 2024', '비타민C 세럼 비교', '세럼 순위'] },
      ],
      headlines: ['3주 만에 달라지는 피부톤', '비타민C 15% 고농축', '피부과 전문의 추천'],
      descriptions: ['매일 아침 세럼 한 방울로 시작하는 광채 루틴. 지금 30% 할인 중.'],
    },
    naver: {
      toneGuide: '신뢰감 있고 전문적인 톤, 과장 표현 자제',
      extensionAssets: ['가격 확장소재', '프로모션 확장', '사이트링크'],
      headlines: ['비타민C 15% 글로우 세럼', '피부과 전문의 94% 추천'],
      descriptions: ['3주 집중 케어로 칙칙함 개선. 첫 구매 30% 할인.'],
    },
    headlines: [
      {
        id: 'h1',
        text: '3주 만에 달라지는 피부톤',
        isSafeMode: true,
        tone: 'neutral',
        type: 'benefit_based',
      },
      {
        id: 'h2',
        text: '비타민C 15% 고농축 세럼',
        isSafeMode: true,
        tone: 'neutral',
        type: 'benefit_based',
      },
      {
        id: 'h3',
        text: '피부과 전문의 94% 추천',
        isSafeMode: true,
        tone: '30s',
        type: 'benefit_based',
      },
      {
        id: 'h4',
        text: '칙칙함 OUT, 광채 IN',
        isSafeMode: true,
        tone: '20s',
        type: 'benefit_based',
      },
      {
        id: 'h5',
        text: '"3주 써봤는데 진짜 달라졌어"',
        isSafeMode: false,
        tone: '20s',
        type: 'review_based',
      },
      {
        id: 'h6',
        text: '지금 첫 구매 30% 할인',
        isSafeMode: true,
        tone: 'neutral',
        type: 'urgency',
      },
      {
        id: 'h7',
        text: '오늘 주문 시 내일 도착',
        isSafeMode: true,
        tone: 'neutral',
        type: 'urgency',
      },
      {
        id: 'h8',
        text: '3만 리뷰가 증명하는 효과',
        isSafeMode: true,
        tone: '30s',
        type: 'review_based',
      },
    ],
    bodyTexts: [
      {
        id: 'b1',
        text: '매일 아침, 세럼 한 방울로 시작하는 광채 루틴. 비타민C 15%가 칙칙한 피부톤을 환하게 밝혀줍니다.',
        isSafeMode: true,
        tone: 'neutral',
      },
      {
        id: 'b2',
        text: '왜 비타민C 15%일까요? 효과는 최대로, 자극은 최소로. 피부과학이 찾은 골든 밸런스입니다.',
        isSafeMode: true,
        tone: '30s',
      },
      {
        id: 'b3',
        text: '"3주 만에 동료들이 먼저 물어봤어요" 3만 명이 경험한 피부톤 변화, 지금 시작하세요.',
        isSafeMode: false,
        tone: '20s',
        type: 'review_based',
      },
    ],
    ctas: [
      { id: 'c1', text: '지금 구매하기', isSafeMode: true },
      { id: 'c2', text: '30% 할인 받기', isSafeMode: true },
      { id: 'c3', text: '무료 샘플 신청', isSafeMode: true },
      { id: 'c4', text: '자세히 보기', isSafeMode: true },
      { id: 'c5', text: '후기 확인하기', isSafeMode: true },
    ],
  },

  // ============ 3. Creative ============
  creative: {
    ugcScripts: [
      {
        id: 'ugc_1',
        title: '문제-해결형 15초',
        duration: '15s',
        hook: '"아침마다 거울 보면서 한숨 쉬는 사람?"',
        fullScript:
          '아침마다 거울 보면서 한숨 쉬는 사람? 칙칙한 피부톤 때문에 화장도 안 먹고... 이 세럼 3주 썼는데, 진짜 달라졌어. 비타민C 15%라 효과가 확실함. 링크 타고 와, 지금 30% 할인 중.',
        cuts: [
          {
            order: 1,
            name: '훅',
            duration: '0-2초',
            description: '시선 끄는 질문',
            voiceover: '"아침마다 거울 보면서 한숨 쉬는 사람?"',
            visual: '거울 앞 한숨 짓는 얼굴 클로즈업',
          },
          {
            order: 2,
            name: '문제',
            duration: '2-5초',
            description: '공감대 형성',
            voiceover: '"칙칙한 피부톤 때문에 화장도 안 먹고..."',
            visual: '파운데이션 바르는 손, 답답한 표정',
          },
          {
            order: 3,
            name: '해결',
            duration: '5-10초',
            description: '제품 소개',
            voiceover: '"이 세럼 3주 썼는데, 진짜 달라졌어"',
            visual: '세럼 사용 장면, 발림성 클로즈업',
          },
          {
            order: 4,
            name: '근거',
            duration: '10-13초',
            description: '신뢰 요소',
            voiceover: '"비타민C 15%라 효과가 확실함"',
            visual: '성분표, 텍스처 클로즈업',
          },
          {
            order: 5,
            name: 'CTA',
            duration: '13-15초',
            description: '행동 유도',
            voiceover: '"링크 타고 와, 지금 30% 할인 중"',
            visual: '제품 패키지, 가격 태그',
          },
        ],
      },
      {
        id: 'ugc_2',
        title: '루틴형 30초',
        duration: '30s',
        hook: '"아침 스킨케어 루틴 공개합니다"',
        fullScript:
          '아침 스킨케어 루틴 공개합니다. 먼저 가볍게 세안하고, 토너로 피부결 정돈한 다음, 여기서 이 세럼이 핵심이에요. 비타민C 15%라 흡수가 진짜 빠르고, 끈적임이 없어요. 3주 쓰니까 진짜 피부톤이 밝아졌어요. 프로필 링크에 할인 있어요.',
        cuts: [
          {
            order: 1,
            name: '훅',
            duration: '0-3초',
            description: '루틴 시작',
            voiceover: '"아침 스킨케어 루틴 공개합니다"',
            visual: '욕실 전경, 아침 햇살',
          },
          {
            order: 2,
            name: '클렌징',
            duration: '3-8초',
            description: '세안 단계',
            voiceover: '"먼저 가볍게 세안하고"',
            visual: '세안 장면',
          },
          {
            order: 3,
            name: '토너',
            duration: '8-12초',
            description: '토너 단계',
            voiceover: '"토너로 피부결 정돈한 다음"',
            visual: '토너 패팅',
          },
          {
            order: 4,
            name: '세럼',
            duration: '12-22초',
            description: '메인 제품',
            voiceover:
              '"여기서 이 세럼이 핵심이에요. 비타민C 15%라 흡수가 진짜 빠르고, 끈적임이 없어요"',
            visual: '세럼 사용, 흡수 과정',
          },
          {
            order: 5,
            name: '결과',
            duration: '22-27초',
            description: '효과 언급',
            voiceover: '"3주 쓰니까 진짜 피부톤이 밝아졌어요"',
            visual: '거울 속 밝은 피부',
          },
          {
            order: 6,
            name: 'CTA',
            duration: '27-30초',
            description: '행동 유도',
            voiceover: '"프로필 링크에 할인 있어요"',
            visual: '제품 클로즈업',
          },
        ],
      },
    ],
    textureDescriptions: [
      {
        category: 'texture',
        phrases: ['투명한 젤 타입', '묽은 에센스 제형', '부드러운 세럼 텍스처', '가벼운 워터 타입'],
      },
      {
        category: 'absorption',
        phrases: [
          '빠르게 스며드는',
          '끈적임 없이 흡수되는',
          '바로 건조되는 산뜻한',
          '피부에 녹아드는',
        ],
      },
      {
        category: 'scent',
        phrases: ['은은한 시트러스 향', '향료 무첨가', '피부 본연의 향', '자극 없는 순한 향'],
      },
      {
        category: 'finish',
        phrases: ['촉촉한 마무리', '산뜻한 피니쉬', '윤기 나는 광택', '매끈한 피부결'],
      },
    ],
    beforeAfterTemplates: [
      {
        id: 'ba_1',
        title: '피부톤 개선',
        beforeText: '칙칙하고 고르지 못한 피부톤으로 매일 아침 화장이 힘들었어요.',
        afterText: '3주 사용 후 피부톤이 한결 균일해지고, 생기가 돌아왔어요!',
        disclaimer:
          '*개인 사용 후기이며, 효과는 개인에 따라 다를 수 있습니다. 이미지는 보정되지 않았습니다.',
      },
      {
        id: 'ba_2',
        title: '수분 장벽 강화',
        beforeText: '건조한 계절마다 피부 당김이 심해서 고민이었어요.',
        afterText: '세럼 사용 후 하루 종일 촉촉함이 유지되는 걸 느꼈어요!',
        disclaimer:
          '*개인 사용 후기이며, 효과는 개인에 따라 다를 수 있습니다. 패치 테스트 후 사용을 권장합니다.',
      },
    ],
  },

  // ============ 4. Landing ============
  landing: {
    heroSection: {
      headline: '3주 만에 거울 보는 게 설레는 피부',
      subHeadline: '비타민C 15% + 히알루론산의 과학적 조합',
      evidence: ['피부과 전문의 94% 추천', '3만 리뷰 평점 4.8', '4주 임상 테스트 완료'],
      cta: '첫 구매 30% 할인 받기',
      variants: [
        {
          headline: '3주 만에 거울 보는 게 설레는 피부',
          subHeadline: '비타민C 15% + 히알루론산의 과학적 조합',
          evidence: ['피부과 전문의 94% 추천', '3만 리뷰 평점 4.8'],
          cta: '첫 구매 30% 할인 받기',
        },
        {
          headline: '칙칙한 피부톤, 이제 고민 끝',
          subHeadline: '비타민C 15%가 만드는 맑고 투명한 광채',
          evidence: ['4주 임상 테스트 완료', '피부톤 개선 94%'],
          cta: '지금 시작하기',
        },
        {
          headline: '"3주 만에 동료들이 먼저 물어봤어요"',
          subHeadline: '3만 명이 경험한 피부톤 변화의 비밀',
          evidence: ['실제 사용자 후기 기반', '재구매율 78%'],
          cta: '후기 더 보기',
        },
        {
          headline: '비타민C 15%, 왜 이 농도일까?',
          subHeadline: '효과는 최대로, 자극은 최소로 - 피부과학이 찾은 골든 밸런스',
          evidence: ['특허 성분 3종', 'SCI 논문 인용'],
          cta: '성분 자세히 보기',
        },
        {
          headline: '오늘 시작하면, 3주 후 달라진 나',
          subHeadline: '매일 아침 세럼 한 방울로 시작하는 광채 루틴',
          evidence: ['30일 환불 보장', '무료 배송'],
          cta: '부담 없이 시작하기',
        },
      ],
    },
    fullStructure: [
      {
        order: 1,
        type: 'problem',
        title: '문제 제기',
        content:
          '"혹시 이런 고민 있으신가요?" - 칙칙함, 잡티, 건조함으로 아침마다 거울 보기가 두려우셨나요?',
      },
      {
        order: 2,
        type: 'solution',
        title: '해결책 제시',
        content:
          '글로우 세럼 프로가 답입니다. 비타민C 15%의 강력한 광채 케어로 칙칙함을 밝혀드립니다.',
      },
      {
        order: 3,
        type: 'evidence',
        title: '성분 근거',
        content:
          '비타민C 15% + 히알루론산 + 나이아신아마이드의 시너지. 피부과학이 증명한 황금 비율입니다.',
      },
      {
        order: 4,
        type: 'review',
        title: '리뷰 하이라이트',
        content:
          '4주 사용 후 피부톤 개선 94%, 보습 지속력 89%. 3만 명의 실제 사용자가 경험한 변화입니다.',
      },
      {
        order: 5,
        type: 'faq',
        title: 'FAQ',
        content:
          '민감 피부도 사용 가능한가요? 아침/저녁 모두 사용해도 되나요? 다른 세럼과 함께 써도 되나요?',
      },
      {
        order: 6,
        type: 'offer',
        title: '오퍼',
        content: '첫 구매 고객 한정 30% 할인 + 미니어처 세트 증정. 오늘 주문 시 내일 도착!',
      },
      {
        order: 7,
        type: 'cta',
        title: '최종 CTA',
        content: '지금 바로 시작하세요. 3주 후 달라진 피부를 만나보세요.',
      },
    ],
    reviewHighlights: [
      {
        category: '피부톤',
        count: 2847,
        highlights: ['밝아졌어요', '화사해졌어요', '칙칙함 개선', '톤업 효과'],
        sentiment: 'positive',
      },
      {
        category: '보습력',
        count: 2156,
        highlights: ['촉촉해요', '당김 없어요', '24시간 유지', '건조함 해결'],
        sentiment: 'positive',
      },
      {
        category: '흡수력',
        count: 1893,
        highlights: ['빠르게 흡수', '끈적임 없음', '산뜻해요', '가벼워요'],
        sentiment: 'positive',
      },
      {
        category: '자극',
        count: 892,
        highlights: ['순해요', '민감 피부 OK', '트러블 없음', '저자극'],
        sentiment: 'neutral',
      },
    ],
  },

  // ============ 5. Experiment ============
  experiment: {
    calendar: {
      duration: '4weeks',
      phases: [
        {
          week: 1,
          focus: '핵심 변수 테스트',
          tests: ['훅 A/B 테스트 (문제형 vs 성분형)', '랜딩 상단 헤드라인 테스트'],
          budget: 75,
        },
        {
          week: 2,
          focus: '오퍼 최적화',
          tests: ['오퍼 테스트 (30% 할인 vs 1+1)', 'UGC 오프닝 훅 테스트'],
          budget: 100,
        },
        {
          week: 3,
          focus: '타겟 세분화',
          tests: ['타겟 테스트 (20대 vs 30대)', '크리에이티브 포맷 테스트 (이미지 vs 영상)'],
          budget: 100,
        },
        {
          week: 4,
          focus: '스케일업',
          tests: ['최적 조합 스케일업', '성과 분석 및 리포트'],
          budget: 125,
        },
      ],
    },
    variables: [
      {
        id: 'var_1',
        name: '훅 메시지',
        type: 'hook',
        variants: ['"칙칙한 피부톤 고민?"', '"비타민C 15%의 비밀"', '"3주 만에 달라진 피부"'],
        currentWinner: '"칙칙한 피부톤 고민?"',
      },
      {
        id: 'var_2',
        name: '오퍼',
        type: 'offer',
        variants: ['30% 할인', '본품+미니 증정', '2+1 번들'],
      },
      {
        id: 'var_3',
        name: '랜딩 상단',
        type: 'landing_hero',
        variants: ['문제 중심 헤드라인', '결과 중심 헤드라인', '후기 중심 헤드라인'],
      },
      {
        id: 'var_4',
        name: 'UGC 오프닝',
        type: 'ugc_opening',
        variants: ['얼굴 클로즈업', '제품 클로즈업', '사용 장면'],
      },
      {
        id: 'var_5',
        name: '타겟 연령',
        type: 'target',
        variants: ['25-30세 여성', '31-38세 여성', '전체 연령'],
      },
    ],
    priorities: [
      {
        id: 'pri_1',
        testName: '훅 메시지 A/B',
        variable: 'hook',
        impact: 8,
        confidence: 7,
        ease: 9,
        iceScore: 8.0,
        status: 'running',
      },
      {
        id: 'pri_2',
        testName: '오퍼 비교',
        variable: 'offer',
        impact: 9,
        confidence: 8,
        ease: 7,
        iceScore: 8.0,
        status: 'pending',
      },
      {
        id: 'pri_3',
        testName: '랜딩 헤드라인',
        variable: 'landing_hero',
        impact: 7,
        confidence: 6,
        ease: 8,
        iceScore: 7.0,
        status: 'pending',
      },
      {
        id: 'pri_4',
        testName: 'UGC 오프닝 훅',
        variable: 'ugc_opening',
        impact: 6,
        confidence: 5,
        ease: 9,
        iceScore: 6.7,
        status: 'pending',
      },
      {
        id: 'pri_5',
        testName: '타겟 연령대',
        variable: 'target',
        impact: 8,
        confidence: 6,
        ease: 6,
        iceScore: 6.7,
        status: 'completed',
      },
    ],
  },

  // ============ 6. Compliance ============
  compliance: {
    overallScore: 72,
    riskExpressions: [
      {
        id: 'risk_1',
        original: '피부 재생',
        riskLevel: 'high',
        riskType: '의약품 효능 표현',
        reason: '화장품은 "재생" 표현 사용 불가, 의약품으로 오인 가능',
        alternatives: ['피부 컨디션 케어', '피부 활력 케어', '피부 건강 도움'],
        location: 'Strategy > 핵심 메시지',
      },
      {
        id: 'risk_2',
        original: '즉시 효과',
        riskLevel: 'high',
        riskType: '과장 광고',
        reason: '즉각적 효과 단정은 과장 광고에 해당',
        alternatives: ['꾸준히 사용 시', '지속 사용 시 기대되는', '사용 후 느껴지는'],
        location: 'Ads > 헤드라인',
      },
      {
        id: 'risk_3',
        original: '주름 제거',
        riskLevel: 'high',
        riskType: '의약품 효능 표현',
        reason: '"제거"는 의료 행위 암시',
        alternatives: ['주름 케어에 도움', '주름 고민 완화', '탄력 케어'],
        location: 'Landing > Hero',
      },
      {
        id: 'risk_4',
        original: '100% 개선',
        riskLevel: 'medium',
        riskType: '단정적 표현',
        reason: '절대적 수치는 입증 어려움',
        alternatives: ['개선에 도움을 줄 수 있습니다', '많은 분들이 만족', '높은 만족도'],
        location: 'Creative > UGC',
      },
      {
        id: 'risk_5',
        original: '부작용 없음',
        riskLevel: 'medium',
        riskType: '단정적 표현',
        reason: '모든 사용자에게 적용 불가',
        alternatives: ['순한 포뮬러', '저자극 설계', '민감 피부 테스트 완료'],
        location: 'Landing > FAQ',
      },
      {
        id: 'risk_6',
        original: '의사 추천',
        riskLevel: 'low',
        riskType: '출처 필요',
        reason: '전문가 추천 시 출처 명시 필요',
        alternatives: ['피부과 전문의 94% 추천 (출처: OOO, 2024)', '전문가 테스트 완료'],
        location: 'Strategy > 서브 메시지',
      },
    ],
    platformWarnings: [
      {
        platform: 'Meta',
        warnings: [
          '전후 비교 이미지 사용 시 보정 여부 명확히 고지',
          '개인차 문구 필수 삽입',
          '가격 할인율 실제 판매가 기준 정확히 표기',
          '신체 이미지 과도한 클로즈업 심의 거부 가능',
        ],
        recommendation:
          'Meta는 신체 이미지 관련 광고에 엄격합니다. 긍정적 메시지 중심 구성, 개인차 문구 눈에 띄게 배치하세요.',
      },
      {
        platform: 'Google',
        warnings: [
          '최상급 표현(최고, 최초) 객관적 근거 필요',
          '임상 데이터 인용 시 출처/테스트 조건 명시',
          '리뷰 인용 시 작성자/작성일 표기',
          '착륙 페이지와 광고 내용 일치 필수',
        ],
        recommendation:
          'Google은 광고-랜딩 페이지 일관성을 중시합니다. 약속 내용 정확히 전달, 모든 주장에 근거 명시하세요.',
      },
      {
        platform: '네이버',
        warnings: [
          '체험단/협찬 콘텐츠 상단 명확히 표기',
          '"광고" 표시 눈에 띄는 위치 배치',
          '의약품 오인 효능 표현 금지',
          '타 브랜드 비하/직접 비교 금지',
        ],
        recommendation:
          '네이버는 체험단 표기와 광고 표시에 특히 엄격합니다. 투명한 정보 공개가 핵심입니다.',
      },
    ],
  },
};

// ============ 메인 페이지 컴포넌트 ============
export default function CampaignResultPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  // 상태 관리
  const [activeTab, setActiveTab] = useState<string | null>('strategy');
  const [safeMode, setSafeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [meta, setMeta] = useState<CampaignMeta | null>(null);

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: 실제 API 호출로 대체
        // const [resultRes, metaRes] = await Promise.all([
        //   fetch(`/api/campaigns/${campaignId}/result`),
        //   fetch(`/api/campaigns/${campaignId}`)
        // ]);
        // const resultData = await resultRes.json();
        // const metaData = await metaRes.json();

        await new Promise((resolve) => setTimeout(resolve, 800));
        setResult(mockCampaignResult);
        setMeta(mockCampaignMeta);
      } catch (err) {
        setError('캠페인 결과를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  // 다운로드 핸들러
  const handleDownload = async (format: 'json' | 'pdf' | 'csv') => {
    if (!result) return;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campaign-${campaignId}-result.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    // TODO: PDF, CSV 다운로드 구현
  };

  // 재생성 핸들러
  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      // TODO: 재생성 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // 재생성 후 데이터 다시 로드
    } catch (err) {
      setError('재생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 상태별 색상
  const getStatusColor = (status: CampaignMeta['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'processing':
        return 'yellow';
      case 'draft':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: CampaignMeta['status']) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'processing':
        return '생성 중';
      case 'draft':
        return '초안';
      default:
        return status;
    }
  };

  // 날짜 포맷
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <Center h="60vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="pink" />
          <Text c="dimmed">캠페인 결과를 불러오는 중...</Text>
        </Stack>
      </Center>
    );
  }

  // 에러 상태
  if (error || !result || !meta) {
    return (
      <Center h="60vh">
        <Alert color="red" title="오류 발생" icon={<IconAlertTriangle />}>
          {error || '데이터를 불러올 수 없습니다.'}
          <Button variant="light" mt="md" onClick={() => router.back()}>
            돌아가기
          </Button>
        </Alert>
      </Center>
    );
  }

  // 위험 표현 카운트
  const highRiskCount = result.compliance.riskExpressions.filter(
    (r) => r.riskLevel === 'high'
  ).length;

  return (
    <Stack gap="lg" p="md">
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <Anchor href="/dashboard/campaigns" size="sm">
          캠페인
        </Anchor>
        <Text size="sm" c="dimmed">
          {meta.productName}
        </Text>
      </Breadcrumbs>

      {/* 헤더 */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group>
            <ActionIcon variant="subtle" onClick={() => router.back()}>
              <IconArrowLeft size={20} />
            </ActionIcon>
            <div>
              <Group gap="xs" mb={4}>
                <Text fw={700} size="xl">
                  {meta.productName}
                </Text>
                <Badge color={getStatusColor(meta.status)} variant="light">
                  {getStatusLabel(meta.status)}
                </Badge>
                {result.compliance.overallScore >= 80 && (
                  <Badge
                    color="green"
                    variant="outline"
                    leftSection={<IconShieldCheck size={12} />}
                  >
                    규제 안전
                  </Badge>
                )}
              </Group>
              <Group gap="md">
                <Text size="sm" c="dimmed">
                  {meta.category}
                </Text>
                <Group gap={4}>
                  <IconClock size={14} className="text-gray-400" />
                  <Text size="sm" c="dimmed">
                    {formatDate(result.updatedAt)}
                  </Text>
                </Group>
              </Group>
            </div>
          </Group>

          <Group>
            {/* 다운로드 메뉴 */}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="light" leftSection={<IconDownload size={16} />}>
                  다운로드
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>형식 선택</Menu.Label>
                <Menu.Item
                  leftSection={<IconFileText size={14} />}
                  onClick={() => handleDownload('json')}
                >
                  JSON
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconFileText size={14} />}
                  onClick={() => handleDownload('pdf')}
                >
                  PDF 리포트
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconFileText size={14} />}
                  onClick={() => handleDownload('csv')}
                >
                  CSV
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            {/* 더보기 메뉴 */}
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="light" size="lg">
                  <IconDots size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconRefresh size={14} />} onClick={handleRegenerate}>
                  전체 재생성
                </Menu.Item>
                <Menu.Item leftSection={<IconCopy size={14} />}>캠페인 복제</Menu.Item>
                <Menu.Item leftSection={<IconShare size={14} />}>공유하기</Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                  삭제
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Button leftSection={<IconRefresh size={16} />} onClick={handleRegenerate}>
              재생성
            </Button>
          </Group>
        </Group>

        {/* 안전 모드 토글 */}
        <Group justify="space-between" p="sm" className="rounded-md bg-gray-50">
          <Group gap="xs">
            <ThemeIcon color="blue" variant="light" size="sm">
              <IconShieldCheck size={14} />
            </ThemeIcon>
            <div>
              <Text size="sm" fw={500}>
                표현 안전 모드
              </Text>
              <Text size="xs" c="dimmed">
                광고 규제에 안전한 표현만 표시 (isSafeMode: true)
              </Text>
            </div>
          </Group>
          <Switch
            checked={safeMode}
            onChange={(e) => setSafeMode(e.currentTarget.checked)}
            thumbIcon={safeMode ? <IconCheck size={10} /> : undefined}
          />
        </Group>
      </Card>

      {/* 메인 탭 */}
      <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
        <Tabs.List grow>
          <Tabs.Tab value="strategy" leftSection={<IconTarget size={16} />}>
            Strategy
          </Tabs.Tab>
          <Tabs.Tab value="ads" leftSection={<IconBrandMeta size={16} />}>
            Ads
          </Tabs.Tab>
          <Tabs.Tab value="creative" leftSection={<IconVideo size={16} />}>
            Creative
          </Tabs.Tab>
          <Tabs.Tab value="landing" leftSection={<IconFileText size={16} />}>
            Landing
          </Tabs.Tab>
          <Tabs.Tab value="experiment" leftSection={<IconFlask size={16} />}>
            Experiment
          </Tabs.Tab>
          <Tabs.Tab
            value="compliance"
            leftSection={<IconShieldCheck size={16} />}
            rightSection={
              highRiskCount > 0 ? (
                <Badge size="xs" color="red" variant="filled">
                  {highRiskCount}
                </Badge>
              ) : (
                <Badge size="xs" color="green" variant="filled">
                  <IconCheck size={10} />
                </Badge>
              )
            }
          >
            Compliance
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="strategy" pt="md">
          <StrategyTab data={result.strategy} />
        </Tabs.Panel>

        <Tabs.Panel value="ads" pt="md">
          <AdsTab data={result.ads} />
        </Tabs.Panel>

        <Tabs.Panel value="creative" pt="md">
          <CreativeTab />
        </Tabs.Panel>

        <Tabs.Panel value="landing" pt="md">
          <LandingTab data={result.landing} />
        </Tabs.Panel>

        <Tabs.Panel value="experiment" pt="md">
          <ExperimentTab data={result.experiment} />
        </Tabs.Panel>

        <Tabs.Panel value="compliance" pt="md">
          <ComplianceTab
            data={result.compliance}
            safeMode={safeMode}
            onSafeModeChange={setSafeMode}
          />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
