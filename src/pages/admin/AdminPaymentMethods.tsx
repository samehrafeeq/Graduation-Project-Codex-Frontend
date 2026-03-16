import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { walletApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, CreditCard, Loader2, Plus, RefreshCcw, Trash2, XCircle } from 'lucide-react';

const statusLabel: Record<string, string> = {
  pending: 'قيد المراجعة',
  approved: 'تمت الموافقة',
  rejected: 'مرفوض',
};

const AdminPaymentMethods = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingMethod, setSavingMethod] = useState(false);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [methods, setMethods] = useState<any[]>([]);
  const [topupRequests, setTopupRequests] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [form, setForm] = useState({
    name: 'فودافون كاش',
    type: 'mobile_wallet',
    accountNumber: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const params = statusFilter === 'all' ? undefined : { status: statusFilter };
      const [methodsRes, requestsRes] = await Promise.all([
        walletApi.adminGetPaymentMethods(),
        walletApi.adminGetTopupRequests(params),
      ]);
      setMethods(methodsRes.data);
      setTopupRequests(requestsRes.data);
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحميل بيانات طرق الدفع', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const addPaymentMethod = async () => {
    if (!form.name.trim() || !form.accountNumber.trim()) {
      toast({ title: 'خطأ', description: 'يرجى إدخال اسم الطريقة ورقم التحويل', variant: 'destructive' });
      return;
    }
    setSavingMethod(true);
    try {
      await walletApi.adminCreatePaymentMethod({
        name: form.name.trim(),
        type: form.type.trim(),
        accountNumber: form.accountNumber.trim(),
        isActive: true,
      });
      setForm({ name: 'فودافون كاش', type: 'mobile_wallet', accountNumber: '' });
      toast({ title: 'تم', description: 'تمت إضافة طريقة الدفع' });
      loadData();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'تعذر إضافة الطريقة', variant: 'destructive' });
    } finally {
      setSavingMethod(false);
    }
  };

  const toggleMethod = async (method: any) => {
    try {
      await walletApi.adminUpdatePaymentMethod(method.id, { isActive: !method.isActive });
      loadData();
    } catch {
      toast({ title: 'خطأ', description: 'تعذر تحديث حالة طريقة الدفع', variant: 'destructive' });
    }
  };

  const deleteMethod = async (method: any) => {
    try {
      await walletApi.adminDeletePaymentMethod(method.id);
      toast({ title: 'تم', description: 'تم حذف طريقة الدفع' });
      loadData();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'تعذر حذف طريقة الدفع', variant: 'destructive' });
    }
  };

  const reviewTopup = async (id: number, status: 'approved' | 'rejected') => {
    setReviewingId(id);
    try {
      await walletApi.adminReviewTopupRequest(id, { status });
      toast({ title: 'تم', description: status === 'approved' ? 'تمت الموافقة وإضافة الرصيد' : 'تم رفض الطلب' });
      loadData();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'تعذر مراجعة الطلب', variant: 'destructive' });
    } finally {
      setReviewingId(null);
    }
  };

  const pendingCount = useMemo(
    () => topupRequests.filter((item) => item.status === 'pending').length,
    [topupRequests],
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">طرق الدفع</h1>
            <p className="text-muted-foreground mt-1">إدارة طرق الدفع ومراجعة طلبات شحن رصيد المشترين</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={loadData}>
            <RefreshCcw size={15} />
            تحديث
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm ring-1 ring-black/[0.04] lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus size={16} className="text-primary" />
                إضافة طريقة دفع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>اسم الطريقة</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>النوع</Label>
                <Input
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>رقم التحويل</Label>
                <Input
                  value={form.accountNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  className="mt-1"
                  placeholder="01000000000"
                />
              </div>
              <Button onClick={addPaymentMethod} disabled={savingMethod} className="w-full gap-2">
                {savingMethod ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                إضافة
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm ring-1 ring-black/[0.04] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">الطرق الحالية</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 text-center text-muted-foreground">جارٍ التحميل...</div>
              ) : methods.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">لا توجد طرق دفع</div>
              ) : (
                <div className="space-y-2">
                  {methods.map((method) => (
                    <div key={method.id} className="rounded-lg border border-border p-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2"><CreditCard size={14} /> {method.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{method.accountNumber} • {method.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant={method.isActive ? 'secondary' : 'outline'} onClick={() => toggleMethod(method)}>
                          {method.isActive ? 'مفعلة' : 'غير مفعلة'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => deleteMethod(method)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>طلبات شحن الرصيد</span>
              <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20">معلّق: {pendingCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-w-xs">
              <Label>تصفية الحالة</Label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                  <SelectItem value="approved">تمت الموافقة</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="py-8 text-center text-muted-foreground">جارٍ التحميل...</div>
            ) : topupRequests.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">لا توجد طلبات شحن</div>
            ) : (
              <div className="space-y-2">
                {topupRequests.map((request) => (
                  <div key={request.id} className="rounded-lg border border-border p-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{request.user?.name} • {Number(request.amount).toFixed(2)} ج.م</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {request.paymentMethod?.name} ({request.paymentMethod?.accountNumber}) • {new Date(request.createdAt).toLocaleString('ar-SA')}
                        </p>
                      </div>
                      <Badge className={
                        request.status === 'approved'
                          ? 'bg-green-500/10 text-green-700 border-green-500/20'
                          : request.status === 'rejected'
                            ? 'bg-red-500/10 text-red-700 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                      }>
                        {statusLabel[request.status] || request.status}
                      </Badge>
                    </div>

                    {request.screenshotPath && (
                      <a href={`${(import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '')}${request.screenshotPath}`} target="_blank" rel="noreferrer" className="inline-block mt-2">
                        <img
                          src={`${(import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '')}${request.screenshotPath}`}
                          alt="topup-proof"
                          className="h-24 rounded-md border border-border object-cover"
                        />
                      </a>
                    )}

                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="gap-1.5 bg-green-600 hover:bg-green-500"
                          disabled={reviewingId === request.id}
                          onClick={() => reviewTopup(request.id, 'approved')}
                        >
                          {reviewingId === request.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1.5"
                          disabled={reviewingId === request.id}
                          onClick={() => reviewTopup(request.id, 'rejected')}
                        >
                          <XCircle size={14} />
                          رفض
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentMethods;
