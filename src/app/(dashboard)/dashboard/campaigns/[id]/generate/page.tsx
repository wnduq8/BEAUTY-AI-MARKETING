'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Title,
  Text,
  Card,
  Group,
  Button,
  Stack,
  Paper,
  ThemeIcon,
  Badge,
  Progress,
  Alert,
  Accordion,
  CopyButton,
  ActionIcon,
  Tooltip,
  SimpleGrid,
  Loader,
  Divider,
  Timeline,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconSparkles,
  IconCheck,
  IconX,
  IconRefresh,
  IconCopy,
  IconFileText,
  IconTarget,
  IconGift,
  IconSpeakerphone,
  IconPhoto,
  IconPlayerPlay,
  IconDownload,
  IconAlertCircle,
  IconCircleCheck,
  IconCircleDashed,
  IconLoader,
} from '@tabler/icons-react';
import {
  GenerationStep,
  GenerationStepStatus,
  GENERATION_STEPS,
  ChannelContent,
  Creative,
  CHANNEL_OPTIONS,
  CREATIVE_TYPE_OPTIONS,
} from '@/types/campaign';

// Mock 생성 결과
const mockGenerationResult = {
  briefSummary: `
**캠페인 요약**
- 상품: 시카 진정 토너 (그린라인)
- 목적: 신규 고객 획득
- 기간: 2024.07.01 ~ 2024.07.31
- 예산: 100만원 ~ 300만원
- 채널: Meta, 네이버
- 타겟: 마스크 트러블 20대, 홍조/진정 고민 20~30대
  `,
  offerMessage: {
    headline: '민감해진 피부, 시카로 진정하세요',
    subHeadline: '병풀추출물 80% 고함량 진정 토너',
    urgency: '7월 한정 20% 할인',
    cta: '지금 바로 진정 케어 시작하기',
  },
  channelContents: [
    {
      channel: 'meta' as const,
      headlines: [
        '마스크 트러블? 시카가 진정시켜드려요',
        '민감 피부도 OK! 순한 진정 토너',
        '피부과 전문의 추천 진정 케어',
      ],
      descriptions: [
        '병풀추출물 80% 고함량으로 즉각 진정! 민감성 피부 테스트 완료 ✓',
        '트러블, 홍조로 예민해진 피부를 위한 데일리 진정 케어',
        '첫 구매 20% 할인 + 무료배송 🚚',
      ],
      hashtags: ['#시카토너', '#진정케어', '#민감성피부', '#트러블케어', '#병풀추출물'],
      adCopies: [
        '마스크 때문에 트러블이 올라왔다면? 시카 진정 토너로 즉각 케어하세요. 병풀추출물 80% 고함량으로 예민해진 피부도 편안하게. 지금 첫 구매 20% 할인!',
        '민감한 피부도 안심하고 쓸 수 있는 진정 토너. 피부과 전문의 추천, 민감성 피부 테스트 완료. 7월 한정 특별 혜택을 놓치지 마세요.',
      ],
    },
    {
      channel: 'naver' as const,
      headlines: [
        '[7월특가] 시카 진정 토너 20% 할인',
        '민감성 피부 추천 진정 토너',
        '병풀 80% 고함량 진정 케어',
      ],
      descriptions: [
        '마스크 트러블/홍조 진정에 효과적! 민감성 피부 테스트 완료',
        '피부과 전문의 추천 진정 토너, 첫 구매 특별 할인',
      ],
    },
  ] as ChannelContent[],
  creatives: [
    {
      type: 'ugc' as const,
      title: 'UGC 스타일 숏폼 콘텐츠',
      hook: '마스크 때문에 피부가 너무 예민해졌는데...',
      script: `
[Hook - 0~3초]
"마스크 때문에 턱 라인 트러블이 미쳤는데..."

[Problem - 3~8초]
거울 보며 트러블 부위 보여주기
"진짜 뭘 발라도 진정이 안 되더라고요"

[Solution - 8~15초]
시카 토너 보여주며
"근데 이거 쓰고 진짜 달라졌어요"
"병풀이 80%나 들어있대요"

[Result - 15~25초]
피부 클로즈업
"보이시나요? 확실히 진정됐죠?"
"자극 없이 순해서 매일 쓰기 좋아요"

[CTA - 25~30초]
"지금 첫 구매 20% 할인 중이에요"
"링크 타고 가세요~"
      `,
      visualDirection: '자연광, 세로형 9:16, 자막 필수, 진정 전후 비교 강조',
    },
    {
      type: 'ingredient_card' as const,
      title: '성분 카드뉴스',
      script: `
[슬라이드 1]
"내 피부가 왜 이렇게 예민해졌지?"
(붉어진 피부 일러스트)

[슬라이드 2]
"마스크, 미세먼지, 스트레스..."
"외부 자극으로 지친 피부"

[슬라이드 3]
"시카(병풀)가 답이에요"
"진정 + 피부장벽 강화"

[슬라이드 4]
핵심 성분 인포그래픽
- 병풀추출물 80%
- 판테놀 5%
- 알란토인 2%

[슬라이드 5]
"민감성 피부 테스트 완료"
"피부과 전문의 추천"

[슬라이드 6]
CTA + 할인 정보
      `,
      visualDirection: '깔끔한 그린 톤, 성분 구조 일러스트, 임상 데이터 그래프',
    },
  ] as Creative[],
};

