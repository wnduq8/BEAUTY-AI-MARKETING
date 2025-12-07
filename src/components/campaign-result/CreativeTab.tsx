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
  Tabs,
  CopyButton,
  ActionIcon,
  Tooltip,
  Select,
  Textarea,
  TextInput,
  Slider,
  Switch,
  Collapse,
  Divider,
  ThemeIcon,
  ColorSwatch,
  Grid,
  Image,
  Checkbox,
  NumberInput,
  SegmentedControl,
  Modal,
  Box,
  Progress,
  Loader,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCopy,
  IconCheck,
  IconSparkles,
  IconPhoto,
  IconPalette,
  IconTypography,
  IconLayout,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandFacebook,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconRefresh,
  IconDownload,
  IconEye,
  IconPlus,
  IconTrash,
  IconWand,
  IconAdjustments,
  IconColorSwatch,
  IconVideo,
  IconGif,
  IconSlideshow,
  IconSquare,
  IconRectangle,
  IconRectangleVertical,
  IconChevronDown,
  IconChevronUp,
  IconHeart,
  IconMessageCircle,
  IconBookmark,
  IconSend,
} from '@tabler/icons-react';
import { CreativeResult } from '@/types/campaign-result';

// 크리에이티브 템플릿 타입
interface CreativeTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  aspectRatio: string;
  tags: string[];
}

// 생성된 크리에이티브 타입
interface GeneratedCreative {
  id: string;
  type: 'image' | 'video' | 'carousel' | 'gif';
  platform: string;
  aspectRatio: string;
  previewUrl: string;
  headline: string;
  subheadline: string;
  cta: string;
  colors: string[];
  status: 'generating' | 'completed' | 'failed';
}

// 더미 템플릿 데이터
const templates: CreativeTemplate[] = [
  {
    id: '1',
    name: '미니멀 프로덕트',
    category: '제품 중심',
    thumbnail: '/templates/minimal-product.jpg',
    aspectRatio: '1:1',
    tags: ['심플', '고급', '세럼'],
  },
  {
    id: '2',
    name: '그라데이션 글로우',
    category: '감성',
    thumbnail: '/templates/gradient-glow.jpg',
    aspectRatio: '1:1',
    tags: ['트렌디', '글로우', '핑크'],
  },
  {
    id: '3',
    name: '성분 포커스',
    category: '정보형',
    thumbnail: '/templates/ingredient-focus.jpg',
    aspectRatio: '4:5',
    tags: ['성분', '과학적', '클린뷰티'],
  },
  {
    id: '4',
    name: '전후 비교',
    category: '후기',
    thumbnail: '/templates/before-after.jpg',
    aspectRatio: '1:1',
    tags: ['비포애프터', '결과', '변화'],
  },
  {
    id: '5',
    name: '스토리 세로형',
    category: '스토리/릴스',
    thumbnail: '/templates/story-vertical.jpg',
    aspectRatio: '9:16',
    tags: ['스토리', '릴스', '틱톡'],
  },
  {
    id: '6',
    name: '캐러셀 시리즈',
    category: '캐러셀',
    thumbnail: '/templates/carousel-series.jpg',
    aspectRatio: '1:1',
    tags: ['캐러셀', '슬라이드', '정보형'],
  },
];

