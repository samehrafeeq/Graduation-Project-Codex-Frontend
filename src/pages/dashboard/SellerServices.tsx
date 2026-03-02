import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { PageHeader, FilterTabs, EmptyState, PageLoader, StatusBadge } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { servicesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Clock,
  ShoppingCart,
  Search,
  Package,
  Image as ImageIcon,
  AlertTriangle,
  MoreVertical,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' }> = {
  pending_review: { label: 'قيد المراجعة', variant: 'warning' },
  active: { label: 'نشطة', variant: 'success' },
  rejected: { label: 'مرفوضة', variant: 'error' },
  inactive: { label: 'متوقفة', variant: 'neutral' },
};

const SellerServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await servicesApi.getMy();
      setServices(res.data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل الخدمات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    try {
      await servicesApi.remove(id);
      toast({ title: 'تم الحذف', description: 'تم حذف الخدمة بنجاح' });
      fetchServices();
    } catch (err: any) {
      toast({
        title: 'خطأ',
        description: err.response?.data?.message || 'فشل حذف الخدمة',
        variant: 'destructive',
      });
    }
  };

  const counts = useMemo(() => ({
    all: services.length,
    active: services.filter(s => s.status === 'active').length,
    pending_review: services.filter(s => s.status === 'pending_review').length,
    rejected: services.filter(s => s.status === 'rejected').length,
  }), [services]);

  const filtered = useMemo(() => {
    let list = services;
    if (activeFilter !== 'all') list = list.filter(s => s.status === activeFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(s => s.title?.toLowerCase().includes(q) || s.category?.name?.toLowerCase().includes(q));
    }
    return list;
  }, [services, activeFilter, search]);

  const filterTabs = [
    { key: 'all', label: 'الكل', count: counts.all },
    { key: 'active', label: 'نشطة', count: counts.active },
    { key: 'pending_review', label: 'قيد المراجعة', count: counts.pending_review },
    { key: 'rejected', label: 'مرفوضة', count: counts.rejected },
  ];

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="خدماتي" description={`${services.length} خدمة مسجلة`}>
          <Link to="/dashboard/services/new">
            <Button className="gap-2 rounded-xl shadow-md shadow-primary/20">
              <Plus size={16} />
              إضافة خدمة
            </Button>
          </Link>
        </PageHeader>

        {services.length === 0 ? (
          <EmptyState
            icon={Package}
            title="لا توجد خدمات بعد"
            description="ابدأ بإضافة خدمتك الأولى لعرضها على المشترين"
            action={
              <Link to="/dashboard/services/new">
                <Button className="gap-2 rounded-xl">
                  <Plus size={16} />
                  إضافة خدمة جديدة
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <FilterTabs tabs={filterTabs} active={activeFilter} onChange={setActiveFilter} />
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="بحث في الخدمات..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pr-9 h-10 rounded-xl bg-white"
                />
              </div>
            </div>

            {/* Services grid */}
            {filtered.length === 0 ? (
              <EmptyState
                icon={Search}
                title="لا توجد نتائج"
                description="حاول تغيير الفلتر أو كلمة البحث"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((service) => {
                  const sc = statusConfig[service.status] || statusConfig.inactive;
                  return (
                    <div
                      key={service.id}
                      className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.04] transition-all hover:shadow-lg hover:shadow-black/5"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] bg-muted/30 overflow-hidden">
                        {service.image ? (
                          <img
                            src={`${API_BASE}${service.image}`}
                            alt={service.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon size={36} className="text-muted-foreground/30" />
                          </div>
                        )}
                        {/* Status badge overlay */}
                        <div className="absolute top-3 right-3">
                          <StatusBadge variant={sc.variant}>{sc.label}</StatusBadge>
                        </div>
                        {/* Price badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="rounded-lg bg-white/90 backdrop-blur px-2.5 py-1 text-sm font-bold text-foreground shadow-sm">
                            {service.discountPrice ? (
                              <>
                                <span className="line-through text-muted-foreground text-xs ml-1">{service.price}</span>
                                {service.discountPrice}
                              </>
                            ) : service.price}{' '}
                            <span className="text-xs font-normal text-muted-foreground">ج.م</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="font-bold text-foreground line-clamp-1">{service.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {service.description}
                          </p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {service.deliveryDays} يوم
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingCart size={13} /> {service.totalOrders}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={13} className="text-amber-500" />
                            {Number(service.averageRating) > 0 ? Number(service.averageRating).toFixed(1) : '-'}
                          </span>
                          {service.category?.name && (
                            <span className="mr-auto rounded-full bg-muted/60 px-2 py-0.5 text-[11px]">
                              {service.category.name}
                            </span>
                          )}
                        </div>

                        {/* Rejection reason */}
                        {service.status === 'rejected' && service.rejectionReason && (
                          <div className="mb-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                            <span>{service.rejectionReason}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                          <Link to={`/dashboard/services/edit/${service.id}`} className="flex-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full gap-1.5 rounded-lg text-xs h-9 hover:bg-primary/5 hover:text-primary"
                            >
                              <Pencil size={13} />
                              تعديل
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 rounded-lg text-xs h-9 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 size={13} />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerServices;
