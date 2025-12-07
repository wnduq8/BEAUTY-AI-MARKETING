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
  CopyButton,
  ActionIcon,
  ThemeIcon,
  Table,
  Alert,
  List,
  Switch,
  Tabs,
  Tooltip,
  Divider,
  Modal,
  Textarea,
  Select,
  RingProgress,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowRight,
  IconCopy,
  IconCheck,
  IconAlertTriangle,
  IconShieldCheck,
  IconBrandMeta,
  IconBrandGoogle,
  IconInfoCircle,
  IconRefresh,
  IconEdit,
  IconX,
  IconCircleCheck,
  IconAlertCircleFilled,
  IconExclamationCircle,
  IconMapPin,
} from '@tabler/icons-react';
import { ComplianceResult, RiskExpression } from '@/types/campaign-result';

// ============ 더미 데이터 ============
const mockComplianceData: ComplianceResult = {
  overallScore: 72,
  riskExpressions: [
    {
      id: 'risk_1',
      original: '피부 재생',
      riskLevel: 'high',
      riskType: '의약품 효능 표현',
      reason: '화장품은 의약품이 아니므로 "재생" 표현은 의약품으로 오인될 수 있습니다.',
      alternatives: ['피부 컨디션 케어', '피부 활력 케어', '피부 건강 케어'],
      location: 'Strategy > 핵심 메시지',
    },
    {
      id: 'risk_2',
      original: '즉시 효과',
      riskLevel: 'high',
      riskType: '과장 광고',
      reason: '즉각적인 효과를 단정 짓는 표현은 과장 광고에 해당할 수 있습니다.',
      alternatives: ['꾸준히 사용 시', '지속 사용 시 기대되는', '사용 후 느껴지는'],
      location: 'Ads > 헤드라인',
    },
    {
      id: 'risk_3',
      original: '주름 제거',
      riskLevel: 'high',
      riskType: '의약품 효능 표현',
      reason: '"제거"는 의료 행위를 암시하는 표현입니다.',
      alternatives: ['주름 케어에 도움', '주름 고민 완화', '탄력 케어'],
      location: 'Landing > Hero Section',
    },
    {
      id: 'risk_4',
      original: '100% 개선',
      riskLevel: 'medium',
      riskType: '단정적 표현',
      reason: '100%와 같은 절대적 수치는 입증이 어렵고 소비자를 오도할 수 있습니다.',
      alternatives: ['개선에 도움을 줄 수 있습니다', '많은 분들이 만족하셨습니다', '높은 만족도'],
      location: 'Creative > UGC 스크립트',
    },
    {
      id: 'risk_5',
      original: '부작용 없음',
      riskLevel: 'medium',
      riskType: '단정적 표현',
      reason: '모든 사용자에게 부작용이 없다고 단정할 수 없습니다.',
      alternatives: ['순한 포뮬러', '저자극 설계', '민감 피부 테스트 완료'],
      location: 'Landing > FAQ',
    },
    {
      id: 'risk_6',
      original: '의사 추천',
      riskLevel: 'low',
      riskType: '출처 필요',
      reason: '전문가 추천 표현 시 구체적인 출처와 조건을 명시해야 합니다.',
      alternatives: ['피부과 전문의 94% 추천 (출처: OOO 조사, 2024)', '전문가 테스트 완료'],
      location: 'Strategy > 서브 메시지',
    },
  ],
  platformWarnings: [
    {
      platform: 'Meta',
      warnings: [
        '전후 비교 이미지 사용 시 보정 여부를 명확히 고지해야 합니다.',
        '개인차가 있을 수 있다는 문구를 필수로 포함해야 합니다.',
        '가격 할인율은 실제 판매가 기준으로 정확히 표기해야 합니다.',
        '신체 이미지의 과도한 클로즈업은 심의 거부될 수 있습니다.',
      ],
      recommendation:
        'Meta는 특히 신체 이미지와 관련된 광고에 엄격합니다. 긍정적인 메시지 중심으로 구성하고, 개인차 문구를 눈에 띄게 배치하세요.',
    },
    {
      platform: 'Google',
      warnings: [
        '최상급 표현(최고, 최초, 유일 등)은 객관적 근거가 필요합니다.',
        '임상 데이터 인용 시 출처와 테스트 조건을 명시해야 합니다.',
        '리뷰 인용 시 작성자와 작성일을 표기해야 합니다.',
        '착륙 페이지와 광고 내용이 일치해야 합니다.',
      ],
      recommendation:
        'Google은 광고와 랜딩 페이지의 일관성을 중요시합니다. 약속한 내용을 정확히 전달하고, 모든 주장에 근거를 명시하세요.',
    },
    {
      platform: '네이버',
      warnings: [
        '체험단/협찬 콘텐츠는 상단에 명확히 표기해야 합니다.',
        '"광고" 표시를 눈에 띄는 위치에 배치해야 합니다.',
        '의약품으로 오인될 수 있는 효능 표현은 금지됩니다.',
        '타 브랜드를 비하하거나 직접 비교하는 표현은 금지됩니다.',
      ],
      recommendation:
        '네이버는 체험단 표기와 광고 표시에 특히 엄격합니다. 투명한 정보 공개가 핵심이며, 과장 표현을 자제하세요.',
    },
  ],
};