export default function CampaignGeneratePage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState<GenerationStep | null>(null);
  const [steps, setSteps] = useState<GenerationStepStatus[]>(
    GENERATION_STEPS.map((s) => ({
      step: s.step,
      status: 'pending',
      progress: 0,
    }))
  );
  const [result, setResult] = useState<typeof mockGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      const step = GENERATION_STEPS[i];
      setCurrentStep(step.step);

      // 현재 스텝 processing
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'processing', progress: 0 } : s))
      );

      // 프로그레스 애니메이션
      for (let p = 0; p <= 100; p += 20) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, progress: p } : s)));
      }

      // 스텝 완료
      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'completed', progress: 100 } : s))
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setResult(mockGenerationResult);
    setIsComplete(true);
    setIsGenerating(false);
    setCurrentStep(null);

    notifications.show({
      title: '생성 완료!',
      message: '캠페인 콘텐츠가 성공적으로 생성되었습니다.',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

  const regenerateStep = async (stepKey: GenerationStep) => {
    const stepIndex = GENERATION_STEPS.findIndex((s) => s.step === stepKey);
    if (stepIndex === -1) return;

    setSteps((prev) =>
      prev.map((s, idx) => (idx === stepIndex ? { ...s, status: 'processing', progress: 0 } : s))
    );

    for (let p = 0; p <= 100; p += 25) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setSteps((prev) => prev.map((s, idx) => (idx === stepIndex ? { ...s, progress: p } : s)));
    }

    setSteps((prev) =>
      prev.map((s, idx) => (idx === stepIndex ? { ...s, status: 'completed', progress: 100 } : s))
    );

    notifications.show({
      title: '재생성 완료',
      message: `${GENERATION_STEPS[stepIndex].label} 섹션이 재생성되었습니다.`,
      color: 'green',
    });
  };

  const getStepIcon = (status: GenerationStepStatus['status']) => {
    switch (status) {
      case 'completed':
        return <IconCircleCheck size={20} className="text-green-500" />;
      case 'processing':
        return <Loader size={20} color="pink" />;
      case 'failed':
        return <IconX size={20} className="text-red-500" />;
      default:
        return <IconCircleDashed size={20} className="text-gray-300" />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* 헤더 */}
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="subtle" onClick={() => router.back()}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <div>
            <Title order={2}>캠페인 콘텐츠 생성</Title>
            <Text c="dimmed" size="sm">
              AI가 캠페인 브리프를 분석하고 마케팅 콘텐츠를 생성합니다.
            </Text>
          </div>
        </Group>
        {isComplete && (
          <Group>
            <Button variant="light" leftSection={<IconDownload size={16} />}>
              전체 다운로드
            </Button>
            <Button
              color="green"
              leftSection={<IconPlayerPlay size={16} />}
              onClick={() => router.push(`/dashboard/campaigns/${campaignId}`)}
            >
              캠페인 시작
            </Button>
          </Group>
        )}
      </Group>

      {/* 생성 진행 상태 */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="lg">
          <Group>
            <ThemeIcon size={40} color="pink" variant="light">
              <IconSparkles size={22} />
            </ThemeIcon>
            <div>
              <Text fw={600}>AI 콘텐츠 생성</Text>
              <Text size="sm" c="dimmed">
                {isGenerating ? '생성 중...' : isComplete ? '생성 완료!' : '생성을 시작하세요'}
              </Text>
            </div>
          </Group>
          {!isGenerating && !isComplete && (
            <Button color="pink" leftSection={<IconSparkles size={16} />} onClick={startGeneration}>
              생성 시작
            </Button>
          )}
        </Group>

        {/* 스텝 타임라인 */}
        <Timeline
          active={steps.filter((s) => s.status === 'completed').length}
          bulletSize={32}
          lineWidth={2}
        >
          {GENERATION_STEPS.map((step, index) => {
            const stepStatus = steps[index];
            return (
              <Timeline.Item
                key={step.step}
                bullet={getStepIcon(stepStatus.status)}
                title={
                  <Group justify="space-between">
                    <Text fw={500}>{step.label}</Text>
                    {stepStatus.status === 'completed' && isComplete && (
                      <Tooltip label="재생성">
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => regenerateStep(step.step)}
                        >
                          <IconRefresh size={14} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                }
              >
                <Text size="sm" c="dimmed">
                  {step.description}
                </Text>
                {stepStatus.status === 'processing' && (
                  <Progress
                    value={stepStatus.progress || 0}
                    size="sm"
                    color="pink"
                    mt="xs"
                    animated
                  />
                )}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </Card>

      {/* 에러 표시 */}
      {error && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
          <Button variant="light" color="red" size="xs" mt="sm" onClick={startGeneration}>
            다시 시도
          </Button>
        </Alert>
      )}

      {/* 생성 결과 */}
      {isComplete && result && (
        <Stack gap="md">
          {/* 브리프 요약 */}
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="md">
              <Group>
                <ThemeIcon color="blue" variant="light">
                  <IconFileText size={18} />
                </ThemeIcon>
                <Text fw={600}>브리프 요약</Text>
              </Group>
              <CopyButton value={result.briefSummary}>
                {({ copied, copy }) => (
                  <ActionIcon variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
            <Paper p="md" radius="md" className="bg-gray-50">
              <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                {result.briefSummary}
              </Text>
            </Paper>
          </Card>

          {/* 오퍼 메시지 */}
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="md">
              <Group>
                <ThemeIcon color="green" variant="light">
                  <IconGift size={18} />
                </ThemeIcon>
                <Text fw={600}>오퍼 메시지</Text>
              </Group>
              <ActionIcon variant="subtle" onClick={() => regenerateStep('offer')}>
                <IconRefresh size={16} />
              </ActionIcon>
            </Group>
            <Paper p="lg" radius="md" className="bg-gradient-to-r from-green-50 to-emerald-50">
              <Stack gap="xs">
                <Text size="xl" fw={700}>
                  {result.offerMessage.headline}
                </Text>
                <Text size="md" c="dimmed">
                  {result.offerMessage.subHeadline}
                </Text>
                {result.offerMessage.urgency && (
                  <Badge color="red" size="lg">
                    {result.offerMessage.urgency}
                  </Badge>
                )}
                <Button color="green" mt="sm" className="w-fit">
                  {result.offerMessage.cta}
                </Button>
              </Stack>
            </Paper>
          </Card>

          {/* 채널별 콘텐츠 */}
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="md">
              <Group>
                <ThemeIcon color="violet" variant="light">
                  <IconSpeakerphone size={18} />
                </ThemeIcon>
                <Text fw={600}>채널별 콘텐츠</Text>
              </Group>
              <ActionIcon variant="subtle" onClick={() => regenerateStep('channel')}>
                <IconRefresh size={16} />
              </ActionIcon>
            </Group>

            <Accordion variant="separated">
              {result.channelContents.map((content) => {
                const channelInfo = CHANNEL_OPTIONS.find((c) => c.value === content.channel);
                return (
                  <Accordion.Item key={content.channel} value={content.channel}>
                    <Accordion.Control>
                      <Group>
                        <Badge color={channelInfo?.color}>{channelInfo?.label}</Badge>
                        <Text size="sm" c="dimmed">
                          {content.headlines.length}개 헤드라인, {content.descriptions.length}개
                          설명
                        </Text>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="md">
                        <div>
                          <Text size="sm" fw={500} mb="xs">
                            헤드라인
                          </Text>
                          {content.headlines.map((headline, i) => (
                            <Paper key={i} withBorder p="sm" mb="xs" radius="sm">
                              <Group justify="space-between">
                                <Text size="sm">{headline}</Text>
                                <CopyButton value={headline}>
                                  {({ copied, copy }) => (
                                    <ActionIcon variant="subtle" size="sm" onClick={copy}>
                                      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                    </ActionIcon>
                                  )}
                                </CopyButton>
                              </Group>
                            </Paper>
                          ))}
                        </div>
                        <div>
                          <Text size="sm" fw={500} mb="xs">
                            설명
                          </Text>
                          {content.descriptions.map((desc, i) => (
                            <Paper key={i} withBorder p="sm" mb="xs" radius="sm">
                              <Group justify="space-between">
                                <Text size="sm">{desc}</Text>
                                <CopyButton value={desc}>
                                  {({ copied, copy }) => (
                                    <ActionIcon variant="subtle" size="sm" onClick={copy}>
                                      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                    </ActionIcon>
                                  )}
                                </CopyButton>
                              </Group>
                            </Paper>
                          ))}
                        </div>
                        {content.hashtags && (
                          <div>
                            <Text size="sm" fw={500} mb="xs">
                              해시태그
                            </Text>
                            <Group gap={4}>
                              {content.hashtags.map((tag) => (
                                <Badge key={tag} variant="light">
                                  {tag}
                                </Badge>
                              ))}
                            </Group>
                          </div>
                        )}
                        {content.adCopies && (
                          <div>
                            <Text size="sm" fw={500} mb="xs">
                              광고 카피
                            </Text>
                            {content.adCopies.map((copy, i) => (
                              <Paper
                                key={i}
                                withBorder
                                p="sm"
                                mb="xs"
                                radius="sm"
                                className="bg-gray-50"
                              >
                                <Text size="sm">{copy}</Text>
                              </Paper>
                            ))}
                          </div>
                        )}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Card>

          {/* 크리에이티브 가이드 */}
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="md">
              <Group>
                <ThemeIcon color="pink" variant="light">
                  <IconPhoto size={18} />
                </ThemeIcon>
                <Text fw={600}>크리에이티브 가이드</Text>
              </Group>
              <ActionIcon variant="subtle" onClick={() => regenerateStep('creative')}>
                <IconRefresh size={16} />
              </ActionIcon>
            </Group>

            <Accordion variant="separated">
              {result.creatives.map((creative, index) => {
                const creativeInfo = CREATIVE_TYPE_OPTIONS.find((c) => c.value === creative.type);
                return (
                  <Accordion.Item key={index} value={`creative-${index}`}>
                    <Accordion.Control>
                      <Group>
                        <Text size="lg">{creativeInfo?.emoji}</Text>
                        <div>
                          <Text size="sm" fw={500}>
                            {creative.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {creativeInfo?.description}
                          </Text>
                        </div>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="md">
                        {creative.hook && (
                          <div>
                            <Text size="sm" fw={500} mb="xs">
                              🎣 Hook
                            </Text>
                            <Paper withBorder p="sm" radius="sm" className="bg-yellow-50">
                              <Text size="sm" fw={500}>
                                "{creative.hook}"
                              </Text>
                            </Paper>
                          </div>
                        )}
                        <div>
                          <Text size="sm" fw={500} mb="xs">
                            📝 스크립트
                          </Text>
                          <Paper withBorder p="md" radius="sm" className="bg-gray-50">
                            <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                              {creative.script}
                            </Text>
                          </Paper>
                        </div>
                        {creative.visualDirection && (
                          <div>
                            <Text size="sm" fw={500} mb="xs">
                              🎨 비주얼 디렉션
                            </Text>
                            <Paper withBorder p="sm" radius="sm">
                              <Text size="sm">{creative.visualDirection}</Text>
                            </Paper>
                          </div>
                        )}
                        <Group justify="flex-end">
                          <CopyButton value={creative.script || ''}>
                            {({ copied, copy }) => (
                              <Button
                                variant="light"
                                size="xs"
                                leftSection={
                                  copied ? <IconCheck size={14} /> : <IconCopy size={14} />
                                }
                                onClick={copy}
                              >
                                {copied ? '복사됨' : '스크립트 복사'}
                              </Button>
                            )}
                          </CopyButton>
                        </Group>
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Card>
        </Stack>
      )}
    </div>
  );
}
