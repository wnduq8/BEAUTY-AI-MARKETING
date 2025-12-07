'use client';

import { useEffect, useState } from 'react';
import {
  Title,
  Text,
  Card,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Avatar,
  Group,
  Divider,
  Alert,
  Tabs,
  Textarea,
  TagsInput,
  FileButton,
  ColorInput,
  SimpleGrid,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconLock,
  IconAlertCircle,
  IconCheck,
  IconUpload,
  IconPalette,
  IconMessageCircle,
  IconBan,
  IconStar,
} from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function SettingsPage() {
  const { workspaceSettings, updateSettings, currentWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // 프로필 폼
  const profileForm = useForm({
    initialValues: {
      name: '',
      company: '',
      phone: '',
    },
    validate: {
      name: (value) => (value.length >= 2 ? null : '이름은 2자 이상이어야 합니다'),
    },
  });

  // 비밀번호 폼
  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) => {
        if (value.length < 6) return '비밀번호는 6자 이상이어야 합니다';
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
          return '비밀번호는 영문과 숫자를 포함해야 합니다';
        }
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.newPassword ? '비밀번호가 일치하지 않습니다' : null,
    },
  });

  // 브랜드 설정 폼
  const brandForm = useForm({
    initialValues: {
      brandTone: '',
      forbiddenWords: [] as string[],
      requiredPhrases: [] as string[],
      primaryColor: '#FF6B9D',
      secondaryColor: '#B388FF',
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || '');
        profileForm.setValues({
          name: user.user_metadata?.name || '',
          company: user.user_metadata?.company || '',
          phone: user.user_metadata?.phone || '',
        });
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (workspaceSettings) {
      brandForm.setValues({
        brandTone: workspaceSettings.brandTone || '',
        forbiddenWords: workspaceSettings.forbiddenWords || [],
        requiredPhrases: workspaceSettings.requiredPhrases || [],
        primaryColor: workspaceSettings.primaryColor || '#FF6B9D',
        secondaryColor: workspaceSettings.secondaryColor || '#B388FF',
      });
    }
  }, [workspaceSettings]);

  const handleProfileUpdate = async (values: typeof profileForm.values) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { name: values.name, company: values.company, phone: values.phone },
    });

    if (error) {
      setError('프로필 업데이트 중 오류가 발생했습니다.');
    } else {
      notifications.show({
        title: '저장 완료',
        message: '프로필이 업데이트되었습니다.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    }
    setLoading(false);
  };

  const handlePasswordChange = async (values: typeof passwordForm.values) => {
    setPasswordLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: values.newPassword });

    if (error) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
    } else {
      notifications.show({
        title: '비밀번호 변경 완료',
        message: '새 비밀번호로 변경되었습니다.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      passwordForm.reset();
    }
    setPasswordLoading(false);
  };

  const handleBrandUpdate = async (values: typeof brandForm.values) => {
    setBrandLoading(true);
    await updateSettings({
      brandTone: values.brandTone,
      forbiddenWords: values.forbiddenWords,
      requiredPhrases: values.requiredPhrases,
      primaryColor: values.primaryColor,
      secondaryColor: values.secondaryColor,
    });

    notifications.show({
      title: '브랜드 설정 저장',
      message: '브랜드 설정이 업데이트되었습니다.',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
    setBrandLoading(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Title order={2}>설정</Title>
        <Text c="dimmed" size="sm">
          계정 및 브랜드 설정을 관리합니다.
        </Text>
      </div>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Tabs defaultValue="brand">
        <Tabs.List>
          <Tabs.Tab value="brand" leftSection={<IconPalette size={16} />}>
            브랜드 설정
          </Tabs.Tab>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            프로필
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
            보안
          </Tabs.Tab>
        </Tabs.List>

        {/* 브랜드 설정 탭 */}
        <Tabs.Panel value="brand" pt="md">
          <Stack gap="md">
            <Card withBorder padding="lg" radius="md">
              <Group mb="md">
                <IconMessageCircle size={20} className="text-pink-500" />
                <Title order={4}>브랜드 톤 & 보이스</Title>
              </Group>
              <form onSubmit={brandForm.onSubmit(handleBrandUpdate)}>
                <Stack>
                  <Textarea
                    label="브랜드 톤 설명"
                    description="AI가 콘텐츠 생성 시 참고할 브랜드 톤을 설명해주세요."
                    placeholder="예: 친근하고 전문적인 톤. 20-30대 여성 타겟. 신뢰감을 주되 딱딱하지 않게."
                    minRows={3}
                    {...brandForm.getInputProps('brandTone')}
                  />

                  <Divider my="sm" />

                  <Group mb="xs">
                    <IconBan size={18} className="text-red-500" />
                    <Text fw={500}>금칙어 설정</Text>
                  </Group>
                  <TagsInput
                    description="콘텐츠에 사용하지 않을 단어들을 입력하세요."
                    placeholder="단어 입력 후 Enter"
                    {...brandForm.getInputProps('forbiddenWords')}
                  />
                  <Group gap="xs">
                    {brandForm.values.forbiddenWords.map((word) => (
                      <Badge key={word} color="red" variant="light">
                        {word}
                      </Badge>
                    ))}
                  </Group>

                  <Divider my="sm" />

                  <Group mb="xs">
                    <IconStar size={18} className="text-yellow-500" />
                    <Text fw={500}>필수 문구 설정</Text>
                  </Group>
                  <TagsInput
                    description="콘텐츠에 반드시 포함할 문구들을 입력하세요."
                    placeholder="문구 입력 후 Enter"
                    {...brandForm.getInputProps('requiredPhrases')}
                  />
                  <Group gap="xs">
                    {brandForm.values.requiredPhrases.map((phrase) => (
                      <Badge key={phrase} color="green" variant="light">
                        {phrase}
                      </Badge>
                    ))}
                  </Group>

                  <Divider my="sm" />

                  <Text fw={500} mb="xs">
                    브랜드 컬러
                  </Text>
                  <SimpleGrid cols={2}>
                    <ColorInput
                      label="Primary Color"
                      {...brandForm.getInputProps('primaryColor')}
                    />
                    <ColorInput
                      label="Secondary Color"
                      {...brandForm.getInputProps('secondaryColor')}
                    />
                  </SimpleGrid>

                  <Group justify="flex-end" mt="md">
                    <Button type="submit" loading={brandLoading} color="pink">
                      브랜드 설정 저장
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* 프로필 탭 */}
        <Tabs.Panel value="profile" pt="md">
          <Card withBorder padding="lg" radius="md">
            <form onSubmit={profileForm.onSubmit(handleProfileUpdate)}>
              <Stack>
                <Group>
                  <Avatar size={80} radius="xl" color="pink">
                    <IconUser size={40} />
                  </Avatar>
                  <div>
                    <Text fw={500}>{profileForm.values.name || '사용자'}</Text>
                    <Text size="sm" c="dimmed">
                      {userEmail}
                    </Text>
                    {/* <FileButton onChange={() => {}} accept="image/*">
                      {(props) => (
                        <Button
                          {...props}
                          variant="light"
                          size="xs"
                          mt="xs"
                          leftSection={<IconUpload size={14} />}
                        >
                          사진 변경
                        </Button>
                      )}
                    </FileButton> */}
                  </div>
                </Group>
                <Divider my="sm" />
                <TextInput
                  label="이름"
                  placeholder="홍길동"
                  {...profileForm.getInputProps('name')}
                />
                <TextInput label="이메일" value={userEmail} disabled />
                <TextInput
                  label="회사명"
                  placeholder="회사명"
                  {...profileForm.getInputProps('company')}
                />
                <TextInput
                  label="연락처"
                  placeholder="010-0000-0000"
                  {...profileForm.getInputProps('phone')}
                />
                <Group justify="flex-end" mt="md">
                  <Button type="submit" loading={loading} color="pink">
                    저장하기
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>

        {/* 보안 탭 */}
        <Tabs.Panel value="security" pt="md">
          <Card withBorder padding="lg" radius="md">
            <Title order={4} mb="md">
              비밀번호 변경
            </Title>
            <form onSubmit={passwordForm.onSubmit(handlePasswordChange)}>
              <Stack>
                <PasswordInput
                  label="현재 비밀번호"
                  {...passwordForm.getInputProps('currentPassword')}
                />
                <PasswordInput label="새 비밀번호" {...passwordForm.getInputProps('newPassword')} />
                <PasswordInput
                  label="새 비밀번호 확인"
                  {...passwordForm.getInputProps('confirmPassword')}
                />
                <Group justify="flex-end" mt="md">
                  <Button type="submit" loading={passwordLoading} color="pink">
                    비밀번호 변경
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
