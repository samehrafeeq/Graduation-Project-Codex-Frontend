import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { missingServiceRequestsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { HandPlatter } from 'lucide-react';

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

const AdminMissingServiceRequests = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'found' | 'not_found'>('all');

  const fetchRequests = async () => {
    try {
      const params = filter === 'all' ? undefined : { foundStatus: filter };
      const res = await missingServiceRequestsApi.adminGetAll(params);
      setRequests(res.data);
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحميل الطلبات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, [filter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">طلبات الخدمات غير الموجودة</h1>
          <p className="text-muted-foreground mt-1">عرض ومتابعة الطلبات التي لم يجدها العملاء داخل المنصة</p>
        </div>

        <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
          <CardContent className="pt-6">
            <div className="max-w-xs">
              <p className="text-sm text-muted-foreground mb-1">تصفية حسب الحالة</p>
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="pending">لم يتم الحسم بعد</SelectItem>
                  <SelectItem value="found">تم العثور على الخدمة</SelectItem>
                  <SelectItem value="not_found">لم يجدها بعد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="py-16 text-center text-muted-foreground">جارٍ التحميل...</div>
        ) : requests.length === 0 ? (
          <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
            <CardContent className="py-16 text-center text-muted-foreground">لا توجد طلبات حالياً</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="bg-card shadow-sm ring-1 ring-black/[0.04]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <HandPlatter size={16} className="text-primary shrink-0" />
                      <span className="truncate">{request.title}</span>
                    </div>
                    <Badge className={statusClass[request.foundStatus] || ''}>{statusLabel[request.foundStatus] || request.foundStatus}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-2 text-sm">
                    <p className="text-muted-foreground">العميل: <span className="text-foreground font-medium">{request.requester?.name}</span></p>
                    <p className="text-muted-foreground">متوسط السعر: <span className="text-foreground font-medium">{Number(request.averageBudget || 0).toLocaleString('ar-EG')} ج.م</span></p>
                    <p className="text-muted-foreground">تاريخ الطلب: <span className="text-foreground font-medium">{new Date(request.createdAt).toLocaleString('ar-SA')}</span></p>
                  </div>

                  <p className="text-sm text-foreground whitespace-pre-wrap leading-7">{request.description}</p>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">تعليقات البائعين</p>
                    {request.comments?.length ? (
                      <div className="space-y-2">
                        {request.comments.map((comment: any) => (
                          <div key={comment.id} className="rounded-lg border border-border bg-muted/20 p-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-xs text-muted-foreground">{comment.user?.name || 'بائع'} (بائع)</p>
                              <p className="text-[11px] text-muted-foreground">{new Date(comment.createdAt).toLocaleString('ar-SA')}</p>
                            </div>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{comment.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">لا توجد تعليقات بائعين حتى الآن</p>
                    )}
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

export default AdminMissingServiceRequests;
