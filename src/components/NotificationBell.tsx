import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { notificationsApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Bell, Check, ShoppingCart, MessageSquare, Star, ArrowLeft } from 'lucide-react';

const iconMap: Record<string, any> = {
  new_order: ShoppingCart,
  order_status: ArrowLeft,
  new_message: MessageSquare,
  new_review: Star,
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifs = () => {
    notificationsApi.getAll().then((r) => setNotifications(r.data)).catch(() => {});
    notificationsApi.getUnreadCount().then((r) => setUnreadCount(r.data)).catch(() => {});
  };

  useEffect(() => {
    fetchNotifs();

    // Real-time notifications
    const socket = getSocket();
    if (socket) {
      const handler = () => {
        fetchNotifs();
      };
      socket.on('notification', handler);
      return () => { socket.off('notification', handler); };
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllAsRead().catch(() => {});
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClick = async (notif: any) => {
    if (!notif.isRead) {
      await notificationsApi.markAsRead(notif.id).catch(() => {});
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
    }
    setOpen(false);
  };

  const getLink = (notif: any) => {
    if (notif.data?.orderId) return `/dashboard/orders/${notif.data.orderId}`;
    return '#';
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-black/10 ring-1 ring-black/[0.06] z-50 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border/40">
            <h4 className="font-bold text-sm">الإشعارات</h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Check size={12} />
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                لا توجد إشعارات
              </div>
            ) : (
              notifications.slice(0, 15).map((notif) => {
                const Icon = iconMap[notif.type] || Bell;
                return (
                  <Link
                    key={notif.id}
                    to={getLink(notif)}
                    onClick={() => handleClick(notif)}
                    className={`flex items-start gap-3 p-3 transition-colors ${
                      notif.isRead ? 'bg-white' : 'bg-primary/[0.03]'
                    } hover:bg-accent/50`}
                  >
                    <div
                      className={`mt-0.5 rounded-lg p-1.5 ${
                        notif.isRead ? 'bg-muted/50' : 'bg-primary/10'
                      }`}
                    >
                      <Icon size={14} className={notif.isRead ? 'text-muted-foreground' : 'text-primary'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </p>
                      {notif.body && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {notif.body}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
