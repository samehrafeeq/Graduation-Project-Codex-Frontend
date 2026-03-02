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
} from 'lucide-react';

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
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => { loadWallet(); }, []);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const [walletRes, txRes] = await Promise.all([
        walletApi.getMyWallet(),
        walletApi.getMyTransactions(),
      ]);
      setWallet(walletRes.data);
      setTransactions(txRes.data);
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
    setWithdrawing(true);
    try {
      await walletApi.requestWithdrawal({ amount: withdrawAmount });
      toast({ title: 'تم', description: 'تم تقديم طلب السحب بنجاح' });
      setWithdrawAmount('');
      loadWallet();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'فشل طلب السحب', variant: 'destructive' });
    } finally {
      setWithdrawing(false);
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
          /* === Buyer: info card + transactions === */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-5">
              {/* Balance info card */}
              <div className="rounded-2xl bg-primary/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Info size={16} />
                  <span>كيف يعمل الرصيد؟</span>
                </div>
                <ul className="space-y-2 text-[13px] text-muted-foreground">
                  {[
                    'يتم شحن رصيدك من قبل إدارة المنصة',
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
              <DataCard title="طلب سحب" description="حوّل رصيدك المتاح لحسابك البنكي">
                <div className="space-y-4">
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
