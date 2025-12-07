'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Title,
  Text,
  Card,
  Group,
  Button,
  Stack,
  Badge,
  Paper,
  ThemeIcon,
  SimpleGrid,
  Tabs,
  ActionIcon,
  Menu,
  Divider,
  Progress,
  NumberFormatter,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconEdit,
  IconPlayerPlay,
  IconPlayerPause,
  IconSparkles,
  IconDots,
  IconTrash,
  IconCopy,
  IconChartBar,
  IconSpeakerphone,
  IconTarget,
  IconGift,
  IconCalendar,
  IconUsers,
  IconPhoto,
  IconFileText,
  IconDownload,
} from '@tabler/icons-react';
import {
  CAMPAIGN_STATUS_OPTIONS,
  CAMPAIGN_PURPOSE_OPTIONS,
  CHANNEL_OPTIONS,
  CREATIVE_TYPE_OPTIONS,
  OFFER_TYPE_OPTIONS,
} from '@/types/campaign';

import { CampaignStatus } from '@/types/campaign';

// Mock 캠페인 데이터
const mockCampaign = {
  id: '1',
  workspaceId: '1',
  name: '여름 시카 토너 신규 고객 캠페인',
  status: 'running' as CampaignStatus,
  productId: '1',
  product: {
    name: '시카 진정 토너',
    line: '그린라인',
    price: 28000,
  },
  purpose: 'acquisition',
  period: {
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
  },
  budget: { min: 1000000, max: 3000000, currency: 'KRW' },
  spent: 1250000,
  offer: { type: 'discount', value: '20%', description: '첫 구매 20% 할인' },
  channels: ['meta', 'naver'],
  creativeTypes: ['ugc', 'ingredient_card'],
  targetSegments: [
    { id: '1', name: '마스크 트러블 20대', description: '마스크로 인한 트러블 고민' },
    { id: '2', name: '홍조/진정 고민 20~30대', description: '홍조와 진정 케어가 필요한 타겟' },
  ],
  guardrails: { forbiddenStrength: 'strict', referenceTone: 'review' },
  metrics: {
    impressions: 125000,
    clicks: 4500,
    conversions: 180,
    ctr: 3.6,
    cvr: 4.0,
    roas: 2.8,
  },
};

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign] = useState(mockCampaign);

  const statusInfo = CAMPAIGN_STATUS_OPTIONS.find((s) => s.value === campaign.status);
  const purposeInfo = CAMPAIGN_PURPOSE_OPTIONS.find((p) => p.value === campaign.purpose);
  const offerInfo = OFFER_TYPE_OPTIONS.find((o) => o.value === campaign.offer.type);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const budgetProgress = (campaign.spent / campaign.budget.max) * 100;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="subtle" onClick={() => router.push('/dashboard/campaigns')}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <div>
            <Group gap="sm">
              <Title order={2}>{campaign.name}</Title>
              <Badge color={statusInfo?.color} size="lg">
                {statusInfo?.label}
              </Badge>
            </Group>
            <Text c="dimmed" size="sm">
              {purposeInfo?.emoji} {purposeInfo?.label} · {formatDate(campaign.period.startDate)} ~{' '}
              {formatDate(campaign.period.endDate)}
            </Text>
          </div>
        </Group>
        <Group>
          {campaign.status === 'running' && (
            <Button variant="light" color="yellow" leftSection={<IconPlayerPause size={16} />}>
              일시중지
            </Button>
          )}
          {campaign.status === 'generated' && (
            <Button color="green" leftSection={<IconPlayerPlay size={16} />}>
              캠페인 시작
            </Button>
          )}
          <Button variant="light" leftSection={<IconEdit size={16} />}>
            수정
          </Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconCopy size={14} />}>복제</Menu.Item>
              <Menu.Item leftSection={<IconDownload size={14} />}>다운로드</Menu.Item>
              <Menu.Item
                leftSection={<IconSparkles size={14} />}
                onClick={() => router.push(`/dashboard/campaigns/${campaignId}/generate`)}
              >
                재생성
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                삭제
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {/* 성과 요약 (진행중인 경우) */}
      {campaign.status === 'running' && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }}>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed" tt="uppercase">
              노출수
            </Text>
            <Text size="xl" fw={700}>
              <NumberFormatter value={campaign.metrics.impressions} thousandSeparator />
            </Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed" tt="uppercase">
              클릭수
            </Text>
            <Text size="xl" fw={700}>
              <NumberFormatter value={campaign.metrics.clicks} thousandSeparator />
            </Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed" tt="uppercase">
              전환수
            </Text>
            <Text size="xl" fw={700}>
              <NumberFormatter value={campaign.metrics.conversions} thousandSeparator />
            </Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed" tt="uppercase">
              CTR
            </Text>
            <Text size="xl" fw={700}>
              {campaign.metrics.ctr}%
            </Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed" tt="uppercase">
              CVR
            </Text>
            <Text size="xl" fw={700}>
              {campaign.metrics.cvr}%
            </Text>
          </Card>
          <Card withBorder padding="md">
            <Text size="xs" c="dimmed" tt="uppercase">
              ROAS
            </Text>
            <Text size="xl" fw={700} c="green">
              {campaign.metrics.roas}x
            </Text>
          </Card>
        </SimpleGrid>
      )}

      {/* 탭 */}
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconFileText size={16} />}>
            개요
          </Tabs.Tab>
          <Tabs.Tab value="creatives" leftSection={<IconPhoto size={16} />}>
            크리에이티브
          </Tabs.Tab>
          <Tabs.Tab value="performance" leftSection={<IconChartBar size={16} />}>
            성과
          </Tabs.Tab>
        </Tabs.List>

        {/* 개요 탭 */}
        <Tabs.Panel value="overview" pt="md">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            {/* 상품 정보 */}
            <Card withBorder padding="lg">
              <Group mb="md">
                <ThemeIcon color="pink" variant="light">
                  <IconSpeakerphone size={18} />
                </ThemeIcon>
                <Text fw={600}>연결 상품</Text>
              </Group>
              <Paper withBorder p="md" radius="md">
                <Text fw={500}>{campaign.product.name}</Text>
                <Text size="sm" c="dimmed">
                  {campaign.product.line}
                </Text>
                <Text size="sm" fw={500} c="pink" mt="xs">
                  <NumberFormatter value={campaign.product.price} thousandSeparator suffix="원" />
                </Text>
              </Paper>
            </Card>

            {/* 오퍼 정보 */}
            <Card withBorder padding="lg">
              <Group mb="md">
                <ThemeIcon color="green" variant="light">
                  <IconGift size={18} />
                </ThemeIcon>
                <Text fw={600}>오퍼</Text>
              </Group>
              <Paper withBorder p="md" radius="md" className="bg-green-50">
                <Group gap="xs" mb="xs">
                  <Text size="lg">{offerInfo?.emoji}</Text>
                  <Text fw={500}>{offerInfo?.label}</Text>
                </Group>
                <Text size="xl" fw={700}>
                  {campaign.offer.value}
                </Text>
                <Text size="sm" c="dimmed">
                  {campaign.offer.description}
                </Text>
              </Paper>
            </Card>

            {/* 예산 */}
            <Card withBorder padding="lg">
              <Group mb="md">
                <ThemeIcon color="blue" variant="light">
                  <IconTarget size={18} />
                </ThemeIcon>
                <Text fw={600}>예산</Text>
              </Group>
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    사용금액
                  </Text>
                  <Text fw={500}>
                    <NumberFormatter value={campaign.spent} thousandSeparator suffix="원" />
                  </Text>
                </Group>
                <Progress
                  value={budgetProgress}
                  color={budgetProgress > 80 ? 'red' : 'blue'}
                  size="lg"
                />
                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    <NumberFormatter value={campaign.budget.min} thousandSeparator />원
                  </Text>
                  <Text size="xs" c="dimmed">
                    <NumberFormatter value={campaign.budget.max} thousandSeparator />원
                  </Text>
                </Group>
              </Stack>
            </Card>

            {/* 채널 */}
            <Card withBorder padding="lg">
              <Group mb="md">
                <ThemeIcon color="violet" variant="light">
                  <IconSpeakerphone size={18} />
                </ThemeIcon>
                <Text fw={600}>채널</Text>
              </Group>
              <Group gap="xs">
                {campaign.channels.map((channel) => {
                  const info = CHANNEL_OPTIONS.find((c) => c.value === channel);
                  return (
                    <Badge key={channel} color={info?.color} size="lg">
                      {info?.label}
                    </Badge>
                  );
                })}
              </Group>
            </Card>

            {/* 타겟 세그먼트 */}
            <Card withBorder padding="lg">
              <Group mb="md">
                <ThemeIcon color="cyan" variant="light">
                  <IconUsers size={18} />
                </ThemeIcon>
                <Text fw={600}>타겟 세그먼트</Text>
              </Group>
              <Stack gap="xs">
                {campaign.targetSegments.map((segment) => (
                  <Paper key={segment.id} withBorder p="sm" radius="sm">
                    <Text size="sm" fw={500}>
                      {segment.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {segment.description}
                    </Text>
                  </Paper>
                ))}
              </Stack>
            </Card>

            {/* 크리에이티브 타입 */}
            <Card withBorder padding="lg">
              <Group mb="md">
                <ThemeIcon color="orange" variant="light">
                  <IconPhoto size={18} />
                </ThemeIcon>
                <Text fw={600}>크리에이티브 타입</Text>
              </Group>
              <Group gap="xs">
                {campaign.creativeTypes.map((type) => {
                  const info = CREATIVE_TYPE_OPTIONS.find((c) => c.value === type);
                  return (
                    <Badge key={type} variant="light" size="lg">
                      {info?.emoji} {info?.label}
                    </Badge>
                  );
                })}
              </Group>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        {/* 크리에이티브 탭 */}
        <Tabs.Panel value="creatives" pt="md">
          <Card withBorder padding="lg">
            <Group justify="space-between" mb="md">
              <Text fw={600}>생성된 크리에이티브</Text>
              <Button
                variant="light"
                leftSection={<IconSparkles size={16} />}
                onClick={() => router.push(`/dashboard/campaigns/${campaignId}/generate`)}
              >
                크리에이티브 보기/재생성
              </Button>
            </Group>
            <Text c="dimmed" size="sm">
              생성된 크리에이티브는 생성 페이지에서 확인할 수 있습니다.
            </Text>
          </Card>
        </Tabs.Panel>

        {/* 성과 탭 */}
        <Tabs.Panel value="performance" pt="md">
          <Card withBorder padding="lg">
            <Text fw={600} mb="md">
              성과 리포트
            </Text>
            <Text c="dimmed" size="sm">
              캠페인이 진행 중이면 상세 성과 데이터가 표시됩니다.
            </Text>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
