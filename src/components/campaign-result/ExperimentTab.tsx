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
  ThemeIcon,
  Table,
  Progress,
  SegmentedControl,
  Modal,
  NumberInput,
  Tooltip,
  ActionIcon,
  Divider,
  Checkbox,
  RingProgress,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendar,
  IconFlask,
  IconTarget,
  IconCoin,
  IconChartBar,
  IconPlayerPlay,
  IconAdjustments,
  IconCheck,
  IconInfoCircle,
  IconArrowRight,
  IconSparkles,
  IconClock,
  IconTrophy,
  IconGift,
  IconVideo,
  IconUsers,
} from '@tabler/icons-react';
import {
  ExperimentResult,
  ExperimentCalendar,
  ExperimentPhase,
  ExperimentVariable,
  ExperimentPriority,
} from '@/types/campaign-result';

// ============ 더미 데이터 ============
const mockExperimentData: ExperimentResult = {
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
        tests: ['타겟 테스트 (20대 vs 30대)', '크리에이티브 포맷 테스트'],
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
};

// ============ 예산 플랜 데이터 ============
interface BudgetPlan {
  budget: string;
  budgetValue: number;
  duration: string;
  focus: string;
  channels: string;
  expectedCTR: string;
  testCount: number;
}

const budgetPlans: BudgetPlan[] = [
  {
    budget: '100만원',
    budgetValue: 100,
    duration: '2주',
    focus: '핵심 변수 2개 테스트',
    channels: 'Meta 집중',
    expectedCTR: '15%',
    testCount: 2,
  },
  {
    budget: '300만원',
    budgetValue: 300,
    duration: '4주',
    focus: '변수 4개 + 스케일업',
    channels: 'Meta + Google',
    expectedCTR: '25%',
    testCount: 4,
  },
  {
    budget: '1000만원',
    budgetValue: 1000,
    duration: '8주',
    focus: '풀 퍼널 최적화',
    channels: 'Meta + Google + 네이버',
    expectedCTR: '40%',
    testCount: 8,
  },
];

// ============ Props 인터페이스 ============
interface ExperimentTabProps {
  data?: ExperimentResult;
  onChangeBudget?: (budgetValue: number) => void;
  onStartExperiment?: (priorityId: string) => void;
  onChangeDuration?: (duration: '2weeks' | '4weeks') => void;
}

