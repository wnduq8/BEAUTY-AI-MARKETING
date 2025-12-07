'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Title,
  Text,
  Card,
  Group,
  Badge,
  Button,
  TextInput,
  Select,
  MultiSelect,
  SimpleGrid,
  Stack,
  Image,
  ActionIcon,
  Menu,
  Checkbox,
  Paper,
  Divider,
  Collapse,
  NumberFormatter,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconDots,
  IconEdit,
  IconTrash,
  IconCopy,
  IconSparkles,
  IconChevronDown,
  IconChevronUp,
  IconPackage,
} from '@tabler/icons-react';
import {
  BeautyProduct,
  CATEGORY_OPTIONS,
  SKIN_CONCERN_OPTIONS,
  PRICE_RANGE_OPTIONS,
  ProductCategory,
  SkinConcern,
} from '@/types/product';

// Mock 데이터
const mockProducts: BeautyProduct[] = [
  {
    id: '1',
    workspaceId: '1',
    basic: {
      name: '시카 진정 토너',
      line: '그린라인',
      price: 28000,
      volume: '200ml',
      images: ['/api/placeholder/200/200'],
    },
    skinConcerns: { primary: ['calming', 'trouble', 'redness'] },
    ingredients: {
      keyIngredients: [{ name: '시카/병풀', percentage: '80%', benefit: '진정 효과' }],
    },
    texture: { type: 'essence' },
    target: { skinTypes: ['sensitive', 'combination'], ageGroups: ['20s-early', '20s-late'] },
    category: 'skincare',
    status: 'active',
    hasPromotion: true,
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
      images: ['/api/placeholder/200/200'],
    },
    skinConcerns: { primary: ['wrinkle', 'elasticity'] },
    ingredients: {
      keyIngredients: [{ name: '레티놀', percentage: '0.1%', benefit: '주름 개선' }],
    },
    texture: { type: 'cream' },
    target: { skinTypes: ['dry', 'normal'], ageGroups: ['30s', '40s'] },
    category: 'skincare',
    status: 'active',
    hasPromotion: false,
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    workspaceId: '1',
    basic: {
      name: '워터프루프 선크림 SPF50+',
      line: '선케어라인',
      price: 32000,
      volume: '50ml',
      images: ['/api/placeholder/200/200'],
    },
    skinConcerns: { primary: ['hydration'] },
    ingredients: {
      keyIngredients: [{ name: '히알루론산', benefit: '보습' }],
    },
    texture: { type: 'cream' },
    target: { skinTypes: ['oily', 'combination'], ageGroups: ['20s-early', '20s-late', '30s'] },
    category: 'suncare',
    status: 'active',
    hasPromotion: true,
    inStock: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products] = useState<BeautyProduct[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpened, { toggle: toggleFilter }] = useDisclosure(false);

  // 필터 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [showPromoOnly, setShowPromoOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // 필터링된 상품
  const filteredProducts = products.filter((product) => {
    // 검색어 필터
    if (searchQuery && !product.basic.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 카테고리 필터
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    // 고민 필터
    if (selectedConcerns.length > 0) {
      const productConcerns = product.skinConcerns.primary;
      if (!selectedConcerns.some((c) => productConcerns.includes(c as SkinConcern))) {
        return false;
      }
    }
    // 가격대 필터
    if (selectedPriceRange) {
      const price = product.basic.price;
      if (selectedPriceRange === '0-20000' && price > 20000) return false;
      if (selectedPriceRange === '20000-50000' && (price < 20000 || price > 50000)) return false;
      if (selectedPriceRange === '50000-100000' && (price < 50000 || price > 100000)) return false;
      if (selectedPriceRange === '100000+' && price < 100000) return false;
    }
    // 프로모션 필터
    if (showPromoOnly && !product.hasPromotion) return false;
    // 재고 필터
    if (showInStockOnly && !product.inStock) return false;

    return true;
  });

  const getConcernLabel = (concern: SkinConcern) => {
    return SKIN_CONCERN_OPTIONS.find((c) => c.value === concern)?.label || concern;
  };

  const getCategoryEmoji = (category: ProductCategory) => {
    return CATEGORY_OPTIONS.find((c) => c.value === category)?.emoji || '📦';
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConcerns([]);
    setSelectedPriceRange(null);
    setShowPromoOnly(false);
    setShowInStockOnly(false);
  };

  const activeFilterCount = [
    selectedCategories.length > 0,
    selectedConcerns.length > 0,
    selectedPriceRange !== null,
    showPromoOnly,
    showInStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Group justify="space-between">
        <div>
          <Title order={2}>상품 관리</Title>
          <Text c="dimmed" size="sm">
            뷰티 상품 브리프를 관리하고 AI 마케팅 콘텐츠를 생성하세요.
          </Text>
        </div>
        <Button
          color="pink"
          leftSection={<IconPlus size={16} />}
          onClick={() => router.push('/dashboard/products/new')}
        >
          새 상품 등록
        </Button>
      </Group>

      {/* 검색 및 필터 */}
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" mb={filterOpened ? 'md' : 0}>
          <TextInput
            placeholder="상품명 검색..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md flex-1"
          />
          <Button
            variant={activeFilterCount > 0 ? 'filled' : 'light'}
            color={activeFilterCount > 0 ? 'pink' : 'gray'}
            leftSection={<IconFilter size={16} />}
            rightSection={
              filterOpened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />
            }
            onClick={toggleFilter}
          >
            필터 {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </Group>

        <Collapse in={filterOpened}>
          <Divider my="md" />
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <MultiSelect
              label="카테고리"
              placeholder="선택"
              data={CATEGORY_OPTIONS.map((c) => ({
                value: c.value,
                label: `${c.emoji} ${c.label}`,
              }))}
              value={selectedCategories}
              onChange={setSelectedCategories}
              clearable
            />
            <MultiSelect
              label="피부 고민"
              placeholder="선택"
              data={SKIN_CONCERN_OPTIONS.map((c) => ({
                value: c.value,
                label: `${c.emoji} ${c.label}`,
              }))}
              value={selectedConcerns}
              onChange={setSelectedConcerns}
              clearable
            />
            <Select
              label="가격대"
              placeholder="선택"
              data={PRICE_RANGE_OPTIONS}
              value={selectedPriceRange}
              onChange={setSelectedPriceRange}
              clearable
            />
            <Stack gap="xs" mt={24}>
              <Checkbox
                label="프로모션 상품만"
                checked={showPromoOnly}
                onChange={(e) => setShowPromoOnly(e.currentTarget.checked)}
              />
              <Checkbox
                label="재고 있는 상품만"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.currentTarget.checked)}
              />
            </Stack>
          </SimpleGrid>
          {activeFilterCount > 0 && (
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" size="xs" onClick={clearFilters}>
                필터 초기화
              </Button>
            </Group>
          )}
        </Collapse>
      </Paper>

      {/* 상품 수 표시 */}
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          총 {filteredProducts.length}개 상품
        </Text>
      </Group>

      {/* 상품 카드 그리드 */}
      {filteredProducts.length === 0 ? (
        <Paper withBorder p="xl" radius="md" className="text-center">
          <IconPackage size={48} className="mx-auto mb-4 text-gray-300" />
          <Text fw={500} mb="xs">
            등록된 상품이 없습니다
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            새 상품을 등록하고 AI 마케팅 콘텐츠를 생성해보세요.
          </Text>
          <Button
            color="pink"
            leftSection={<IconPlus size={16} />}
            onClick={() => router.push('/dashboard/products/new')}
          >
            첫 상품 등록하기
          </Button>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              withBorder
              padding="lg"
              radius="md"
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => router.push(`/dashboard/products/${product.id}`)}
            >
              {/* 상품 이미지 */}
              <Card.Section>
                <div className="relative">
                  <Image
                    src={product.basic.images[0] || '/api/placeholder/300/200'}
                    height={160}
                    alt={product.basic.name}
                    fallbackSrc="https://placehold.co/300x200?text=No+Image"
                  />
                  <Group gap={4} className="absolute top-2 left-2">
                    {product.hasPromotion && (
                      <Badge color="red" size="sm">
                        프로모션
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge color="gray" size="sm">
                        품절
                      </Badge>
                    )}
                  </Group>
                  <Menu position="bottom-end" withinPortal>
                    <Menu.Target>
                      <ActionIcon
                        variant="white"
                        className="absolute top-2 right-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconDots size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/products/${product.id}`);
                        }}
                      >
                        수정
                      </Menu.Item>
                      <Menu.Item leftSection={<IconCopy size={14} />}>복제</Menu.Item>
                      <Menu.Item leftSection={<IconSparkles size={14} />} color="pink">
                        AI 콘텐츠 생성
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                        삭제
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              </Card.Section>

              {/* 상품 정보 */}
              <Stack gap="xs" mt="md">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text size="xs" c="dimmed">
                      {getCategoryEmoji(product.category)} {product.basic.line || '기본라인'}
                    </Text>
                    <Text fw={600} lineClamp={1}>
                      {product.basic.name}
                    </Text>
                  </div>
                  <Text fw={700} c="pink">
                    <NumberFormatter value={product.basic.price} thousandSeparator suffix="원" />
                  </Text>
                </Group>

                {/* 핵심 고민 태그 */}
                <Group gap={4}>
                  {product.skinConcerns.primary.slice(0, 3).map((concern) => (
                    <Badge key={concern} size="xs" variant="light" color="pink">
                      {getConcernLabel(concern)}
                    </Badge>
                  ))}
                  {product.skinConcerns.primary.length > 3 && (
                    <Badge size="xs" variant="light" color="gray">
                      +{product.skinConcerns.primary.length - 3}
                    </Badge>
                  )}
                </Group>

                {/* 핵심 성분 (USP) */}
                {product.ingredients.keyIngredients.length > 0 && (
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    🧪 {product.ingredients.keyIngredients.map((i) => i.name).join(', ')}
                  </Text>
                )}

                {/* AI 생성물 여부 */}
                {product.artifacts?.messageHouse && (
                  <Badge size="xs" color="violet" variant="dot">
                    AI 메시지하우스 생성됨
                  </Badge>
                )}
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </div>
  );
}
