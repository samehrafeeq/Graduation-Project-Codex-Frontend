import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PageHeader, DataCard, StatCard, PageLoader, EmptyState, StatusBadge } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { walletApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Wallet,
  Clock,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  CreditCard,
  Send,
  ShieldCheck,
  Info,
  Lock,
  ShoppingCart,
  Smartphone,
  Upload,
} from 'lucide-react';

const topupStatusLabel: Record<string, string> = {
  pending: 'قيد المراجعة',
  approved: 'تمت الموافقة',
  rejected: 'مرفوض',
};

const txTypeConfig: Record<string, { label: string; variant: 'success' | 'info' | 'warning' | 'purple'; icon: typeof ArrowDownLeft; sign: string }> = {
  earning:    { label: 'إيداع',    variant: 'success', icon: ArrowDownLeft, sign: '+' },
  withdrawal: { label: 'سحب',      variant: 'info',    icon: ArrowUpRight,  sign: '-' },
  refund:     { label: 'استرداد',   variant: 'warning', icon: ArrowDownLeft, sign: '+' },
  commission: { label: 'عمولة',    variant: 'purple',  icon: DollarSign,    sign: '-' },
  hold:       { label: 'تعليق',    variant: 'purple',  icon: Lock,          sign: '-' },
  release:    { label: 'دفع نهائي', variant: 'info',    icon: ShoppingCart,  sign: '-' },
};

const SellerWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');
  const [sellerWithdrawPhone, setSellerWithdrawPhone] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [buyerWithdrawAmount, setBuyerWithdrawAmount] = useState<number | ''>('');
  const [buyerWithdrawPhone, setBuyerWithdrawPhone] = useState('');
  const [buyerWithdrawing, setBuyerWithdrawing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [topupRequests, setTopupRequests] = useState<any[]>([]);
  const [topupSubmitting, setTopupSubmitting] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number | ''>('');
  const [topupPaymentMethodId, setTopupPaymentMethodId] = useState<number | ''>('');
  const [topupScreenshot, setTopupScreenshot] = useState<File | null>(null);

  useEffect(() => { loadWallet(); }, [user?.role]);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const requests: any[] = [walletApi.getMyWallet(), walletApi.getMyTransactions()];
      if (user?.role === 'buyer') {
        requests.push(walletApi.getPaymentMethods());
        requests.push(walletApi.getMyTopupRequests());
      }

      const responses = await Promise.all(requests);
      const [walletRes, txRes, methodsRes, topupsRes] = responses;
      setWallet(walletRes.data);
      setTransactions(txRes.data);
      if (user?.role === 'buyer') {
        setPaymentMethods(methodsRes?.data || []);
        setTopupRequests(topupsRes?.data || []);
      }
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل بيانات المحفظة', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({ title: 'خطأ', description: 'أدخل مبلغ صحيح', variant: 'destructive' });
      return;
    }
    if (!sellerWithdrawPhone.trim()) {
      toast({ title: 'خطأ', description: 'أدخل رقم المحفظة المراد التحويل عليه', variant: 'destructive' });
      return;
    }
    setWithdrawing(true);
    try {
      await walletApi.requestWithdrawal({ amount: withdrawAmount, phoneNumber: sellerWithdrawPhone.trim() });
      toast({ title: 'تم', description: 'تم تقديم طلب السحب بنجاح' });
      setWithdrawAmount('');
      setSellerWithdrawPhone('');
      loadWallet();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'فشل طلب السحب', variant: 'destructive' });
    } finally {
      setWithdrawing(false);
    }
  };

  const handleBuyerWithdraw = async () => {
    if (!buyerWithdrawAmount || buyerWithdrawAmount <= 0) {
      toast({ title: 'خطأ', description: 'أدخل مبلغ صحيح', variant: 'destructive' });
      return;
    }
    if (!buyerWithdrawPhone.trim()) {
      toast({ title: 'خطأ', description: 'أدخل رقم الهاتف المراد التحويل عليه', variant: 'destructive' });
      return;
    }
    setBuyerWithdrawing(true);
    try {
      await walletApi.requestWithdrawal({ amount: buyerWithdrawAmount, phoneNumber: buyerWithdrawPhone.trim() });
      toast({ title: 'تم', description: 'تم تقديم طلب السحب بنجاح' });
      setBuyerWithdrawAmount('');
      setBuyerWithdrawPhone('');
      loadWallet();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'فشل طلب السحب', variant: 'destructive' });
    } finally {
      setBuyerWithdrawing(false);
    }
  };

  const handleTopupRequest = async () => {
    if (!topupPaymentMethodId) {
      toast({ title: 'خطأ', description: 'اختر طريقة الدفع أولاً', variant: 'destructive' });
      return;
    }
    if (!topupAmount || topupAmount <= 0) {
      toast({ title: 'خطأ', description: 'أدخل قيمة تحويل صحيحة', variant: 'destructive' });
      return;
    }

    setTopupSubmitting(true);
    try {
      await walletApi.createTopupRequest({
        paymentMethodId: Number(topupPaymentMethodId),
        amount: Number(topupAmount),
        screenshot: topupScreenshot,
      });
      toast({ title: 'تم الإرسال', description: 'تم إرسال طلب الشحن وبانتظار مراجعة الإدارة' });
      setTopupAmount('');
      setTopupPaymentMethodId('');
      setTopupScreenshot(null);
      loadWallet();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'فشل إرسال طلب الشحن', variant: 'destructive' });
    } finally {
      setTopupSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  const isBuyer = user?.role === 'buyer';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="المحفظة"
          description={isBuyer ? 'إدارة رصيدك المالي وتتبع مدفوعاتك' : 'إدارة رصيدك المالي وعمليات السحب'}
        />

        {/* Balance stat cards */}
        <div className={`grid grid-cols-2 ${isBuyer ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-4`}>
          <StatCard icon={Wallet}     label="الرصيد المتاح"  value={`${Number(wallet?.availableBalance ?? 0).toFixed(2)} ج.م`} color="green" />
          <StatCard icon={Clock}      label="رصيد معلّق"     value={`${Number(wallet?.pendingBalance ?? 0).toFixed(2)} ج.م`}    color="yellow" />
          {!isBuyer && (
            <>
              <StatCard icon={TrendingUp} label="إجمالي الأرباح" value={`${Number(wallet?.totalEarnings ?? 0).toFixed(2)} ج.م`}     color="blue" />
              <StatCard icon={CreditCard} label="إجمالي المسحوب" value={`${Number(wallet?.totalWithdrawn ?? 0).toFixed(2)} ج.م`}    color="purple" />
            </>
          )}
        </div>

        {isBuyer ? (
          /* === Buyer: topup + withdraw + transactions === */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-5">
              <DataCard title="شحن الرصيد" description="حوّل على الرقم المعروض ثم أرسل طلب الشحن للمراجعة">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">طريقة الدفع</Label>
                    <select
                      value={topupPaymentMethodId}
                      onChange={(e) => setTopupPaymentMethodId(e.target.value ? Number(e.target.value) : '')}
                      className="mt-1.5 w-full h-11 rounded-xl border border-input bg-muted/30 px-3 text-sm focus:bg-white focus:outline-none"
                    >
                      <option value="">اختر طريقة الدفع</option>
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>{method.name}</option>
                      ))}
                    </select>
                  </div>

                  {topupPaymentMethodId && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
                      <p className="text-muted-foreground">حوّل على الرقم:</p>
                      <p className="font-bold text-primary flex items-center gap-2 mt-1">
                        <Smartphone size={14} />
                        {paymentMethods.find((m) => m.id === Number(topupPaymentMethodId))?.accountNumber}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-semibold">قيمة التحويل (ج.م)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value ? Number(e.target.value) : '')}
                      className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-semibold">سكرين التحويل (اختياري)</Label>
                    <label className="mt-1.5 flex items-center gap-2 cursor-pointer text-sm text-muted-foreground rounded-xl border border-dashed border-border px-3 py-2.5 hover:bg-muted/30">
                      <Upload size={15} />
                      <span>{topupScreenshot ? topupScreenshot.name : 'إرفاق صورة إثبات التحويل'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setTopupScreenshot(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  <Button onClick={handleTopupRequest} disabled={topupSubmitting} className="w-full gap-2 rounded-xl">
                    {topupSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    إرسال طلب الشحن
                  </Button>
                </div>
              </DataCard>

              <DataCard title="سحب الرصيد" description="ضع رقم الهاتف المراد التحويل عليه">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">رقم الهاتف</Label>
                    <Input
                      value={buyerWithdrawPhone}
                      onChange={(e) => setBuyerWithdrawPhone(e.target.value)}
                      placeholder="مثال: 01000000000"
                      className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">المبلغ (ج.م)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={wallet?.availableBalance || 0}
                      value={buyerWithdrawAmount}
                      onChange={(e) => setBuyerWithdrawAmount(e.target.value ? Number(e.target.value) : '')}
                      className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                    />
                  </div>
                  <Button onClick={handleBuyerWithdraw} disabled={buyerWithdrawing} className="w-full gap-2 rounded-xl">
                    {buyerWithdrawing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    تقديم طلب سحب
                  </Button>
                </div>
              </DataCard>

              <DataCard title="طلبات الشحن" description={`${topupRequests.length} طلب`}>
                {topupRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">لا توجد طلبات شحن بعد</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {topupRequests.map((request: any) => (
                      <div key={request.id} className="rounded-lg border border-border p-3 bg-muted/20">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{Number(request.amount).toFixed(2)} ج.م</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            request.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : request.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                          }`}>
                            {topupStatusLabel[request.status] || request.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {request.paymentMethod?.name} • {new Date(request.createdAt).toLocaleString('ar-SA')}
                        </p>
                        {request.reviewNote && (
                          <p className="text-xs text-muted-foreground mt-1">ملاحظة الإدارة: {request.reviewNote}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </DataCard>

              {/* Balance info card */}
              <div className="rounded-2xl bg-primary/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Info size={16} />
                  <span>كيف يعمل الرصيد؟</span>
                </div>
                <ul className="space-y-2 text-[13px] text-muted-foreground">
                  {[
                    'شحن الرصيد يتم عبر تحويل على طريقة الدفع المعروضة ثم مراجعة الإدارة',
                    'عند طلب خدمة يتم تعليق المبلغ من رصيدك',
                    'عند إتمام الطلب يتم خصم المبلغ نهائياً',
                    'عند إلغاء الطلب يتم استرداد المبلغ المعلق',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-primary/40 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Transactions */}
            <div className="lg:col-span-2">
            <DataCard title="سجل المعاملات" description={`${transactions.length} معاملة`}>
              {transactions.length === 0 ? (
                <EmptyState icon={DollarSign} title="لا توجد معاملات" description="ستظهر هنا جميع العمليات المالية" />
              ) : (
                <div className="space-y-2 max-h-[460px] overflow-y-auto scrollbar-thin">
                  {transactions.map((tx: any) => {
                    const cfg = txTypeConfig[tx.type] || { label: tx.type, variant: 'neutral' as const, icon: DollarSign, sign: '' };
                    const Icon = cfg.icon;
                    return (
                      <div key={tx.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/20 p-3.5 ring-1 ring-black/[0.03] hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`shrink-0 flex items-center justify-center h-9 w-9 rounded-lg ${
                            cfg.variant === 'success' ? 'bg-green-50 text-green-600'
                            : cfg.variant === 'info' ? 'bg-blue-50 text-blue-600'
                            : cfg.variant === 'warning' ? 'bg-orange-50 text-orange-600'
                            : 'bg-purple-50 text-purple-600'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{tx.description}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {new Date(tx.createdAt).toLocaleDateString('ar-EG', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <StatusBadge label={cfg.label} variant={cfg.variant} />
                          <span className={`text-sm font-bold tabular-nums ${
                            cfg.variant === 'success' ? 'text-green-600'
                            : cfg.variant === 'info' ? 'text-blue-600'
                            : cfg.variant === 'warning' ? 'text-orange-600'
                            : 'text-purple-600'
                          }`}>
                            {cfg.sign}{Number(tx.amount ?? 0).toFixed(2)} ج.م
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </DataCard>
            </div>
          </div>
        ) : (
          /* === Seller: withdrawal form + transactions === */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Withdrawal form */}
            <div className="space-y-5">
              <DataCard title="طلب سحب" description="حوّل رصيدك المتاح إلى رقم محفظتك الإلكترونية">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sellerPhone" className="text-sm font-semibold">رقم المحفظة *</Label>
                    <Input
                      id="sellerPhone"
                      value={sellerWithdrawPhone}
                      onChange={e => setSellerWithdrawPhone(e.target.value)}
                      placeholder="مثال: 01000000000"
                      className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount" className="text-sm font-semibold">المبلغ (ج.م)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min={1}
                      max={wallet?.availableBalance || 0}
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="أدخل المبلغ"
                      className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      الحد الأقصى: {Number(wallet?.availableBalance ?? 0).toFixed(2)} ج.م
                    </p>
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    disabled={withdrawing || !withdrawAmount}
                    className="w-full gap-2 rounded-xl shadow-md shadow-primary/20"
                  >
                    {withdrawing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    تقديم طلب سحب
                  </Button>
                </div>
              </DataCard>

              {/* Policies card */}
              <div className="rounded-2xl bg-primary/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <ShieldCheck size={16} />
                  <span>سياسة السحب</span>
                </div>
                <ul className="space-y-2 text-[13px] text-muted-foreground">
                  {[
                    'الأرباح تُحجز لمدة 14 يوم قبل إتاحتها',
                    'الحد الأدنى للسحب 50 ج.م',
                    'تتم مراجعة الطلبات خلال 24 ساعة',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-primary/40 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Transactions */}
            <div className="lg:col-span-2">
              <DataCard title="سجل المعاملات" description={`${transactions.length} معاملة`}>
                {transactions.length === 0 ? (
                  <EmptyState icon={DollarSign} title="لا توجد معاملات" description="ستظهر هنا جميع العمليات المالية" />
                ) : (
                  <div className="space-y-2 max-h-[460px] overflow-y-auto scrollbar-thin">
                    {transactions.map((tx: any) => {
                      const cfg = txTypeConfig[tx.type] || { label: tx.type, variant: 'neutral' as const, icon: DollarSign, sign: '' };
                      const Icon = cfg.icon;
                      return (
                        <div key={tx.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/20 p-3.5 ring-1 ring-black/[0.03] hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`shrink-0 flex items-center justify-center h-9 w-9 rounded-lg ${
                              cfg.variant === 'success' ? 'bg-green-50 text-green-600'
                              : cfg.variant === 'info' ? 'bg-blue-50 text-blue-600'
                              : cfg.variant === 'warning' ? 'bg-orange-50 text-orange-600'
                              : 'bg-purple-50 text-purple-600'
                            }`}>
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{tx.description}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {new Date(tx.createdAt).toLocaleDateString('ar-EG', {
                                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <StatusBadge label={cfg.label} variant={cfg.variant} />
                            <span className={`text-sm font-bold tabular-nums ${
                              cfg.variant === 'success' ? 'text-green-600'
                              : cfg.variant === 'info' ? 'text-blue-600'
                              : cfg.variant === 'warning' ? 'text-orange-600'
                              : 'text-purple-600'
                            }`}>
                              {cfg.sign}{Number(tx.amount ?? 0).toFixed(2)} ج.م
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </DataCard>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerWallet;
