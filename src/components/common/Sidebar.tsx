'use client';

import { usePathname, useRouter } from 'next/navigation';
import { NavLink, Stack, Text, Divider, Badge, Group } from '@mantine/core';
import {
  IconPackage,
  IconSpeakerphone,
  IconPhoto,
  IconChartBar,
  IconTemplate,
  IconCreditCard,
  IconSettings,
  IconSparkles,
} from '@tabler/icons-react';

const mainNavItems = [
  {
    icon: IconPackage,
    label: '상품',
    href: '/dashboard/products',
    description: 'Product',
    badge: undefined,
  },
  {
    icon: IconSpeakerphone,
    label: '캠페인',
    href: '/dashboard/campaigns',
    description: 'Campaign',
    badge: 3,
  },
  {
    icon: IconPhoto,
    label: '소재',
    href: '/dashboard/assets',
    description: 'Assets',
  },
  {
    icon: IconChartBar,
    label: '리포트',
    href: '/dashboard/reports',
    description: 'Report',
  },
  {
    icon: IconTemplate,
    label: '템플릿',
    href: '/dashboard/templates',
    description: 'Guide',
  },
  {
    icon: IconCreditCard,
    label: '결제',
    href: '/dashboard/billing',
    description: 'Billing',
  },
];

const bottomNavItems = [
  {
    icon: IconSettings,
    label: '설정',
    href: '/dashboard/settings',
    description: '브랜드 톤, 금칙어 설정',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (href: string) => {
    router.push(href);
  };

  return (
    <Stack justify="space-between" h="100%">
      <Stack gap={4}>
        {/* 로고 영역 */}
        <Group
          className="cursor-pointer"
          gap="xs"
          mb="md"
          px="xs"
          onClick={() => router.push('/dashboard')}
        >
          <IconSparkles size={24} className="text-pink-500" />
          <Text fw={700} size="lg" c="pink">
            Beauty AI Marketing
          </Text>
        </Group>

        <Divider mb="sm" />

        {/* 메인 네비게이션 */}
        {mainNavItems.map((item) => (
          <NavLink
            key={item.href}
            active={pathname.startsWith(item.href)}
            label={
              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text size="sm" fw={500}>
                    {item.label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {item.description}
                  </Text>
                </div>
                {item.badge && (
                  <Badge size="sm" variant="filled" color="pink">
                    {item.badge}
                  </Badge>
                )}
              </Group>
            }
            leftSection={<item.icon size={20} />}
            onClick={() => handleNavClick(item.href)}
            color="pink"
            variant="light"
            className="rounded-md"
            styles={{
              root: { padding: '10px 12px' },
            }}
          />
        ))}
      </Stack>

      {/* 하단 네비게이션 */}
      <Stack gap={4}>
        <Divider mb="sm" />
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.href}
            active={pathname.startsWith(item.href)}
            label={
              <div>
                <Text size="sm" fw={500}>
                  {item.label}
                </Text>
                <Text size="xs" c="dimmed">
                  {item.description}
                </Text>
              </div>
            }
            leftSection={<item.icon size={20} />}
            onClick={() => handleNavClick(item.href)}
            color="pink"
            variant="light"
            className="rounded-md"
            styles={{
              root: { padding: '10px 12px' },
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
