import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { missingServiceRequestsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLink, HandPlatter, Loader2, Plus, SearchCheck } from 'lucide-react';

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

const MissingServiceRequestsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingStatusId, setSavingStatusId] = useState<number | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'found' | 'not_found'>('all');

  const fetchRequests = async () => {
    try {
      const params = filter === 'all' ? undefined : { foundStatus: filter };
      const res = await missingServiceRequestsApi.getAll(params);
      setRequests(res.data);
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحميل طلبات الخدمات غير الموجودة', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, [filter]);

  const handleStatusChange = async (requestId: number, foundStatus: 'pending' | 'found' | 'not_found') => {
    setSavingStatusId(requestId);
    try {
      await missingServiceRequestsApi.updateFoundStatus(requestId, { foundStatus });
      toast({ title: 'تم التحديث', description: 'تم تحديث حالة العثور على الخدمة' });
      fetchRequests();
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحديث الحالة', variant: 'destructive' });
    } finally {
      setSavingStatusId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">طلبات الخدمات غير الموجودة</h1>
            <p className="text-muted-foreground mt-1">
              هذه الصفحة لعرض الطلبات فقط. لإتمام أي طلب يجب على البائع إضافة الخدمة أولاً داخل المنصة.
            </p>
          </div>

          {user?.role === 'buyer' && (
            <Link to="/dashboard/missing-services/new">
              <Button className="gap-2">
                <Plus size={16} />
                طلب خدمة غير موجودة
              </Button>
            </Link>
          )}
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
            {requests.map((request) => {
              const isOwner = request.requesterId === user?.id;
              const isSeller = user?.role === 'seller';
              return (
                <Card key={request.id} className="bg-card shadow-sm ring-1 ring-black/[0.04]">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <HandPlatter size={16} className="text-primary shrink-0" />
                        <span className="truncate">{request.title}</span>
                      </div>
                      <Badge className={statusClass[request.foundStatus] || ''}>
                        {statusLabel[request.foundStatus] || request.foundStatus}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground">
                        طالب الخدمة: <Link to={`/profile/${request.requester?.id}`} className="text-foreground font-medium hover:underline">{request.requester?.name}</Link>
                      </p>
                      <p className="text-muted-foreground">
                        متوسط السعر: <span className="text-foreground font-medium">{Number(request.averageBudget || 0).toLocaleString('ar-EG')} ج.م</span>
                      </p>
                    </div>

                    <p className="text-sm text-foreground whitespace-pre-wrap leading-7">{request.description}</p>

                    {isOwner && (
                      <div className="rounded-xl border border-border p-3">
                        <p className="text-sm font-medium mb-2">هل وجدت الخدمة المطلوبة؟</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant={request.foundStatus === 'found' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(request.id, 'found')}
                            disabled={savingStatusId === request.id}
                            className="gap-1.5"
                          >
                            {savingStatusId === request.id ? <Loader2 size={14} className="animate-spin" /> : <SearchCheck size={14} />}
                            نعم، وجدتها
                          </Button>
                          <Button
                            size="sm"
                            variant={request.foundStatus === 'not_found' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(request.id, 'not_found')}
                            disabled={savingStatusId === request.id}
                          >
                            لا، لم أجدها
                          </Button>
                          <Button
                            size="sm"
                            variant={request.foundStatus === 'pending' ? 'secondary' : 'outline'}
                            onClick={() => handleStatusChange(request.id, 'pending')}
                            disabled={savingStatusId === request.id}
                          >
                            غير محسوم
                          </Button>
                        </div>
                      </div>
                    )}

                    {isSeller ? (
                      <div className="rounded-xl border border-border bg-muted/10 p-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground">
                          عدد التعليقات الحالية: <span className="text-foreground font-medium">{request.comments?.length || 0}</span>
                        </p>
                        {request.foundStatus === 'found' ? (
                          <Badge variant="outline" className="text-muted-foreground">
                            التعليقات مغلقة بعد العثور على الخدمة
                          </Badge>
                        ) : (
                          <Link to={`/dashboard/missing-services/${request.id}/reply`}>
                            <Button size="sm" className="gap-1.5">
                              <ExternalLink size={14} />
                              فتح صفحة الرد على الخدمة
                            </Button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">تعليقات البائعين</p>
                        {request.comments?.length ? (
                          <div className="space-y-2">
                            {request.comments.map((comment: any) => (
                              <div key={comment.id} className="rounded-lg border border-border bg-muted/20 p-3">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <p className="text-xs text-muted-foreground">
                                    البائع: <Link to={`/profile/${comment.user?.id}`} className="text-foreground font-medium hover:underline">{comment.user?.name}</Link>
                                  </p>
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
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MissingServiceRequestsPage;