// 더미 생성된 크리에이티브
const generatedCreatives: GeneratedCreative[] = [
  {
    id: '1',
    type: 'image',
    platform: 'Instagram',
    aspectRatio: '1:1',
    previewUrl: '',
    headline: '피부에 닿는 순간, 광채가 시작돼요',
    subheadline: '비타민C 15% + 히알루론산',
    cta: '지금 구매하기',
    colors: ['#FF6B9D', '#FFB6C1', '#FFF0F5'],
    status: 'completed',
  },
  {
    id: '2',
    type: 'carousel',
    platform: 'Instagram',
    aspectRatio: '1:1',
    previewUrl: '',
    headline: '3주의 변화, 직접 확인하세요',
    subheadline: '94%가 경험한 피부 톤 개선',
    cta: '후기 더보기',
    colors: ['#B388FF', '#E1BEE7', '#F3E5F5'],
    status: 'completed',
  },
  {
    id: '3',
    type: 'video',
    platform: 'Instagram Reels',
    aspectRatio: '9:16',
    previewUrl: '',
    headline: 'POV: 세럼 하나로 달라진 피부',
    subheadline: '',
    cta: '프로필 링크 클릭',
    colors: ['#64FFDA', '#B2DFDB', '#E0F2F1'],
    status: 'generating',
  },
];

// 컬러 팔레트 프리셋
const colorPresets = [
  { name: '로즈 골드', colors: ['#B76E79', '#E8C4C4', '#FFF5F5'] },
  { name: '라벤더 드림', colors: ['#9575CD', '#D1C4E9', '#EDE7F6'] },
  { name: '민트 프레시', colors: ['#26A69A', '#B2DFDB', '#E0F2F1'] },
  { name: '코랄 선셋', colors: ['#FF8A65', '#FFCCBC', '#FBE9E7'] },
  { name: '클래식 블랙', colors: ['#212121', '#757575', '#FAFAFA'] },
  { name: '네이처 그린', colors: ['#66BB6A', '#C8E6C9', '#F1F8E9'] },
];

