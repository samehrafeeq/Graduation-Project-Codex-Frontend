import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '@/lib/api';
import { PageHeader, EmptyState, PageLoader, FilterTabs, StatusBadge } from '@/components/dashboard';
import {
  ShoppingBag,
  Clock,
  Loader2,
  Truck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  ArrowLeft,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple' }> = {
  pending: { label: 'بانتظار القبول', variant: 'warning' },
  in_progress: { label: 'قيد التنفيذ', variant: 'info' },
  delivered: { label: 'تم التسليم', variant: 'purple' },
  completed: { label: 'مكتمل', variant: 'success' },
  cancelled: { label: 'ملغي', variant: 'error' },
  disputed: { label: 'نزاع', variant: 'error' },
};

const tabIcons: Record<string, React.ReactNode> = {
  all: <ShoppingBag size={14} />,
  pending: <Clock size={14} />,
  in_progress: <Loader2 size={14} />,
  delivered: <Truck size={14} />,
  completed: <CheckCircle2 size={14} />,
  cancelled: <XCircle size={14} />,
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    ordersApi
      .getByBuyer()
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  const tabs = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return [
      { key: 'all', label: 'الكل', count: orders.length, icon: tabIcons.all },
      { key: 'pending', label: 'بانتظار القبول', count: counts.pending || 0, icon: tabIcons.pending },
      { key: 'in_progress', label: 'قيد التنفيذ', count: counts.in_progress || 0, icon: tabIcons.in_progress },
      { key: 'delivered', label: 'تم التسليم', count: counts.delivered || 0, icon: tabIcons.delivered },
      { key: 'completed', label: 'مكتمل', count: counts.completed || 0, icon: tabIcons.completed },
      { key: 'cancelled', label: 'ملغي', count: counts.cancelled || 0, icon: tabIcons.cancelled },
    ];
  }, [orders]);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(o => o.status === activeTab);
  }, [orders, activeTab]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader title="طلباتي" subtitle="تتبع حالة طلباتك وإدارتها" />

      <FilterTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="لا توجد طلبات"
          description={activeTab === 'all' ? 'لم تقم بأي طلب بعد. تصفح الخدمات وابدأ أول طلب!' : 'لا توجد طلبات في هذه الحالة'}
          actionLabel="تصفح الخدمات"
          actionLink="/services"
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map(order => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            return (
              <Link
                key={order.id}
                to={`/dashboard/orders/${order.id}`}
                className="group bg-white rounded-2xl p-5 ring-1 ring-black/[0.04] hover:shadow-md hover:shadow-black/5 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Service image */}
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-muted/30 shrink-0">
                    {order.service?.image ? (
                      <img
                        src={`${API_BASE}${order.service.image}`}
                        alt={order.service?.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package size={24} className="text-muted-foreground/20" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {order.service?.title || `طلب #${order.id}`}
                      </h3>
                      <StatusBadge variant={sc.variant} label={sc.label} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground mb-2">
                      <span>البائع: {order.seller?.name}</span>
                      <span>رقم الطلب: #{order.id}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-primary">
                        {Number(order.totalAmount).toFixed(0)} ج.م
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                        عرض التفاصيل
                        <ArrowLeft size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
