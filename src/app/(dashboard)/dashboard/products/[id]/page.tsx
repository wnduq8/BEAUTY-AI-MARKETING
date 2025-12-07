'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  TagsInput,
  Stack,
  Tabs,
  Divider,
  Badge,
  ActionIcon,
  Paper,
  Alert,
  Modal,
  Loader,
  Progress,
  SimpleGrid,
  ThemeIcon,
  Checkbox,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconSparkles,
  IconPlus,
  IconTrash,
  IconPhoto,
  IconFlask,
  IconDroplet,
  IconUsers,
  IconChartBar,
  IconMessageCircle,
  IconCheck,
  IconWand,
  IconFileText,
  IconAlertCircle,
  IconBrain,
} from '@tabler/icons-react';
import { MessageHouseViewer } from '@/components/product/MessageHouseViewer';
import { LandingOutlineViewer } from '@/components/product/LandingOutlineViewer';
import {
  BeautyProduct,
  CATEGORY_OPTIONS,
  SKIN_CONCERN_OPTIONS,
  TEXTURE_OPTIONS,
  SKIN_TYPE_OPTIONS,
  AGE_GROUP_OPTIONS,
  ROUTINE_STEP_OPTIONS,
  POPULAR_INGREDIENTS,
  KeyIngredient,
  Competitor,
  FAQ,
  SkinConcern,
  ProductCategory,
  TextureType,
  SkinType,
  AgeGroup,
  RoutineStep,
} from '@/types/product';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationType, setGenerationType] = useState<'messageHouse' | 'landing' | null>(null);
  const [aiModalOpened, { open: openAiModal, close: closeAiModal }] = useDisclosure(false);

  const form = useForm<Partial<BeautyProduct>>({
    initialValues: {
      basic: {
        name: '',
        line: '',
        price: 0,
        costPrice: undefined,
        volume: '',
        usagePeriod: '',
        images: [],
        description: '',
      },
      skinConcerns: {
        primary: [],
        secondary: [],
        customConcerns: [],
      },
      ingredients: {
        keyIngredients: [],
        clinicalData: '',
        certifications: [],
      },
      texture: {
        type: 'essence',
        scent: '',
        absorption: '',
        stickiness: 'light',
        irritation: 'none',
      },
      target: {
        skinTypes: [],
        ageGroups: [],
        routineStep: undefined,
      },
      competition: {
        competitors: [],
      },
      reviewsSeed: {
        bestReviews: [],
        faqs: [],
      },
      category: 'skincare',
      status: 'draft',
      hasPromotion: false,
      inStock: true,
    },
    validate: {
      basic: {
        name: (value) => (!value ? '제품명을 입력해주세요' : null),
        price: (value) => (!value || value <= 0 ? '가격을 입력해주세요' : null),
      },
    },
  });

  // 핵심 성분 추가
  const addIngredient = () => {
    const current = form.values.ingredients?.keyIngredients || [];
    form.setFieldValue('ingredients.keyIngredients', [
      ...current,
      { name: '', percentage: '', benefit: '' },
    ]);
  };

  const removeIngredient = (index: number) => {
    const current = form.values.ingredients?.keyIngredients || [];
    form.setFieldValue(
      'ingredients.keyIngredients',
      current.filter((_, i) => i !== index)
    );
  };

  // 경쟁사 추가
  const addCompetitor = () => {
    const current = form.values.competition?.competitors || [];
    form.setFieldValue('competition.competitors', [
      ...current,
      { name: '', brand: '', price: undefined, comparePoints: '' },
    ]);
  };

  const removeCompetitor = (index: number) => {
    const current = form.values.competition?.competitors || [];
    form.setFieldValue(
      'competition.competitors',
      current.filter((_, i) => i !== index)
    );
  };

  // FAQ 추가
  const addFaq = () => {
    const current = form.values.reviewsSeed?.faqs || [];
    form.setFieldValue('reviewsSeed.faqs', [...current, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    const current = form.values.reviewsSeed?.faqs || [];
    form.setFieldValue(
      'reviewsSeed.faqs',
      current.filter((_, i) => i !== index)
    );
  };

  // 저장
  const handleSave = async () => {
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
    // TODO: Supabase 저장
    await new Promise((resolve) => setTimeout(resolve, 1000));

    notifications.show({
      title: '저장 완료',
      message: '상품 정보가 저장되었습니다.',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
    setSaving(false);

    if (isNew) {
      router.push('/dashboard/products');
    }
  };

  // AI 생성
  const handleGenerate = async (type: 'messageHouse' | 'landing') => {
    setGenerationType(type);
    setGenerating(true);
    setGenerationProgress(0);
    openAiModal();

    // 프로그레스 시뮬레이션
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    // TODO: 실제 AI API 호출
    await new Promise((resolve) => setTimeout(resolve, 5000));

    clearInterval(interval);
    setGenerationProgress(100);
    setGenerating(false);

    setTimeout(() => {
      closeAiModal();
      notifications.show({
        title: '생성 완료',
        message:
          type === 'messageHouse'
            ? '상품 메시지 하우스가 생성되었습니다.'
            : '상세페이지 섹션 초안이 생성되었습니다.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    }, 500);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      {/* 헤더 */}
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="subtle" onClick={() => router.back()}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <div>
            <Title order={2}>{isNew ? '새 상품 등록' : '상품 편집'}</Title>
            <Text c="dimmed" size="sm">
              뷰티 특화 상품 브리프를 작성하세요.
            </Text>
          </div>
        </Group>
        <Group>
          <Button
            variant="light"
            color="violet"
            leftSection={<IconSparkles size={16} />}
            onClick={() => handleGenerate('messageHouse')}
            disabled={!form.values.basic?.name}
          >
            AI 메시지하우스
          </Button>
          <Button
            color="pink"
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSave}
            loading={saving}
          >
            저장
          </Button>
        </Group>
      </Group>

      {/* 탭 폼 */}
      <Tabs defaultValue="basic">
        <Tabs.List>
          <Tabs.Tab value="basic" leftSection={<IconPhoto size={16} />}>
            기본 정보
          </Tabs.Tab>
          <Tabs.Tab value="concerns" leftSection={<IconDroplet size={16} />}>
            피부 고민/효과
          </Tabs.Tab>
          <Tabs.Tab value="ingredients" leftSection={<IconFlask size={16} />}>
            성분/근거
          </Tabs.Tab>
          <Tabs.Tab value="texture" leftSection={<IconDroplet size={16} />}>
            사용감/제형
          </Tabs.Tab>
          <Tabs.Tab value="target" leftSection={<IconUsers size={16} />}>
            타겟
          </Tabs.Tab>
          <Tabs.Tab value="competition" leftSection={<IconChartBar size={16} />}>
            경쟁/비교
          </Tabs.Tab>
          <Tabs.Tab value="reviews" leftSection={<IconMessageCircle size={16} />}>
            리뷰/FAQ
          </Tabs.Tab>
          <Tabs.Tab value="ai-results" leftSection={<IconBrain size={16} />}>
            AI 생성물
          </Tabs.Tab>
        </Tabs.List>

        {/* 기본 정보 탭 */}
        <Tabs.Panel value="basic" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="제품명"
                  placeholder="예: 시카 진정 토너"
                  required
                  {...form.getInputProps('basic.name')}
                />
                <TextInput
                  label="제품 라인"
                  placeholder="예: 그린라인, 프리미엄라인"
                  {...form.getInputProps('basic.line')}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <NumberInput
                  label="판매가"
                  placeholder="0"
                  suffix="원"
                  thousandSeparator=","
                  required
                  min={0}
                  {...form.getInputProps('basic.price')}
                />
                <NumberInput
                  label="원가 (선택)"
                  placeholder="0"
                  suffix="원"
                  thousandSeparator=","
                  min={0}
                  {...form.getInputProps('basic.costPrice')}
                />
                <TextInput
                  label="용량"
                  placeholder="예: 50ml, 200ml"
                  {...form.getInputProps('basic.volume')}
                />
              </SimpleGrid>

              <TextInput
                label="사용 기간"
                placeholder="예: 약 2개월 사용 가능"
                {...form.getInputProps('basic.usagePeriod')}
              />

              <Select
                label="카테고리"
                data={CATEGORY_OPTIONS.map((c) => ({
                  value: c.value,
                  label: `${c.emoji} ${c.label}`,
                }))}
                {...form.getInputProps('category')}
              />

              <Textarea
                label="상품 설명"
                placeholder="상품에 대한 간단한 설명을 입력하세요."
                minRows={3}
                {...form.getInputProps('basic.description')}
              />

              <Group>
                <Checkbox
                  label="프로모션 진행중"
                  {...form.getInputProps('hasPromotion', { type: 'checkbox' })}
                />
                <Checkbox
                  label="재고 있음"
                  {...form.getInputProps('inStock', { type: 'checkbox' })}
                />
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* 피부 고민/효과 탭 */}
        <Tabs.Panel value="concerns" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <div>
                <Text fw={500} mb="xs">
                  주요 피부 고민 (Primary)
                </Text>
                <Text size="sm" c="dimmed" mb="sm">
                  이 제품이 해결하는 핵심 피부 고민을 선택하세요.
                </Text>
                <MultiSelect
                  data={SKIN_CONCERN_OPTIONS.map((c) => ({
                    value: c.value,
                    label: `${c.emoji} ${c.label}`,
                  }))}
                  placeholder="고민 선택"
                  {...form.getInputProps('skinConcerns.primary')}
                />
              </div>

              <div>
                <Text fw={500} mb="xs">
                  부가 효과 (Secondary)
                </Text>
                <Text size="sm" c="dimmed" mb="sm">
                  추가적으로 기대할 수 있는 효과를 선택하세요.
                </Text>
                <MultiSelect
                  data={SKIN_CONCERN_OPTIONS.map((c) => ({
                    value: c.value,
                    label: `${c.emoji} ${c.label}`,
                  }))}
                  placeholder="효과 선택"
                  {...form.getInputProps('skinConcerns.secondary')}
                />
              </div>

              <Textarea
                label="기타 효과 (자유 입력)"
                placeholder="위 목록에 없는 특별한 효과가 있다면 입력하세요."
                {...form.getInputProps('skinConcerns.customConcerns')}
              />
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* 성분/근거 탭 */}
        <Tabs.Panel value="ingredients" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>핵심 성분</Text>
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconPlus size={14} />}
                  onClick={addIngredient}
                >
                  성분 추가
                </Button>
              </Group>

              {(form.values.ingredients?.keyIngredients || []).map((_, index) => (
                <Paper key={index} withBorder p="md">
                  <Group justify="space-between" mb="sm">
                    <Badge>성분 {index + 1}</Badge>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeIngredient(index)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 3 }}>
                    <Select
                      label="성분명"
                      data={POPULAR_INGREDIENTS}
                      searchable
                      {...form.getInputProps(`ingredients.keyIngredients.${index}.name`)}
                    />
                    <TextInput
                      label="함량"
                      placeholder="예: 80%, 5000ppm"
                      {...form.getInputProps(`ingredients.keyIngredients.${index}.percentage`)}
                    />
                    <TextInput
                      label="효능"
                      placeholder="예: 진정 효과"
                      {...form.getInputProps(`ingredients.keyIngredients.${index}.benefit`)}
                    />
                  </SimpleGrid>
                </Paper>
              ))}

              {(form.values.ingredients?.keyIngredients || []).length === 0 && (
                <Alert color="gray" variant="light">
                  아직 등록된 핵심 성분이 없습니다. 성분을 추가해주세요.
                </Alert>
              )}

              <Divider my="sm" />

              <Textarea
                label="임상/시험 데이터"
                placeholder="임상 결과나 테스트 데이터 요약을 입력하세요. (예: 사용 4주 후 주름 개선 효과 23%)"
                minRows={3}
                {...form.getInputProps('ingredients.clinicalData')}
              />

              <TagsInput
                label="인증/테스트"
                placeholder="인증 입력 후 Enter"
                data={[
                  '민감성 피부 테스트 완료',
                  '논코메도제닉 테스트 완료',
                  '피부과 테스트 완료',
                  '알러지 테스트 완료',
                  '동물실험 미실시',
                  'EWG 그린등급',
                ]}
                {...form.getInputProps('ingredients.certifications')}
              />
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* 사용감/제형 탭 */}
        <Tabs.Panel value="texture" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Select label="제형" data={TEXTURE_OPTIONS} {...form.getInputProps('texture.type')} />

              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="향"
                  placeholder="예: 은은한 허브향, 무향"
                  {...form.getInputProps('texture.scent')}
                />
                <TextInput
                  label="흡수감"
                  placeholder="예: 빠르게 흡수, 촉촉하게 마무리"
                  {...form.getInputProps('texture.absorption')}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Select
                  label="끈적임"
                  data={[
                    { value: 'none', label: '없음' },
                    { value: 'light', label: '약간' },
                    { value: 'medium', label: '보통' },
                    { value: 'heavy', label: '많음' },
                  ]}
                  {...form.getInputProps('texture.stickiness')}
                />
                <Select
                  label="자극감"
                  data={[
                    { value: 'none', label: '없음' },
                    { value: 'mild', label: '약간 (따끔거림)' },
                    { value: 'moderate', label: '보통' },
                  ]}
                  {...form.getInputProps('texture.irritation')}
                />
              </SimpleGrid>

              <Textarea
                label="추가 사용감 설명"
                placeholder="기타 사용감에 대해 설명해주세요."
                {...form.getInputProps('texture.customTexture')}
              />
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* 타겟 탭 */}
        <Tabs.Panel value="target" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <MultiSelect
                label="타겟 피부 타입"
                data={SKIN_TYPE_OPTIONS}
                {...form.getInputProps('target.skinTypes')}
              />

              <MultiSelect
                label="타겟 연령대"
                data={AGE_GROUP_OPTIONS}
                {...form.getInputProps('target.ageGroups')}
              />

              <Select
                label="스킨케어 루틴 단계"
                placeholder="선택"
                data={ROUTINE_STEP_OPTIONS.map((r) => ({
                  value: r.value,
                  label: `${r.order}. ${r.label}`,
                }))}
                clearable
                {...form.getInputProps('target.routineStep')}
              />
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* 경쟁/비교 탭 */}
        <Tabs.Panel value="competition" pt="md">
          <Card withBorder padding="lg">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={500}>경쟁 제품</Text>
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconPlus size={14} />}
                  onClick={addCompetitor}
                >
                  경쟁사 추가
                </Button>
              </Group>

              {(form.values.competition?.competitors || []).map((_, index) => (
                <Paper key={index} withBorder p="md">
                  <Group justify="space-between" mb="sm">
                    <Badge>경쟁사 {index + 1}</Badge>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeCompetitor(index)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} mb="sm">
                    <TextInput
                      label="제품명"
                      placeholder="경쟁 제품명"
                      {...form.getInputProps(`competition.competitors.${index}.name`)}
                    />
                    <TextInput
                      label="브랜드"
                      placeholder="브랜드명"
                      {...form.getInputProps(`competition.competitors.${index}.brand`)}
                    />
                  </SimpleGrid>
                  <NumberInput
                    label="가격"
                    placeholder="0"
                    suffix="원"
                    thousandSeparator=","
                    mb="sm"
                    {...form.getInputProps(`competition.competitors.${index}.price`)}
                  />
                  <Textarea
                    label="비교 포인트"
                    placeholder="가격, 성분, 용량, 임상, 후기 등 비교 내용"
                    {...form.getInputProps(`competition.competitors.${index}.comparePoints`)}
                  />
                </Paper>
              ))}

              {(form.values.competition?.competitors || []).length === 0 && (
                <Alert color="gray" variant="light">
                  경쟁 제품을 추가하면 AI가 더 효과적인 마케팅 메시지를 생성합니다.
                </Alert>
              )}
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* 리뷰/FAQ 탭 */}
        <Tabs.Panel value="reviews" pt="md">
          <Stack gap="md">
            <Card withBorder padding="lg">
              <Stack gap="md">
                <Text fw={500}>베스트 리뷰 시드</Text>
                <Text size="sm" c="dimmed">
                  실제 고객 리뷰를 복사해서 붙여넣으세요. AI가 마케팅 메시지 생성에 활용합니다.
                </Text>
                <Textarea
                  placeholder="리뷰 1: 피부가 진짜 진정되는 느낌이에요...&#10;리뷰 2: 민감한 피부인데 자극 없이 잘 맞아요...&#10;리뷰 3: 가성비 최고! 다 쓰면 재구매할 예정..."
                  minRows={6}
                  {...form.getInputProps('reviewsSeed.bestReviews')}
                />
              </Stack>
            </Card>

            <Card withBorder padding="lg">
              <Stack gap="md">
                <Group justify="space-between">
                  <Text fw={500}>자주 묻는 질문 (FAQ)</Text>
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<IconPlus size={14} />}
                    onClick={addFaq}
                  >
                    FAQ 추가
                  </Button>
                </Group>

                {(form.values.reviewsSeed?.faqs || []).map((_, index) => (
                  <Paper key={index} withBorder p="md">
                    <Group justify="space-between" mb="sm">
                      <Badge>Q{index + 1}</Badge>
                      <ActionIcon color="red" variant="subtle" onClick={() => removeFaq(index)}>
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>
                    <TextInput
                      label="질문"
                      placeholder="고객이 자주 묻는 질문"
                      mb="sm"
                      {...form.getInputProps(`reviewsSeed.faqs.${index}.question`)}
                    />
                    <Textarea
                      label="답변"
                      placeholder="질문에 대한 답변"
                      {...form.getInputProps(`reviewsSeed.faqs.${index}.answer`)}
                    />
                  </Paper>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* AI 생성물 탭 */}
        <Tabs.Panel value="ai-results" pt="md">
          <Stack gap="lg">
            <MessageHouseViewer
              messageHouse={{
                version: 1,
                bigIdea: '민감한 피부도 안심하고 쓸 수 있는 시카 진정 케어',
                uspExpressions: ['병풀추출물 80% 고함량으로 즉각적인 진정 효과'],
                safeCopies: ['피부 고민, 시카로 진정시키세요'],
                objectionHandling: [
                  {
                    question: '민감한 피부인데 자극 없을까요?',
                    answer: '민감성 피부 테스트 완료 제품입니다.',
                  },
                ],
                createdAt: new Date(),
              }}
              onRegenerate={(section) => handleGenerate('messageHouse')}
            />
            <LandingOutlineViewer
              landingOutline={{
                version: 1,
                heroSection: '## 민감해진 피부, 시카로 진정하세요',
                evidenceSection: '## 과학이 증명한 진정 효과',
                reviewSection: '## 실제 사용자 후기',
                faqSection: '## 자주 묻는 질문',
                ctaSection: '## 지금 바로 시작하세요',
                createdAt: new Date(),
              }}
              onRegenerate={(section) => handleGenerate('landing')}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* AI 버튼 영역 */}
      <Card withBorder padding="lg" className="bg-gradient-to-r from-violet-50 to-pink-50">
        <Group justify="space-between" align="center">
          <div>
            <Group gap="xs" mb="xs">
              <ThemeIcon color="violet" variant="light">
                <IconSparkles size={18} />
              </ThemeIcon>
              <Text fw={600}>AI 콘텐츠 생성</Text>
            </Group>
            <Text size="sm" c="dimmed">
              상품 정보를 기반으로 마케팅 콘텐츠를 자동 생성합니다.
            </Text>
          </div>
          <Group>
            <Button
              variant="light"
              color="violet"
              leftSection={<IconWand size={16} />}
              onClick={() => handleGenerate('messageHouse')}
              disabled={!form.values.basic?.name}
            >
              메시지 하우스 생성
            </Button>
            <Button
              variant="light"
              color="pink"
              leftSection={<IconFileText size={16} />}
              onClick={() => handleGenerate('landing')}
              disabled={!form.values.basic?.name}
            >
              상세페이지 초안 생성
            </Button>
          </Group>
        </Group>
      </Card>

      {/* AI 생성 모달 */}
      <Modal
        opened={aiModalOpened}
        onClose={closeAiModal}
        title={
          generationType === 'messageHouse'
            ? '🪄 메시지 하우스 생성 중...'
            : '📄 상세페이지 초안 생성 중...'
        }
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={!generating}
      >
        <Stack gap="md">
          {generating ? (
            <>
              <Text size="sm" c="dimmed" ta="center">
                AI가 상품 정보를 분석하고 있습니다...
              </Text>
              <Progress value={generationProgress} color="pink" size="lg" animated />
              <Text size="xs" c="dimmed" ta="center">
                {generationType === 'messageHouse'
                  ? 'Big Idea, USP 표현, 안전 카피, 반론 처리 Q&A 생성 중'
                  : '상단 섹션, 근거 섹션, 후기 섹션, FAQ, CTA 생성 중'}
              </Text>
            </>
          ) : (
            <>
              <Alert color="green" icon={<IconCheck size={16} />}>
                생성이 완료되었습니다!
              </Alert>
              <Text size="sm">
                {generationType === 'messageHouse'
                  ? '메시지 하우스 v1이 저장되었습니다. 상품 상세에서 확인하세요.'
                  : '랜딩페이지 아웃라인 v1이 저장되었습니다.'}
              </Text>
            </>
          )}
        </Stack>
      </Modal>
    </div>
  );
}
