import { useState, useEffect, useCallback } from 'react';
import { getSocket } from '@/lib/socket';

/**
 * Hook to track online/offline status of users in real-time
 */
export function useOnlineStatus(userIds: number[] = []) {
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUserOnline = (data: { userId: number; isOnline: boolean }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (data.isOnline) {
          next.add(data.userId);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    };

    socket.on('user_online', handleUserOnline);

    return () => {
      socket.off('user_online', handleUserOnline);
    };
  }, []);

  const isOnline = useCallback(
    (userId: number) => onlineUsers.has(userId),
    [onlineUsers],
  );

  return { onlineUsers, isOnline };
}

/**
 * Format last seen time in Arabic
 */
export function formatLastSeen(lastSeen: string | null | undefined): string {
  if (!lastSeen) return 'غير معروف';

  const date = new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسبوع`;

  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