// ============ 위험 유형 카테고리 ============
const riskTypeCategories = [
  { key: '의약품 효능 표현', color: 'red', icon: IconExclamationCircle },
  { key: '과장 광고', color: 'orange', icon: IconAlertTriangle },
  { key: '단정적 표현', color: 'yellow', icon: IconAlertCircleFilled },
  { key: '출처 필요', color: 'blue', icon: IconInfoCircle },
];

// ============ Props 인터페이스 ============
interface ComplianceTabProps {
  data?: ComplianceResult;
  safeMode?: boolean;
  onSafeModeChange?: (value: boolean) => void;
  onRefreshCheck?: () => void;
}

// ============ 메인 컴포넌트 ============
export default function ComplianceTab({
  data = mockComplianceData,
  safeMode = false,
  onSafeModeChange,
  onRefreshCheck,
}: ComplianceTabProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('Meta');
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [selectedRisk, setSelectedRisk] = useState<RiskExpression | null>(null);
  const [customAlternative, setCustomAlternative] = useState('');
  const [riskTypeFilter, setRiskTypeFilter] = useState<string | null>(null);

  // 위험도별 카운트
  const riskCounts = {
    high: data.riskExpressions.filter((r) => r.riskLevel === 'high').length,
    medium: data.riskExpressions.filter((r) => r.riskLevel === 'medium').length,
    low: data.riskExpressions.filter((r) => r.riskLevel === 'low').length,
  };

  // 위험도 색상
  const getRiskLevelColor = (level: RiskExpression['riskLevel']) => {
    switch (level) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  // 위험도 라벨
  const getRiskLevelLabel = (level: RiskExpression['riskLevel']) => {
    switch (level) {
      case 'high':
        return '높음';
      case 'medium':
        return '중간';
      case 'low':
        return '낮음';
      default:
        return level;
    }
  };

  // 위험도 아이콘
  const getRiskLevelIcon = (level: RiskExpression['riskLevel']) => {
    switch (level) {
      case 'high':
        return IconAlertCircleFilled;
      case 'medium':
        return IconAlertTriangle;
      case 'low':
        return IconInfoCircle;
      default:
        return IconInfoCircle;
    }
  };

  // 점수 색상
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  // 플랫폼 아이콘
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Meta':
        return <IconBrandMeta size={20} />;
      case 'Google':
        return <IconBrandGoogle size={20} />;
      case '네이버':
        return (
          <Text size="lg" fw={700}>
            N
          </Text>
        );
      default:
        return null;
    }
  };

  // 플랫폼 색상
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Meta':
        return 'blue';
      case 'Google':
        return 'red';
      case '네이버':
        return 'green';
      default:
        return 'gray';
    }
  };

  // 필터링된 위험 표현
  const filteredRisks = riskTypeFilter
    ? data.riskExpressions.filter((r) => r.riskType === riskTypeFilter)
    : data.riskExpressions;

  // 전체 대체 문구 텍스트
  const getAllAlternativesText = () => {
    return data.riskExpressions.map((r) => `"${r.original}" → "${r.alternatives[0]}"`).join('\n');
  };

  return (
    <Stack gap="md">
      {/* ========== 안전 점수 개요 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Group gap="xs" mb="sm">
              <ThemeIcon color={getScoreColor(data.overallScore)} variant="filled" size="lg">
                <IconShieldCheck size={20} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="lg">
                  광고 규제 안전 점수
                </Text>
                <Text size="xs" c="dimmed">
                  화장품 광고 심의 기준 기반
                </Text>
              </div>
            </Group>
          </div>

          <Group gap="xl">
            {/* 안전 점수 링 */}
            <RingProgress
              size={100}
              thickness={10}
              roundCaps
              sections={[{ value: data.overallScore, color: getScoreColor(data.overallScore) }]}
              label={
                <Text ta="center" fw={700} size="xl">
                  {data.overallScore}
                </Text>
              }
            />

            {/* 위험도별 카운트 */}
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon color="red" variant="filled" size="sm">
                  <IconAlertCircleFilled size={12} />
                </ThemeIcon>
                <Text size="sm">높은 위험</Text>
                <Badge color="red" variant="filled" size="sm">
                  {riskCounts.high}
                </Badge>
              </Group>
              <Group gap="xs">
                <ThemeIcon color="orange" variant="filled" size="sm">
                  <IconAlertTriangle size={12} />
                </ThemeIcon>
                <Text size="sm">중간 위험</Text>
                <Badge color="orange" variant="filled" size="sm">
                  {riskCounts.medium}
                </Badge>
              </Group>
              <Group gap="xs">
                <ThemeIcon color="yellow" variant="filled" size="sm">
                  <IconInfoCircle size={12} />
                </ThemeIcon>
                <Text size="sm">낮은 위험</Text>
                <Badge color="yellow" variant="filled" size="sm">
                  {riskCounts.low}
                </Badge>
              </Group>
            </Stack>
          </Group>
        </Group>

        <Divider my="md" />

        {/* 표현 보수 모드 */}
        <Paper p="md" radius="md" className="border border-blue-200 bg-blue-50">
          <Group justify="space-between">
            <div>
              <Group gap="xs" mb="xs">
                <IconShieldCheck size={18} className="text-blue-600" />
                <Text fw={600}>표현 보수 모드</Text>
                <Badge variant="light" color="blue" size="xs">
                  권장
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                활성화하면 모든 콘텐츠가 광고 심의에 안전한 표현으로 자동 변환됩니다.
              </Text>
            </div>
            <Switch
              size="lg"
              checked={safeMode}
              onChange={(e) => onSafeModeChange?.(e.currentTarget.checked)}
              thumbIcon={safeMode ? <IconCheck size={12} /> : <IconX size={12} />}
            />
          </Group>
        </Paper>
      </Card>

      {/* ========== 위험 표현 감지 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="red" variant="light">
              <IconAlertTriangle size={18} />
            </ThemeIcon>
            <Text fw={600}>위험 표현 감지</Text>
            <Badge variant="light">{data.riskExpressions.length}건 발견</Badge>
          </Group>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconRefresh size={14} />}
            onClick={onRefreshCheck}
          >
            다시 검사
          </Button>
        </Group>

        {/* 위험 유형별 필터 */}
        <Group gap="xs" mb="md">
          <Badge
            variant={riskTypeFilter === null ? 'filled' : 'outline'}
            color="gray"
            style={{ cursor: 'pointer' }}
            onClick={() => setRiskTypeFilter(null)}
          >
            전체 ({data.riskExpressions.length})
          </Badge>
          {riskTypeCategories.map((cat) => {
            const count = data.riskExpressions.filter((r) => r.riskType === cat.key).length;
            if (count === 0) return null;
            return (
              <Badge
                key={cat.key}
                variant={riskTypeFilter === cat.key ? 'filled' : 'outline'}
                color={cat.color}
                style={{ cursor: 'pointer' }}
                onClick={() => setRiskTypeFilter(riskTypeFilter === cat.key ? null : cat.key)}
                leftSection={<cat.icon size={12} />}
              >
                {cat.key} ({count})
              </Badge>
            );
          })}
        </Group>

        {/* 위험 표현 테이블 */}
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={50}></Table.Th>
              <Table.Th>위험 표현</Table.Th>
              <Table.Th w={100}>위험도</Table.Th>
              <Table.Th>유형 / 사유</Table.Th>
              <Table.Th>발견 위치</Table.Th>
              <Table.Th>대체 문구 추천</Table.Th>
              <Table.Th w={80}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredRisks
              .sort((a, b) => {
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.riskLevel] - order[b.riskLevel];
              })
              .map((risk) => {
                const RiskIcon = getRiskLevelIcon(risk.riskLevel);
                return (
                  <Table.Tr key={risk.id}>
                    <Table.Td>
                      <ThemeIcon
                        color={getRiskLevelColor(risk.riskLevel)}
                        variant="light"
                        size="sm"
                      >
                        <RiskIcon size={14} />
                      </ThemeIcon>
                    </Table.Td>
                    <Table.Td>
                      <Paper
                        p="xs"
                        radius="sm"
                        className="inline-block border border-red-200 bg-red-50"
                      >
                        <Text size="sm" fw={500} c="red">
                          "{risk.original}"
                        </Text>
                      </Paper>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getRiskLevelColor(risk.riskLevel)} variant="light">
                        {getRiskLevelLabel(risk.riskLevel)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Badge size="xs" variant="outline">
                          {risk.riskType}
                        </Badge>
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {risk.reason}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <IconMapPin size={12} className="text-gray-400" />
                        <Text size="xs" c="dimmed">
                          {risk.location}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        {risk.alternatives.slice(0, 2).map((alt, i) => (
                          <Paper
                            key={i}
                            p={4}
                            radius="sm"
                            className="border border-green-200 bg-green-50"
                          >
                            <Text size="xs" c="green">
                              "{alt}"
                            </Text>
                          </Paper>
                        ))}
                        {risk.alternatives.length > 2 && (
                          <Text size="xs" c="dimmed">
                            +{risk.alternatives.length - 2}개 더
                          </Text>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <CopyButton value={risk.alternatives[0]}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? '복사됨!' : '첫 번째 대체 문구 복사'}>
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
                        <Tooltip label="직접 수정">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => {
                              setSelectedRisk(risk);
                              setCustomAlternative(risk.alternatives[0]);
                              openEditModal();
                            }}
                          >
                            <IconEdit size={14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>

        {/* 전체 대체 문구 복사 */}
        <Group justify="flex-end" mt="md">
          <CopyButton value={getAllAlternativesText()}>
            {({ copied, copy }) => (
              <Button
                variant="light"
                leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                onClick={copy}
              >
                {copied ? '전체 복사됨!' : '전체 대체 문구 복사'}
              </Button>
            )}
          </CopyButton>
        </Group>
      </Card>

      {/* ========== 플랫폼별 주의사항 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group gap="xs" mb="md">
          <ThemeIcon color="violet" variant="light">
            <IconInfoCircle size={18} />
          </ThemeIcon>
          <Text fw={600}>플랫폼별 주의사항</Text>
        </Group>

        <Tabs value={selectedPlatform} onChange={setSelectedPlatform}>
          <Tabs.List>
            {data.platformWarnings.map((pw) => (
              <Tabs.Tab
                key={pw.platform}
                value={pw.platform}
                leftSection={getPlatformIcon(pw.platform)}
                color={getPlatformColor(pw.platform)}
              >
                {pw.platform}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {data.platformWarnings.map((pw) => (
            <Tabs.Panel key={pw.platform} value={pw.platform} pt="md">
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                {/* 주의사항 */}
                <Paper withBorder p="md" radius="md">
                  <Group gap="xs" mb="sm">
                    <ThemeIcon color="red" variant="light" size="sm">
                      <IconAlertTriangle size={14} />
                    </ThemeIcon>
                    <Text fw={600}>⚠️ 주의사항 ({pw.warnings.length})</Text>
                  </Group>
                  <List size="sm" spacing="xs">
                    {pw.warnings.map((warning, i) => (
                      <List.Item
                        key={i}
                        icon={
                          <ThemeIcon color="red" variant="light" size={16} radius="xl">
                            <IconX size={10} />
                          </ThemeIcon>
                        }
                      >
                        {warning}
                      </List.Item>
                    ))}
                  </List>
                </Paper>

                {/* 권장사항 */}
                <Paper withBorder p="md" radius="md" className="border-green-200 bg-green-50">
                  <Group gap="xs" mb="sm">
                    <ThemeIcon color="green" variant="filled" size="sm">
                      <IconCircleCheck size={14} />
                    </ThemeIcon>
                    <Text fw={600}>💡 권장사항</Text>
                  </Group>
                  <Text size="sm">{pw.recommendation}</Text>
                </Paper>
              </SimpleGrid>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Card>

      {/* ========== 주요 금칙어 요약 ========== */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="red" variant="light">
              <IconX size={18} />
            </ThemeIcon>
            <Text fw={600}>화장품 광고 주요 금칙어</Text>
          </Group>
          <Badge variant="light" color="red">
            법적 규제 기반
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 2, md: 4 }}>
          {riskTypeCategories.map((cat) => (
            <Paper key={cat.key} withBorder p="md" radius="md">
              <Group gap="xs" mb="sm">
                <ThemeIcon color={cat.color} variant="light" size="sm">
                  <cat.icon size={14} />
                </ThemeIcon>
                <Text size="sm" fw={600}>
                  {cat.key}
                </Text>
              </Group>
              <Stack gap="xs">
                {data.riskExpressions
                  .filter((r) => r.riskType === cat.key)
                  .slice(0, 3)
                  .map((r, i) => (
                    <Group key={i} gap="xs">
                      <IconX size={10} className="text-red-500" />
                      <Text size="xs" c="dimmed">
                        {r.original}
                      </Text>
                    </Group>
                  ))}
                {data.riskExpressions.filter((r) => r.riskType === cat.key).length === 0 && (
                  <Text size="xs" c="dimmed">
                    해당 유형 없음
                  </Text>
                )}
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      </Card>

      {/* ========== 안전 모드 권장 Alert ========== */}
      {!safeMode && (
        <Alert
          color="blue"
          icon={<IconShieldCheck size={20} />}
          title="표현 보수 모드를 활성화하세요"
          withCloseButton
        >
          <Text size="sm">
            현재 {riskCounts.high}개의 높은 위험 표현이 감지되었습니다. 광고 심의 통과율을 높이려면
            상단의 "표현 보수 모드"를 활성화하여 모든 카피를 규제 친화적 버전으로 자동 변환하세요.
          </Text>
        </Alert>
      )}

      {/* ========== 대체 문구 수정 모달 ========== */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title={
          <Group gap="xs">
            <IconEdit size={20} />
            <Text fw={600}>대체 문구 수정</Text>
          </Group>
        }
        size="lg"
      >
        {selectedRisk && (
          <Stack gap="md">
            {/* 원본 위험 표현 */}
            <Paper p="md" radius="md" className="border border-red-200 bg-red-50">
              <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed">
                  위험 표현
                </Text>
                <Badge color={getRiskLevelColor(selectedRisk.riskLevel)} size="sm">
                  {getRiskLevelLabel(selectedRisk.riskLevel)}
                </Badge>
              </Group>
              <Text fw={600} c="red" size="lg">
                "{selectedRisk.original}"
              </Text>
              <Divider my="xs" />
              <Group gap="xs">
                <Badge size="xs" variant="outline">
                  {selectedRisk.riskType}
                </Badge>
                <Text size="xs" c="dimmed">
                  {selectedRisk.reason}
                </Text>
              </Group>
              <Group gap="xs" mt="xs">
                <IconMapPin size={12} className="text-gray-400" />
                <Text size="xs" c="dimmed">
                  {selectedRisk.location}
                </Text>
              </Group>
            </Paper>

            {/* 대체 문구 입력 */}
            <Textarea
              label="대체 문구 직접 입력"
              value={customAlternative}
              onChange={(e) => setCustomAlternative(e.target.value)}
              autosize
              minRows={2}
              placeholder="안전한 대체 문구를 입력하세요"
            />

            {/* AI 추천 대안 */}
            <Paper p="md" radius="md" className="bg-gray-50">
              <Text size="sm" fw={500} mb="sm">
                AI 추천 대안
              </Text>
              <Group gap="xs">
                {selectedRisk.alternatives.map((alt, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    color="green"
                    size="lg"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCustomAlternative(alt)}
                  >
                    {alt}
                  </Badge>
                ))}
              </Group>
            </Paper>

            {/* 미리보기 */}
            {customAlternative && (
              <Paper p="md" radius="md" className="border border-green-200 bg-green-50">
                <Text size="xs" c="dimmed" mb="xs">
                  변경 미리보기
                </Text>
                <Group gap="xs" align="center">
                  <Text size="sm" td="line-through" c="red">
                    "{selectedRisk.original}"
                  </Text>
                  <IconArrowRight size={14} />
                  <Text size="sm" fw={500} c="green">
                    "{customAlternative}"
                  </Text>
                </Group>
              </Paper>
            )}

            <Group justify="flex-end">
              <Button variant="light" onClick={closeEditModal}>
                취소
              </Button>
              <Button
                onClick={() => {
                  // TODO: 저장 로직
                  closeEditModal();
                }}
                disabled={!customAlternative.trim()}
              >
                저장 및 적용
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
