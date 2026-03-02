import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { StatCard, PageHeader, DataCard, InfoRow, StatusBadge } from '@/components/dashboard';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Package,
  Wallet,
  Star,
  ArrowLeft,
  ShoppingCart,
  Search,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { servicesApi, walletApi, ordersApi } from '@/lib/api';

const DashboardHome = () => {
  const { user } = useAuth();
  const isSeller = user?.role === 'seller';
  const isBuyer = user?.role === 'buyer';
  const [stats, setStats] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isSeller) {
      servicesApi.getMyStats().then(r => setStats(r.data)).catch(() => {});
      walletApi.getMyWallet().then(r => setWallet(r.data)).catch(() => {});
    }
    if (isBuyer) {
      ordersApi.getByBuyer().then(r => setBuyerOrders(r.data)).catch(() => {});
    }
  }, [isSeller, isBuyer]);

  const accountStatus = user?.status === 'active' ? 'نشط' : user?.status === 'pending' ? 'قيد المراجعة' : 'معلّق';
  const accountVariant = user?.status === 'active' ? 'success' : user?.status === 'pending' ? 'warning' : 'error';

  const kycLabel = user?.kyc?.status === 'verified' ? 'محققة' : user?.kyc?.status === 'pending' ? 'قيد المراجعة' : user?.kyc?.status === 'rejected' ? 'مرفوضة' : 'غير مقدمة';
  const kycVariant = user?.kyc?.status === 'verified' ? 'success' : user?.kyc?.status === 'pending' ? 'warning' : user?.kyc?.status === 'rejected' ? 'error' : 'neutral';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="rounded-2xl bg-gradient-to-l from-primary/10 via-primary/5 to-transparent p-6">
          <PageHeader
            title={`مرحباً، ${user?.name} 👋`}
            description={isSeller ? 'إليك نظرة سريعة على حسابك وأدائك' : 'مرحباً بك في لوحة التحكم الخاصة بك'}
          />
        </div>

        {/* Quick stats for sellers */}
        {isSeller && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="خدمات فعّالة"
              value={stats.activeServices ?? 0}
              icon={Package}
              color="primary"
            />
            <StatCard
              label="إجمالي الطلبات"
              value={stats.totalOrders ?? 0}
              icon={ShoppingCart}
              color="blue"
            />
            <StatCard
              label="متوسط التقييم"
              value={Number(stats.averageRating ?? 0).toFixed(1)}
              icon={Star}
              color="amber"
            />
            <StatCard
              label="الرصيد المتاح"
              value={`${Number(wallet?.availableBalance ?? 0).toFixed(0)} ج.م`}
              icon={Wallet}
              color="green"
            />
          </div>
        )}

        {/* Quick stats for buyers */}
        {isBuyer && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="إجمالي الطلبات"
              value={buyerOrders.length}
              icon={ShoppingCart}
              color="primary"
            />
            <StatCard
              label="طلبات نشطة"
              value={buyerOrders.filter(o => ['pending', 'in_progress', 'delivered'].includes(o.status)).length}
              icon={Clock}
              color="blue"
            />
            <StatCard
              label="طلبات مكتملة"
              value={buyerOrders.filter(o => o.status === 'completed').length}
              icon={CheckCircle2}
              color="green"
            />
            <StatCard
              label="إجمالي الإنفاق"
              value={`${buyerOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.totalAmount || 0), 0).toFixed(0)} ج.م`}
              icon={Wallet}
              color="amber"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Account info */}
          <div className="lg:col-span-2">
            <DataCard title="معلومات الحساب">
              <div className="space-y-0">
                <InfoRow label="الاسم" value={user?.name} />
                <InfoRow label="البريد الإلكتروني" value={user?.email} />
                <InfoRow label="رقم الهاتف" value={<span dir="ltr">{user?.phone}</span>} />
                <InfoRow
                  label="تحقق الهاتف"
                  value={
                    user?.isPhoneVerified ? (
                      <StatusBadge variant="success">محقق</StatusBadge>
                    ) : (
                      <StatusBadge variant="warning">غير محقق</StatusBadge>
                    )
                  }
                />
                {user?.country && (
                  <InfoRow
                    label="الموقع"
                    value={`${user.country}${user.city ? ` - ${user.city}` : ''}`}
                    last
                  />
                )}
              </div>
            </DataCard>
          </div>

          {/* Status sidebar */}
          <div className="space-y-4">
            {/* Account status */}
            <DataCard>
              <div className="flex items-center gap-4">
                <div className={`rounded-xl p-3 ${user?.status === 'active' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  {user?.status === 'active' ? (
                    <CheckCircle2 size={22} className="text-emerald-600" />
                  ) : (
                    <Clock size={22} className="text-amber-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">حالة الحساب</p>
                  <StatusBadge variant={accountVariant as any} className="mt-1">{accountStatus}</StatusBadge>
                </div>
              </div>
            </DataCard>

            {/* KYC status (seller only) */}
            {isSeller && (
              <DataCard>
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-3 ${kycVariant === 'success' ? 'bg-emerald-50' : kycVariant === 'warning' ? 'bg-amber-50' : 'bg-gray-50'}`}>
                    <ShieldCheck size={22} className={kycVariant === 'success' ? 'text-emerald-600' : kycVariant === 'warning' ? 'text-amber-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">حالة الهوية</p>
                    <StatusBadge variant={kycVariant as any} className="mt-1">{kycLabel}</StatusBadge>
                  </div>
                </div>
              </DataCard>
            )}

            {/* Quick links */}
            {isSeller && (
              <DataCard title="وصول سريع">
                <div className="space-y-2">
                  <Link to="/dashboard/services/new">
                    <Button variant="outline" className="w-full justify-between h-10 text-sm rounded-xl">
                      إضافة خدمة جديدة
                      <ArrowLeft size={14} />
                    </Button>
                  </Link>
                  <Link to="/dashboard/wallet">
                    <Button variant="outline" className="w-full justify-between h-10 text-sm rounded-xl">
                      إدارة المحفظة
                      <ArrowLeft size={14} />
                    </Button>
                  </Link>
                  <Link to="/dashboard/stats">
                    <Button variant="outline" className="w-full justify-between h-10 text-sm rounded-xl">
                      عرض الإحصائيات
                      <ArrowLeft size={14} />
                    </Button>
                  </Link>
                </div>
              </DataCard>
            )}

            {/* Buyer quick links */}
            {isBuyer && (
              <DataCard title="وصول سريع">
                <div className="space-y-2">
                  <Link to="/services">
                    <Button variant="outline" className="w-full justify-between h-10 text-sm rounded-xl">
                      تصفح الخدمات
                      <ArrowLeft size={14} />
                    </Button>
                  </Link>
                  <Link to="/dashboard/orders">
                    <Button variant="outline" className="w-full justify-between h-10 text-sm rounded-xl">
                      طلباتي
                      <ArrowLeft size={14} />
                    </Button>
                  </Link>
                  <Link to="/dashboard/profile">
                    <Button variant="outline" className="w-full justify-between h-10 text-sm rounded-xl">
                      الملف الشخصي
                      <ArrowLeft size={14} />
                    </Button>
                  </Link>
                </div>
              </DataCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
