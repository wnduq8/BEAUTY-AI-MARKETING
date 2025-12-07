'use client';

import { AppShell, Burger, Group, Title, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSparkles } from '@tabler/icons-react';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <WorkspaceProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 260,
          breakpoint: 'sm',
          collapsed: { mobile: !opened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          {/* 모바일 헤더 */}
          <Group h="100%" px="md" justify="space-between" hiddenFrom="sm">
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Group gap="xs">
              <IconSparkles size={20} className="text-pink-500" />
              <Title order={4} c="pink">
                Beauty AI Marketing
              </Title>
            </Group>
            <div style={{ width: 28 }} /> {/* 버거 메뉴 너비만큼 여백 */}
          </Group>

          {/* 데스크탑 헤더 */}
          <Box h="100%" visibleFrom="sm">
            <Header onSidebarToggle={toggleDesktop} sidebarOpened={desktopOpened} />
          </Box>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Sidebar />
        </AppShell.Navbar>

        <AppShell.Main className="min-h-screen bg-gray-50">{children}</AppShell.Main>
      </AppShell>
    </WorkspaceProvider>
  );
}
