'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Title,
  Text,
  Card,
  Group,
  Button,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  MultiSelect,
  Stack,
  Stepper,
  Divider,
  Badge,
  ActionIcon,
  Paper,
  Alert,
  SimpleGrid,
  ThemeIcon,
  Checkbox,
  Radio,
  Chip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconArrowRight,
  IconDeviceFloppy,
  IconSparkles,
  IconPackage,
  IconTarget,
  IconGift,
  IconSpeakerphone,
  IconPhoto,
  IconUsers,
  IconShield,
  IconCheck,
  IconPlus,
  IconTrash,
  IconWand,
  IconBulb,
} from '@tabler/icons-react';
import {
  Campaign,
  CampaignPurpose,
  CampaignChannel,
  CreativeType,
  OfferType,
  TargetSegment,
  CAMPAIGN_PURPOSE_OPTIONS,
  CHANNEL_OPTIONS,
  CREATIVE_TYPE_OPTIONS,
  OFFER_TYPE_OPTIONS,
} from '@/types/campaign';
import { BeautyProduct, CATEGORY_OPTIONS } from '@/types/product';

// Mock 상품 데이터
const mockProducts: BeautyProduct[] = [
  {
    id: '1',
    workspaceId: '1',
    basic: { name: '시카 진정 토너', line: '그린라인', price: 28000, volume: '200ml', images: [] },
    skinConcerns: { primary: ['calming', 'trouble'] },
    ingredients: { keyIngredients: [{ name: '시카', percentage: '80%', benefit: '진정' }] },
    texture: { type: 'essence' },
    target: { skinTypes: ['sensitive'], ageGroups: ['20s-early', '20s-late'] },
    category: 'skincare',
    status: 'active',
    hasPromotion: false,
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    workspaceId: '1',
    basic: {
      name: '레티놀 안티에이징 크림',
      line: '프리미엄라인',
      price: 65000,
      volume: '50ml',
      images: [],
    },
    skinConcerns: { primary: ['wrinkle', 'elasticity'] },
    ingredients: { keyIngredients: [{ name: '레티놀', percentage: '0.1%', benefit: '주름개선' }] },
    texture: { type: 'cream' },
    target: { skinTypes: ['dry'], ageGroups: ['30s', '40s'] },
    category: 'skincare',
    status: 'active',
    hasPromotion: false,
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// AI 추천 타겟 세그먼트
const aiRecommendedSegments: TargetSegment[] = [
  {
    id: '1',
    name: '마스크 트러블 20대',
    description: '마스크로 인한 트러블/민감성 진정 찾는 20대',
    isAiRecommended: true,
  },
  {
    id: '2',
    name: '홍조/진정 고민 20~30대',
    description: '홍조와 진정 케어가 필요한 20~30대',
    isAiRecommended: true,
  },
  {
    id: '3',
    name: '레티놀 입문 30대',
    description: '안티에이징을 시작하는 30대 초중반',
    isAiRecommended: true,
  },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BeautyProduct | null>(null);
  const [customSegments, setCustomSegments] = useState<TargetSegment[]>([]);
  const [newSegmentName, setNewSegmentName] = useState('');

  const form = useForm({
    initialValues: {
      name: '',
      productId: '',
      purpose: '' as CampaignPurpose | '',
      period: {
        startDate: null as Date | null,
        endDate: null as Date | null,
      },
      budget: {
        min: 500000,
        max: 1000000,
      },
      offer: {
        type: '' as OfferType | '',
        value: '',
        description: '',
      },
      channels: [] as CampaignChannel[],
      creativeTypes: [] as CreativeType[],
      targetSegments: [] as string[],
      guardrails: {
        forbiddenStrength: 'normal' as 'strict' | 'normal',
        referenceTone: 'review' as 'emotional' | 'professional' | 'review',
      },
    },
    validate: {
      name: (value) => (!value ? '캠페인명을 입력해주세요' : null),
      productId: (value) => (!value ? '상품을 선택해주세요' : null),
      purpose: (value) => (!value ? '캠페인 목적을 선택해주세요' : null),
      channels: (value) => (value.length === 0 ? '채널을 선택해주세요' : null),
    },
  });

  const nextStep = () => {
    if (active === 0 && (!form.values.productId || !form.values.purpose)) {
      form.validate();
      return;
    }
    if (active === 2 && form.values.channels.length === 0) {
      form.validate();
      return;
    }
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleProductSelect = (productId: string | null) => {
    if (productId) {
      form.setFieldValue('productId', productId);
      const product = mockProducts.find((p) => p.id === productId);
      setSelectedProduct(product || null);

      // 상품 기반 캠페인명 자동 생성
      if (product && !form.values.name) {
        form.setFieldValue('name', `${product.basic.name} 캠페인`);
      }
    }
  };

  const addCustomSegment = () => {
    if (newSegmentName.trim()) {
      const newSegment: TargetSegment = {
        id: `custom-${Date.now()}`,
        name: newSegmentName,
        description: '사용자 정의 세그먼트',
        isAiRecommended: false,
      };
      setCustomSegments([...customSegments, newSegment]);
      setNewSegmentName('');
    }
  };

  const removeCustomSegment = (id: string) => {
    setCustomSegments(customSegments.filter((s) => s.id !== id));
    form.setFieldValue(
      'targetSegments',
      form.values.targetSegments.filter((sid) => sid !== id)
    );
  };

  const handleSave = async (generateAfter = false) => {
    const validation = form.validate();
    if (validation.hasErrors) {
      notifications.show({
        title: '입력 오류',
        message: '필수 항목을 확인해주세요.',
        color: 'red',
      });
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    notifications.show({
      title: '캠페인 저장 완료',
      message: generateAfter ? 'AI 생성을 시작합니다.' : '캠페인이 저장되었습니다.',
      color: 'green',
      icon: <IconCheck size={16} />,
    });

    setSaving(false);

    if (generateAfter) {
      router.push('/dashboard/campaigns/new-campaign-id/generate');
    } else {
      router.push('/dashboard/campaigns');
    }
  };

  const allSegments = [...aiRecommendedSegments, ...customSegments];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* 헤더 */}
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="subtle" onClick={() => router.back()}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <div>
            <Title order={2}>새 캠페인 생성</Title>
            <Text c="dimmed" size="sm">
              뷰티 마케팅 캠페인 브리프를 작성하세요.
            </Text>
          </div>
        </Group>
        <Group>
          <Button variant="subtle" onClick={() => handleSave(false)} loading={saving}>
            임시 저장
          </Button>
          <Button
            color="pink"
            leftSection={<IconSparkles size={16} />}
            onClick={() => handleSave(true)}
            loading={saving}
          >
            저장 후 AI 생성
          </Button>
        </Group>
      </Group>

      {/* Stepper */}
      <Paper withBorder p="md" radius="md">
        <Stepper active={active} onStepClick={setActive} color="pink">
          <Stepper.Step
            label="기본 설정"
            description="상품 & 목적"
            icon={<IconPackage size={18} />}
          />
          <Stepper.Step label="오퍼 & 예산" description="혜택 설정" icon={<IconGift size={18} />} />
          <Stepper.Step
            label="채널 & 크리에이티브"
            description="채널 선택"
            icon={<IconSpeakerphone size={18} />}
          />
          <Stepper.Step label="타겟" description="세그먼트" icon={<IconUsers size={18} />} />
          <Stepper.Step label="가드레일" description="톤 & 제한" icon={<IconShield size={18} />} />
        </Stepper>
      </Paper>

      {/* Step 1: 기본 설정 */}
      {active === 0 && (
        <Card withBorder padding="lg">
          <Stack gap="md">
            <TextInput
              label="캠페인명"
              placeholder="예: 여름 시즌 신규 고객 캠페인"
              required
              {...form.getInputProps('name')}
            />

            <Select
              label="연결 상품"
              placeholder="상품 선택"
              description="캠페인에 사용할 상품을 선택하세요."
              required
              data={mockProducts.map((p) => ({
                value: p.id,
                label: `${p.basic.name} (${p.basic.line || '기본라인'})`,
              }))}
              value={form.values.productId}
              onChange={handleProductSelect}
            />

            {selectedProduct && (
              <Paper withBorder p="md" radius="md" className="bg-pink-50">
                <Group gap="md">
                  <ThemeIcon size={40} color="pink" variant="light">
                    <IconPackage size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={500}>{selectedProduct.basic.name}</Text>
                    <Text size="sm" c="dimmed">
                      {selectedProduct.basic.line} · {selectedProduct.basic.price?.toLocaleString()}
                      원
                    </Text>
                    <Group gap={4} mt={4}>
                      {selectedProduct.skinConcerns.primary.slice(0, 3).map((concern) => (
                        <Badge key={concern} size="xs" variant="light">
                          {concern}
                        </Badge>
                      ))}
                    </Group>
                  </div>
                </Group>
              </Paper>
            )}

            <Divider my="sm" />

            <div>
              <Text fw={500} mb="sm">
                캠페인 목적
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {CAMPAIGN_PURPOSE_OPTIONS.map((purpose) => (
                  <Paper
                    key={purpose.value}
                    withBorder
                    p="md"
                    radius="md"
                    className={`cursor-pointer transition-all ${
                      form.values.purpose === purpose.value
                        ? 'border-pink-400 bg-pink-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => form.setFieldValue('purpose', purpose.value)}
                  >
                    <Group>
                      <Text size="xl">{purpose.emoji}</Text>
                      <div>
                        <Text fw={500}>{purpose.label}</Text>
                        <Text size="xs" c="dimmed">
                          {purpose.description}
                        </Text>
                      </div>
                      {form.values.purpose === purpose.value && (
                        <ThemeIcon size="sm" color="pink" variant="filled" ml="auto">
                          <IconCheck size={12} />
                        </ThemeIcon>
                      )}
                    </Group>
                  </Paper>
                ))}
              </SimpleGrid>
            </div>

            <SimpleGrid cols={2}>
              <DatePickerInput
                label="시작일"
                placeholder="시작일 선택"
                valueFormat="YYYY-MM-DD"
                value={form.values.period.startDate}
                onChange={(date) => form.setFieldValue('period.startDate', date as Date | null)}
              />
              <DatePickerInput
                label="종료일"
                placeholder="종료일 선택"
                valueFormat="YYYY-MM-DD"
                value={form.values.period.endDate}
                onChange={(date) => form.setFieldValue('period.endDate', date as Date | null)}
                minDate={form.values.period.startDate || undefined}
              />
            </SimpleGrid>
          </Stack>
        </Card>
      )}

      {/* Step 2: 오퍼 & 예산 */}
      {active === 1 && (
        <Card withBorder padding="lg">
          <Stack gap="md">
            <div>
              <Text fw={500} mb="sm">
                오퍼 유형
              </Text>
              <SimpleGrid cols={{ base: 2, sm: 3 }}>
                {OFFER_TYPE_OPTIONS.map((offer) => (
                  <Paper
                    key={offer.value}
                    withBorder
                    p="md"
                    radius="md"
                    className={`cursor-pointer text-center transition-all ${
                      form.values.offer.type === offer.value
                        ? 'border-pink-400 bg-pink-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => form.setFieldValue('offer.type', offer.value)}
                  >
                    <Text size="2xl" mb={4}>
                      {offer.emoji}
                    </Text>
                    <Text size="sm" fw={500}>
                      {offer.label}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </div>

            {form.values.offer.type && (
              <SimpleGrid cols={2}>
                <TextInput
                  label="오퍼 값"
                  placeholder="예: 20%, 10,000원"
                  {...form.getInputProps('offer.value')}
                />
                <TextInput
                  label="오퍼 설명"
                  placeholder="예: 첫 구매 한정 20% 할인"
                  {...form.getInputProps('offer.description')}
                />
              </SimpleGrid>
            )}

            <Divider my="sm" />

            <Text fw={500}>예산 범위</Text>
            <SimpleGrid cols={2}>
              <NumberInput
                label="최소 예산"
                placeholder="500,000"
                suffix="원"
                thousandSeparator=","
                min={0}
                step={100000}
                {...form.getInputProps('budget.min')}
              />
              <NumberInput
                label="최대 예산"
                placeholder="1,000,000"
                suffix="원"
                thousandSeparator=","
                min={form.values.budget.min}
                step={100000}
                {...form.getInputProps('budget.max')}
              />
            </SimpleGrid>
          </Stack>
        </Card>
      )}

      {/* Step 3: 채널 & 크리에이티브 */}
      {active === 2 && (
        <Card withBorder padding="lg">
          <Stack gap="md">
            <div>
              <Text fw={500} mb="sm">
                운영 채널 (복수 선택)
              </Text>
              <SimpleGrid cols={{ base: 2, sm: 3 }}>
                {CHANNEL_OPTIONS.map((channel) => {
                  const isSelected = form.values.channels.includes(channel.value);
                  return (
                    <Paper
                      key={channel.value}
                      withBorder
                      p="md"
                      radius="md"
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'border-pink-400 bg-pink-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        const newChannels = isSelected
                          ? form.values.channels.filter((c) => c !== channel.value)
                          : [...form.values.channels, channel.value];
                        form.setFieldValue('channels', newChannels);
                      }}
                    >
                      <Group>
                        <Checkbox checked={isSelected} onChange={() => {}} color="pink" />
                        <Text size="sm" fw={500}>
                          {channel.label}
                        </Text>
                      </Group>
                    </Paper>
                  );
                })}
              </SimpleGrid>
            </div>

            <Divider my="sm" />

            <div>
              <Text fw={500} mb="sm">
                크리에이티브 타입 선호 (복수 선택)
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {CREATIVE_TYPE_OPTIONS.map((creative) => {
                  const isSelected = form.values.creativeTypes.includes(creative.value);
                  return (
                    <Paper
                      key={creative.value}
                      withBorder
                      p="md"
                      radius="md"
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'border-violet-400 bg-violet-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        const newTypes = isSelected
                          ? form.values.creativeTypes.filter((c) => c !== creative.value)
                          : [...form.values.creativeTypes, creative.value];
                        form.setFieldValue('creativeTypes', newTypes);
                      }}
                    >
                      <Group>
                        <Checkbox checked={isSelected} onChange={() => {}} color="violet" />
                        <Text size="lg">{creative.emoji}</Text>
                        <div>
                          <Text size="sm" fw={500}>
                            {creative.label}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {creative.description}
                          </Text>
                        </div>
                      </Group>
                    </Paper>
                  );
                })}
              </SimpleGrid>
            </div>
          </Stack>
        </Card>
      )}

      {/* Step 4: 타겟 세그먼트 */}
      {active === 3 && (
        <Card withBorder padding="lg">
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text fw={500}>타겟 세그먼트</Text>
                <Text size="sm" c="dimmed">
                  AI 추천 세그먼트를 선택하거나 직접 추가하세요.
                </Text>
              </div>
              <Badge color="violet" leftSection={<IconWand size={12} />}>
                AI 추천
              </Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {allSegments.map((segment) => {
                const isSelected = form.values.targetSegments.includes(segment.id);
                return (
                  <Paper
                    key={segment.id}
                    withBorder
                    p="md"
                    radius="md"
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'border-pink-400 bg-pink-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      const newSegments = isSelected
                        ? form.values.targetSegments.filter((s) => s !== segment.id)
                        : [...form.values.targetSegments, segment.id];
                      form.setFieldValue('targetSegments', newSegments);
                    }}
                  >
                    <Group justify="space-between">
                      <Group>
                        <Checkbox checked={isSelected} onChange={() => {}} color="pink" />
                        <div>
                          <Group gap={4}>
                            <Text size="sm" fw={500}>
                              {segment.name}
                            </Text>
                            {segment.isAiRecommended && (
                              <Badge size="xs" color="violet" variant="light">
                                AI
                              </Badge>
                            )}
                          </Group>
                          <Text size="xs" c="dimmed">
                            {segment.description}
                          </Text>
                        </div>
                      </Group>
                      {!segment.isAiRecommended && (
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCustomSegment(segment.id);
                          }}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Paper>
                );
              })}
            </SimpleGrid>

            <Divider label="세그먼트 직접 추가" labelPosition="center" />

            <Group>
              <TextInput
                placeholder="예: 민감성 진정 찾는 직장인 여성"
                value={newSegmentName}
                onChange={(e) => setNewSegmentName(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={addCustomSegment}
                disabled={!newSegmentName.trim()}
              >
                추가
              </Button>
            </Group>
          </Stack>
        </Card>
      )}

      {/* Step 5: 가드레일 */}
      {active === 4 && (
        <Card withBorder padding="lg">
          <Stack gap="lg">
            <div>
              <Text fw={500} mb="sm">
                금칙표현 강도
              </Text>
              <Radio.Group
                value={form.values.guardrails.forbiddenStrength}
                onChange={(value) =>
                  form.setFieldValue('guardrails.forbiddenStrength', value as 'strict' | 'normal')
                }
              >
                <Stack gap="sm">
                  <Radio
                    value="strict"
                    label={
                      <div>
                        <Text size="sm" fw={500}>
                          엄격
                        </Text>
                        <Text size="xs" c="dimmed">
                          모든 금칙어 및 과장 표현 철저히 필터링
                        </Text>
                      </div>
                    }
                  />
                  <Radio
                    value="normal"
                    label={
                      <div>
                        <Text size="sm" fw={500}>
                          보통
                        </Text>
                        <Text size="xs" c="dimmed">
                          핵심 금칙어만 필터링, 일부 마케팅 표현 허용
                        </Text>
                      </div>
                    }
                  />
                </Stack>
              </Radio.Group>
            </div>

            <Divider />

            <div>
              <Text fw={500} mb="sm">
                레퍼런스 톤
              </Text>
              <Radio.Group
                value={form.values.guardrails.referenceTone}
                onChange={(value) =>
                  form.setFieldValue(
                    'guardrails.referenceTone',
                    value as 'emotional' | 'professional' | 'review'
                  )
                }
              >
                <Stack gap="sm">
                  <Radio
                    value="emotional"
                    label={
                      <div>
                        <Text size="sm" fw={500}>
                          🎭 감성적
                        </Text>
                        <Text size="xs" c="dimmed">
                          감정에 호소, 스토리텔링 중심
                        </Text>
                      </div>
                    }
                  />
                  <Radio
                    value="professional"
                    label={
                      <div>
                        <Text size="sm" fw={500}>
                          🔬 전문적
                        </Text>
                        <Text size="xs" c="dimmed">
                          성분, 임상 데이터 중심의 신뢰감 있는 톤
                        </Text>
                      </div>
                    }
                  />
                  <Radio
                    value="review"
                    label={
                      <div>
                        <Text size="sm" fw={500}>
                          ⭐ 후기 중심
                        </Text>
                        <Text size="xs" c="dimmed">
                          실제 사용자 후기 스타일, 친근한 톤
                        </Text>
                      </div>
                    }
                  />
                </Stack>
              </Radio.Group>
            </div>

            <Alert color="blue" variant="light" icon={<IconBulb size={16} />}>
              가드레일 설정은 워크스페이스의 브랜드 톤/금칙어 설정과 함께 적용됩니다.
            </Alert>
          </Stack>
        </Card>
      )}

      {/* 네비게이션 */}
      <Group justify="space-between">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={prevStep}
          disabled={active === 0}
        >
          이전
        </Button>
        {active < 4 ? (
          <Button color="pink" rightSection={<IconArrowRight size={16} />} onClick={nextStep}>
            다음
          </Button>
        ) : (
          <Button
            color="pink"
            leftSection={<IconSparkles size={16} />}
            onClick={() => handleSave(true)}
            loading={saving}
          >
            저장 후 AI 생성
          </Button>
        )}
      </Group>
    </div>
  );
}