// ============ 메인 컴포넌트 ============
export default function ExperimentTab({
  data = mockExperimentData,
  onChangeBudget,
  onStartExperiment,
  onChangeDuration,
}: ExperimentTabProps) {
  const [budgetModalOpened, { open: openBudgetModal, close: closeBudgetModal }] =
    useDisclosure(false);
  const [selectedBudget, setSelectedBudget] = useState<string>('300만원');
  const [calendarDuration, setCalendarDuration] = useState<'2weeks' | '4weeks'>(
    data.calendar.duration
  );
  const [customBudget, setCustomBudget] = useState<number>(300);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    data.priorities.filter((p) => p.status === 'running').map((p) => p.id)
  );

  // 변수 타입별 아이콘
  const getVariableIcon = (type: ExperimentVariable['type']) => {
    switch (type) {
      case 'hook':
        return IconTarget;
      case 'offer':
        return IconGift;
      case 'landing_hero':
        return IconChartBar;
      case 'ugc_opening':
        return IconVideo;
      case 'target':
        return IconUsers;
      default:
        return IconFlask;
    }
  };

  // 변수 타입별 색상
  const getVariableColor = (type: ExperimentVariable['type']) => {
    switch (type) {
      case 'hook':
        return 'pink';
      case 'offer':
        return 'green';
      case 'landing_hero':
        return 'blue';
      case 'ugc_opening':
        return 'violet';
      case 'target':
        return 'orange';
      default:
        return 'gray';
    }
  };

  // 변수 타입별 라벨
  const getVariableLabel = (type: ExperimentVariable['type']) => {
    switch (type) {
      case 'hook':
        return '훅';
      case 'offer':
        return '오퍼';
      case 'landing_hero':
        return '랜딩상단';
      case 'ugc_opening':
        return 'UGC오프닝';
      case 'target':
        return '타겟';
      default:
        return type;
    }
  };

  // 상태별 색상
  const getStatusColor = (status: ExperimentPriority['status']) => {
    switch (status) {
      case 'running':
        return 'blue';
      case 'completed':
        return 'green';
      case 'pending':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // 상태별 라벨
  const getStatusLabel = (status: ExperimentPriority['status']) => {
    switch (status) {
      case 'running':
        return '진행 중';
      case 'completed':
        return '완료';
      case 'pending':
        return '대기';
      default:
        return status;
    }
  };

  // ICE 점수 색상
  const getICEColor = (score: number) => {
    if (score >= 8) return 'green';
    if (score >= 6) return 'yellow';
    return 'red';
  };

  // 캘린더 기간 변경
  const handleDurationChange = (value: string) => {
    const duration = value as '2weeks' | '4weeks';
    setCalendarDuration(duration);
    onChangeDuration?.(duration);
  };

  // 2주 캘린더 데이터
  const get2WeeksPhases = (): ExperimentPhase[] => [
    { week: 1, focus: '핵심 테스트', tests: ['핵심 변수 A/B 테스트', '데이터 수집'], budget: 50 },
    { week: 2, focus: '최적화', tests: ['우승 조합 스케일업', '성과 리포트'], budget: 50 },
  ];

  // 현재 표시할 phases
  const currentPhases = calendarDuration === '2weeks' ? get2WeeksPhases() : data.calendar.phases;

  // 총 예산 계산
  const totalBudget = currentPhases.reduce((sum, phase) => sum + phase.budget, 0);

  // 선택된 실험 수
  const selectedCount = selectedPriorities.length;
  const runningCount = data.priorities.filter((p) => p.status === 'running').length;
  const completedCount = data.priorities.filter((p) => p.status === 'completed').length;

  return (
    <Stack gap="md">
      {/* ========== 실험 개요 ========== */}
      <Card
        withBorder
        padding="lg"
        radius="md"
        className="bg-gradient-to-r from-violet-50 to-pink-50"
      >
        <Group justify="space-between">
          <div>
            <Group gap="xs" mb="xs">
              <ThemeIcon color="violet" variant="filled">
                <IconFlask size={18} />
              </ThemeIcon>
              <Text fw={700} size="lg">
                A/B 테스트 실험실
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              체계적인 실험으로 최적의 마케팅 조합을 찾아보세요. ICE 프레임워크로 우선순위를 자동
              산정합니다.
            </Text>
          </div>
          <Stack align="flex-end" gap="xs">
            <Group gap="md">
              <div className="text-center">
                <Text size="xl" fw={700} c="blue">
                  {runningCount}
                </Text>
                <Text size="xs" c="dimmed">
                  진행 중
                </Text>
              </div>
              <div className="text-center">
                <Text size="xl" fw={700} c="green">
                  {completedCount}
                </Text>
                <Text size="xs" c="dimmed">
                  완료
                </Text>
              </div>
              <div className="text-center">
                <Text size="xl" fw={700} c="gray">
                  {data.priorities.length - runningCount - completedCount}
                </Text>
                <Text size="xs" c="dimmed">
                  대기
                </Text>
              </div>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* ========== 실험 캘린더 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="blue" variant="light">
              <IconCalendar size={18} />
            </ThemeIcon>
            <Text fw={600}>실험 캘린더</Text>
            <Badge variant="light" color="blue">
              총 예산 {totalBudget}만원
            </Badge>
          </Group>
          <SegmentedControl
            size="xs"
            value={calendarDuration}
            onChange={handleDurationChange}
            data={[
              { value: '2weeks', label: '2주 플랜' },
              { value: '4weeks', label: '4주 플랜' },
            ]}
          />
        </Group>

        <SimpleGrid cols={{ base: 2, md: calendarDuration === '2weeks' ? 2 : 4 }}>
          {currentPhases.map((phase, index) => (
            <Paper
              key={phase.week}
              withBorder
              p="md"
              radius="md"
              className={index === 0 ? 'border-violet-300 bg-violet-50' : ''}
            >
              <Group justify="space-between" mb="sm">
                <Badge
                  color={index === 0 ? 'violet' : 'gray'}
                  variant={index === 0 ? 'filled' : 'light'}
                >
                  Week {phase.week}
                </Badge>
                <Badge variant="outline" size="xs" color="green">
                  {phase.budget}만원
                </Badge>
              </Group>

              <Text size="sm" fw={600} mb="xs" c={index === 0 ? 'violet' : undefined}>
                {phase.focus}
              </Text>

              <Stack gap="xs">
                {phase.tests.map((test, i) => (
                  <Group key={i} gap="xs" align="flex-start">
                    <ThemeIcon size="xs" color="gray" variant="light">
                      <IconArrowRight size={10} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed">
                      {test}
                    </Text>
                  </Group>
                ))}
              </Stack>

              {index === 0 && (
                <Button
                  variant="light"
                  size="xs"
                  fullWidth
                  mt="sm"
                  leftSection={<IconPlayerPlay size={14} />}
                  color="violet"
                >
                  이번 주 시작
                </Button>
              )}
            </Paper>
          ))}
        </SimpleGrid>
      </Card>

      {/* ========== 실험 변수 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="orange" variant="light">
              <IconAdjustments size={18} />
            </ThemeIcon>
            <Text fw={600}>실험 변수</Text>
            <Badge variant="light">{data.variables.length}개</Badge>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {data.variables.map((variable) => {
            const IconComponent = getVariableIcon(variable.type);
            const color = getVariableColor(variable.type);

            return (
              <Paper key={variable.id} withBorder p="md" radius="md">
                <Group justify="space-between" mb="sm">
                  <Group gap="xs">
                    <ThemeIcon color={color} variant="light" size="sm">
                      <IconComponent size={14} />
                    </ThemeIcon>
                    <Text fw={600}>{variable.name}</Text>
                  </Group>
                  <Badge size="xs" variant="light" color={color}>
                    {getVariableLabel(variable.type)}
                  </Badge>
                </Group>

                <Stack gap="xs">
                  {variable.variants.map((variant, i) => (
                    <Group key={i} gap="xs" justify="space-between">
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">
                          {String.fromCharCode(65 + i)}.
                        </Text>
                        <Text size="sm">{variant}</Text>
                      </Group>
                      {variable.currentWinner === variant && (
                        <Badge
                          size="xs"
                          color="green"
                          variant="filled"
                          leftSection={<IconTrophy size={10} />}
                        >
                          우승
                        </Badge>
                      )}
                    </Group>
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </SimpleGrid>
      </Card>

      {/* ========== ICE 우선순위 테이블 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="pink" variant="light">
              <IconChartBar size={18} />
            </ThemeIcon>
            <Text fw={600}>ICE 우선순위</Text>
            <Tooltip label="ICE = (Impact + Confidence + Ease) / 3" withArrow>
              <ActionIcon variant="subtle" color="gray" size="sm">
                <IconInfoCircle size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Group gap="xs">
            <Badge variant="light">선택됨: {selectedCount}개</Badge>
            <Button variant="light" size="xs" disabled={selectedCount === 0}>
              선택 실험 시작
            </Button>
          </Group>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}></Table.Th>
              <Table.Th>테스트명</Table.Th>
              <Table.Th>변수</Table.Th>
              <Table.Th w={100}>
                <Tooltip label="예상 영향력 (1-10)">
                  <Text size="xs">Impact</Text>
                </Tooltip>
              </Table.Th>
              <Table.Th w={100}>
                <Tooltip label="성공 확신도 (1-10)">
                  <Text size="xs">Confidence</Text>
                </Tooltip>
              </Table.Th>
              <Table.Th w={100}>
                <Tooltip label="실행 용이성 (1-10)">
                  <Text size="xs">Ease</Text>
                </Tooltip>
              </Table.Th>
              <Table.Th w={80}>ICE</Table.Th>
              <Table.Th w={100}>상태</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.priorities
              .sort((a, b) => b.iceScore - a.iceScore)
              .map((priority) => {
                const variableData = data.variables.find((v) => v.type === priority.variable);
                const color = getVariableColor(priority.variable as ExperimentVariable['type']);

                return (
                  <Table.Tr key={priority.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedPriorities.includes(priority.id)}
                        disabled={priority.status === 'completed'}
                        onChange={(e) => {
                          if (e.currentTarget.checked) {
                            setSelectedPriorities([...selectedPriorities, priority.id]);
                          } else {
                            setSelectedPriorities(
                              selectedPriorities.filter((id) => id !== priority.id)
                            );
                          }
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{priority.testName}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={color}>
                        {getVariableLabel(priority.variable as ExperimentVariable['type'])}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Progress value={priority.impact * 10} size="sm" w={50} color="pink" />
                        <Text size="xs" fw={500}>
                          {priority.impact}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Progress value={priority.confidence * 10} size="sm" w={50} color="green" />
                        <Text size="xs" fw={500}>
                          {priority.confidence}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Progress value={priority.ease * 10} size="sm" w={50} color="blue" />
                        <Text size="xs" fw={500}>
                          {priority.ease}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getICEColor(priority.iceScore)} variant="filled" size="lg">
                        {priority.iceScore.toFixed(1)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(priority.status)} variant="light">
                        {getStatusLabel(priority.status)}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </Card>

      {/* ========== 예산별 플랜 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="green" variant="light">
              <IconCoin size={18} />
            </ThemeIcon>
            <Text fw={600}>예산별 실험 플랜</Text>
          </Group>
          <Button
            variant="filled"
            size="xs"
            leftSection={<IconAdjustments size={14} />}
            onClick={openBudgetModal}
          >
            예산 {selectedBudget} 플랜으로 변환
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }}>
          {budgetPlans.map((plan, i) => {
            const isSelected = plan.budget === selectedBudget;
            const isRecommended = i === 1;

            return (
              <Paper
                key={i}
                withBorder
                p="lg"
                radius="md"
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => {
                  setSelectedBudget(plan.budget);
                  onChangeBudget?.(plan.budgetValue);
                }}
              >
                {isRecommended && (
                  <Badge color="pink" mb="sm" leftSection={<IconSparkles size={10} />}>
                    추천
                  </Badge>
                )}

                <Text size="2rem" fw={700} mb="xs">
                  {plan.budget}
                </Text>

                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      기간
                    </Text>
                    <Text size="sm" fw={500}>
                      {plan.duration}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      테스트 범위
                    </Text>
                    <Text size="sm" fw={500}>
                      {plan.focus}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      채널
                    </Text>
                    <Text size="sm" fw={500}>
                      {plan.channels}
                    </Text>
                  </Group>
                </Stack>

                <Divider my="md" />

                {/* 예상 결과 */}
                <Stack gap="xs">
                  <Text size="xs" c="dimmed">
                    예상 결과
                  </Text>
                  <Group gap="lg" justify="center">
                    <div className="text-center">
                      <Text size="lg" fw={700} c="green">
                        {plan.expectedCTR}
                      </Text>
                      <Text size="xs" c="dimmed">
                        CTR 개선
                      </Text>
                    </div>
                    <div className="text-center">
                      <Text size="lg" fw={700} c="blue">
                        {plan.testCount}개
                      </Text>
                      <Text size="xs" c="dimmed">
                        테스트 변수
                      </Text>
                    </div>
                  </Group>
                </Stack>

                {isSelected && (
                  <Button fullWidth mt="md" color="pink" variant="light">
                    <IconCheck size={14} style={{ marginRight: 4 }} />
                    선택됨
                  </Button>
                )}
              </Paper>
            );
          })}
        </SimpleGrid>
      </Card>

      {/* ========== 커스텀 예산 모달 ========== */}
      <Modal
        opened={budgetModalOpened}
        onClose={closeBudgetModal}
        title={
          <Group gap="xs">
            <IconCoin size={20} className="text-green-500" />
            <Text fw={600}>맞춤 예산 플랜 설정</Text>
          </Group>
        }
      >
        <Stack gap="md">
          <NumberInput
            label="예산 (만원)"
            value={customBudget}
            onChange={(v) => setCustomBudget(typeof v === 'number' ? v : 0)}
            min={50}
            max={5000}
            step={50}
            suffix=" 만원"
          />

          <Paper p="md" radius="md" className="bg-gray-50">
            <Text size="sm" fw={500} mb="sm">
              AI 추천 플랜
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">추천 기간</Text>
                <Text size="sm" fw={500}>
                  {customBudget < 200 ? '2주' : customBudget < 500 ? '4주' : '8주'}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">테스트 변수</Text>
                <Text size="sm" fw={500}>
                  {customBudget < 200 ? '2개' : customBudget < 500 ? '4개' : '6개 이상'}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">추천 채널</Text>
                <Text size="sm" fw={500}>
                  {customBudget < 200
                    ? 'Meta 집중'
                    : customBudget < 500
                      ? 'Meta + Google'
                      : '멀티 채널'}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">예상 CTR 개선</Text>
                <Text size="sm" fw={500} c="green">
                  {customBudget < 200 ? '15%' : customBudget < 500 ? '25%' : '40%+'}
                </Text>
              </Group>
            </Stack>
          </Paper>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeBudgetModal}>
              취소
            </Button>
            <Button
              onClick={() => {
                setSelectedBudget(`${customBudget}만원`);
                onChangeBudget?.(customBudget);
                closeBudgetModal();
              }}
            >
              플랜 생성
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
