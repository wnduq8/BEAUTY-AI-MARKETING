'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Stack,
  Divider,
  Alert,
  Tabs,
  Group,
  ThemeIcon,
  Anchor,
  Modal,
  Code,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconCheck,
  IconMail,
  IconLock,
  IconSparkles,
  IconBrandGoogle,
  IconBrandApple,
  IconWand,
  IconBuilding,
  IconUserPlus,
} from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceModalOpened, { open: openWorkspaceModal, close: closeWorkspaceModal }] =
    useDisclosure(false);

  // 로그인 폼
  const loginForm = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '올바른 이메일을 입력해주세요'),
      password: (value) => (value.length >= 6 ? null : '비밀번호는 6자 이상이어야 합니다'),
    },
  });

  // 회원가입 폼
  const registerForm = useForm({
    initialValues: { email: '', password: '', confirmPassword: '', name: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '올바른 이메일을 입력해주세요'),
      password: (value) => {
        if (value.length < 6) return '비밀번호는 6자 이상이어야 합니다';
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) return '영문과 숫자를 포함해야 합니다';
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? '비밀번호가 일치하지 않습니다' : null,
      name: (value) => (value.length >= 2 ? null : '이름은 2자 이상이어야 합니다'),
    },
  });

  // 매직링크 폼
  const magicLinkForm = useForm({
    initialValues: { email: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : '올바른 이메일을 입력해주세요'),
    },
  });

  // 워크스페이스 참여 폼
  const workspaceForm = useForm({
    initialValues: { inviteCode: '' },
    validate: {
      inviteCode: (value) => (value.length >= 6 ? null : '초대 코드를 입력해주세요'),
    },
  });

  const getErrorMessage = (message: string): string => {
    if (message.includes('Invalid login credentials'))
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    if (message.includes('Email not confirmed'))
      return '이메일 인증이 필요합니다. 메일함을 확인해주세요.';
    if (message.includes('User already registered')) return '이미 등록된 이메일입니다.';
    if (message.includes('Too many requests'))
      return '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
    return '오류가 발생했습니다. 다시 시도해주세요.';
  };

  // 이메일 로그인
  const handleLogin = async (values: typeof loginForm.values) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(getErrorMessage(error.message));
      setLoading(false);
      return;
    }

    // 온보딩 완료 여부 체크
    const hasCompletedOnboarding = data.user?.user_metadata?.onboarding_completed;

    notifications.show({
      title: '로그인 성공',
      message: '환영합니다!',
      color: 'green',
      icon: <IconCheck size={16} />,
    });

    if (hasCompletedOnboarding) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
    router.refresh();
  };

  // 회원가입
  const handleRegister = async (values: typeof registerForm.values) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { name: values.name },
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });

    if (error) {
      setError(getErrorMessage(error.message));
      setLoading(false);
      return;
    }

    notifications.show({
      title: '회원가입 완료',
      message: '이메일 인증 후 온보딩을 진행해주세요.',
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 5000,
    });

    setLoading(false);
  };

  // 매직링크 전송
  const handleMagicLink = async (values: typeof magicLinkForm.values) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(getErrorMessage(error.message));
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  };

  // 소셜 로그인
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(getErrorMessage(error.message));
    }
  };

  // 워크스페이스 참여
  const handleJoinWorkspace = async (values: typeof workspaceForm.values) => {
    // TODO: 초대 코드로 워크스페이스 참여 로직
    notifications.show({
      title: '워크스페이스 참여',
      message: '워크스페이스에 참여했습니다.',
      color: 'green',
    });
    closeWorkspaceModal();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <Container size={480} className="w-full">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <Group justify="center" mb="sm">
            <ThemeIcon size={50} radius="xl" color="pink">
              <IconSparkles size={28} />
            </ThemeIcon>
          </Group>
          <Title className="text-3xl font-bold text-gray-800">Beauty AI Marketing</Title>
          <Text c="dimmed" size="sm" mt={5}>
            뷰티 마케팅의 새로운 시작
          </Text>
        </div>

        <Paper withBorder shadow="md" p={30} radius="md">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              mb="md"
              withCloseButton
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Tabs defaultValue="login">
            <Tabs.List grow mb="md">
              <Tabs.Tab value="login" leftSection={<IconLock size={16} />}>
                로그인
              </Tabs.Tab>
              <Tabs.Tab value="register" leftSection={<IconUserPlus size={16} />}>
                회원가입
              </Tabs.Tab>
              <Tabs.Tab value="magic" leftSection={<IconWand size={16} />}>
                매직링크
              </Tabs.Tab>
            </Tabs.List>

            {/* 로그인 탭 */}
            <Tabs.Panel value="login">
              <form onSubmit={loginForm.onSubmit(handleLogin)}>
                <Stack>
                  <TextInput
                    label="이메일"
                    placeholder="hello@example.com"
                    leftSection={<IconMail size={16} />}
                    required
                    {...loginForm.getInputProps('email')}
                  />
                  <PasswordInput
                    label="비밀번호"
                    placeholder="비밀번호를 입력하세요"
                    leftSection={<IconLock size={16} />}
                    required
                    {...loginForm.getInputProps('password')}
                  />
                  <Button type="submit" fullWidth loading={loading} color="pink">
                    로그인
                  </Button>
                </Stack>
              </form>
            </Tabs.Panel>

            {/* 회원가입 탭 */}
            <Tabs.Panel value="register">
              <form onSubmit={registerForm.onSubmit(handleRegister)}>
                <Stack>
                  <TextInput
                    label="이름"
                    placeholder="홍길동"
                    required
                    {...registerForm.getInputProps('name')}
                  />
                  <TextInput
                    label="이메일"
                    placeholder="hello@example.com"
                    leftSection={<IconMail size={16} />}
                    required
                    {...registerForm.getInputProps('email')}
                  />
                  <PasswordInput
                    label="비밀번호"
                    placeholder="영문, 숫자 포함 6자 이상"
                    leftSection={<IconLock size={16} />}
                    required
                    {...registerForm.getInputProps('password')}
                  />
                  <PasswordInput
                    label="비밀번호 확인"
                    placeholder="비밀번호를 다시 입력하세요"
                    leftSection={<IconLock size={16} />}
                    required
                    {...registerForm.getInputProps('confirmPassword')}
                  />
                  <Button type="submit" fullWidth loading={loading} color="pink">
                    회원가입
                  </Button>
                </Stack>
              </form>
            </Tabs.Panel>

            {/* 매직링크 탭 */}
            <Tabs.Panel value="magic">
              {magicLinkSent ? (
                <Alert color="green" icon={<IconCheck size={16} />}>
                  <Text fw={500}>이메일을 확인해주세요!</Text>
                  <Text size="sm" mt={4}>
                    {magicLinkForm.values.email}로 로그인 링크를 보냈습니다. 링크를 클릭하면
                    자동으로 로그인됩니다.
                  </Text>
                  <Button variant="light" size="xs" mt="sm" onClick={() => setMagicLinkSent(false)}>
                    다른 이메일로 시도
                  </Button>
                </Alert>
              ) : (
                <form onSubmit={magicLinkForm.onSubmit(handleMagicLink)}>
                  <Stack>
                    <Text size="sm" c="dimmed">
                      비밀번호 없이 이메일 링크로 간편하게 로그인하세요.
                    </Text>
                    <TextInput
                      label="이메일"
                      placeholder="hello@example.com"
                      leftSection={<IconMail size={16} />}
                      required
                      {...magicLinkForm.getInputProps('email')}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      loading={loading}
                      color="pink"
                      leftSection={<IconWand size={16} />}
                    >
                      매직링크 받기
                    </Button>
                  </Stack>
                </form>
              )}
            </Tabs.Panel>
          </Tabs>

          <Divider label="또는" labelPosition="center" my="lg" />

          {/* 소셜 로그인 */}
          <Stack gap="sm">
            <Button
              variant="default"
              fullWidth
              leftSection={<IconBrandGoogle size={18} />}
              onClick={() => handleSocialLogin('google')}
            >
              Google로 계속하기
            </Button>
            <Button
              variant="default"
              fullWidth
              leftSection={<IconBrandApple size={18} />}
              onClick={() => handleSocialLogin('apple')}
            >
              Apple로 계속하기
            </Button>
          </Stack>

          <Divider my="lg" />

          {/* 워크스페이스 참여 */}
          <Button
            variant="light"
            fullWidth
            color="violet"
            leftSection={<IconBuilding size={16} />}
            onClick={openWorkspaceModal}
          >
            초대코드로 워크스페이스 참여
          </Button>
        </Paper>

        {/* 워크스페이스 참여 모달 */}
        <Modal
          opened={workspaceModalOpened}
          onClose={closeWorkspaceModal}
          title="워크스페이스 참여"
          centered
        >
          <form onSubmit={workspaceForm.onSubmit(handleJoinWorkspace)}>
            <Stack>
              <Text size="sm" c="dimmed">
                관리자에게 받은 초대 코드를 입력하세요.
              </Text>
              <TextInput
                label="초대 코드"
                placeholder="예: ABC123XYZ"
                {...workspaceForm.getInputProps('inviteCode')}
              />
              <Group justify="flex-end">
                <Button variant="subtle" onClick={closeWorkspaceModal}>
                  취소
                </Button>
                <Button type="submit" color="pink">
                  참여하기
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </div>
  );
}
