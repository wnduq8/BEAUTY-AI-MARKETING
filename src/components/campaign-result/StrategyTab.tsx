'use client';

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
  Accordion,
  List,
  Divider,
  CopyButton,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconBulb,
  IconUsers,
  IconGift,
  IconTarget,
  IconRefresh,
  IconPlus,
  IconCopy,
  IconCheck,
  IconAlertTriangle,
  IconSparkles,
} from '@tabler/icons-react';
import { StrategyResult, Persona, OfferOption, MarketingAngle } from '@/types/campaign-result';

interface StrategyTabProps {
  data: StrategyResult;
  onRegenerate?: (section: string) => void;
}

// Mock 데이터
const mockStrategy: StrategyResult = {
  coreMessage: '마스크로 예민해진 피부, 시카가 진정시켜드려요',
  subMessages: [
    '병풀추출물 80% 고함량으로 즉각적인 진정 효과',
    '민감성 피부 테스트 완료, 자극 없이 순하게',
    '첫 구매 20% 할인, 지금 시작하세요',
  ],
  personas: [
    {
      id: '1',
      name: '마스크 트러블러 지은',
      age: '25세',
      skinType: '복합성/민감성',
      concerns: ['마스크로 인한 턱라인 트러블', '피부가 쉽게 붉어짐', '기존 제품 자극 느낌'],
      situation: '재택근무 끝나고 다시 출근, 마스크 착용 시간 증가',
      objections: ['시카 제품 많은데 뭐가 다른지?', '효과 얼마나 걸리나요?', '끈적이면 싫은데'],
      triggers: [
        '피부과 가기 전에 셀프케어 시도',
        '동료가 피부 좋아졌다고 물어봄',
        '인스타에서 광고 봄',
      ],
    },
    {
      id: '2',
      name: '홍조 고민러 수빈',
      age: '28세',
      skinType: '건성/민감성',
      concerns: ['볼 부분 상시 홍조', '온도 변화에 민감', '화장이 안 먹음'],
      situation: '미팅 많은 직장인, 홍조 때문에 자신감 저하',
      objections: ['홍조에 진짜 효과 있나요?', '피부과 치료가 낫지 않나?', '가격 대비 용량?'],
      triggers: ['중요한 미팅 전 피부 관리', '계절 변화 시 피부 예민', '친구 추천'],
    },
    {
      id: '3',
      name: '성분 꼼꼼러 현정',
      age: '32세',
      skinType: '복합성',
      concerns: ['트러블 반복', '성분에 민감한 반응', '순한 제품 찾기 어려움'],
      situation: '화해 앱으로 성분 체크하는 습관, EWG 등급 중시',
      objections: ['전성분 공개되어 있나요?', '임상 테스트 결과는?', '피부과 테스트 받았나요?'],
      triggers: ['화해 앱 추천', '성분 관련 콘텐츠', '피부과 의사 추천'],
    },
  ],
  offers: [
    {
      id: 1,
      type: 'discount',
      value: '20% 할인',
      description: '첫 구매 고객 한정 20% 할인',
      margin: 'medium',
      label: 'recommended',
      reasoning: '신규 유입률 높고 재구매 전환 유도에 효과적. 마진 20% 수준 유지.',
    },
    {
      id: 2,
      type: 'gift',
      value: '미니어처 증정',
      description: '본품 구매 시 10ml 미니어처 증정',
      margin: 'high',
      label: 'recommended',
      reasoning: '원가 부담 낮고 재구매 전환 효과 높음. SNS 언박싱 콘텐츠 유도.',
    },
    {
      id: 3,
      type: 'set',
      value: '1+1',
      description: '2개 구매 시 30% 할인',
      margin: 'low',
      label: 'caution',
      reasoning: '객단가 상승하지만 마진율 급감. 재고 소진 시에만 권장.',
    },
  ],
  angles: [
    {
      id: '1',
      type: 'problem_solution',
      title: '문제해결형',
      headline: '마스크 트러블, 더 이상 참지 마세요',
      description:
        '마스크 착용으로 예민해진 피부 고민을 시카가 해결해드립니다. 문제 상황에 공감하고 솔루션을 제시하는 앵글.',
    },
    {
      id: '2',
      type: 'ingredient_evidence',
      title: '성분근거형',
      headline: '병풀추출물 80%, 피부과 전문의가 추천하는 이유',
      description: '고함량 시카 성분과 임상 데이터를 강조. 성분 중시하는 타겟에게 효과적.',
    },
    {
      id: '3',
      type: 'review_trust',
      title: '후기신뢰형',
      headline: '"진짜 진정됐어요" 2,847개 리뷰가 증명합니다',
      description: '실제 사용자 후기와 평점을 전면에 배치. 사회적 증거로 신뢰도 구축.',
    },
  ],
};

