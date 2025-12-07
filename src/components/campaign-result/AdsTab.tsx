'use client';

import { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Paper,
  SimpleGrid,
  Button,
  ThemeIcon,
  Tabs,
  Accordion,
  CopyButton,
  ActionIcon,
  Switch,
  SegmentedControl,
  ScrollArea,
  Table,
  Chip,
} from '@mantine/core';
import {
  IconBrandMeta,
  IconBrandGoogle,
  IconCopy,
  IconCheck,
  IconRefresh,
  IconShieldCheck,
  IconMessageCircle,
  IconHash,
} from '@tabler/icons-react';
import { AdsResult, AdCopy } from '@/types/campaign-result';

interface AdsTabProps {
  data: AdsResult;
  onRegenerate?: (section: string, options?: Record<string, string>) => void;
}

export default function AdsTab({ data, onRegenerate }: AdsTabProps) {
  const [safeMode, setSafeMode] = useState(true);
  const [toneFilter, setToneFilter] = useState<string>('all');

  const filteredHeadlines = data.headlines.filter((h) => {
    if (safeMode && !h.isSafeMode) return false;
    if (toneFilter !== 'all' && h.tone !== toneFilter) return false;
    return true;
  });

  const filteredBodyTexts = data.bodyTexts.filter((b) => {
    if (safeMode && !b.isSafeMode) return false;
    return true;
  });

  const getClusterLabel = (type: string) => {
    switch (type) {
      case 'brand':
        return '브랜드';
      case 'concern':
        return '고민';
      case 'ingredient':
        return '성분';
      case 'comparison':
        return '비교';
      default:
        return type;
    }
  };

  const getClusterColor = (type: string) => {
    switch (type) {
      case 'brand':
        return 'pink';
      case 'concern':
        return 'blue';
      case 'ingredient':
        return 'green';
      case 'comparison':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Stack gap="lg">
      {/* 채널별 전략 */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">
          채널별 광고 전략
        </Title>

        <Tabs defaultValue="meta">
          <Tabs.List>
            <Tabs.Tab value="meta" leftSection={<IconBrandMeta size={16} />}>
              Meta
            </Tabs.Tab>
            <Tabs.Tab value="google" leftSection={<IconBrandGoogle size={16} />}>
              Google
            </Tabs.Tab>
            <Tabs.Tab value="naver">네이버</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="meta" pt="md">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <Paper withBorder p="md" radius="md">
                <Text fw={500} mb="sm">
                  🎯 캠페인 구조
                </Text>
                <Stack gap="xs">
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>
                      상단 퍼널 (인지/관심)
                    </Text>
                    {data.meta.campaignStructure.topFunnel.map((item, i) => (
                      <Badge key={i} variant="light" mr={4} mb={4}>
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <Text size="xs" c="dimmed" mb={4}>
                      리타겟팅
                    </Text>
                    {data.meta.campaignStructure.retarget.map((item, i) => (
                      <Badge key={i} variant="light" color="orange" mr={4} mb={4}>
                        {item}
                      </Badge>
                    ))}
                  </div>
                </Stack>
              </Paper>

              <Paper withBorder p="md" radius="md">
                <Text fw={500} mb="sm">
                  📊 소재 비중 추천
                </Text>
                <Stack gap="xs">
                  {data.meta.creativeRatio.map((item, i) => (
                    <Group key={i} justify="space-between">
                      <Text size="sm">{item.type}</Text>
                      <Badge>{item.ratio}%</Badge>
                    </Group>
                  ))}
                </Stack>
              </Paper>

              <Paper withBorder p="md" radius="md" className="md:col-span-2">
                <Text fw={500} mb="sm">
                  ⚡ 이벤트 최적화 추천
                </Text>
                <Stack gap="xs">
                  {data.meta.eventRecommendations.map((rec, i) => (
                    <Text key={i} size="sm">
                      • {rec}
                    </Text>
                  ))}
                </Stack>
              </Paper>
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="google" pt="md">
            <Paper withBorder p="md" radius="md">
              <Text fw={500} mb="md">
                🔍 키워드 클러스터
              </Text>
              <Stack gap="md">
                {data.google.keywordClusters.map((cluster, i) => (
                  <div key={i}>
                    <Badge color={getClusterColor(cluster.type)} mb="xs">
                      {getClusterLabel(cluster.type)}
                    </Badge>
                    <Group gap={4}>
                      {cluster.keywords.map((kw, j) => (
                        <Chip key={j} size="xs" variant="light">
                          {kw}
                        </Chip>
                      ))}
                    </Group>
                  </div>
                ))}
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="naver" pt="md">
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Paper withBorder p="md" radius="md">
                <Text fw={500} mb="sm">
                  🎨 톤 가이드
                </Text>
                <Text size="sm">{data.naver.toneGuide}</Text>
              </Paper>
              <Paper withBorder p="md" radius="md">
                <Text fw={500} mb="sm">
                  📎 확장소재
                </Text>
                <Group gap={4}>
                  {data.naver.extensionAssets.map((asset, i) => (
                    <Badge key={i} variant="light">
                      {asset}
                    </Badge>
                  ))}
                </Group>
              </Paper>
            </SimpleGrid>
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* 카피 번들 */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>광고 카피 번들</Title>
          <Group>
            <Switch
              label="표현 안전 모드"
              checked={safeMode}
              onChange={(e) => setSafeMode(e.currentTarget.checked)}
              color="green"
              thumbIcon={safeMode ? <IconShieldCheck size={12} /> : undefined}
            />
            <Button
              variant="light"
              size="xs"
              leftSection={<IconMessageCircle size={14} />}
              onClick={() => onRegenerate?.('copies', { style: 'review' })}
            >
              후기 기반으로 변환
            </Button>
          </Group>
        </Group>

        <SegmentedControl
          value={toneFilter}
          onChange={setToneFilter}
          data={[
            { value: 'all', label: '전체' },
            { value: '20s', label: '20대 톤' },
            { value: '30s', label: '30대 톤' },
            { value: 'neutral', label: '중립' },
          ]}
          mb="md"
        />

        <Accordion variant="separated" defaultValue="headlines">
          <Accordion.Item value="headlines">
            <Accordion.Control>
              <Group>
                <Text fw={500}>헤드라인</Text>
                <Badge>{filteredHeadlines.length}개</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <ScrollArea h={300}>
                <Stack gap="xs">
                  {filteredHeadlines.map((headline, i) => (
                    <Paper key={headline.id} withBorder p="sm" radius="sm">
                      <Group justify="space-between">
                        <Group gap="xs">
                          <Badge size="xs" variant="light">
                            {i + 1}
                          </Badge>
                          <Text size="sm">{headline.text}</Text>
                          {headline.tone && headline.tone !== 'neutral' && (
                            <Badge size="xs" color="violet">
                              {headline.tone}
                            </Badge>
                          )}
                          {!headline.isSafeMode && (
                            <Badge size="xs" color="yellow">
                              주의
                            </Badge>
                          )}
                        </Group>
                        <CopyButton value={headline.text}>
                          {({ copied, copy }) => (
                            <ActionIcon variant="subtle" size="sm" onClick={copy}>
                              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                            </ActionIcon>
                          )}
                        </CopyButton>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </ScrollArea>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="body">
            <Accordion.Control>
              <Group>
                <Text fw={500}>본문 카피</Text>
                <Badge>{filteredBodyTexts.length}개</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <ScrollArea h={400}>
                <Stack gap="xs">
                  {filteredBodyTexts.map((body, i) => (
                    <Paper key={body.id} withBorder p="sm" radius="sm">
                      <Group justify="space-between" align="flex-start">
                        <Stack gap={4} style={{ flex: 1 }}>
                          <Group gap="xs">
                            <Badge size="xs" variant="light">
                              {i + 1}
                            </Badge>
                            {body.type && (
                              <Badge
                                size="xs"
                                color={
                                  body.type === 'review_based'
                                    ? 'yellow'
                                    : body.type === 'urgency'
                                      ? 'red'
                                      : 'blue'
                                }
                              >
                                {body.type === 'review_based'
                                  ? '후기형'
                                  : body.type === 'urgency'
                                    ? '긴급성'
                                    : '혜택형'}
                              </Badge>
                            )}
                            {!body.isSafeMode && (
                              <Badge size="xs" color="yellow">
                                주의
                              </Badge>
                            )}
                          </Group>
                          <Text size="sm">{body.text}</Text>
                        </Stack>
                        <CopyButton value={body.text}>
                          {({ copied, copy }) => (
                            <ActionIcon variant="subtle" size="sm" onClick={copy}>
                              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                            </ActionIcon>
                          )}
                        </CopyButton>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </ScrollArea>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="cta">
            <Accordion.Control>
              <Group>
                <Text fw={500}>CTA</Text>
                <Badge>{data.ctas.length}개</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <SimpleGrid cols={{ base: 2, md: 3 }}>
                {data.ctas.map((cta) => (
                  <Paper key={cta.id} withBorder p="sm" radius="sm">
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        {cta.text}
                      </Text>
                      <CopyButton value={cta.text}>
                        {({ copied, copy }) => (
                          <ActionIcon variant="subtle" size="sm" onClick={copy}>
                            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                          </ActionIcon>
                        )}
                      </CopyButton>
                    </Group>
                  </Paper>
                ))}
              </SimpleGrid>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>
    </Stack>
  );
}
