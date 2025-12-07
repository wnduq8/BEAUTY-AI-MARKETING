'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Title,
  Text,
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  TagsInput,
  Checkbox,
  Card,
  SimpleGrid,
  Stack,
  ThemeIcon,
  Badge,
  Progress,
  Alert,
  MultiSelect,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconSparkles,
  IconBuilding,
  IconPalette,
  IconSpeakerphone,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconBrandInstagram,
  IconBrandGoogle,
  IconMail,
  IconShoppingBag,
  IconRocket,
  IconConfetti,
} from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import {
  OnboardingData,
  BRAND_TONE_OPTIONS,
  REGION_OPTIONS,
  LANGUAGE_OPTIONS,
  CHANNEL_OPTIONS,
} from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const form = useForm<OnboardingData>({
    initialValues: {
      brandName: '',
      storeName: '',
      targetRegions: ['kr'],
      languages: ['ko'],
      brandTone: 'friendly',
      brandToneDescription: '',
      forbiddenWords: [],
      requiredPhrases: [],
      channels: {
        meta: true,
        google: false,
        naver: true,
        kakao: false,
        ownMall: false,
        email: false,
      },
      primaryChannel: '',
    },
    validate: {
      brandName: (value) => (value.length >= 2 ? null : '브랜드명은 2자 이상이어야 합니다'),
      targetRegions: (value) => (value.length > 0 ? null : '최소 1개 지역을 선택해주세요'),
      languages: (value) => (value.length > 0 ? null : '최소 1개 언어를 선택해주세요'),
    },
  });

  const nextStep = () => {
    if (active === 0) {
      const result = form.validate();
      if (result.hasErrors) return;
    }
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleComplete = async () => {
    setLoading(true);

    const supabase = createClient();

    // 1. 워크스페이스 생성 (실제로는 Supabase에 저장)
    // const { data: workspace, error: workspaceError } = await supabase
    //   .from('workspaces')
    //   .insert({ name: form.values.brandName, ... })
    //   .select()
    //   .single();

    // 2. 사용자 메타데이터 업데이트
    const { error } = await supabase.auth.updateUser({
      data: {
        onboarding_completed: true,
        onboarding_data: form.values,
      },
    });

    if (error) {
      notifications.show({
        title: '오류 발생',
        message: '설정 저장 중 오류가 발생했습니다.',
        color: 'red',
      });
      setLoading(false);
      return;
    }

    setCompleted(true);
    setLoading(false);

    // 3초 후 대시보드로 이동
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 3000);
  };

  const toggleChannel = (key: keyof OnboardingData['channels']) => {
    form.setFieldValue(`channels.${key}`, !form.values.channels[key]);
  };

  const getSelectedChannelsCount = () => {
    return Object.values(form.values.channels).filter(Boolean).length;
  };

  // 완료 화면
  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Container size={500}>
          <Paper p={40} radius="lg" className="text-center" withBorder shadow="lg">
            <ThemeIcon size={80} radius="xl" color="green" variant="light" className="mx-auto mb-4">
              <IconConfetti size={40} />
            </ThemeIcon>
            <Title order={2} mb="sm">
              🎉 기본 템플릿 세팅 완료!
            </Title>
            <Text c="dimmed" mb="lg">
              {form.values.brandName}의 마케팅 설정이 완료되었습니다.
            </Text>

            <Card withBorder p="md" radius="md" mb="lg" className="text-left">
              <Text fw={600} mb="sm">
                추천 샘플 캠페인
              </Text>
              <Stack gap="xs">
                <Group gap="xs">
                  <Badge color="pink" size="sm">
                    SNS
                  </Badge>
                  <Text size="sm">인스타그램 신제품 런칭 캠페인</Text>
                </Group>
                <Group gap="xs">
                  <Badge color="blue" size="sm">
                    광고
                  </Badge>
                  <Text size="sm">네이버 검색광고 브랜드 인지도</Text>
                </Group>
                <Group gap="xs">
                  <Badge color="violet" size="sm">
                    UGC
                  </Badge>
                  <Text size="sm">인플루언서 협업 리뷰 콘텐츠</Text>
                </Group>
              </Stack>
            </Card>

            <Progress value={100} color="green" size="sm" mb="sm" animated />
            <Text size="sm" c="dimmed">
              잠시 후 대시보드로 이동합니다...
            </Text>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <Container size={700}>
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <Group justify="center" mb="sm">
            <ThemeIcon size={40} radius="xl" color="pink">
              <IconSparkles size={22} />
            </ThemeIcon>
          </Group>
          <Title order={2}>뷰티 마케팅 초기 세팅</Title>
          <Text c="dimmed" size="sm">
            3분이면 완료! AI가 최적의 마케팅 전략을 준비합니다.
          </Text>
        </div>

        <Paper withBorder shadow="md" p="xl" radius="md">
          <Stepper active={active} onStepClick={setActive} color="pink" mb="xl">
            <Stepper.Step
              label="기본 정보"
              description="브랜드 & 타겟"
              icon={<IconBuilding size={18} />}
            />
            <Stepper.Step
              label="브랜드 톤"
              description="톤 & 가이드라인"
              icon={<IconPalette size={18} />}
            />
            <Stepper.Step
              label="운영 채널"
              description="마케팅 채널"
              icon={<IconSpeakerphone size={18} />}
            />
            <Stepper.Completed>
              <IconCheck size={18} />
            </Stepper.Completed>
          </Stepper>

          {/* Step 1: 기본 정보 */}
          {active === 0 && (
            <Stack gap="md">
              <TextInput
                label="브랜드명"
                placeholder="예: 글로우랩 코스메틱"
                description="마케팅 콘텐츠에 사용될 브랜드명입니다."
                required
                {...form.getInputProps('brandName')}
              />
              <TextInput
                label="스토어명 (선택)"
                placeholder="예: 글로우랩 공식몰"
                description="자사몰이 있다면 스토어명을 입력하세요."
                {...form.getInputProps('storeName')}
              />
              <MultiSelect
                label="타겟 지역"
                placeholder="지역 선택"
                description="마케팅을 진행할 지역을 선택하세요."
                data={REGION_OPTIONS.map((r) => ({
                  value: r.value,
                  label: `${r.flag} ${r.label}`,
                }))}
                required
                {...form.getInputProps('targetRegions')}
              />
              <MultiSelect
                label="콘텐츠 언어"
                placeholder="언어 선택"
                description="마케팅 콘텐츠에 사용할 언어를 선택하세요."
                data={LANGUAGE_OPTIONS}
                required
                {...form.getInputProps('languages')}
              />
            </Stack>
          )}

          {/* Step 2: 브랜드 톤 */}
          {active === 1 && (
            <Stack gap="md">
              <div>
                <Text fw={500} mb="xs">
                  브랜드 톤 선택
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  {BRAND_TONE_OPTIONS.map((tone) => (
                    <Card
                      key={tone.value}
                      withBorder
                      padding="sm"
                      radius="md"
                      className={`cursor-pointer transition-all ${
                        form.values.brandTone === tone.value
                          ? 'border-pink-400 bg-pink-50 shadow-sm'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => form.setFieldValue('brandTone', tone.value)}
                    >
                      <Group>
                        <Text size="xl">{tone.emoji}</Text>
                        <div>
                          <Text size="sm" fw={600}>
                            {tone.label}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {tone.description}
                          </Text>
                        </div>
                        {form.values.brandTone === tone.value && (
                          <ThemeIcon size="sm" color="pink" variant="filled" ml="auto">
                            <IconCheck size={12} />
                          </ThemeIcon>
                        )}
                      </Group>
                    </Card>
                  ))}
                </SimpleGrid>
              </div>

              <Textarea
                label="추가 톤 설명 (선택)"
                placeholder="예: 20-30대 여성 타겟, 과학적 근거 강조, 너무 캐주얼하지 않게"
                description="AI가 참고할 추가적인 브랜드 톤 설명입니다."
                minRows={2}
                {...form.getInputProps('brandToneDescription')}
              />

              <TagsInput
                label="금칙어"
                placeholder="단어 입력 후 Enter"
                description="마케팅 콘텐츠에 사용하지 않을 단어들"
                {...form.getInputProps('forbiddenWords')}
              />

              <TagsInput
                label="필수 고지 문구"
                placeholder="문구 입력 후 Enter"
                description="반드시 포함해야 하는 문구 (예: 개인차가 있을 수 있습니다)"
                {...form.getInputProps('requiredPhrases')}
              />
            </Stack>
          )}

          {/* Step 3: 운영 채널 */}
          {active === 2 && (
            <Stack gap="md">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>운영 채널 선택</Text>
                  <Badge color="pink">{getSelectedChannelsCount()}개 선택</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="md">
                  마케팅을 진행할 채널을 선택하세요. 채널별 최적화된 템플릿을 제공합니다.
                </Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  {CHANNEL_OPTIONS.map((channel) => {
                    const isSelected =
                      form.values.channels[channel.key as keyof OnboardingData['channels']];
                    return (
                      <Card
                        key={channel.key}
                        withBorder
                        padding="md"
                        radius="md"
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'border-pink-400 bg-pink-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() =>
                          toggleChannel(channel.key as keyof OnboardingData['channels'])
                        }
                      >
                        <Group justify="space-between">
                          <Group>
                            <Checkbox checked={isSelected} onChange={() => {}} color="pink" />
                            <div>
                              <Text size="sm" fw={500}>
                                {channel.label}
                              </Text>
                            </div>
                          </Group>
                        </Group>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              </div>

              {getSelectedChannelsCount() > 0 && (
                <Alert color="blue" variant="light">
                  <Text size="sm">
                    선택한 {getSelectedChannelsCount()}개 채널에 맞는 마케팅 템플릿과 가이드가
                    준비됩니다.
                  </Text>
                </Alert>
              )}
            </Stack>
          )}

          {/* 네비게이션 버튼 */}
          <Group justify="space-between" mt="xl">
            <Button
              variant="subtle"
              onClick={prevStep}
              disabled={active === 0}
              leftSection={<IconArrowLeft size={16} />}
            >
              이전
            </Button>

            {active < 2 ? (
              <Button onClick={nextStep} color="pink" rightSection={<IconArrowRight size={16} />}>
                다음
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                color="pink"
                loading={loading}
                leftSection={<IconRocket size={16} />}
              >
                설정 완료
              </Button>
            )}
          </Group>
        </Paper>

        {/* 진행률 표시 */}
        <Group justify="center" mt="md">
          <Text size="sm" c="dimmed">
            {Math.round(((active + 1) / 3) * 100)}% 완료
          </Text>
        </Group>
      </Container>
    </div>
  );
}