export default function StrategyTab({ data = mockStrategy, onRegenerate }: StrategyTabProps) {
  const getOfferLabelColor = (label: OfferOption['label']) => {
    switch (label) {
      case 'recommended':
        return 'green';
      case 'caution':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getOfferLabelText = (label: OfferOption['label']) => {
    switch (label) {
      case 'recommended':
        return '추천';
      case 'caution':
        return '주의';
      default:
        return '보통';
    }
  };

  const getAngleIcon = (type: MarketingAngle['type']) => {
    switch (type) {
      case 'problem_solution':
        return '🎯';
      case 'ingredient_evidence':
        return '🔬';
      case 'review_trust':
        return '⭐';
    }
  };

  return (
    <Stack gap="lg">
      {/* 핵심 메시지 */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group>
            <ThemeIcon color="pink" variant="light" size="lg">
              <IconBulb size={20} />
            </ThemeIcon>
            <Title order={4}>핵심 메시지</Title>
          </Group>
          <CopyButton value={data.coreMessage}>
            {({ copied, copy }) => (
              <ActionIcon variant="subtle" onClick={copy}>
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            )}
          </CopyButton>
        </Group>

        <Paper p="lg" radius="md" className="bg-gradient-to-r from-pink-50 to-purple-50">
          <Text size="xl" fw={700} ta="center">
            "{data.coreMessage}"
          </Text>
        </Paper>

        <Divider my="md" label="서브 메시지" labelPosition="center" />

        <Stack gap="xs">
          {data.subMessages.map((msg, idx) => (
            <Paper key={idx} withBorder p="sm" radius="sm">
              <Group justify="space-between">
                <Group gap="xs">
                  <Badge size="sm" variant="light">
                    {idx + 1}
                  </Badge>
                  <Text size="sm">{msg}</Text>
                </Group>
                <CopyButton value={msg}>
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
      </Card>

      {/* 페르소나 */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group>
            <ThemeIcon color="violet" variant="light" size="lg">
              <IconUsers size={20} />
            </ThemeIcon>
            <Title order={4}>타겟 페르소나</Title>
          </Group>
          <Badge>{data.personas.length}명</Badge>
        </Group>

        <Accordion variant="separated">
          {data.personas.map((persona) => (
            <Accordion.Item key={persona.id} value={persona.id}>
              <Accordion.Control>
                <Group>
                  <Text fw={500}>{persona.name}</Text>
                  <Badge size="sm" variant="light">
                    {persona.age}
                  </Badge>
                  <Badge size="sm" variant="outline">
                    {persona.skinType}
                  </Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <Paper withBorder p="sm" radius="sm">
                    <Text size="xs" c="dimmed" fw={500} mb="xs">
                      😰 피부 고민
                    </Text>
                    <List size="sm" spacing="xs">
                      {persona.concerns.map((c, i) => (
                        <List.Item key={i}>{c}</List.Item>
                      ))}
                    </List>
                  </Paper>
                  <Paper withBorder p="sm" radius="sm">
                    <Text size="xs" c="dimmed" fw={500} mb="xs">
                      📍 상황
                    </Text>
                    <Text size="sm">{persona.situation}</Text>
                  </Paper>
                  <Paper withBorder p="sm" radius="sm">
                    <Text size="xs" c="dimmed" fw={500} mb="xs">
                      🤔 반론/의심
                    </Text>
                    <List size="sm" spacing="xs">
                      {persona.objections.map((o, i) => (
                        <List.Item key={i}>{o}</List.Item>
                      ))}
                    </List>
                  </Paper>
                  <Paper withBorder p="sm" radius="sm">
                    <Text size="xs" c="dimmed" fw={500} mb="xs">
                      ⚡ 구매 트리거
                    </Text>
                    <List size="sm" spacing="xs">
                      {persona.triggers.map((t, i) => (
                        <List.Item key={i}>{t}</List.Item>
                      ))}
                    </List>
                  </Paper>
                </SimpleGrid>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card>

      {/* 오퍼 옵션 */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group>
            <ThemeIcon color="green" variant="light" size="lg">
              <IconGift size={20} />
            </ThemeIcon>
            <Title order={4}>오퍼 옵션</Title>
          </Group>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconRefresh size={14} />}
            onClick={() => onRegenerate?.('offers')}
          >
            오퍼만 다시 뽑기
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }}>
          {data.offers.map((offer) => (
            <Paper
              key={offer.id}
              withBorder
              p="md"
              radius="md"
              className={offer.label === 'recommended' ? 'border-green-400 bg-green-50' : ''}
            >
              <Group justify="space-between" mb="sm">
                <Badge color={getOfferLabelColor(offer.label)}>
                  {offer.label === 'caution' && <IconAlertTriangle size={12} className="mr-1" />}
                  {getOfferLabelText(offer.label)}
                </Badge>
                <Badge
                  variant="outline"
                  color={
                    offer.margin === 'high' ? 'green' : offer.margin === 'medium' ? 'yellow' : 'red'
                  }
                >
                  마진{' '}
                  {offer.margin === 'high' ? '높음' : offer.margin === 'medium' ? '보통' : '낮음'}
                </Badge>
              </Group>
              <Text size="lg" fw={700} mb="xs">
                {offer.value}
              </Text>
              <Text size="sm" c="dimmed" mb="sm">
                {offer.description}
              </Text>
              <Paper p="xs" radius="sm" className="bg-gray-50">
                <Text size="xs" c="dimmed">
                  {offer.reasoning}
                </Text>
              </Paper>
            </Paper>
          ))}
        </SimpleGrid>
      </Card>

      {/* 추천 앵글 */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group>
            <ThemeIcon color="orange" variant="light" size="lg">
              <IconTarget size={20} />
            </ThemeIcon>
            <Title order={4}>추천 앵글 3종</Title>
          </Group>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={() => onRegenerate?.('angles')}
          >
            앵글 추가 생성
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }}>
          {data.angles.map((angle) => (
            <Paper key={angle.id} withBorder p="md" radius="md">
              <Group gap="xs" mb="sm">
                <Text size="xl">{getAngleIcon(angle.type)}</Text>
                <Badge variant="light">{angle.title}</Badge>
              </Group>
              <Text fw={600} mb="xs">
                "{angle.headline}"
              </Text>
              <Text size="sm" c="dimmed">
                {angle.description}
              </Text>
              <Group justify="flex-end" mt="sm">
                <CopyButton value={angle.headline}>
                  {({ copied, copy }) => (
                    <Button variant="subtle" size="xs" onClick={copy}>
                      {copied ? '복사됨' : '헤드라인 복사'}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>
      </Card>
    </Stack>
  );
}