export default function CreativeTab() {
  // 상태 관리
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('1:1');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedColorPreset, setSelectedColorPreset] = useState<number>(0);
  const [customColors, setCustomColors] = useState<string[]>(['#FF6B9D', '#FFB6C1', '#FFF0F5']);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewOpened, { open: openPreview, close: closePreview }] = useDisclosure(false);
  const [selectedPreview, setSelectedPreview] = useState<GeneratedCreative | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    cta: '지금 구매하기',
    productName: '글로우 세럼 프로',
    keyBenefit: '피부 톤 개선',
    includePrice: false,
    price: '',
    includeBadge: true,
    badgeText: 'NEW',
    fontStyle: 'modern',
    animationStyle: 'fade',
    creativityLevel: 70,
  });

  // 플랫폼 옵션
  const platformOptions = [
    { value: 'instagram', label: 'Instagram', icon: IconBrandInstagram },
    { value: 'facebook', label: 'Facebook', icon: IconBrandFacebook },
    { value: 'youtube', label: 'YouTube', icon: IconBrandYoutube },
  ];

  // 비율 옵션
  const aspectRatioOptions = [
    { value: '1:1', label: '1:1', icon: IconSquare, desc: '피드' },
    { value: '4:5', label: '4:5', icon: IconRectangleVertical, desc: '피드 세로' },
    { value: '9:16', label: '9:16', icon: IconRectangleVertical, desc: '스토리/릴스' },
    { value: '16:9', label: '16:9', icon: IconRectangle, desc: '가로형' },
  ];

  // 크리에이티브 타입 옵션
  const creativeTypeOptions = [
    { value: 'image', label: '이미지', icon: IconPhoto },
    { value: 'video', label: '비디오', icon: IconVideo },
    { value: 'carousel', label: '캐러셀', icon: IconSlideshow },
    { value: 'gif', label: 'GIF', icon: IconGif },
  ];

  // 미리보기 열기
  const handlePreview = (creative: GeneratedCreative) => {
    setSelectedPreview(creative);
    openPreview();
  };

  // 필터된 템플릿
  const filteredTemplates = templates.filter(
    (t) => t.aspectRatio === selectedAspectRatio || selectedAspectRatio === 'all'
  );

  return (
    <Stack gap="lg">
      {/* 헤더 */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <div>
            <Group gap="xs" mb={4}>
              <ThemeIcon variant="light" color="pink" size="lg">
                <IconPalette size={20} />
              </ThemeIcon>
              <Text fw={700} size="lg">
                크리에이티브 스튜디오
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              AI가 뷰티 제품에 최적화된 마케팅 이미지와 영상을 생성합니다.
            </Text>
          </div>
          <Badge variant="light" color="violet" size="lg">
            <Group gap={4}>
              <IconSparkles size={14} />
              AI 생성
            </Group>
          </Badge>
        </Group>
      </Card>

      <Grid>
        {/* 좌측: 설정 패널 */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            {/* 플랫폼 선택 */}
            <Card withBorder padding="md" radius="md">
              <Text fw={600} mb="sm">
                플랫폼 선택
              </Text>
              <SegmentedControl
                fullWidth
                value={selectedPlatform}
                onChange={setSelectedPlatform}
                data={platformOptions.map((p) => ({
                  value: p.value,
                  label: (
                    <Group gap={6} justify="center">
                      <p.icon size={16} />
                      <span>{p.label}</span>
                    </Group>
                  ),
                }))}
              />
            </Card>

            {/* 비율 선택 */}
            <Card withBorder padding="md" radius="md">
              <Text fw={600} mb="sm">
                비율 선택
              </Text>
              <SimpleGrid cols={4}>
                {aspectRatioOptions.map((ratio) => (
                  <Paper
                    key={ratio.value}
                    p="sm"
                    radius="md"
                    withBorder
                    className={`cursor-pointer transition-all ${
                      selectedAspectRatio === ratio.value
                        ? 'border-pink-500 bg-pink-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedAspectRatio(ratio.value)}
                  >
                    <Stack gap={4} align="center">
                      <ratio.icon
                        size={24}
                        className={
                          selectedAspectRatio === ratio.value ? 'text-pink-500' : 'text-gray-500'
                        }
                      />
                      <Text size="xs" fw={500}>
                        {ratio.label}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {ratio.desc}
                      </Text>
                    </Stack>
                  </Paper>
                ))}
              </SimpleGrid>
            </Card>

            {/* 콘텐츠 설정 */}
            <Card withBorder padding="md" radius="md">
              <Text fw={600} mb="sm">
                콘텐츠 설정
              </Text>
              <Stack gap="sm">
                <TextInput
                  label="헤드라인"
                  placeholder="메인 카피를 입력하세요"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  rightSection={
                    <Tooltip label="AI 추천">
                      <ActionIcon variant="subtle" color="violet">
                        <IconWand size={16} />
                      </ActionIcon>
                    </Tooltip>
                  }
                />
                <TextInput
                  label="서브 헤드라인"
                  placeholder="부가 설명을 입력하세요"
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                />
                <Select
                  label="CTA 버튼"
                  value={formData.cta}
                  onChange={(value) => setFormData({ ...formData, cta: value || '' })}
                  data={[
                    '지금 구매하기',
                    '자세히 보기',
                    '무료 샘플 받기',
                    '한정 할인 중',
                    '프로필 링크 클릭',
                  ]}
                />

                <Divider my="xs" />

                <Group>
                  <Checkbox
                    label="가격 표시"
                    checked={formData.includePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, includePrice: e.currentTarget.checked })
                    }
                  />
                  {formData.includePrice && (
                    <TextInput
                      placeholder="₩39,000"
                      size="xs"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      style={{ width: 100 }}
                    />
                  )}
                </Group>

                <Group>
                  <Checkbox
                    label="뱃지 표시"
                    checked={formData.includeBadge}
                    onChange={(e) =>
                      setFormData({ ...formData, includeBadge: e.currentTarget.checked })
                    }
                  />
                  {formData.includeBadge && (
                    <Select
                      size="xs"
                      value={formData.badgeText}
                      onChange={(value) => setFormData({ ...formData, badgeText: value || '' })}
                      data={['NEW', 'BEST', 'HOT', '한정', '1+1', '무료배송']}
                      style={{ width: 100 }}
                    />
                  )}
                </Group>
              </Stack>
            </Card>

            {/* 컬러 팔레트 */}
            <Card withBorder padding="md" radius="md">
              <Text fw={600} mb="sm">
                컬러 팔레트
              </Text>
              <SimpleGrid cols={3} mb="md">
                {colorPresets.map((preset, idx) => (
                  <Paper
                    key={idx}
                    p="xs"
                    radius="md"
                    withBorder
                    className={`cursor-pointer transition-all ${
                      selectedColorPreset === idx
                        ? 'border-pink-500 bg-pink-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => {
                      setSelectedColorPreset(idx);
                      setCustomColors(preset.colors);
                    }}
                  >
                    <Group gap={4} mb={4}>
                      {preset.colors.map((color, i) => (
                        <ColorSwatch key={i} color={color} size={16} />
                      ))}
                    </Group>
                    <Text size="xs" ta="center">
                      {preset.name}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>

              <Text size="xs" c="dimmed" mb="xs">
                커스텀 컬러
              </Text>
              <Group gap="xs">
                {customColors.map((color, idx) => (
                  <ColorSwatch key={idx} color={color} size={32} style={{ cursor: 'pointer' }} />
                ))}
                <ActionIcon variant="light" color="gray" size={32}>
                  <IconPlus size={16} />
                </ActionIcon>
              </Group>
            </Card>

            {/* 고급 설정 */}
            <Card withBorder padding="md" radius="md">
              <Group justify="space-between" mb={showAdvanced ? 'sm' : 0}>
                <Group gap="xs">
                  <IconAdjustments size={18} />
                  <Text fw={600}>고급 설정</Text>
                </Group>
                <ActionIcon variant="subtle" onClick={() => setShowAdvanced(!showAdvanced)}>
                  {showAdvanced ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                </ActionIcon>
              </Group>

              <Collapse in={showAdvanced}>
                <Stack gap="sm">
                  <Select
                    label="폰트 스타일"
                    value={formData.fontStyle}
                    onChange={(value) => setFormData({ ...formData, fontStyle: value || '' })}
                    data={[
                      { value: 'modern', label: '모던 산세리프' },
                      { value: 'elegant', label: '엘레강스 세리프' },
                      { value: 'playful', label: '플레이풀' },
                      { value: 'minimal', label: '미니멀' },
                    ]}
                  />
                  <Select
                    label="애니메이션 스타일"
                    value={formData.animationStyle}
                    onChange={(value) => setFormData({ ...formData, animationStyle: value || '' })}
                    data={[
                      { value: 'fade', label: '페이드 인' },
                      { value: 'slide', label: '슬라이드' },
                      { value: 'zoom', label: '줌 인' },
                      { value: 'bounce', label: '바운스' },
                    ]}
                  />
                  <div>
                    <Text size="sm" mb="xs">
                      창의성 레벨: {formData.creativityLevel}%
                    </Text>
                    <Slider
                      value={formData.creativityLevel}
                      onChange={(value) => setFormData({ ...formData, creativityLevel: value })}
                      marks={[
                        { value: 20, label: '보수적' },
                        { value: 50, label: '균형' },
                        { value: 80, label: '창의적' },
                      ]}
                      color="violet"
                    />
                  </div>
                </Stack>
              </Collapse>
            </Card>

            {/* 생성 버튼 */}
            <Button fullWidth size="lg" color="pink" leftSection={<IconSparkles size={20} />}>
              크리에이티브 생성하기
            </Button>
          </Stack>
        </Grid.Col>

        {/* 우측: 템플릿 & 결과 */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Tabs defaultValue="templates" variant="outline">
            <Tabs.List>
              <Tabs.Tab value="templates" leftSection={<IconLayout size={16} />}>
                템플릿
              </Tabs.Tab>
              <Tabs.Tab value="generated" leftSection={<IconPhoto size={16} />}>
                생성된 크리에이티브
                <Badge ml="xs" size="sm" variant="filled" color="pink">
                  3
                </Badge>
              </Tabs.Tab>
            </Tabs.List>

            {/* 템플릿 탭 */}
            <Tabs.Panel value="templates" pt="md">
              <SimpleGrid cols={{ base: 2, sm: 3 }}>
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    withBorder
                    padding="xs"
                    radius="md"
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-pink-500 ring-2 ring-pink-200'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {/* 썸네일 플레이스홀더 */}
                    <Paper
                      h={140}
                      radius="sm"
                      mb="xs"
                      className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-violet-100"
                    >
                      <IconPhoto size={32} className="text-gray-400" />
                    </Paper>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {template.name}
                    </Text>
                    <Group gap={4} mt={4}>
                      <Badge size="xs" variant="light">
                        {template.category}
                      </Badge>
                      <Badge size="xs" variant="outline">
                        {template.aspectRatio}
                      </Badge>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>
            </Tabs.Panel>

            {/* 생성된 크리에이티브 탭 */}
            <Tabs.Panel value="generated" pt="md">
              <Stack gap="md">
                {generatedCreatives.map((creative) => (
                  <Card key={creative.id} withBorder padding="md" radius="md">
                    <Group align="flex-start" gap="md">
                      {/* 미리보기 */}
                      <Paper
                        w={creative.aspectRatio === '9:16' ? 100 : 150}
                        h={creative.aspectRatio === '9:16' ? 178 : 150}
                        radius="md"
                        className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 to-violet-100"
                      >
                        {creative.status === 'generating' ? (
                          <Stack align="center" gap="xs">
                            <Loader size="sm" color="pink" />
                            <Text size="xs" c="dimmed">
                              생성 중...
                            </Text>
                          </Stack>
                        ) : (
                          <>
                            <IconPhoto size={32} className="text-gray-400" />
                            <ActionIcon
                              variant="filled"
                              color="dark"
                              size="sm"
                              radius="xl"
                              className="absolute right-2 bottom-2"
                              onClick={() => handlePreview(creative)}
                            >
                              <IconEye size={14} />
                            </ActionIcon>
                          </>
                        )}
                        {/* 타입 뱃지 */}
                        <Badge
                          size="xs"
                          variant="filled"
                          color="dark"
                          className="absolute top-2 left-2"
                        >
                          {creative.type === 'carousel'
                            ? '캐러셀'
                            : creative.type === 'video'
                              ? '비디오'
                              : creative.type === 'gif'
                                ? 'GIF'
                                : '이미지'}
                        </Badge>
                      </Paper>

                      {/* 정보 */}
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Group justify="space-between">
                          <Group gap="xs">
                            <Badge variant="light" color="pink">
                              {creative.platform}
                            </Badge>
                            <Badge variant="outline">{creative.aspectRatio}</Badge>
                          </Group>
                          {creative.status === 'completed' && (
                            <Group gap={4}>
                              <Tooltip label="다운로드">
                                <ActionIcon variant="subtle" color="gray">
                                  <IconDownload size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <CopyButton value={creative.headline}>
                                {({ copied, copy }) => (
                                  <Tooltip label={copied ? '복사됨!' : '텍스트 복사'}>
                                    <ActionIcon
                                      variant="subtle"
                                      color={copied ? 'green' : 'gray'}
                                      onClick={copy}
                                    >
                                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                    </ActionIcon>
                                  </Tooltip>
                                )}
                              </CopyButton>
                              <Tooltip label="삭제">
                                <ActionIcon variant="subtle" color="red">
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          )}
                        </Group>

                        <div>
                          <Text fw={600} size="sm">
                            {creative.headline}
                          </Text>
                          {creative.subheadline && (
                            <Text size="xs" c="dimmed">
                              {creative.subheadline}
                            </Text>
                          )}
                        </div>

                        {creative.cta && (
                          <Badge variant="light" color="green" size="sm" w="fit-content">
                            {creative.cta}
                          </Badge>
                        )}

                        <Group gap={4}>
                          <Text size="xs" c="dimmed">
                            컬러:
                          </Text>
                          {creative.colors.map((color, idx) => (
                            <ColorSwatch key={idx} color={color} size={14} />
                          ))}
                        </Group>

                        {creative.status === 'generating' && (
                          <Progress value={65} size="xs" color="pink" animated />
                        )}
                      </Stack>
                    </Group>
                  </Card>
                ))}

                {generatedCreatives.length === 0 && (
                  <Paper p="xl" radius="md" className="bg-gray-50 text-center">
                    <IconPhoto size={48} className="mx-auto mb-2 text-gray-300" />
                    <Text c="dimmed">아직 생성된 크리에이티브가 없습니다.</Text>
                    <Text size="sm" c="dimmed">
                      왼쪽에서 설정 후 생성 버튼을 클릭하세요.
                    </Text>
                  </Paper>
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Grid.Col>
      </Grid>

      {/* 미리보기 모달 */}
      <Modal
        opened={previewOpened}
        onClose={closePreview}
        size="lg"
        title={
          <Group gap="xs">
            <IconEye size={20} />
            <Text fw={600}>크리에이티브 미리보기</Text>
          </Group>
        }
      >
        {selectedPreview && (
          <Stack gap="md">
            {/* 디바이스 미리보기 */}
            <SegmentedControl
              fullWidth
              data={[
                {
                  value: 'mobile',
                  label: (
                    <Group gap={6} justify="center">
                      <IconDeviceMobile size={16} />
                      <span>모바일</span>
                    </Group>
                  ),
                },
                {
                  value: 'desktop',
                  label: (
                    <Group gap={6} justify="center">
                      <IconDeviceDesktop size={16} />
                      <span>데스크톱</span>
                    </Group>
                  ),
                },
              ]}
            />

            {/* 인스타그램 스타일 미리보기 */}
            <Paper withBorder radius="md" p="md" className="mx-auto max-w-sm">
              {/* 헤더 */}
              <Group mb="sm">
                <Paper
                  w={32}
                  h={32}
                  radius="xl"
                  className="bg-gradient-to-r from-pink-500 to-violet-500"
                />
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={600}>
                    beauty_brand
                  </Text>
                  <Text size="xs" c="dimmed">
                    Sponsored
                  </Text>
                </div>
              </Group>

              {/* 이미지 */}
              <Paper
                h={300}
                radius="sm"
                mb="sm"
                className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-violet-100"
              >
                <Stack align="center" gap="xs">
                  <Text fw={700} size="lg" ta="center" px="md">
                    {selectedPreview.headline}
                  </Text>
                  {selectedPreview.subheadline && (
                    <Text size="sm" c="dimmed" ta="center">
                      {selectedPreview.subheadline}
                    </Text>
                  )}
                  <Button size="xs" color="pink" mt="sm">
                    {selectedPreview.cta}
                  </Button>
                </Stack>
              </Paper>

              {/* 액션 바 */}
              <Group justify="space-between" mb="sm">
                <Group gap="md">
                  <IconHeart size={24} />
                  <IconMessageCircle size={24} />
                  <IconSend size={24} />
                </Group>
                <IconBookmark size={24} />
              </Group>

              <Text size="sm" fw={600}>
                1,234 likes
              </Text>
              <Text size="sm">
                <Text span fw={600}>
                  beauty_brand
                </Text>{' '}
                {selectedPreview.headline}
              </Text>
            </Paper>

            {/* 액션 버튼 */}
            <Group justify="center">
              <Button variant="light" leftSection={<IconRefresh size={16} />}>
                다시 생성
              </Button>
              <Button leftSection={<IconDownload size={16} />}>다운로드</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
