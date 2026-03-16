import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { supportTicketsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePlus, LifeBuoy, Loader2, Send } from 'lucide-react';

const statusLabel: Record<string, string> = {
  in_review: 'قيد المراجعة',
  resolved: 'تم الحل',
};

const statusClass: Record<string, string> = {
  in_review: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
};

const issueTypeLabel: Record<string, string> = {
  account: 'الحساب',
  kyc: 'التحقق KYC',
  service: 'الخدمات',
  order: 'الطلبات',
  payment: 'الدفع',
  wallet: 'المحفظة',
  chat: 'المحادثات',
  technical: 'مشكلة تقنية',
  other: 'أخرى',
};

const UPLOADS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');

const AdminSupportTickets = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [replySubmittingId, setReplySubmittingId] = useState<number | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [statusDraft, setStatusDraft] = useState<Record<number, string>>({});
  const [replyDraft, setReplyDraft] = useState<Record<number, string>>({});
  const [replyImageDraft, setReplyImageDraft] = useState<Record<number, File | null>>({});

  const fetchTickets = async () => {
    try {
      const res = await supportTicketsApi.adminGetAll();
      setTickets(res.data);
      const nextStatus: Record<number, string> = {};
      res.data.forEach((t: any) => {
        nextStatus[t.id] = t.status;
      });
      setStatusDraft(nextStatus);
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحميل التذاكر', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const saveTicket = async (ticketId: number) => {
    setSavingId(ticketId);
    try {
      await supportTicketsApi.adminUpdateStatus(ticketId, {
        status: statusDraft[ticketId] || 'in_review',
      });
      toast({ title: 'تم التحديث', description: 'تم تحديث حالة التذكرة' });
      fetchTickets();
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحديث التذكرة', variant: 'destructive' });
    } finally {
      setSavingId(null);
    }
  };

  const sendReply = async (ticketId: number) => {
    const message = (replyDraft[ticketId] || '').trim();
    const image = replyImageDraft[ticketId] || null;
    if (!message) return;

    setReplySubmittingId(ticketId);
    try {
      await supportTicketsApi.addReply(ticketId, { message, image });
      toast({ title: 'تم الإرسال', description: 'تم إرسال الرد على التذكرة' });
      setReplyDraft((prev) => ({ ...prev, [ticketId]: '' }));
      setReplyImageDraft((prev) => ({ ...prev, [ticketId]: null }));
      fetchTickets();
    } catch {
      toast({ title: 'خطأ', description: 'تعذر إرسال الرد', variant: 'destructive' });
    } finally {
      setReplySubmittingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">تذاكر الدعم الفني</h1>
          <p className="text-muted-foreground mt-1">مراجعة مشاكل واستفسارات المشترين والبائعين والرد عليها</p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">جارٍ التحميل...</div>
        ) : tickets.length === 0 ? (
          <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
            <CardContent className="py-16 text-center text-muted-foreground">لا توجد تذاكر حالياً</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="bg-card shadow-sm ring-1 ring-black/[0.04]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <LifeBuoy size={16} className="text-primary shrink-0" />
                      <span className="truncate">{ticket.title}</span>
                    </div>
                    <Badge className={statusClass[ticket.status] || ''}>{statusLabel[ticket.status] || ticket.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">
                      مقدم التذكرة: <span className="text-foreground font-medium">{ticket.user?.name}</span>
                    </p>
                    <p className="text-muted-foreground">
                      الدور: <span className="text-foreground font-medium">{ticket.user?.role === 'buyer' ? 'مشتري' : 'بائع'}</span>
                    </p>
                    <p className="text-muted-foreground">
                      نوع المشكلة: <span className="text-foreground font-medium">{issueTypeLabel[ticket.issueType] || ticket.issueType}</span>
                    </p>
                    <p className="text-muted-foreground">
                      تاريخ الإنشاء: <span className="text-foreground font-medium">{new Date(ticket.createdAt).toLocaleString('ar-SA')}</span>
                    </p>
                  </div>

                  {ticket.description && (
                    <div className="rounded-lg bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground mb-1">تفاصيل المرسل:</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.description}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">سجل الردود</p>
                    {ticket.replies?.length ? (
                      <div className="space-y-2">
                        {ticket.replies.map((reply: any) => {
                          const isAdmin = reply.user?.role === 'admin';
                          return (
                            <div key={reply.id} className={`rounded-lg p-3 border ${isAdmin ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border'}`}>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="text-xs font-semibold text-foreground">
                                  {isAdmin ? 'الدعم الفني' : `${reply.user?.name || 'العميل'}`}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {new Date(reply.createdAt).toLocaleString('ar-SA')}
                                </p>
                              </div>
                              <p className="text-sm text-foreground whitespace-pre-wrap">{reply.message}</p>
                              {reply.imagePath && (
                                <a
                                  href={`${UPLOADS_BASE}${reply.imagePath}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-block mt-2"
                                >
                                  <img
                                    src={`${UPLOADS_BASE}${reply.imagePath}`}
                                    alt="support-reply"
                                    className="h-28 rounded-md border border-border object-cover"
                                  />
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">لا توجد ردود بعد</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <p className="text-sm font-medium mb-1">الحالة</p>
                      <Select
                        value={statusDraft[ticket.id] || ticket.status}
                        onValueChange={(value) =>
                          setStatusDraft((prev) => ({ ...prev, [ticket.id]: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_review">قيد المراجعة</SelectItem>
                          <SelectItem value="resolved">تم الحل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 flex items-end justify-end">
                      <Button onClick={() => saveTicket(ticket.id)} disabled={savingId === ticket.id} className="gap-2">
                        {savingId === ticket.id && <Loader2 size={14} className="animate-spin" />}
                        حفظ الحالة
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border p-3 space-y-2">
                    <p className="text-sm font-medium">إضافة رد جديد</p>
                    <div className="md:col-span-2">
                      <Textarea
                        value={replyDraft[ticket.id] || ''}
                        onChange={(e) =>
                          setReplyDraft((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                        }
                        placeholder="اكتب ردك للعميل..."
                        className="min-h-[88px]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <ImagePlus size={14} />
                        <span>{replyImageDraft[ticket.id] ? replyImageDraft[ticket.id]?.name : 'إرفاق صورة'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            setReplyImageDraft((prev) => ({ ...prev, [ticket.id]: e.target.files?.[0] || null }))
                          }
                        />
                      </label>

                      <Button
                        onClick={() => sendReply(ticket.id)}
                        disabled={replySubmittingId === ticket.id || !(replyDraft[ticket.id] || '').trim()}
                        className="gap-2"
                      >
                        {replySubmittingId === ticket.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        إرسال الرد
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSupportTickets;
