import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { chatApi } from '@/lib/api';
import { MessageSquare, Users, Clock, Eye, ArrowLeft } from 'lucide-react';

const AdminChat = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    chatApi.adminGetAll().then((r) => {
      setConversations(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const openConversation = async (conv: any) => {
    setSelectedConv(conv);
    setMessagesLoading(true);
    try {
      const r = await chatApi.adminGetMessages(conv.id);
      setMessages(r.data);
    } catch {}
    setMessagesLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div>
          <h1 className="text-2xl font-bold">مراقبة المحادثات</h1>
          <p className="text-muted-foreground text-sm mt-1">
            مراقبة جميع المحادثات بين البائعين والمشترين
          </p>
        </div>

        {/* تحذير */}
        <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-200/50 text-sm">
          <Eye size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-blue-800">وضع المراقبة</p>
            <p className="text-blue-700 mt-1">
              يمكنك قراءة جميع المحادثات لضمان التزام المستخدمين بالقواعد. لا يمكنك الرد على المحادثات.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white rounded-xl ring-1 ring-black/[0.06] overflow-hidden min-h-[500px]">
          {/* قائمة المحادثات */}
          <div className={`border-l border-border/40 ${selectedConv ? 'hidden lg:block' : ''}`}>
            <div className="p-4 border-b border-border/40">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <MessageSquare size={14} />
                جميع المحادثات ({conversations.length})
              </h3>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-muted-foreground">جارٍ التحميل...</div>
            ) : conversations.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">لا توجد محادثات</div>
            ) : (
              <div className="divide-y divide-border/40 overflow-y-auto max-h-[450px]">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className={`w-full flex items-start gap-3 p-4 text-right transition-colors ${
                      selectedConv?.id === conv.id ? 'bg-blue-50' : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Users size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-sm">{conv.buyer?.name}</span>
                        <span className="text-muted-foreground">↔</span>
                        <span className="font-bold text-sm">{conv.seller?.name}</span>
                      </div>
                      {conv.service && (
                        <p className="text-[11px] text-blue-600/70 truncate mt-0.5">{conv.service.title}</p>
                      )}
                      {conv.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock size={10} />
                          {conv.lastMessageAt && new Date(conv.lastMessageAt).toLocaleDateString('ar-EG')}
                        </span>
                        {conv.orderId && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                            طلب #{conv.orderId}
                          </span>
                        )}
                        {conv.messages?.length > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {conv.messages.length} رسالة
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* عرض الرسائل */}
          <div className="lg:col-span-2 flex flex-col">
            {!selectedConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <Eye size={48} className="text-muted-foreground/15 mb-4" />
                <p className="font-medium text-muted-foreground">اختر محادثة لعرض الرسائل</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-border/40 bg-blue-50/50">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="lg:hidden text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <Eye size={16} className="text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">
                      {selectedConv.buyer?.name} ↔ {selectedConv.seller?.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {selectedConv.service?.title}
                      {selectedConv.orderId && ` · طلب #${selectedConv.orderId}`}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px] bg-[#f8f9fb]">
                  {messagesLoading ? (
                    <div className="text-center py-16 text-sm text-muted-foreground">جارٍ التحميل...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16 text-sm text-muted-foreground">لا توجد رسائل</div>
                  ) : (
                    messages.map((msg) => {
                      const isBuyer = msg.senderId === selectedConv.buyerId;
                      const isSystem = msg.type === 'system' || msg.type === 'order_created' || msg.type === 'order_status';

                      if (isSystem) {
                        return (
                          <div key={msg.id} className="flex justify-center">
                            <span className="bg-white rounded-full px-4 py-1.5 text-xs text-muted-foreground ring-1 ring-black/[0.04]">
                              {msg.content}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div key={msg.id} className={`flex ${isBuyer ? 'justify-start' : 'justify-end'}`}>
                          <div className="max-w-[75%]">
                            <p className={`text-[10px] mb-1 ${isBuyer ? 'text-right' : 'text-left'} text-muted-foreground`}>
                              {msg.sender?.name} ({isBuyer ? 'مشتري' : 'بائع'})
                            </p>
                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm ${
                                isBuyer
                                  ? 'bg-blue-500 text-white rounded-bl-sm'
                                  : 'bg-white text-foreground ring-1 ring-black/[0.04] rounded-br-sm'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              <p className={`text-[10px] mt-1 ${isBuyer ? 'text-white/60' : 'text-muted-foreground'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString('ar-EG', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer notice */}
                <div className="p-3 border-t border-border/40 bg-amber-50/50 text-center">
                  <p className="text-xs text-amber-700">
                    ⚠️ وضع المراقبة فقط — لا يمكنك الرد على المحادثات
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
