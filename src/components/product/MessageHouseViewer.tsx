'use client';

import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Paper,
  Accordion,
  CopyButton,
  ActionIcon,
  Tooltip,
  Divider,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import {
  IconCopy,
  IconCheck,
  IconBulb,
  IconSparkles,
  IconShieldCheck,
  IconMessageQuestion,
  IconRefresh,
} from '@tabler/icons-react';
import { MessageHouse } from '@/types/product';

interface MessageHouseViewerProps {
  messageHouse: MessageHouse;
  onRegenerate?: (section: string) => void;
}

// Mock 데이터 (실제로는 props로 받음)
const mockMessageHouse: MessageHouse = {
  version: 1,
  bigIdea: '민감한 피부도 안심하고 쓸 수 있는 시카 진정 케어, 피부 본연의 힘을 깨우다',
  uspExpressions: [
    '병풀추출물 80% 고함량으로 즉각적인 진정 효과',
    '민감성 피부 테스트 완료, 자극 없이 순하게',
    '트러블 부위에 집중 케어, 하루만에 달라지는 피부결',
    '촉촉함은 유지하면서 끈적임 없는 산뜻한 마무리',
    '피부과 전문의 추천, 믿을 수 있는 진정 솔루션',
    '아침저녁 데일리 케어로 건강한 피부 밸런스',
    '외부 자극으로 지친 피부의 회복을 돕는 포뮬러',
    '홍조와 열감을 케어하는 쿨링 진정 효과',
    '가성비와 효과를 동시에, 합리적인 스킨케어',
    '자연 유래 성분으로 피부에 순하게, 지구에도 순하게',
  ],
  safeCopies: [
    '피부 고민, 시카로 진정시키세요',
    '민감해진 피부를 위한 순한 선택',
    '트러블 피부도 편안하게 케어',
    '진정이 필요한 순간, 시카 토너',
    '촉촉하게 진정, 산뜻하게 마무리',
    '매일 쓰는 진정 토너의 새로운 기준',
    '붉어진 피부, 시카로 케어하세요',
    '자극 없이 순하게, 효과는 확실하게',
    '피부 진정의 첫 단계, 시카 토너',
    '예민해진 피부를 위한 데일리 진정 케어',
  ],
  objectionHandling: [
    {
      question: '민감한 피부인데 자극 없을까요?',
      answer:
        '민감성 피부 테스트를 완료한 제품으로, 자극 없이 순하게 사용하실 수 있어요. 병풀추출물이 피부를 진정시켜 예민해진 피부도 편안하게 케어해드립니다.',
    },
    {
      question: '트러블 피부에도 효과가 있나요?',
      answer:
        '시카 성분이 트러블로 예민해진 피부를 진정시키고, 피부 장벽 강화에 도움을 줍니다. 트러블 부위에 꾸준히 사용하시면 피부결 개선에 도움이 됩니다.',
    },
    {
      question: '끈적이지 않나요?',
      answer:
        '에센스 타입이지만 빠르게 흡수되어 끈적임 없이 산뜻하게 마무리됩니다. 아침 메이크업 전에도 부담 없이 사용하실 수 있어요.',
    },
    {
      question: '어떤 피부 타입에 좋나요?',
      answer:
        '민감성, 복합성 피부에 특히 추천드리며, 트러블이나 홍조 고민이 있는 모든 피부 타입에 사용하실 수 있습니다.',
    },
    {
      question: '다른 제품과 같이 써도 되나요?',
      answer:
        '네, 세안 후 토너 단계에서 사용하시고 이후 평소 루틴대로 케어하시면 됩니다. 다른 진정 제품과 함께 사용하시면 시너지 효과를 볼 수 있어요.',
    },
    {
      question: '얼마나 써야 효과가 있나요?',
      answer:
        '피부 진정은 사용 직후부터 느끼실 수 있고, 꾸준한 피부결 개선은 2-4주 정도 사용 후 체감하실 수 있습니다.',
    },
    {
      question: '향이 강하지 않나요?',
      answer:
        '인공 향료를 최소화하여 은은한 허브향만 나며, 향에 민감한 분들도 편하게 사용하실 수 있습니다.',
    },
    {
      question: '용량 대비 가격이 어떤가요?',
      answer:
        '200ml 대용량으로 약 2개월 사용 가능하며, 같은 용량 대비 합리적인 가격으로 가성비가 뛰어납니다.',
    },
    {
      question: '수입 제품인가요?',
      answer: '국내에서 연구 개발하고 생산한 제품으로, 한국인 피부에 맞게 설계되었습니다.',
    },
    {
      question: '임산부도 사용 가능한가요?',
      answer:
        '자극 성분을 배제한 순한 처방이지만, 임신 중에는 개인 피부 상태가 다를 수 있으니 의사와 상담 후 사용을 권장드립니다.',
    },
  ],
  createdAt: new Date(),
};

