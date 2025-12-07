'use client';

import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Badge,
  Paper,
  CopyButton,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Button,
  Divider,
  TypographyStylesProvider,
} from '@mantine/core';
import {
  IconCopy,
  IconCheck,
  IconFileText,
  IconRocket,
  IconFlask,
  IconStar,
  IconQuestionMark,
  IconClick,
  IconRefresh,
  IconDownload,
} from '@tabler/icons-react';
import { LandingOutline } from '@/types/product';

interface LandingOutlineViewerProps {
  landingOutline: LandingOutline;
  onRegenerate?: (section: string) => void;
}

// Mock 데이터
const mockLandingOutline: LandingOutline = {
  version: 1,
  heroSection: `## 🌿 민감해진 피부, 시카로 진정하세요

**병풀추출물 80% 고함량 진정 토너**

트러블과 홍조로 예민해진 피부를 위한 데일리 진정 케어.
자극 없이 순하게, 피부 본연의 건강한 밸런스를 되찾아드립니다.

✓ 민감성 피부 테스트 완료
✓ 피부과 전문의 추천
✓ 무향료 · 무색소 · 저자극

**지금 바로 진정 케어를 시작하세요 →**`,

  evidenceSection: `## 🔬 과학이 증명한 진정 효과

### 핵심 성분: 병풀추출물 80%

| 성분 | 함량 | 효능 |
|------|------|------|
| 병풀추출물 | 80% | 즉각적인 진정, 피부 장벽 강화 |
| 판테놀 | 5% | 보습 및 피부 진정 |
| 알란토인 | 2% | 피부 보호 및 재생 |

### 임상 결과
- 사용 직후 피부 진정감 **93%** 체감
- 2주 사용 후 트러블 **45%** 감소
- 4주 사용 후 피부결 개선 **78%** 만족

*자체 임상 테스트 결과 (n=50)*`,

  reviewSection: `## ⭐ 실제 사용자 후기

> "민감한 피부인데 자극 없이 잘 맞아요. 트러블도 확실히 줄었어요!"
> — 20대 여성, 민감성 피부

> "촉촉한데 끈적이지 않아서 아침에도 쓰기 좋아요. 재구매 5번째입니다."
> — 30대 여성, 복합성 피부

> "홍조가 심했는데 이거 쓰고 많이 좋아졌어요. 진짜 추천!"
> — 20대 여성, 지성 피부

**평균 평점 4.8/5.0** (리뷰 2,847개)`,

  faqSection: `## ❓ 자주 묻는 질문

**Q. 민감한 피부인데 자극 없을까요?**
민감성 피부 테스트를 완료한 제품으로, 자극 없이 순하게 사용하실 수 있습니다.

**Q. 끈적이지 않나요?**
에센스 타입이지만 빠르게 흡수되어 산뜻하게 마무리됩니다.

**Q. 얼마나 써야 효과가 있나요?**
진정 효과는 즉시, 피부결 개선은 2-4주 사용 후 체감하실 수 있습니다.

**Q. 어떻게 사용하나요?**
세안 후 화장솜 또는 손에 덜어 피부결 따라 부드럽게 발라주세요.`,

  ctaSection: `## 🛒 지금 바로 시작하세요

### 시카 진정 토너 200ml

~~35,000원~~ **28,000원**
**20% 할인** + 무료 배송

- ✅ 첫 구매 시 미니어처 증정
- ✅ 100% 정품 보장
- ✅ 14일 무료 반품

**[지금 구매하기]**

*오늘 주문 시 내일 도착 (서울/경기)*`,
  createdAt: new Date(),
};

const sections = [
  { key: 'heroSection', label: '상단 히어로', icon: IconRocket, color: 'pink' },
  { key: 'evidenceSection', label: '근거 섹션', icon: IconFlask, color: 'blue' },
  { key: 'reviewSection', label: '후기 섹션', icon: IconStar, color: 'yellow' },
  { key: 'faqSection', label: 'FAQ 섹션', icon: IconQuestionMark, color: 'cyan' },
  { key: 'ctaSection', label: 'CTA 섹션', icon: IconClick, color: 'green' },
];

export function LandingOutlineViewer({
  landingOutline = mockLandingOutline,
  onRegenerate,
}: LandingOutlineViewerProps) {
  const handleExportMarkdown = () => {
    const content = `# 상세페이지 초안

${landingOutline.heroSection}

---

${landingOutline.evidenceSection}

---

${landingOutline.reviewSection}

---

${landingOutline.faqSection}

---

${landingOutline.ctaSection}
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-outline.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card withBorder padding="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Group>
          <ThemeIcon color="pink" variant="light" size="lg">
            <IconFileText size={20} />
          </ThemeIcon>
          <div>
            <Title order={4}>상세페이지 아웃라인</Title>
            <Text size="xs" c="dimmed">
              v{landingOutline.version} •{' '}
              {new Date(landingOutline.createdAt).toLocaleDateString('ko-KR')}
            </Text>
          </div>
        </Group>
        <Group>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconDownload size={14} />}
            onClick={handleExportMarkdown}
          >
            Markdown 내보내기
          </Button>
          <Badge color="pink">AI 생성</Badge>
        </Group>
      </Group>

      <Stack gap="md">
        {sections.map(({ key, label, icon: Icon, color }) => {
          const content = landingOutline[key as keyof LandingOutline] as string;
          return (
            <Paper key={key} withBorder p="md" radius="md">
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <ThemeIcon color={color} variant="light" size="sm">
                    <Icon size={14} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">
                    {label}
                  </Text>
                </Group>
                <Group gap={4}>
                  {onRegenerate && (
                    <Tooltip label="이 섹션만 재생성">
                      <ActionIcon variant="subtle" size="sm" onClick={() => onRegenerate(key)}>
                        <IconRefresh size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  <CopyButton value={content}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? '복사됨' : '복사'}>
                        <ActionIcon variant="subtle" size="sm" onClick={copy}>
                          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
              </Group>
              <Paper p="sm" radius="sm" className="bg-gray-50">
                <TypographyStylesProvider>
                  <div
                    className="prose prose-sm max-w-none text-sm"
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {content}
                  </div>
                </TypographyStylesProvider>
              </Paper>
            </Paper>
          );
        })}
      </Stack>
    </Card>
  );
}
