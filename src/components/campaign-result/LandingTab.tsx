'use client';

import { useState } from 'react';
import {
  Card,
  Text,
  Stack,
  Group,
  Badge,
  Button,
  Paper,
  SimpleGrid,
  Timeline,
  Accordion,
  CopyButton,
  ActionIcon,
  Tooltip,
  Modal,
  Textarea,
  Select,
  ThemeIcon,
  Divider,
  Box,
  RingProgress,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconRefresh,
  IconPlus,
  IconCopy,
  IconCheck,
  IconEye,
  IconEdit,
  IconSparkles,
  IconQuote,
  IconMoodSmile,
  IconDroplet,
  IconLeaf,
  IconAlertCircle,
  IconDownload,
  IconAlertTriangle,
  IconGift,
  IconMessage,
  IconTargetArrow,
  IconBulb,
  IconStarFilled,
} from '@tabler/icons-react';
import { LandingResult, HeroSection, LandingSection, ReviewCluster } from '@/types/campaign-result';

// ============ Props 인터페이스 ============
interface LandingTabProps {
  data: LandingResult;
  onRegenerateHero?: (count: number) => void;
  onAddFAQ?: (count: number) => void;
}

// ============ 메인 컴포넌트 ============
export default function LandingTab({ data, onRegenerateHero, onAddFAQ }: LandingTabProps) {
  const [variantsOpened, { open: openVariants, close: closeVariants }] = useDisclosure(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [editMode, setEditMode] = useState(false);
  const [editedHero, setEditedHero] = useState<HeroSection>(data.heroSection);

  // 섹션 타입별 아이콘
  const getSectionIcon = (type: LandingSection['type']) => {
    switch (type) {
      case 'problem':
        return IconAlertTriangle;
      case 'solution':
        return IconBulb;
      case 'evidence':
        return IconTargetArrow;
      case 'review':
        return IconQuote;
      case 'faq':
        return IconMessage;
      case 'offer':
        return IconGift;
      case 'cta':
        return IconSparkles;
      default:
        return IconBulb;
    }
  };

  // 섹션 타입별 색상
  const getSectionColor = (type: LandingSection['type']) => {
    switch (type) {
      case 'problem':
        return 'red';
      case 'solution':
        return 'blue';
      case 'evidence':
        return 'violet';
      case 'review':
        return 'yellow';
      case 'faq':
        return 'gray';
      case 'offer':
        return 'green';
      case 'cta':
        return 'pink';
      default:
        return 'gray';
    }
  };

  // 리뷰 클러스터 아이콘
  const getClusterIcon = (category: string) => {
    switch (category) {
      case '피부톤':
        return IconSparkles;
      case '보습력':
        return IconDroplet;
      case '흡수력':
        return IconLeaf;
      case '자극':
        return IconAlertCircle;
      default:
        return IconMoodSmile;
    }
  };

  // 리뷰 클러스터 색상
  const getClusterColor = (category: string) => {
    switch (category) {
      case '피부톤':
        return 'pink';
      case '보습력':
        return 'blue';
      case '흡수력':
        return 'green';
      case '자극':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  // 감성 색상
  const getSentimentColor = (sentiment: ReviewCluster['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'green';
      case 'neutral':
        return 'yellow';
      case 'negative':
        return 'red';
      default:
        return 'gray';
    }
  };

  // 감성 퍼센트 (더미)
  const getSentimentPercent = (sentiment: ReviewCluster['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 92;
      case 'neutral':
        return 68;
      case 'negative':
        return 25;
      default:
        return 50;
    }
  };

  // 선택된 Hero (variants에서)
  const currentHero = editMode
    ? editedHero
    : data.heroSection.variants?.[selectedVariantIndex] || data.heroSection;

  // Hero 텍스트 복사용
  const getHeroCopyText = (hero: HeroSection) => {
    return `헤드라인: ${hero.headline}\n서브: ${hero.subHeadline}\n근거: ${hero.evidence.join(' | ')}\nCTA: ${hero.cta}`;
  };

  return (
    <Stack gap="md">
      {/* ========== 상단 1스크롤 (Hero Section) ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="pink" variant="light">
              <IconEye size={18} />
            </ThemeIcon>
            <Text fw={600}>상단 1스크롤 (Hero Section)</Text>
          </Group>
          <Group>
            <Button
              variant="light"
              size="xs"
              leftSection={<IconEdit size={14} />}
              onClick={() => {
                if (editMode) {
                  setEditMode(false);
                } else {
                  setEditedHero(currentHero);
                  setEditMode(true);
                }
              }}
            >
              {editMode ? '미리보기' : '직접 수정'}
            </Button>
            <Button
              variant="filled"
              size="xs"
              leftSection={<IconSparkles size={14} />}
              onClick={openVariants}
            >
              상단만 5안 생성
            </Button>
          </Group>
        </Group>

        {/* Hero 미리보기 / 수정 모드 */}
        <Paper
          p="xl"
          radius="md"
          className="border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-violet-50"
        >
          {editMode ? (
            <Stack gap="md">
              <TextInput
                label="헤드라인"
                value={editedHero.headline}
                onChange={(e) => setEditedHero({ ...editedHero, headline: e.target.value })}
              />
              <TextInput
                label="서브 헤드라인"
                value={editedHero.subHeadline}
                onChange={(e) => setEditedHero({ ...editedHero, subHeadline: e.target.value })}
              />
              <Textarea
                label="근거/신뢰 요소 (줄바꿈으로 구분)"
                value={editedHero.evidence.join('\n')}
                onChange={(e) =>
                  setEditedHero({
                    ...editedHero,
                    evidence: e.target.value.split('\n').filter(Boolean),
                  })
                }
                autosize
                minRows={2}
              />
              <Select
                label="CTA 버튼"
                value={editedHero.cta}
                onChange={(v) => setEditedHero({ ...editedHero, cta: v || '' })}
                data={[
                  '첫 구매 30% 할인 받기',
                  '지금 시작하기',
                  '무료 샘플 받기',
                  '자세히 보기',
                  '후기 확인하기',
                  '성분 자세히 보기',
                  '부담 없이 시작하기',
                ]}
              />
              <Group justify="flex-end">
                <Button variant="light" onClick={() => setEditMode(false)}>
                  취소
                </Button>
                <Button onClick={() => setEditMode(false)}>저장</Button>
              </Group>
            </Stack>
          ) : (
            <Stack align="center" gap="md">
              <Text size="xl" fw={700} ta="center" className="text-gray-800">
                {currentHero.headline}
              </Text>
              <Text size="md" c="dimmed" ta="center">
                {currentHero.subHeadline}
              </Text>
              <Group gap="xs" justify="center" wrap="wrap">
                {currentHero.evidence.map((ev, i) => (
                  <Badge key={i} variant="outline" color="gray">
                    {ev}
                  </Badge>
                ))}
              </Group>
              <Button color="pink" size="lg" mt="sm">
                {currentHero.cta}
              </Button>
            </Stack>
          )}
        </Paper>

        {/* 복사 버튼 */}
        <Group justify="flex-end" mt="md">
          <CopyButton value={getHeroCopyText(currentHero)}>
            {({ copied, copy }) => (
              <Button
                variant="subtle"
                size="xs"
                leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                onClick={copy}
              >
                {copied ? '복사됨!' : '텍스트 복사'}
              </Button>
            )}
          </CopyButton>
        </Group>
      </Card>

      {/* ========== 랜딩 페이지 전체 구조 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Text fw={600}>문제-해결-근거-후기-FAQ-오퍼-CTA 구조</Text>
          <Button variant="light" size="xs" leftSection={<IconDownload size={14} />}>
            구조 내보내기
          </Button>
        </Group>

        <Timeline active={-1} bulletSize={36} lineWidth={2}>
          {data.fullStructure.map((section) => {
            const IconComponent = getSectionIcon(section.type);
            const color = getSectionColor(section.type);

            return (
              <Timeline.Item
                key={section.order}
                bullet={
                  <ThemeIcon
                    size={36}
                    radius="xl"
                    color={color}
                    variant={
                      section.order === 1 || section.order === data.fullStructure.length
                        ? 'filled'
                        : 'light'
                    }
                  >
                    <IconComponent size={18} />
                  </ThemeIcon>
                }
              >
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Group gap="xs" mb={4}>
                      <Text fw={600}>{section.title}</Text>
                      <Badge size="xs" variant="light" color={color}>
                        {section.type}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {section.content}
                    </Text>
                  </div>
                  <Group gap={4}>
                    <CopyButton value={`${section.title}\n${section.content}`}>
                      {({ copied, copy }) => (
                        <Tooltip label={copied ? '복사됨!' : '복사'}>
                          <ActionIcon
                            variant="subtle"
                            color={copied ? 'green' : 'gray'}
                            onClick={copy}
                          >
                            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                    <Tooltip label="수정">
                      <ActionIcon variant="subtle" color="gray">
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Card>

      {/* ========== 리뷰 하이라이트 (클러스터링) ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="violet" variant="light">
              <IconQuote size={18} />
            </ThemeIcon>
            <Text fw={600}>리뷰 하이라이트 (클러스터링)</Text>
          </Group>
          <Badge variant="light" color="violet">
            총 {data.reviewHighlights.reduce((acc, c) => acc + c.count, 0).toLocaleString()}건 분석
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          {data.reviewHighlights.map((cluster, i) => {
            const IconComponent = getClusterIcon(cluster.category);
            const color = getClusterColor(cluster.category);
            const sentimentPercent = getSentimentPercent(cluster.sentiment);

            return (
              <Paper key={i} withBorder p="md" radius="md" className="relative overflow-hidden">
                {/* 배경 장식 */}
                <Box className="absolute top-0 right-0 h-16 w-16 opacity-5">
                  <IconComponent size={64} />
                </Box>

                <Group justify="space-between" mb="sm">
                  <Group gap="xs">
                    <ThemeIcon color={color} variant="light" size="sm">
                      <IconComponent size={14} />
                    </ThemeIcon>
                    <Text fw={600}>{cluster.category}</Text>
                  </Group>
                  <RingProgress
                    size={40}
                    thickness={4}
                    sections={[
                      { value: sentimentPercent, color: getSentimentColor(cluster.sentiment) },
                    ]}
                    label={
                      <Text size="xs" ta="center" fw={600}>
                        {sentimentPercent}%
                      </Text>
                    }
                  />
                </Group>

                <Group gap="xs" mb="xs">
                  <Text size="lg" fw={700}>
                    {cluster.count.toLocaleString()}건
                  </Text>
                  <Badge size="xs" variant="light" color={getSentimentColor(cluster.sentiment)}>
                    {cluster.sentiment === 'positive'
                      ? '긍정'
                      : cluster.sentiment === 'neutral'
                        ? '중립'
                        : '부정'}
                  </Badge>
                </Group>

                <Divider my="xs" />

                <Text size="xs" c="dimmed" mb="xs">
                  주요 키워드
                </Text>
                <Group gap={4}>
                  {cluster.highlights.map((highlight, j) => (
                    <Badge key={j} size="xs" variant="outline" color={color}>
                      {highlight}
                    </Badge>
                  ))}
                </Group>

                {/* 대표 후기 미리보기 */}
                <Paper p="xs" mt="sm" radius="sm" className="bg-gray-50">
                  <Text size="xs" c="dimmed" lineClamp={2}>
                    "{cluster.highlights[0]} 효과가 정말 좋아요. {cluster.category} 만족합니다!"
                  </Text>
                </Paper>
              </Paper>
            );
          })}
        </SimpleGrid>

        {/* 전체 감성 분석 요약 */}
        <Paper p="md" mt="md" radius="md" className="bg-gradient-to-r from-green-50 to-blue-50">
          <Group justify="space-between">
            <div>
              <Text size="sm" fw={500}>
                전체 감성 분석
              </Text>
              <Text size="xs" c="dimmed">
                AI가 분석한 리뷰 감성 점수
              </Text>
            </div>
            <Group gap="lg">
              <div className="text-center">
                <Text size="xl" fw={700} c="green">
                  {data.reviewHighlights.filter((r) => r.sentiment === 'positive').length}
                </Text>
                <Text size="xs" c="dimmed">
                  긍정 카테고리
                </Text>
              </div>
              <div className="text-center">
                <Text size="xl" fw={700} c="yellow">
                  {data.reviewHighlights.filter((r) => r.sentiment === 'neutral').length}
                </Text>
                <Text size="xs" c="dimmed">
                  중립 카테고리
                </Text>
              </div>
              <div className="text-center">
                <Text size="xl" fw={700} c="red">
                  {data.reviewHighlights.filter((r) => r.sentiment === 'negative').length}
                </Text>
                <Text size="xs" c="dimmed">
                  부정 카테고리
                </Text>
              </div>
            </Group>
          </Group>
        </Paper>
      </Card>

      {/* ========== FAQ 섹션 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="gray" variant="light">
              <IconMessage size={18} />
            </ThemeIcon>
            <Text fw={600}>FAQ</Text>
            <Badge variant="light">
              {data.fullStructure.find((s) => s.type === 'faq')?.content.split('?').length || 0}개
            </Badge>
          </Group>
          <Button
            variant="filled"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={() => onAddFAQ?.(10)}
          >
            FAQ 10개 추가
          </Button>
        </Group>

        {/* FAQ 콘텐츠 파싱 (간단한 구조) */}
        <Accordion variant="separated">
          {data.fullStructure
            .find((s) => s.type === 'faq')
            ?.content.split('?')
            .filter((q) => q.trim())
            .map((question, i) => (
              <Accordion.Item key={i} value={i.toString()}>
                <Accordion.Control>
                  <Group justify="space-between" pr="md">
                    <Text fw={500}>{question.trim()}?</Text>
                    <CopyButton value={`Q: ${question.trim()}?`}>
                      {({ copied, copy }) => (
                        <ActionIcon
                          component="div"
                          size="sm"
                          variant="subtle"
                          color={copied ? 'green' : 'gray'}
                          onClick={(e) => {
                            e.stopPropagation();
                            copy();
                          }}
                        >
                          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                        </ActionIcon>
                      )}
                    </CopyButton>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed">
                    네, 가능합니다. 자세한 내용은 제품 상세 페이지를 참고해 주세요.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
        </Accordion>
      </Card>

      {/* ========== Hero 변형 선택 모달 ========== */}
      <Modal
        opened={variantsOpened}
        onClose={closeVariants}
        size="xl"
        title={
          <Group gap="xs">
            <IconSparkles size={20} className="text-pink-500" />
            <Text fw={600}>상단 1스크롤 5안</Text>
          </Group>
        }
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            AI가 생성한 5가지 스타일의 상단 섹션입니다. 원하는 안을 선택하세요.
          </Text>

          {data.heroSection.variants?.map((variant, index) => {
            const styleLabels = [
              '결과 중심형',
              '문제 해결형',
              '후기 신뢰형',
              '성분 근거형',
              '행동 유도형',
            ];
            const scores = [92, 88, 85, 82, 79];

            return (
              <Paper
                key={index}
                withBorder
                p="md"
                radius="md"
                className={`cursor-pointer transition-all ${
                  selectedVariantIndex === index
                    ? 'border-pink-500 bg-pink-50'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedVariantIndex(index)}
              >
                <Group justify="space-between" mb="sm">
                  <Group gap="xs">
                    <Badge variant="light" color="violet">
                      {styleLabels[index]}
                    </Badge>
                    <Badge
                      variant="outline"
                      color={
                        scores[index] >= 90 ? 'green' : scores[index] >= 80 ? 'yellow' : 'gray'
                      }
                    >
                      <Group gap={4}>
                        <IconStarFilled size={10} />
                        예상 점수 {scores[index]}점
                      </Group>
                    </Badge>
                  </Group>
                  {selectedVariantIndex === index && <Badge color="pink">선택됨</Badge>}
                </Group>

                <Text fw={600} mb="xs">
                  {variant.headline}
                </Text>
                <Text size="sm" c="dimmed" mb="xs">
                  {variant.subHeadline}
                </Text>
                <Group gap="xs" mb="sm">
                  {variant.evidence.map((ev, i) => (
                    <Badge key={i} size="xs" variant="outline">
                      {ev}
                    </Badge>
                  ))}
                </Group>
                <Badge variant="light" color="green">
                  {variant.cta}
                </Badge>
              </Paper>
            );
          })}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeVariants}>
              취소
            </Button>
            <Button
              onClick={() => {
                const selectedVariant = data.heroSection.variants?.[selectedVariantIndex];
                if (selectedVariant) {
                  setEditedHero(selectedVariant);
                }
                closeVariants();
              }}
            >
              이 안으로 적용
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