export function MessageHouseViewer({
  messageHouse = mockMessageHouse,
  onRegenerate,
}: MessageHouseViewerProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Group>
          <ThemeIcon color="violet" variant="light" size="lg">
            <IconSparkles size={20} />
          </ThemeIcon>
          <div>
            <Title order={4}>메시지 하우스</Title>
            <Text size="xs" c="dimmed">
              v{messageHouse.version} •{' '}
              {new Date(messageHouse.createdAt).toLocaleDateString('ko-KR')}
            </Text>
          </div>
        </Group>
        <Badge color="violet">AI 생성</Badge>
      </Group>

      <Stack gap="lg">
        {/* Big Idea */}
        <Paper withBorder p="md" radius="md" className="bg-violet-50">
          <Group justify="space-between" mb="xs">
            <Group gap="xs">
              <IconBulb size={18} className="text-violet-600" />
              <Text fw={600} c="violet">
                Big Idea
              </Text>
            </Group>
            <CopyButton value={messageHouse.bigIdea}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? '복사됨' : '복사'}>
                  <ActionIcon variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
          <Text size="lg" fw={500}>
            "{messageHouse.bigIdea}"
          </Text>
        </Paper>

        <Accordion variant="separated">
          {/* 핵심 USP 표현 */}
          <Accordion.Item value="usp">
            <Accordion.Control icon={<IconSparkles size={18} className="text-pink-500" />}>
              <Group>
                <Text fw={500}>핵심 USP 표현</Text>
                <Badge size="sm">{messageHouse.uspExpressions.length}개</Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                {messageHouse.uspExpressions.map((usp, index) => (
                  <Paper key={index} withBorder p="sm" radius="sm">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <Badge size="xs" variant="light">
                          {index + 1}
                        </Badge>
                        <Text size="sm">{usp}</Text>
                      </Group>
                      <CopyButton value={usp}>
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
            </Accordion.Panel>
          </Accordion.Item>

          {/* 금칙어 안전 카피 */}
          <Accordion.Item value="safe">
            <Accordion.Control icon={<IconShieldCheck size={18} className="text-green-500" />}>
              <Group>
                <Text fw={500}>금칙어 안전 카피</Text>
                <Badge size="sm" color="green">
                  {messageHouse.safeCopies.length}개
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {messageHouse.safeCopies.map((copy, index) => (
                  <Paper key={index} withBorder p="sm" radius="sm">
                    <Group justify="space-between">
                      <Text size="sm">{copy}</Text>
                      <CopyButton value={copy}>
                        {({ copied, copy: doCopy }) => (
                          <ActionIcon variant="subtle" size="sm" onClick={doCopy}>
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

          {/* 반론 처리 Q&A */}
          <Accordion.Item value="objection">
            <Accordion.Control icon={<IconMessageQuestion size={18} className="text-blue-500" />}>
              <Group>
                <Text fw={500}>반론 처리 Q&A</Text>
                <Badge size="sm" color="blue">
                  {messageHouse.objectionHandling.length}개
                </Badge>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                {messageHouse.objectionHandling.map((qa, index) => (
                  <Paper key={index} withBorder p="md" radius="sm">
                    <Group gap="xs" mb="xs">
                      <Badge color="blue" variant="light">
                        Q{index + 1}
                      </Badge>
                      <Text size="sm" fw={500}>
                        {qa.question}
                      </Text>
                    </Group>
                    <Text size="sm" c="dimmed" pl={36}>
                      {qa.answer}
                    </Text>
                    <Group justify="flex-end" mt="xs">
                      <CopyButton value={`Q: ${qa.question}\nA: ${qa.answer}`}>
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
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Card>
  );
}
