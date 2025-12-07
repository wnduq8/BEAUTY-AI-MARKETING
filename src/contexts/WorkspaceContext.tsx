'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Workspace, WorkspaceSettings, Notification, UserRole } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  workspaceSettings: WorkspaceSettings | null;
  userRole: UserRole | null;
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => void;
  updateSettings: (settings: Partial<WorkspaceSettings>) => Promise<void>;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  canExport: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Mock 데이터 (실제 구현 시 Supabase에서 가져옴)
const mockWorkspaces: Workspace[] = [
  { id: '1', name: '뷰티브랜드 A', createdAt: new Date(), ownerId: 'user1' },
  { id: '2', name: '코스메틱 B', createdAt: new Date(), ownerId: 'user1' },
  { id: '3', name: '스킨케어 C', createdAt: new Date(), ownerId: 'user1' },
];

const mockSettings: WorkspaceSettings = {
  id: '1',
  workspaceId: '1',
  brandTone: '친근하고 전문적인 톤. 20-30대 여성 타겟.',
  forbiddenWords: ['최고', '완벽', '기적', '즉시'],
  requiredPhrases: ['피부 고민', '데일리 케어'],
  primaryColor: '#FF6B9D',
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    workspaceId: '1',
    type: 'campaign_complete',
    title: '캠페인 생성 완료',
    message: '여름 신상품 캠페인이 생성되었습니다.',
    isRead: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    workspaceId: '1',
    type: 'version_created',
    title: '새 버전 생성',
    message: '캠페인 v2가 저장되었습니다.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000),
  },
];

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    setIsLoading(true);
    // TODO: Supabase에서 실제 데이터 로드
    // const supabase = createClient();
    // const { data } = await supabase.from('workspaces').select('*');

    setWorkspaces(mockWorkspaces);
    setCurrentWorkspace(mockWorkspaces[0]);
    setWorkspaceSettings(mockSettings);
    setUserRole({ userId: 'user1', workspaceId: '1', role: 'owner' });
    setNotifications(mockNotifications);
    setIsLoading(false);
  };

  const switchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      // TODO: 해당 워크스페이스의 설정 로드
    }
  };

  const updateSettings = async (settings: Partial<WorkspaceSettings>) => {
    if (!workspaceSettings) return;
    // TODO: Supabase에 저장
    setWorkspaceSettings({ ...workspaceSettings, ...settings });
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const canExport = userRole?.role === 'owner' || userRole?.role === 'admin';

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        workspaceSettings,
        userRole,
        notifications,
        unreadCount,
        isLoading,
        switchWorkspace,
        updateSettings,
        markNotificationRead,
        markAllNotificationsRead,
        canExport,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
