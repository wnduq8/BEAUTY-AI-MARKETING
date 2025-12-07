'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Title,
  Text,
  Card,
  Group,
  Badge,
  Button,
  TextInput,
  MultiSelect,
  Select,
  SimpleGrid,
  Stack,
  ActionIcon,
  Menu,
  Paper,
  Divider,
  Collapse,
  Progress,
  Avatar,
  ThemeIcon,
  NumberFormatter,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePickerInput } from '@mantine/dates';
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconDots,
  IconEdit,
  IconTrash,
  IconCopy,
  IconPlayerPlay,
  IconPlayerPause,
  IconChevronDown,
  IconChevronUp,
  IconSpeakerphone,
  IconCalendar,
  IconSparkles,
  IconEye,
  IconChartBar,
} from '@tabler/icons-react';
import {
  Campaign,
  CampaignStatus,
  CAMPAIGN_STATUS_OPTIONS,
  CAMPAIGN_PURPOSE_OPTIONS,
  CHANNEL_OPTIONS,
  OFFER_TYPE_OPTIONS,
  CampaignPurpose,
  CampaignChannel,
  OfferType,
} from '@/types/campaign';

// Mock 데이터
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    workspaceId: '1',
    name: '여름 시카 토너 신규 고객 캠페인',
    status: 'running',
    productId: '1',
    purpose: 'acquisition',
    period: {
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-31'),
    },
    budget: { min: 1000000, max: 3000000, currency: 'KRW' },
    offer: { type: 'discount', value: '20%', description: '첫 구매 20% 할인' },
    channels: ['meta', 'naver'],
    creativeTypes: ['ugc', 'ingredient_card'],
    targetSegments: [
      {
        id: '1',
        name: '마스크 트러블 20대',
        description: '마스크로 인한 트러블 고민',
        isAiRecommended: true,
      },
    ],
    guardrails: { forbiddenStrength: 'strict', referenceTone: 'review' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    workspaceId: '1',
    name: '레티놀 크림 재구매 캠페인',
    status: 'generated',
    productId: '2',
    purpose: 'repurchase',
    period: {
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-08-15'),
    },
    budget: { min: 500000, max: 1000000, currency: 'KRW' },
    offer: { type: 'gift', value: '미니어처 증정', description: '재구매 시 미니어처 증정' },
    channels: ['meta', 'email'],
    creativeTypes: ['before_after', 'review'],
    targetSegments: [
      {
        id: '2',
        name: '레티놀 입문 30대',
        description: '안티에이징 시작하는 30대',
        isAiRecommended: true,
      },
    ],
    guardrails: { forbiddenStrength: 'normal', referenceTone: 'professional' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    workspaceId: '1',
    name: '선크림 장바구니 전환 캠페인',
    status: 'draft',
    productId: '3',
    purpose: 'cart_conversion',
    period: {
      startDate: new Date('2024-08-10'),
      endDate: new Date('2024-08-20'),
    },
    budget: { min: 300000, max: 500000, currency: 'KRW' },
    offer: { type: 'free_shipping', description: '무료배송' },
    channels: ['naver', 'kakao'],
    creativeTypes: ['routine'],
    targetSegments: [],
    guardrails: { forbiddenStrength: 'normal', referenceTone: 'emotional' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpened, { toggle: toggleFilter }] = useDisclosure(false);

  // 필터 상태
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedOfferType, setSelectedOfferType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // 필터링
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedStatus.length > 0 && !selectedStatus.includes(campaign.status)) {
      return false;
    }
    if (selectedPurpose.length > 0 && !selectedPurpose.includes(campaign.purpose)) {
      return false;
    }
    if (
      selectedChannels.length > 0 &&
      !selectedChannels.some((c) => campaign.channels.includes(c as CampaignChannel))
    ) {
      return false;
    }
    if (selectedOfferType && campaign.offer.type !== selectedOfferType) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: CampaignStatus) => {
    return CAMPAIGN_STATUS_OPTIONS.find((s) => s.value === status)?.color || 'gray';
  };

  const getStatusLabel = (status: CampaignStatus) => {
    return CAMPAIGN_STATUS_OPTIONS.find((s) => s.value === status)?.label || status;
  };

  const getPurposeLabel = (purpose: CampaignPurpose) => {
    const option = CAMPAIGN_PURPOSE_OPTIONS.find((p) => p.value === purpose);
    return option ? `${option.emoji} ${option.label}` : purpose;
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedPurpose([]);
    setSelectedChannels([]);
    setSelectedOfferType(null);
    setDateRange([null, null]);
  };

  const activeFilterCount = [
    selectedStatus.length > 0,
    selectedPurpose.length > 0,
    selectedChannels.length > 0,
    selectedOfferType !== null,
    dateRange[0] !== null,
  ].filter(Boolean).length;

  const formatBudget = (budget: Campaign['budget']) => {
    const min = new Intl.NumberFormat('ko-KR').format(budget.min);
    const max = new Intl.NumberFormat('ko-KR').format(budget.max);
    return `${min}원 ~ ${max}원`;
  };

  const formatDateRange = (period: Campaign['period']) => {
    const start = new Date(period.startDate).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
    const end = new Date(period.endDate).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
    return `${start} ~ ${end}`;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Group justify="space-between">
        <div>
          <Title order={2}>캠페인</Title>
          <Text c="dimmed" size="sm">
            마케팅 캠페인을 생성하고 관리하세요.
          </Text>
        </div>
        <Button
          color="pink"
          leftSection={<IconPlus size={16} />}
          onClick={() => router.push('/dashboard/campaigns/new')}
        >
          새 캠페인 생성
        </Button>
      </Group>

      {/* 상태별 요약 */}
      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        {CAMPAIGN_STATUS_OPTIONS.slice(0, 4).map((status) => {
          const count = campaigns.filter((c) => c.status === status.value).length;
          return (
            <Card key={status.value} withBorder padding="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" tt="uppercase">
                    {status.label}
                  </Text>
                  <Text size="xl" fw={700}>
                    {count}
                  </Text>
                </div>
                <Badge color={status.color} size="lg" variant="light">
                  {status.label}
                </Badge>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* 검색 및 필터 */}
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" mb={filterOpened ? 'md' : 0}>
          <TextInput
            placeholder="캠페인명 검색..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md flex-1"
          />
          <Button
            variant={activeFilterCount > 0 ? 'filled' : 'light'}
            color={activeFilterCount > 0 ? 'pink' : 'gray'}
            leftSection={<IconFilter size={16} />}
            rightSection={
              filterOpened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />
            }
            onClick={toggleFilter}
          >
            필터 {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </Group>

        <Collapse in={filterOpened}>
          <Divider my="md" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <MultiSelect
              label="상태"
              placeholder="선택"
              data={CAMPAIGN_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
              value={selectedStatus}
              onChange={setSelectedStatus}
              clearable
            />
            <MultiSelect
              label="캠페인 목적"
              placeholder="선택"
              data={CAMPAIGN_PURPOSE_OPTIONS.map((p) => ({
                value: p.value,
                label: `${p.emoji} ${p.label}`,
              }))}
              value={selectedPurpose}
              onChange={setSelectedPurpose}
              clearable
            />
            <MultiSelect
              label="채널"
              placeholder="선택"
              data={CHANNEL_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
              value={selectedChannels}
              onChange={setSelectedChannels}
              clearable
            />
            <Select
              label="오퍼 유형"
              placeholder="선택"
              data={OFFER_TYPE_OPTIONS.map((o) => ({
                value: o.value,
                label: `${o.emoji} ${o.label}`,
              }))}
              value={selectedOfferType}
              onChange={setSelectedOfferType}
              clearable
            />
          </SimpleGrid>
          {activeFilterCount > 0 && (
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" size="xs" onClick={clearFilters}>
                필터 초기화
              </Button>
            </Group>
          )}
        </Collapse>
      </Paper>

      {/* 캠페인 수 */}
      <Text size="sm" c="dimmed">
        총 {filteredCampaigns.length}개 캠페인
      </Text>

      {/* 캠페인 리스트 */}
      {filteredCampaigns.length === 0 ? (
        <Paper withBorder p="xl" radius="md" className="text-center">
          <IconSpeakerphone size={48} className="mx-auto mb-4 text-gray-300" />
          <Text fw={500} mb="xs">
            캠페인이 없습니다
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            새 캠페인을 생성하고 AI 마케팅 콘텐츠를 만들어보세요.
          </Text>
          <Button
            color="pink"
            leftSection={<IconPlus size={16} />}
            onClick={() => router.push('/dashboard/campaigns/new')}
          >
            첫 캠페인 만들기
          </Button>
        </Paper>
      ) : (
        <Stack gap="md">
          {filteredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              withBorder
              padding="lg"
              radius="md"
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
            >
              <Group justify="space-between" align="flex-start">
                <Group align="flex-start" gap="md">
                  <ThemeIcon size={48} radius="md" color="pink" variant="light">
                    <IconSpeakerphone size={24} />
                  </ThemeIcon>
                  <div>
                    <Group gap="xs" mb={4}>
                      <Text fw={600} size="lg">
                        {campaign.name}
                      </Text>
                      <Badge color={getStatusColor(campaign.status)}>
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </Group>
                    <Group gap="md" mb="xs">
                      <Text size="sm" c="dimmed">
                        {getPurposeLabel(campaign.purpose)}
                      </Text>
                      <Text size="sm" c="dimmed">
                        <IconCalendar size={14} className="mr-1 inline" />
                        {formatDateRange(campaign.period)}
                      </Text>
                      <Text size="sm" c="dimmed">
                        💰 {formatBudget(campaign.budget)}
                      </Text>
                    </Group>
                    <Group gap={4}>
                      {campaign.channels.map((channel) => {
                        const opt = CHANNEL_OPTIONS.find((c) => c.value === channel);
                        return (
                          <Badge key={channel} size="xs" variant="outline" color={opt?.color}>
                            {opt?.label}
                          </Badge>
                        );
                      })}
                      {campaign.offer.type && (
                        <Badge size="xs" variant="light" color="green">
                          {OFFER_TYPE_OPTIONS.find((o) => o.value === campaign.offer.type)?.emoji}{' '}
                          {campaign.offer.value || campaign.offer.description}
                        </Badge>
                      )}
                    </Group>
                  </div>
                </Group>

                <Group gap="xs">
                  {campaign.status === 'generated' && (
                    <Button
                      size="xs"
                      color="green"
                      leftSection={<IconPlayerPlay size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        // 캠페인 시작 로직
                      }}
                    >
                      시작
                    </Button>
                  )}
                  {campaign.status === 'draft' && (
                    <Button
                      size="xs"
                      color="violet"
                      leftSection={<IconSparkles size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/campaigns/${campaign.id}/generate`);
                      }}
                    >
                      생성하기
                    </Button>
                  )}
                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <ActionIcon variant="subtle" onClick={(e) => e.stopPropagation()}>
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye size={14} />}>상세 보기</Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>수정</Menu.Item>
                      <Menu.Item leftSection={<IconCopy size={14} />}>복제</Menu.Item>
                      <Menu.Item leftSection={<IconChartBar size={14} />}>리포트</Menu.Item>
                      <Menu.Divider />
                      {campaign.status === 'running' && (
                        <Menu.Item leftSection={<IconPlayerPause size={14} />} color="yellow">
                          일시중지
                        </Menu.Item>
                      )}
                      <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                        삭제
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </div>
  );
}
