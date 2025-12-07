'use client';

import {
  Title,
  Text,
  Card,
  SimpleGrid,
  Group,
  ThemeIcon,
  Stack,
  Badge,
  Paper,
  Progress,
  RingProgress,
  Center,
} from '@mantine/core';
import {
  IconPackage,
  IconSpeakerphone,
  IconPhoto,
  IconChartBar,
  IconSparkles,
  IconTrendingUp,
  IconArrowUpRight,
} from '@tabler/icons-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';

const statsData = [
  { title: '등록 상품', value: '24', icon: IconPackage, color: 'pink', change: '+3' },
  { title: '진행 중 캠페인', value: '8', icon: IconSpeakerphone, color: 'violet', change: '+2' },
  { title: '생성 소재', value: '156', icon: IconPhoto, color: 'cyan', change: '+28' },
  { title: '이번 달 리포트', value: '12', icon: IconChartBar, color: 'green', change: '+5' },
];

const recentCampaigns = [
  { name: '여름 신상품 SNS 캠페인', status: '진행중', progress: 75, type: 'SNS' },
  { name: '인플루언서 협업 콘텐츠', status: '검토중', progress: 90, type: 'UGC' },
  { name: '7월 프로모션 랜딩페이지', status: '준비중', progress: 30, type: 'Landing' },
  { name: '뷰티 유튜버 협찬', status: '완료', progress: 100, type: 'Video' },
];

const recentAssets = [
  { name: '썸머 에디션 메인 배너', type: 'image', createdAt: '2시간 전' },
  { name: 'SNS 카피 세트 v3', type: 'copy', createdAt: '5시간 전' },
  { name: '인플루언서 브리핑 템플릿', type: 'template', createdAt: '1일 전' },
];

export default function DashboardPage() {
  const { currentWorkspace, workspaceSettings } = useWorkspace();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Paper p="lg" radius="md" className="bg-gradient-to-r from-pink-500 to-purple-500">
        <Group justify="space-between" align="flex-start">
          <Group>
            <ThemeIcon size={50} radius="md" variant="white" color="pink">
              <IconSparkles size={28} />
            </ThemeIcon>
            <div>
              <Title order={2} c="white">
                {currentWorkspace?.name || '워크스페이스'}
              </Title>
              <Text c="white" opacity={0.9} size="sm">
                AI 마케팅 어시스턴트가 준비되었습니다
              </Text>
            </div>
          </Group>
          <Badge color="white" variant="light" size="lg">
            {workspaceSettings?.brandTone ? '브랜드 설정 완료' : '브랜드 설정 필요'}
          </Badge>
        </Group>
      </Paper>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        {statsData.map((stat) => (
          <Card key={stat.title} withBorder padding="lg" radius="md">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {stat.title}
                </Text>
                <Group gap="xs" align="baseline">
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                  <Badge
                    size="sm"
                    color="green"
                    variant="light"
                    leftSection={<IconArrowUpRight size={10} />}
                  >
                    {stat.change}
                  </Badge>
                </Group>
              </div>
              <ThemeIcon color={stat.color} variant="light" size={38} radius="md">
                <stat.icon size={22} />
              </ThemeIcon>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {/* Recent Campaigns */}
        <Card withBorder padding="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={4}>최근 캠페인</Title>
            <Text size="sm" c="pink" className="cursor-pointer hover:underline">
              전체 보기
            </Text>
          </Group>
          <Stack gap="sm">
            {recentCampaigns.map((campaign) => (
              <Paper
                key={campaign.name}
                p="sm"
                withBorder
                radius="sm"
                className="cursor-pointer hover:bg-gray-50"
              >
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      {campaign.name}
                    </Text>
                    <Badge size="xs" variant="light">
                      {campaign.type}
                    </Badge>
                  </Group>
                  <Badge
                    size="sm"
                    color={
                      campaign.status === '진행중'
                        ? 'green'
                        : campaign.status === '검토중'
                          ? 'yellow'
                          : campaign.status === '완료'
                            ? 'gray'
                            : 'blue'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </Group>
                <Progress value={campaign.progress} color="pink" size="xs" />
              </Paper>
            ))}
          </Stack>
        </Card>

        {/* Recent Assets */}
        <Card withBorder padding="lg" radius="md">
          <Group justify="space-between" mb="md">
            <Title order={4}>최근 생성 소재</Title>
            <Text size="sm" c="pink" className="cursor-pointer hover:underline">
              전체 보기
            </Text>
          </Group>
          <Stack gap="sm">
            {recentAssets.map((asset) => (
              <Paper
                key={asset.name}
                p="sm"
                withBorder
                radius="sm"
                className="cursor-pointer hover:bg-gray-50"
              >
                <Group justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color={
                        asset.type === 'image' ? 'cyan' : asset.type === 'copy' ? 'pink' : 'violet'
                      }
                    >
                      <IconPhoto size={12} />
                    </ThemeIcon>
                    <Text size="sm">{asset.name}</Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {asset.createdAt}
                  </Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>

      {/* AI Usage Stats */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>이번 달 AI 사용량</Title>
          <Badge color="pink" variant="light">
            Pro Plan
          </Badge>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Paper p="md" withBorder radius="sm">
            <Center>
              <RingProgress
                size={100}
                thickness={8}
                sections={[{ value: 65, color: 'pink' }]}
                label={
                  <Text ta="center" size="sm" fw={700}>
                    65%
                  </Text>
                }
              />
            </Center>
            <Text ta="center" size="sm" mt="sm" fw={500}>
              캠페인 생성
            </Text>
            <Text ta="center" size="xs" c="dimmed">
              65 / 100 회
            </Text>
          </Paper>
          <Paper p="md" withBorder radius="sm">
            <Center>
              <RingProgress
                size={100}
                thickness={8}
                sections={[{ value: 42, color: 'violet' }]}
                label={
                  <Text ta="center" size="sm" fw={700}>
                    42%
                  </Text>
                }
              />
            </Center>
            <Text ta="center" size="sm" mt="sm" fw={500}>
              카피 생성
            </Text>
            <Text ta="center" size="xs" c="dimmed">
              420 / 1,000 회
            </Text>
          </Paper>
          <Paper p="md" withBorder radius="sm">
            <Center>
              <RingProgress
                size={100}
                thickness={8}
                sections={[{ value: 28, color: 'cyan' }]}
                label={
                  <Text ta="center" size="sm" fw={700}>
                    28%
                  </Text>
                }
              />
            </Center>
            <Text ta="center" size="sm" mt="sm" fw={500}>
              이미지 분석
            </Text>
            <Text ta="center" size="xs" c="dimmed">
              28 / 100 회
            </Text>
          </Paper>
        </SimpleGrid>
      </Card>
    </div>
  );
}
