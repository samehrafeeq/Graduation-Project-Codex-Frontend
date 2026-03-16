import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { walletApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
  History,
  User,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

const AdminWallet = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'deposit' | 'deduct'>('deposit');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Transactions view
  const [txUser, setTxUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState<WithdrawalStatus | 'all'>('pending');
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [reviewingWithdrawId, setReviewingWithdrawId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadWithdrawalRequests();
  }, [withdrawalStatusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [walletsRes, statsRes] = await Promise.all([
        walletApi.adminGetAll(),
        walletApi.getAdminStats(),
      ]);
      setWallets(walletsRes.data);
      setStats(statsRes.data);
    } catch {}
    setLoading(false);
  };

  const loadWithdrawalRequests = async () => {
    setWithdrawalLoading(true);
    try {
      const params = withdrawalStatusFilter === 'all' ? undefined : { status: withdrawalStatusFilter };
      const res = await walletApi.adminGetWithdrawalRequests(params);
      setWithdrawalRequests(res.data);
    } catch {
      setWithdrawalRequests([]);
    }
    setWithdrawalLoading(false);
  };

  const reviewWithdrawal = async (requestId: number, status: 'approved' | 'rejected') => {
    setReviewingWithdrawId(requestId);
    try {
      await walletApi.adminReviewWithdrawalRequest(requestId, { status });
      await Promise.all([loadData(), loadWithdrawalRequests()]);
    } catch (err: any) {
      alert(err.response?.data?.message || 'تعذر تحديث حالة طلب السحب');
    }
    setReviewingWithdrawId(null);
  };

  const getWithdrawalBadgeClass = (status: WithdrawalStatus) => {
    if (status === 'approved') return 'bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/10';
    if (status === 'rejected') return 'bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/10';
    return 'bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/10';
  };

  const getWithdrawalStatusLabel = (status: WithdrawalStatus) => {
    if (status === 'approved') return 'تم التنفيذ';
    if (status === 'rejected') return 'مرفوض';
    return 'قيد المراجعة';
  };

  const openModal = (user: any, type: 'deposit' | 'deduct') => {
    setSelectedUser(user);
    setModalType(type);
    setAmount('');
    setDescription('');
    setModalOpen(true);
  };

  const handleAction = async () => {
    if (!selectedUser || !amount || +amount <= 0) return;
    setActionLoading(true);
    try {
      const data = {
        userId: selectedUser.userId,
        amount: +amount,
        description: description || undefined,
      };
      if (modalType === 'deposit') {
        await walletApi.adminDeposit(data);
      } else {
        await walletApi.adminDeduct(data);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'حدث خطأ');
    }
    setActionLoading(false);
  };

  const viewTransactions = async (wallet: any) => {
    setTxUser(wallet);
    setTxLoading(true);
    try {
      const res = await walletApi.adminGetUserTransactions(wallet.userId);
      setTransactions(res.data);
    } catch {}
    setTxLoading(false);
  };

  const filteredWallets = wallets.filter((w) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      w.user?.name?.toLowerCase().includes(term) ||
      w.user?.email?.toLowerCase().includes(term) ||
      w.user?.phone?.includes(term) ||
      w.userId?.toString().includes(term)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: 'إجمالي الأرصدة المتاحة',
      value: `${Number(stats?.totalAvailable || 0).toFixed(2)} ج.م`,
      icon: Wallet,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'الأرصدة المعلقة',
      value: `${Number(stats?.totalPending || 0).toFixed(2)} ج.م`,
      icon: Clock,
      color: 'bg-yellow-500/10 text-yellow-600',
    },
    {
      label: 'إجمالي الأرباح',
      value: `${Number(stats?.totalEarnings || 0).toFixed(2)} ج.م`,
      icon: TrendingUp,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'إجمالي المسحوبات',
      value: `${Number(stats?.totalWithdrawn || 0).toFixed(2)} ج.م`,
      icon: DollarSign,
      color: 'bg-red-500/10 text-red-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">إدارة الأرصدة</h1>
          <p className="text-muted-foreground mt-1">عرض أرصدة المستخدمين وإجراء عمليات الإيداع والخصم</p>
        </div>

        {/* إحصائيات */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <Card key={i} className="bg-white shadow-sm ring-1 ring-black/[0.04]">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                    <card.icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* طلبات السحب */}
        <Card className="bg-white shadow-sm ring-1 ring-black/[0.04] mb-8">
          <div className="p-5 border-b border-border/40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">طلبات السحب (مشتري + بائع)</h2>
              <p className="text-xs text-muted-foreground mt-0.5">يمكنك مراجعة كل طلب وتحديد إذا تم التحويل أم لا</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={withdrawalStatusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setWithdrawalStatusFilter('pending')}
              >
                قيد المراجعة
              </Button>
              <Button
                size="sm"
                variant={withdrawalStatusFilter === 'approved' ? 'default' : 'outline'}
                onClick={() => setWithdrawalStatusFilter('approved')}
              >
                تم التنفيذ
              </Button>
              <Button
                size="sm"
                variant={withdrawalStatusFilter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setWithdrawalStatusFilter('rejected')}
              >
                مرفوض
              </Button>
              <Button
                size="sm"
                variant={withdrawalStatusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setWithdrawalStatusFilter('all')}
              >
                الكل
              </Button>
            </div>
          </div>

          {withdrawalLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary mx-auto mb-3"></div>
              جارٍ تحميل طلبات السحب...
            </div>
          ) : withdrawalRequests.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">لا توجد طلبات سحب بهذه الحالة</div>
          ) : (
            <div className="divide-y divide-border/40">
              {withdrawalRequests.map((req) => {
                const status = (req.withdrawalStatus || 'pending') as WithdrawalStatus;
                return (
                  <div key={req.id} className="p-4 flex flex-col gap-3">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {req.wallet?.user?.name || 'مستخدم'}
                          </p>
                          <Badge className={getWithdrawalBadgeClass(status)}>
                            {getWithdrawalStatusLabel(status)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {req.wallet?.user?.role === 'seller' ? 'بائع' : 'مشتري'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {req.wallet?.user?.email || 'بدون بريد'}
                          {req.withdrawalPhone ? ` · رقم المحفظة: ${req.withdrawalPhone}` : ''}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(req.createdAt).toLocaleString('ar-EG')}
                        </p>
                        {req.reviewNote ? (
                          <p className="text-xs text-muted-foreground mt-1">ملاحظة: {req.reviewNote}</p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-red-600">
                          {Math.abs(Number(req.amount || 0)).toFixed(2)} ج.م
                        </p>
                        {status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-500 text-white"
                              onClick={() => reviewWithdrawal(req.id, 'approved')}
                              disabled={reviewingWithdrawId === req.id}
                            >
                              <CheckCircle2 size={14} className="ml-1" />
                              تم التنفيذ
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => reviewWithdrawal(req.id, 'rejected')}
                              disabled={reviewingWithdrawId === req.id}
                            >
                              <XCircle size={14} className="ml-1" />
                              لم يتم
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* عرض المعاملات */}
        {txUser ? (
          <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
            <div className="flex items-center gap-3 p-5 border-b border-border/40">
              <button
                onClick={() => setTxUser(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight size={20} />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <History size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{txUser.user?.name}</p>
                <p className="text-xs text-muted-foreground">سجل المعاملات</p>
              </div>
            </div>

            {txLoading ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                جارٍ التحميل...
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center">
                <History size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">لا توجد معاملات</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                        +tx.amount >= 0
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {+tx.amount >= 0 ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{tx.description || tx.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {tx.orderId && ` · طلب #${tx.orderId}`}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        +tx.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {+tx.amount >= 0 ? '+' : ''}
                      {Number(tx.amount).toFixed(2)} ج.م
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : (
          <>
            {/* بحث */}
            <div className="relative max-w-md mb-6">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البريد أو الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* قائمة المحافظ */}
            {filteredWallets.length === 0 ? (
              <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
                <CardContent className="p-12 text-center">
                  <Wallet size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'لا توجد نتائج مطابقة' : 'لا توجد محافظ بعد'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredWallets.map((w) => (
                  <Card
                    key={w.id}
                    className="bg-white shadow-sm ring-1 ring-black/[0.04] hover:bg-accent/30 transition-colors"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* معلومات المستخدم */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-11 h-11 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {w.user?.name?.charAt(0) || <User size={18} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-foreground truncate">{w.user?.name}</h3>
                              <Badge
                                className={
                                  w.user?.role === 'seller'
                                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/10'
                                    : 'bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/10'
                                }
                              >
                                {w.user?.role === 'seller' ? 'بائع' : 'مشتري'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{w.user?.email}</p>
                          </div>
                        </div>

                        {/* الأرصدة */}
                        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                          <div className="text-center min-w-[80px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">المتاح</p>
                            <p className="text-sm font-bold text-green-600 mt-0.5">
                              {Number(w.availableBalance).toFixed(2)}
                              <span className="text-[10px] text-muted-foreground mr-1">ج.م</span>
                            </p>
                          </div>
                          <div className="text-center min-w-[80px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">المعلق</p>
                            <p className="text-sm font-bold text-yellow-600 mt-0.5">
                              {Number(w.pendingBalance).toFixed(2)}
                              <span className="text-[10px] text-muted-foreground mr-1">ج.م</span>
                            </p>
                          </div>
                          <div className="text-center min-w-[80px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">الأرباح</p>
                            <p className="text-sm font-bold text-blue-600 mt-0.5">
                              {Number(w.totalEarnings).toFixed(2)}
                              <span className="text-[10px] text-muted-foreground mr-1">ج.م</span>
                            </p>
                          </div>
                          <div className="text-center min-w-[80px]">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">المسحوب</p>
                            <p className="text-sm font-bold text-red-600 mt-0.5">
                              {Number(w.totalWithdrawn).toFixed(2)}
                              <span className="text-[10px] text-muted-foreground mr-1">ج.م</span>
                            </p>
                          </div>
                        </div>

                        {/* إجراءات */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            className="rounded-lg bg-green-600 text-white hover:bg-green-500 text-xs gap-1.5"
                            onClick={() => openModal(w, 'deposit')}
                          >
                            <ArrowDownCircle size={14} />
                            إيداع
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-lg bg-red-600 text-white hover:bg-red-500 text-xs gap-1.5"
                            onClick={() => openModal(w, 'deduct')}
                          >
                            <ArrowUpCircle size={14} />
                            خصم
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs"
                            onClick={() => viewTransactions(w)}
                          >
                            <History size={14} className="ml-1" />
                            السجل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal إيداع / خصم */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              {modalType === 'deposit' ? (
                <>
                  <ArrowDownCircle size={20} className="text-green-600" />
                  <span>إيداع رصيد</span>
                </>
              ) : (
                <>
                  <ArrowUpCircle size={20} className="text-red-600" />
                  <span>خصم رصيد</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* معلومات المستخدم */}
          <div className="bg-accent/30 rounded-xl p-4 ring-1 ring-black/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {selectedUser?.user?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{selectedUser?.user?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedUser?.user?.email}</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-muted-foreground">الرصيد المتاح</p>
                <p className="text-sm font-bold text-green-600">
                  {Number(selectedUser?.availableBalance || 0).toFixed(2)} ج.م
                </p>
              </div>
            </div>
          </div>

          {/* الحقول */}
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground/80 block mb-1.5">المبلغ (ج.م)</label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/80 block mb-1.5">ملاحظة (اختياري)</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="سبب العملية..."
              />
            </div>
          </div>

          {/* أزرار */}
          <div className="flex gap-3 mt-2">
            <Button
              onClick={handleAction}
              disabled={actionLoading || !amount || +amount <= 0}
              className={`flex-1 font-medium ${
                modalType === 'deposit'
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {actionLoading
                ? 'جارٍ التنفيذ...'
                : modalType === 'deposit'
                ? `إيداع ${amount || '0'} ج.م`
                : `خصم ${amount || '0'} ج.م`}
            </Button>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              إلغاء
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminWallet;
