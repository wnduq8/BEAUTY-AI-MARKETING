'use client';

import { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Group,
  Badge,
  Select,
  Stack,
  Divider,
  SimpleGrid,
  Paper,
  Button,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconGitCompare, IconCheck, IconArrowRight, IconRefresh } from '@tabler/icons-react';
import { CampaignVersion } from '@/types';

interface VersionCompareProps {
  versions: CampaignVersion[];
  onSelectVersion?: (versionId: string) => void;
  onRegenerate?: (versionId: string, sections: string[]) => void;
}

export function VersionCompare({ versions, onSelectVersion, onRegenerate }: VersionCompareProps) {
  const [leftVersion, setLeftVersion] = useState<string | null>(
    versions.length > 1 ? versions[versions.length - 2].id : null
  );
  const [rightVersion, setRightVersion] = useState<string | null>(
    versions.length > 0 ? versions[versions.length - 1].id : null
  );

  const leftData = versions.find((v) => v.id === leftVersion);
  const rightData = versions.find((v) => v.id === rightVersion);

  const versionOptions = versions.map((v) => ({
    value: v.id,
    label: `v${v.version} - ${new Date(v.createdAt).toLocaleDateString('ko-KR')}`,
  }));

  const contentFields = [
    { key: 'headline', label: '헤드라인' },
    { key: 'subHeadline', label: '서브 헤드라인' },
    { key: 'bodyCopy', label: '본문 카피' },
    { key: 'cta', label: 'CTA' },
    { key: 'hashtags', label: '해시태그' },
    { key: 'ugcScript', label: 'UGC 스크립트' },
  ];

  const hasChanged = (key: string): boolean => {
    if (!leftData || !rightData) return false;
    const leftValue = leftData.content[key as keyof typeof leftData.content];
    const rightValue = rightData.content[key as keyof typeof rightData.content];
    return JSON.stringify(leftValue) !== JSON.stringify(rightValue);
  };

  const renderContent = (content: Record<string, unknown> | undefined, key: string) => {
    if (!content) return '-';
    const value = content[key];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return (value as string) || '-';
  };

  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" mb="md">
        <Group>
          <IconGitCompare size={24} className="text-pink-500" />
          <Title order={4}>버전 비교</Title>
        </Group>
        <Badge color="pink" variant="light">
          {versions.length}개 버전
        </Badge>
      </Group>

      {/* 버전 선택 */}
      <SimpleGrid cols={2} mb="lg">
        <Select
          label="비교 대상 (이전)"
          placeholder="버전 선택"
          data={versionOptions}
          value={leftVersion}
          onChange={setLeftVersion}
        />
        <Select
          label="비교 대상 (현재)"
          placeholder="버전 선택"
          data={versionOptions}
          value={rightVersion}
          onChange={setRightVersion}
        />
      </SimpleGrid>

      <Divider mb="lg" />

      {/* 비교 테이블 */}
      <Stack gap="md">
        {contentFields.map((field) => {
          const changed = hasChanged(field.key);
          return (
            <Paper
              key={field.key}
              p="md"
              withBorder
              className={changed ? 'border-pink-300 bg-pink-50' : ''}
            >
              <Group justify="space-between" mb="xs">
                <Group>
                  <Text fw={600} size="sm">
                    {field.label}
                  </Text>
                  {changed && (
                    <Badge size="xs" color="pink">
                      변경됨
                    </Badge>
                  )}
                </Group>
                {onRegenerate && (
                  <Tooltip label="이 섹션만 재생성">
                    <ActionIcon
                      variant="light"
                      color="pink"
                      size="sm"
                      onClick={() => rightVersion && onRegenerate(rightVersion, [field.key])}
                    >
                      <IconRefresh size={14} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>

              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="xs" c="dimmed" mb={4}>
                    v{leftData?.version || '-'}
                  </Text>
                  <Text size="sm" className="whitespace-pre-wrap">
                    {renderContent(leftData?.content as Record<string, unknown>, field.key)}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed" mb={4}>
                    v{rightData?.version || '-'}
                  </Text>
                  <Text size="sm" className="whitespace-pre-wrap" fw={changed ? 500 : 400}>
                    {renderContent(rightData?.content as Record<string, unknown>, field.key)}
                  </Text>
                </div>
              </SimpleGrid>
            </Paper>
          );
        })}
      </Stack>

      {/* 액션 버튼 */}
      <Group justify="flex-end" mt="lg">
        {rightData && onSelectVersion && (
          <Button
            color="pink"
            leftSection={<IconCheck size={16} />}
            onClick={() => onSelectVersion(rightData.id)}
          >
            v{rightData.version} 선택
          </Button>
        )}
      </Group>
    </Card>
  );
}
