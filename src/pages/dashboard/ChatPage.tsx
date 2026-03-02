import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { chatApi } from '@/lib/api';
import {
  getSocket,
  joinConversation,
  leaveConversation,
  sendSocketMessage,
  emitTyping,
} from '@/lib/socket';
import { PageHeader, PageLoader } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  Send,
  ArrowRight,
  AlertTriangle,
  Package,
  User,
  Clock,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeConvId = searchParams.get('id') ? Number(searchParams.get('id')) : null;

  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<any>(null);

  const isBuyer = user?.role === 'buyer';

  // جلب المحادثات
  const fetchConversations = useCallback(() => {
    chatApi.getConversations().then((r) => {
      setConversations(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // جلب رسائل المحادثة النشطة
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    setMessagesLoading(true);
    chatApi.getMessages(activeConvId).then((r) => {
      setMessages(r.data);
      setMessagesLoading(false);
    }).catch(() => setMessagesLoading(false));

    // تحديد كمقروء
    chatApi.markAsRead(activeConvId).catch(() => {});

    // الانضمام لغرفة المحادثة
    joinConversation(activeConvId);

    return () => {
      leaveConversation(activeConvId);
    };
  }, [activeConvId]);

  // Socket events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      if (msg.conversationId === activeConvId) {
        setMessages((prev) => [...prev, msg]);
        // تحديد كمقروء
        if (activeConvId) {
          chatApi.markAsRead(activeConvId).catch(() => {});
        }
      }
      // تحديث آخر رسالة في القائمة
      fetchConversations();
    };

    const handleTyping = (data: { conversationId: number; userId: number }) => {
      if (data.conversationId === activeConvId && data.userId !== user?.id) {
        setTypingUser(data.userId);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
    };
  }, [activeConvId, user?.id, fetchConversations]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvId) return;
    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      sendSocketMessage(activeConvId, content);
    } catch {
      // fallback to REST
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (activeConvId) {
      emitTyping(activeConvId);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherUser = activeConv
    ? isBuyer
      ? activeConv.seller
      : activeConv.buyer
    : null;

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-4">
      <PageHeader title="المحادثات" subtitle="تواصل مباشر مع البائعين والمشترين" />

      {/* تحذير */}
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200/50 text-sm">
        <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-amber-800">⚠️ تنبيه مهم</p>
          <p className="text-amber-700 mt-1">
            يُرجى إجراء جميع المحادثات داخل المنصة فقط لضمان حقوقك. أي تواصل خارج المنصة لن يكون محمياً ولن نتمكن من مساعدتك في حالة النزاعات.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white rounded-2xl ring-1 ring-black/[0.04] overflow-hidden min-h-[500px]">
        {/* قائمة المحادثات */}
        <div className={`border-l border-border/40 ${activeConvId ? 'hidden lg:block' : ''}`}>
          <div className="p-4 border-b border-border/40">
            <h3 className="font-bold text-sm">المحادثات ({conversations.length})</h3>
          </div>

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <MessageSquare size={36} className="text-muted-foreground/20 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">لا توجد محادثات بعد</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {isBuyer ? 'تواصل مع بائع من صفحة الخدمة' : 'ستظهر المحادثات عند تواصل المشترين معك'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40 overflow-y-auto max-h-[450px]">
              {conversations.map((conv) => {
                const other = isBuyer ? conv.seller : conv.buyer;
                const unread = isBuyer ? conv.buyerUnread : conv.sellerUnread;
                const isActive = conv.id === activeConvId;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSearchParams({ id: String(conv.id) })}
                    className={`w-full flex items-start gap-3 p-4 text-right transition-colors ${
                      isActive ? 'bg-primary/5' : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-bl from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {other?.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm truncate">{other?.name}</span>
                        {unread > 0 && (
                          <span className="min-w-[20px] h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center px-1.5">
                            {unread}
                          </span>
                        )}
                      </div>
                      {conv.service && (
                        <p className="text-[11px] text-primary/70 truncate mt-0.5">{conv.service.title}</p>
                      )}
                      {conv.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* نافذة المحادثة */}
        <div className="lg:col-span-2 flex flex-col">
          {!activeConvId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquare size={48} className="text-muted-foreground/15 mb-4" />
              <p className="font-medium text-muted-foreground">اختر محادثة للبدء</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border/40">
                <button
                  onClick={() => setSearchParams({})}
                  className="lg:hidden text-muted-foreground hover:text-foreground"
                >
                  <ArrowRight size={20} />
                </button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-bl from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                  {otherUser?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{otherUser?.name}</p>
                  {activeConv?.service && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      <Package size={10} className="inline ml-1" />
                      {activeConv.service.title}
                    </p>
                  )}
                </div>
                {activeConv?.orderId && (
                  <span className="text-[11px] bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                    طلب #{activeConv.orderId}
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px] min-h-[300px] bg-[#f8f9fb]">
                {messagesLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Clock size={20} className="animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-sm text-muted-foreground">
                    لا توجد رسائل بعد. ابدأ المحادثة!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    const isSystem = msg.type === 'system' || msg.type === 'order_created' || msg.type === 'order_status';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <span className="bg-white rounded-full px-4 py-1.5 text-xs text-muted-foreground ring-1 ring-black/[0.04] text-center max-w-sm">
                            {msg.content}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            isMe
                              ? 'bg-primary text-white rounded-bl-sm'
                              : 'bg-white text-foreground ring-1 ring-black/[0.04] rounded-br-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              isMe ? 'text-white/60' : 'text-muted-foreground'
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString('ar-EG', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}

                {typingUser && (
                  <div className="flex justify-end">
                    <span className="bg-white rounded-2xl px-4 py-2 text-xs text-muted-foreground ring-1 ring-black/[0.04]">
                      يكتب...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/40 bg-white">
                <div className="flex items-center gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 rounded-xl h-10 text-sm"
                    disabled={sending}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-gradient-to-l from-primary to-secondary text-white shrink-0"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
