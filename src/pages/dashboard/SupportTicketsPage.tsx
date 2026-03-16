import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { supportTicketsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, LifeBuoy, Send, ImagePlus, Bot } from 'lucide-react';

const issueTypeOptions = [
  { value: 'account', label: 'الحساب' },
  { value: 'kyc', label: 'التحقق KYC' },
  { value: 'service', label: 'الخدمات' },
  { value: 'order', label: 'الطلبات' },
  { value: 'payment', label: 'الدفع' },
  { value: 'wallet', label: 'المحفظة' },
  { value: 'chat', label: 'المحادثات' },
  { value: 'technical', label: 'مشكلة تقنية' },
  { value: 'other', label: 'أخرى' },
];

const statusLabel: Record<string, string> = {
  in_review: 'قيد المراجعة',
  resolved: 'تم الحل',
};

const statusClass: Record<string, string> = {
  in_review: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  resolved: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
};

const UPLOADS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');

const SupportTicketsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replySubmittingId, setReplySubmittingId] = useState<number | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [replyDraft, setReplyDraft] = useState<Record<number, string>>({});
  const [replyImageDraft, setReplyImageDraft] = useState<Record<number, File | null>>({});
  const [form, setForm] = useState({
    title: '',
    isIssue: true,
    issueType: 'technical',
    description: '',
  });

  const fetchTickets = async () => {
    try {
      const res = await supportTicketsApi.getMy();
      setTickets(res.data);
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحميل التذاكر', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await supportTicketsApi.create({
        title: form.title,
        isIssue: form.isIssue,
        issueType: form.issueType,
        description: form.description || undefined,
      });
      toast({ title: 'تم الإرسال', description: 'تم إنشاء تذكرة الدعم بنجاح' });
      setForm({ title: '', isIssue: true, issueType: 'technical', description: '' });
      fetchTickets();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'تعذر إنشاء التذكرة', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (ticketId: number) => {
    const message = (replyDraft[ticketId] || '').trim();
    const image = replyImageDraft[ticketId] || null;
    if (!message) return;

    setReplySubmittingId(ticketId);
    try {
      await supportTicketsApi.addReply(ticketId, { message, image });
      toast({ title: 'تم الإرسال', description: 'تم إرسال الرد بنجاح' });
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
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الدعم الفني</h1>
          <p className="text-muted-foreground mt-1">افتح تذكرة جديدة وتابع حالة حل مشكلتك</p>
          <div className="mt-3">
            <Link to="/dashboard/support/ai">
              <Button variant="outline" className="gap-2">
                <Bot size={16} />
                دعم فني آلي (خدماتي AI)
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LifeBuoy size={18} className="text-primary" />
              إنشاء تذكرة دعم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitTicket} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان التذكرة</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="مثال: مشكلة في حالة الطلب"
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>هل هذه مشكلة؟</Label>
                  <Select
                    value={form.isIssue ? 'yes' : 'no'}
                    onValueChange={(v) => setForm((prev) => ({ ...prev, isIssue: v === 'yes' }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">نعم، مشكلة</SelectItem>
                      <SelectItem value="no">استفسار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>نوع المشكلة</Label>
                  <Select
                    value={form.issueType}
                    onValueChange={(v) => setForm((prev) => ({ ...prev, issueType: v }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">تفاصيل إضافية</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-1 min-h-[100px]"
                  placeholder="اشرح المشكلة أو الاستفسار بالتفصيل"
                />
              </div>

              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                إرسال التذكرة
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
          <CardHeader>
            <CardTitle className="text-base">تذاكري السابقة</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">جارٍ التحميل...</div>
            ) : tickets.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">لا توجد تذاكر بعد</div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(ticket.createdAt).toLocaleString('ar-SA')}
                        </p>
                      </div>
                      <Badge className={statusClass[ticket.status] || ''}>
                        {statusLabel[ticket.status] || ticket.status}
                      </Badge>
                    </div>

                    {ticket.description && (
                      <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">
                        {ticket.description}
                      </p>
                    )}

                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-muted-foreground">سجل الردود</p>
                      {ticket.replies?.length ? (
                        <div className="space-y-2">
                          {ticket.replies.map((reply: any) => {
                            const isAdmin = reply.user?.role === 'admin';
                            return (
                              <div key={reply.id} className={`rounded-lg p-3 ${isAdmin ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30 border border-border'}`}>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <p className="text-xs font-semibold text-foreground">
                                    {isAdmin ? 'الدعم الفني' : 'أنت'}
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
                        <p className="text-xs text-muted-foreground">لا توجد ردود حتى الآن</p>
                      )}

                      <div className="rounded-lg border border-border p-3 space-y-2">
                        <Textarea
                          value={replyDraft[ticket.id] || ''}
                          onChange={(e) =>
                            setReplyDraft((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                          }
                          placeholder="اكتب ردك على التذكرة..."
                          className="min-h-[76px]"
                        />
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
                            size="sm"
                            onClick={() => submitReply(ticket.id)}
                            disabled={replySubmittingId === ticket.id || !(replyDraft[ticket.id] || '').trim()}
                            className="gap-1.5"
                          >
                            {replySubmittingId === ticket.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            إرسال رد
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SupportTicketsPage;
