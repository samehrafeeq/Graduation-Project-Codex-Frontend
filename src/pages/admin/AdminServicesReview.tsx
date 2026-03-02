import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { servicesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Package,
  Tag,
  User,
  Calendar,
  Truck,
  Layers,
  AlertTriangle,
  Image as ImageIcon,
  Search,
  ArrowRight,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  Eye,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

/* ────────── Full-screen Service Detail View ────────── */
const ServiceDetailView = ({
  service,
  onBack,
  onApprove,
  onReject,
  actionLoading,
}: {
  service: any;
  onBack: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  actionLoading: boolean;
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending_review':
        return { label: 'قيد المراجعة', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', border: 'border-amber-200' };
      case 'active':
        return { label: 'فعّالة', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', border: 'border-emerald-200' };
      case 'rejected':
        return { label: 'مرفوضة', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400', border: 'border-red-200' };
      default:
        return { label: status, bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400', border: 'border-gray-200' };
    }
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  };

  const sc = getStatusConfig(service.status);

  const handleRejectClick = () => {
    if (!rejectionReason.trim()) {
      toast({ title: 'خطأ', description: 'يرجى كتابة سبب الرفض', variant: 'destructive' });
      return;
    }
    onReject(service.id, rejectionReason);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight size={16} />
          <span>رجوع للقائمة</span>
        </button>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}>
          <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
          {sc.label}
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden bg-muted/30 ring-1 ring-black/[0.04]">
        {service.image ? (
          <img
            src={`${API_BASE}${service.image}`}
            alt={service.title}
            className="w-full h-72 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center">
            <ImageIcon size={48} className="text-muted-foreground/20" />
          </div>
        )}

        {/* Overlay gradient */}
        {service.image && (
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
        )}

        {/* Price tag on image */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <span className="text-xs text-muted-foreground">السعر</span>
            <p className="text-xl font-bold text-emerald-600">{service.price} ج.م</p>
          </div>
          {service.discountPrice && (
            <div className="bg-red-500/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg text-white">
              <span className="text-xs text-white/80">خصم</span>
              <p className="text-xl font-bold">{service.discountPrice} ج.م</p>
            </div>
          )}
        </div>

        {/* ID badge */}
        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-xs font-medium">
          #{service.id}
        </div>
      </div>

      {/* Content Grid: Main + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content — takes 2 cols */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">{service.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(service.createdAt)}
              </span>
              {service.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-amber-600">{Number(service.averageRating).toFixed(1)}</span>
                  <span className="text-muted-foreground">({service.totalReviews} تقييم)</span>
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl ring-1 ring-black/[0.04] shadow-sm p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare size={15} className="text-primary/60" />
              وصف الخدمة
            </h3>
            <p className="text-sm text-muted-foreground leading-[1.8] whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

          {/* Extras */}
          {service.extras?.length > 0 && (
            <div className="bg-white rounded-xl ring-1 ring-black/[0.04] shadow-sm p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Layers size={15} className="text-primary/60" />
                الإضافات ({service.extras.length})
              </h3>
              <div className="space-y-2">
                {service.extras.map((ext: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-foreground">{ext.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
                        +{ext.price} ج.م
                      </span>
                      <span className="text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-md">
                        +{ext.extraDeliveryDays} يوم
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejection reason (if rejected) */}
          {service.rejectionReason && service.status === 'rejected' && (
            <div className="bg-red-50 rounded-xl p-5 ring-1 ring-red-100">
              <h3 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle size={15} />
                سبب الرفض
              </h3>
              <p className="text-sm text-red-600 leading-relaxed">{service.rejectionReason}</p>
            </div>
          )}

          {/* Discount info */}
          {service.discountPrice && service.discountEndsAt && (
            <div className="bg-amber-50 rounded-xl p-5 ring-1 ring-amber-100">
              <h3 className="text-sm font-bold text-amber-700 mb-1 flex items-center gap-2">
                <DollarSign size={15} />
                معلومات الخصم
              </h3>
              <p className="text-sm text-amber-600">
                سعر الخصم <span className="font-bold">{service.discountPrice} ج.م</span> بدلاً من <span className="line-through">{service.price} ج.م</span>
                {' · '}ينتهي في <span className="font-bold">{formatDate(service.discountEndsAt)}</span>
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Seller Card */}
          <div className="bg-white rounded-xl ring-1 ring-black/[0.04] shadow-sm p-5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4">معلومات البائع</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{service.seller?.name || '—'}</p>
                <p className="text-xs text-muted-foreground">{service.seller?.email || ''}</p>
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-white rounded-xl ring-1 ring-black/[0.04] shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">تفاصيل سريعة</h3>
            {[
              { icon: Tag, label: 'القسم', value: service.category?.name || '—' },
              { icon: DollarSign, label: 'السعر', value: `${service.price} ج.م`, color: 'text-emerald-600' },
              { icon: Truck, label: 'مدة التنفيذ', value: `${service.deliveryDays} يوم` },
              { icon: ShoppingCart, label: 'الطلبات', value: `${service.totalOrders || 0} طلب` },
              { icon: Star, label: 'التقييم', value: service.averageRating > 0 ? `${Number(service.averageRating).toFixed(1)} (${service.totalReviews})` : 'لا يوجد' },
              { icon: Calendar, label: 'تاريخ الإنشاء', value: formatDate(service.createdAt) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <item.icon size={14} />
                  <span className="text-xs">{item.label}</span>
                </div>
                <span className={`text-sm font-semibold ${item.color || 'text-foreground'}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Action Card (for pending) */}
          {service.status === 'pending_review' && (
            <div className="bg-white rounded-xl ring-1 ring-black/[0.04] shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">إجراء المراجعة</h3>

              <Button
                onClick={() => onApprove(service.id)}
                disabled={actionLoading}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 gap-2 rounded-xl text-sm shadow-sm shadow-emerald-600/20"
              >
                {actionLoading && <Loader2 size={15} className="animate-spin" />}
                <CheckCircle size={16} />
                قبول الخدمة
              </Button>

              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 border-t border-border/40" />
                <p className="relative bg-white text-center text-[11px] text-muted-foreground px-3 w-fit mx-auto">أو</p>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-2">سبب الرفض</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="اكتب سبب الرفض هنا..."
                  className="min-h-[80px] rounded-xl bg-muted/20 focus:bg-white resize-none text-sm"
                />
              </div>

              <Button
                onClick={handleRejectClick}
                disabled={actionLoading}
                variant="destructive"
                className="w-full h-11 gap-2 rounded-xl text-sm"
              >
                {actionLoading && <Loader2 size={15} className="animate-spin" />}
                <XCircle size={16} />
                رفض الخدمة
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ────────── Main List View ────────── */
const AdminServicesReview = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending_review' | 'active' | 'rejected'>('pending_review');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, [activeTab]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await servicesApi.adminGetAll({ status: activeTab });
      setServices(res.data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل الخدمات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(true);
    try {
      await servicesApi.adminReview(id, { action: 'approve' });
      toast({ title: 'تمت الموافقة', description: 'تمت الموافقة على الخدمة بنجاح' });
      setSelectedService(null);
      loadServices();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: number, reason: string) => {
    setActionLoading(true);
    try {
      await servicesApi.adminReview(id, { action: 'reject', rejectionReason: reason });
      toast({ title: 'تم الرفض', description: 'تم رفض الخدمة' });
      setSelectedService(null);
      loadServices();
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending_review':
        return { label: 'قيد المراجعة', bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400', ring: 'ring-amber-200/60' };
      case 'active':
        return { label: 'فعّالة', bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400', ring: 'ring-emerald-200/60' };
      case 'rejected':
        return { label: 'مرفوضة', bg: 'bg-red-50 text-red-700', dot: 'bg-red-400', ring: 'ring-red-200/60' };
      default:
        return { label: status, bg: 'bg-gray-50 text-gray-600', dot: 'bg-gray-400', ring: 'ring-gray-200/60' };
    }
  };

  const tabs = [
    { key: 'pending_review' as const, label: 'قيد المراجعة', icon: Clock, color: 'text-amber-600' },
    { key: 'active' as const, label: 'فعّالة', icon: CheckCircle, color: 'text-emerald-600' },
    { key: 'rejected' as const, label: 'مرفوضة', icon: XCircle, color: 'text-red-500' },
  ];

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return d; }
  };

  const filtered = services.filter((s) =>
    !searchQuery ||
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ────── If a service is selected, show full-screen detail ──────
  if (selectedService) {
    return (
      <AdminLayout>
        <ServiceDetailView
          service={selectedService}
          onBack={() => setSelectedService(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          actionLoading={actionLoading}
        />
      </AdminLayout>
    );
  }

  // ────── List View ──────
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground">مراجعة الخدمات</h1>
          <p className="text-sm text-muted-foreground mt-0.5">مراجعة وإدارة الخدمات المقدمة من البائعين</p>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex gap-1 p-1 bg-muted/40 rounded-xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-foreground shadow-sm ring-1 ring-black/[0.04]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon size={15} className={isActive ? tab.color : ''} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالعنوان أو البائع..."
              className="w-full h-9 pr-9 pl-3 rounded-lg border border-border/60 bg-white text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Package size={14} />
          <span>{filtered.length} خدمة</span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin h-8 w-8 text-primary/60" />
              <span className="text-sm text-muted-foreground">جاري التحميل...</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Package className="text-muted-foreground/40" size={28} />
            </div>
            <p className="text-foreground font-medium mb-1">لا توجد خدمات</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد خدمات في هذا التصنيف حالياً'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((service) => {
              const statusConf = getStatusConfig(service.status);
              return (
                <div
                  key={service.id}
                  className="group bg-white rounded-xl ring-1 ring-black/[0.04] shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                  onClick={() => setSelectedService(service)}
                >
                  {/* Card Image */}
                  <div className="relative h-40 bg-muted/20">
                    {service.image ? (
                      <img
                        src={`${API_BASE}${service.image}`}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon size={32} className="text-muted-foreground/20" />
                      </div>
                    )}

                    {/* Status */}
                    <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ring-1 ${statusConf.bg} ${statusConf.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                      {statusConf.label}
                    </div>

                    {/* Price on image */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
                      <span className="text-sm font-bold text-emerald-600">{service.price} ج.م</span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <Eye size={20} className="text-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-foreground line-clamp-1 mb-2">{service.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                      {service.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {service.seller?.name || '—'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        {service.category?.name || '—'}
                      </span>
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Truck size={12} />
                          {service.deliveryDays} يوم
                        </span>
                        {service.averageRating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={11} className="text-amber-400 fill-amber-400" />
                            <span className="text-amber-600 font-medium">{Number(service.averageRating).toFixed(1)}</span>
                          </span>
                        )}
                      </div>

                      {service.status === 'pending_review' && (
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleApprove(service.id); }}
                          disabled={actionLoading}
                          className="h-7 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-700 rounded-lg gap-1"
                        >
                          <CheckCircle size={12} />
                          قبول
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServicesReview;
