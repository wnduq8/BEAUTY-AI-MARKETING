'use client';

import { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Group,
  Checkbox,
  Button,
  Stack,
  Textarea,
  Alert,
  Badge,
  Loader,
  Progress,
} from '@mantine/core';
import { IconRefresh, IconSparkles, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface RegeneratePanelProps {
  campaignId: string;
  versionId: string;
  onRegenerate?: (sections: string[], additionalPrompt?: string) => Promise<void>;
}

const regenerateSections = [
  {
    id: 'headline',
    label: '헤드라인',
    description: '메인 타이틀 및 캐치프레이즈',
  },
  {
    id: 'subHeadline',
    label: '서브 헤드라인',
    description: '부제목 및 보조 문구',
  },
  {
    id: 'bodyCopy',
    label: '본문 카피',
    description: '상세 설명 텍스트',
  },
  {
    id: 'cta',
    label: 'CTA (Call to Action)',
    description: '행동 유도 버튼 문구',
  },
  {
    id: 'hashtags',
    label: '해시태그',
    description: 'SNS용 해시태그 목록',
  },
  {
    id: 'ugcScript',
    label: 'UGC 스크립트',
    description: '인플루언서/리뷰어용 스크립트',
  },
  {
    id: 'visualDirection',
    label: '비주얼 디렉션',
    description: '이미지/영상 가이드',
  },
];

export function RegeneratePanel({ campaignId, versionId, onRegenerate }: RegeneratePanelProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleToggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSections.length === regenerateSections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(regenerateSections.map((s) => s.id));
    }
  };

  const handleRegenerate = async () => {
    if (selectedSections.length === 0) {
      notifications.show({
        title: '섹션 선택 필요',
        message: '재생성할 섹션을 하나 이상 선택해주세요.',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    // 프로그레스 시뮬레이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);

    try {
      if (onRegenerate) {
        await onRegenerate(selectedSections, additionalPrompt);
      } else {
        // Mock delay
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      setProgress(100);

      notifications.show({
        title: '재생성 완료',
        message: `${selectedSections.length}개 섹션이 재생성되었습니다.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });

      setSelectedSections([]);
      setAdditionalPrompt('');
    } catch (error) {
      notifications.show({
        title: '재생성 실패',
        message: '다시 시도해주세요.',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="md">
        <Group>
          <IconRefresh size={24} className="text-pink-500" />
          <Title order={4}>섹션 재생성</Title>
        </Group>
        <Badge color="pink" variant="light">
          AI 생성
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        특정 섹션만 선택하여 다시 생성할 수 있습니다. 브랜드 톤과 금칙어 설정이 자동으로 적용됩니다.
      </Text>

      {isLoading && (
        <Alert color="blue" mb="md" icon={<Loader size={16} />}>
          <Stack gap="xs">
            <Text size="sm">AI가 콘텐츠를 생성하고 있습니다...</Text>
            <Progress value={progress} color="pink" size="sm" animated />
          </Stack>
        </Alert>
      )}

      {/* 전체 선택 */}
      <Group mb="sm">
        <Checkbox
          label="전체 선택"
          checked={selectedSections.length === regenerateSections.length}
          indeterminate={
            selectedSections.length > 0 && selectedSections.length < regenerateSections.length
          }
          onChange={handleSelectAll}
        />
        <Text size="xs" c="dimmed">
          {selectedSections.length}개 선택됨
        </Text>
      </Group>

      {/* 섹션 목록 */}
      <Stack gap="xs" mb="lg">
        {regenerateSections.map((section) => (
          <Card
            key={section.id}
            withBorder
            padding="sm"
            radius="sm"
            className={`cursor-pointer transition-colors ${
              selectedSections.includes(section.id)
                ? 'border-pink-400 bg-pink-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleToggleSection(section.id)}
          >
            <Group>
              <Checkbox
                checked={selectedSections.includes(section.id)}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
              <div>
                <Text size="sm" fw={500}>
                  {section.label}
                </Text>
                <Text size="xs" c="dimmed">
                  {section.description}
                </Text>
              </div>
            </Group>
          </Card>
        ))}
      </Stack>

      {/* 추가 프롬프트 */}
      <Textarea
        label="추가 지시사항 (선택)"
        description="AI에게 전달할 추가 요청사항을 입력하세요."
        placeholder="예: 좀 더 젊은 느낌으로, 이모지 포함해서..."
        minRows={2}
        value={additionalPrompt}
        onChange={(e) => setAdditionalPrompt(e.target.value)}
        mb="md"
      />

      {/* 재생성 버튼 */}
      <Button
        fullWidth
        color="pink"
        size="md"
        leftSection={<IconSparkles size={18} />}
        onClick={handleRegenerate}
        loading={isLoading}
        disabled={selectedSections.length === 0}
      >
        {selectedSections.length > 0
          ? `${selectedSections.length}개 섹션 재생성`
          : '섹션을 선택하세요'}
      </Button>
    </Card>
  );
}
