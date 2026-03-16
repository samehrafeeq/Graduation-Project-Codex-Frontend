import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { missingServiceRequestsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Loader2, MessageSquare } from 'lucide-react';

const statusLabel: Record<string, string> = {
  pending: 'لم يتم الحسم بعد',
  found: 'تم العثور على الخدمة',
  not_found: 'لم يجدها بعد',
};

const statusClass: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  found: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  not_found: 'bg-red-500/10 text-red-700 border-red-500/20',
};

const SellerMissingServiceRequestReplyPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState<any | null>(null);
  const [comment, setComment] = useState('');

  const fetchRequest = async () => {
    try {
      const res = await missingServiceRequestsApi.getOne(Number(id));
      setRequest(res.data);
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحميل تفاصيل الطلب', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const submitComment = async () => {
    const value = comment.trim();
    if (!value) return;

    setSubmitting(true);
    try {
      await missingServiceRequestsApi.addSellerComment(Number(id), { comment: value });
      setComment('');
      toast({ title: 'تم الإرسال', description: 'تم إرسال ردك بنجاح' });
      fetchRequest();
    } catch (err: any) {
      toast({
        title: 'خطأ',
        description: err?.response?.data?.message || 'تعذر إرسال الرد',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">الرد على طلب خدمة غير موجودة</h1>
            <p className="text-muted-foreground mt-1">راجع الطلب ثم أرسل تعليقك للعميل</p>
          </div>
          <Link to="/dashboard/missing-services">
            <Button variant="outline" className="gap-1.5">
              <ArrowRight size={15} />
              رجوع
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">جارٍ التحميل...</div>
        ) : !request ? (
          <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
            <CardContent className="py-16 text-center text-muted-foreground">الطلب غير موجود</CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between gap-3">
                  <span>{request.title}</span>
                  <Badge className={statusClass[request.foundStatus] || ''}>{statusLabel[request.foundStatus] || request.foundStatus}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-3 gap-2 text-sm">
                  <p className="text-muted-foreground">العميل: <span className="text-foreground font-medium">{request.requester?.name}</span></p>
                  <p className="text-muted-foreground">متوسط السعر: <span className="text-foreground font-medium">{Number(request.averageBudget || 0).toLocaleString('ar-EG')} ج.م</span></p>
                  <p className="text-muted-foreground">تاريخ الطلب: <span className="text-foreground font-medium">{new Date(request.createdAt).toLocaleString('ar-SA')}</span></p>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-7">{request.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
              <CardHeader>
                <CardTitle className="text-base">تعليقات البائعين</CardTitle>
              </CardHeader>
              <CardContent>
                {request.comments?.length ? (
                  <div className="space-y-2">
                    {request.comments.map((item: any) => (
                      <div key={item.id} className="rounded-lg border border-border bg-muted/20 p-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-xs text-muted-foreground">{item.user?.name || 'بائع'} (بائع)</p>
                          <p className="text-[11px] text-muted-foreground">{new Date(item.createdAt).toLocaleString('ar-SA')}</p>
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{item.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">لا توجد تعليقات بعد</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
              <CardHeader>
                <CardTitle className="text-base">إرسال رد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {request.foundStatus === 'found' && (
                  <p className="text-sm text-muted-foreground rounded-lg border border-border bg-muted/20 p-3">
                    تم إغلاق التعليقات لأن العميل حدّد أنه وجد الخدمة.
                  </p>
                )}
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="اكتب تعليقك، وإذا كان الطلب مناسبًا لك أضف الخدمة أولاً ثم تواصل مع العميل"
                  disabled={request.foundStatus === 'found'}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={submitComment}
                    disabled={request.foundStatus === 'found' || submitting || !comment.trim()}
                    className="gap-2"
                  >
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                    إرسال الرد
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerMissingServiceRequestReplyPage;
