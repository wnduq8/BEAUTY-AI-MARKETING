'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Group,
  TextInput,
  Button,
  Menu,
  Avatar,
  Indicator,
  ActionIcon,
  Text,
  Popover,
  Stack,
  Badge,
  ScrollArea,
  UnstyledButton,
  rem,
} from '@mantine/core';
import {
  IconSearch,
  IconDownload,
  IconBell,
  IconChevronDown,
  IconUser,
  IconLogout,
  IconBuilding,
  IconCheck,
  IconPlus,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { createClient } from '@/lib/supabase/client';
import { notifications } from '@mantine/notifications';

interface HeaderProps {
  onSidebarToggle?: () => void;
  sidebarOpened?: boolean;
}

export function Header({ onSidebarToggle, sidebarOpened = true }: HeaderProps) {
  const router = useRouter();
  const {
    workspaces,
    currentWorkspace,
    switchWorkspace,
    notifications: notificationList,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    canExport,
  } = useWorkspace();

  const [searchValue, setSearchValue] = useState('');
  const [notificationOpened, setNotificationOpened] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleExport = () => {
    if (!canExport) {
      notifications.show({
        title: '권한 없음',
        message: 'Export 권한이 없습니다. 관리자에게 문의하세요.',
        color: 'red',
      });
      return;
    }
    // TODO: Export 기능 구현
    notifications.show({
      title: 'Export 시작',
      message: '데이터를 내보내는 중입니다...',
      color: 'blue',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return new Date(date).toLocaleDateString('ko-KR');
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      {/* 좌측: 사이드바 토글 + 워크스페이스 선택 */}
      <Group>
        {onSidebarToggle && (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={onSidebarToggle}
            aria-label={sidebarOpened ? '사이드바 접기' : '사이드바 펼치기'}
          >
            {sidebarOpened ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </ActionIcon>
        )}
        <Menu shadow="md" width={250}>
          <Menu.Target>
            <UnstyledButton className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-100">
              <IconBuilding size={18} className="text-pink-500" />
              <Text size="sm" fw={500}>
                {currentWorkspace?.name || '워크스페이스 선택'}
              </Text>
              <IconChevronDown size={14} />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>워크스페이스</Menu.Label>
            {workspaces.map((workspace) => (
              <Menu.Item
                key={workspace.id}
                leftSection={<IconBuilding size={14} />}
                rightSection={
                  workspace.id === currentWorkspace?.id && (
                    <IconCheck size={14} className="text-pink-500" />
                  )
                }
                onClick={() => switchWorkspace(workspace.id)}
              >
                {workspace.name}
              </Menu.Item>
            ))}
            <Menu.Divider />
            <Menu.Item leftSection={<IconPlus size={14} />} c="pink">
              새 워크스페이스 생성
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      {/* 중앙: 검색 */}
      <form onSubmit={handleSearch} className="mx-4 max-w-md flex-1">
        <TextInput
          placeholder="상품, 캠페인 검색..."
          leftSection={<IconSearch size={16} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          radius="md"
        />
      </form>

      {/* 우측: Export, 알림, 프로필 */}
      <Group gap="sm">
        {/* Export 버튼 */}
        <Button
          variant="light"
          color="pink"
          leftSection={<IconDownload size={16} />}
          onClick={handleExport}
          disabled={!canExport}
        >
          Export
        </Button>

        {/* 알림 */}
        <Popover
          width={360}
          position="bottom-end"
          shadow="md"
          opened={notificationOpened}
          onChange={setNotificationOpened}
        >
          <Popover.Target>
            <Indicator color="red" size={8} offset={4} disabled={unreadCount === 0}>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                onClick={() => setNotificationOpened((o) => !o)}
              >
                <IconBell size={20} />
              </ActionIcon>
            </Indicator>
          </Popover.Target>

          <Popover.Dropdown p={0}>
            <Group justify="space-between" p="sm" className="border-b">
              <Text fw={600}>알림</Text>
              {unreadCount > 0 && (
                <Button variant="subtle" size="xs" onClick={markAllNotificationsRead}>
                  모두 읽음
                </Button>
              )}
            </Group>

            <ScrollArea h={300}>
              {notificationList.length === 0 ? (
                <Text ta="center" c="dimmed" py="xl">
                  알림이 없습니다
                </Text>
              ) : (
                <Stack gap={5} p="sm">
                  {notificationList.map((notification) => (
                    <UnstyledButton
                      key={notification.id}
                      className={`w-full border-b p-3 hover:bg-gray-50 ${
                        !notification.isRead ? 'bg-pink-50' : ''
                      }`}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <Group justify="space-between" mb={4}>
                        <Text size="sm" fw={500}>
                          {notification.title}
                        </Text>
                        {!notification.isRead && (
                          <Badge size="xs" color="pink">
                            NEW
                          </Badge>
                        )}
                      </Group>
                      <Text size="xs" c="dimmed" lineClamp={2}>
                        {notification.message}
                      </Text>
                      <Text size="xs" c="dimmed" mt={4}>
                        {formatTime(notification.createdAt)}
                      </Text>
                    </UnstyledButton>
                  ))}
                </Stack>
              )}
            </ScrollArea>
          </Popover.Dropdown>
        </Popover>

        {/* 프로필 메뉴 */}
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <UnstyledButton className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100">
              <Avatar color="pink" radius="xl" size="sm">
                <IconUser size={16} />
              </Avatar>
              <IconChevronDown size={14} />
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
              onClick={() => router.push('/dashboard/settings')}
            >
              프로필 설정
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
              onClick={handleLogout}
            >
              로그아웃
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
