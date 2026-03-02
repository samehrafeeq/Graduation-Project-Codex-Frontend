import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi, reviewsApi } from '@/lib/api';
import { PageLoader, StatusBadge, PageHeader, InfoRow } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  AlertTriangle,
  ArrowRight,
  Star,
  Loader2,
  Package,
  User,
  Calendar,
  CreditCard,
  FileText,
  PlayCircle,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple'; icon: any }> = {
  pending: { label: 'بانتظار القبول', variant: 'warning', icon: Clock },
  in_progress: { label: 'قيد التنفيذ', variant: 'info', icon: PlayCircle },
  delivered: { label: 'تم التسليم', variant: 'purple', icon: Truck },
  completed: { label: 'مكتمل', variant: 'success', icon: CheckCircle2 },
  cancelled: { label: 'ملغي', variant: 'error', icon: XCircle },
  disputed: { label: 'نزاع', variant: 'error', icon: AlertTriangle },
};

const timelineSteps = [
  { key: 'pending', label: 'تم الإنشاء' },
  { key: 'in_progress', label: 'قيد التنفيذ' },
  { key: 'delivered', label: 'تم التسليم' },
  { key: 'completed', label: 'مكتمل' },
];

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Review form
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Cancel form
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchOrder = () => {
    if (!id) return;
    ordersApi
      .getOne(Number(id))
      .then(r => setOrder(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrder, [id]);

  const handleStatusUpdate = async (status: string, reason?: string) => {
    setActionLoading(true);
    try {
      await ordersApi.updateStatus(order.id, {
        status,
        cancelReason: reason || undefined,
      });
      toast({ title: 'تم تحديث حالة الطلب' });
      setShowCancel(false);
      fetchOrder();
    } catch (err: any) {
      toast({ title: err.response?.data?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    setReviewLoading(true);
    try {
      await reviewsApi.create({ orderId: order.id, rating, comment: comment.trim() || undefined });
      toast({ title: 'تم إرسال التقييم بنجاح!' });
      setShowReview(false);
      fetchOrder();
    } catch (err: any) {
      toast({ title: err.response?.data?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <div className="text-center py-20">
        <AlertTriangle size={40} className="mx-auto text-muted-foreground/30 mb-3" />
        <p className="font-semibold">الطلب غير موجود</p>
        <Link to="/dashboard/orders" className="text-sm text-primary hover:underline mt-2 inline-block">
          العودة للطلبات
        </Link>
      </div>
    );
  }

  const sc = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = sc.icon;
  const isBuyer = user?.role === 'buyer';
  const isSeller = user?.role === 'seller';

  // Determine current step index for timeline
  const stepOrder = ['pending', 'in_progress', 'delivered', 'completed'];
  const isCancelled = order.status === 'cancelled' || order.status === 'disputed';
  const currentStepIdx = stepOrder.indexOf(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          to={isBuyer ? '/dashboard/orders' : '/dashboard'}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowRight size={16} />
          {isBuyer ? 'طلباتي' : 'الرئيسية'}
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-lg font-extrabold">طلب #{order.id}</h1>
        <StatusBadge variant={sc.variant} label={sc.label} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status timeline */}
          {!isCancelled && (
            <div className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04]">
              <h3 className="text-sm font-bold mb-5">حالة الطلب</h3>
              <div className="flex items-center justify-between relative">
                {/* Line */}
                <div className="absolute top-4 right-4 left-4 h-0.5 bg-muted -z-0" />
                <div
                  className="absolute top-4 right-4 h-0.5 bg-primary transition-all -z-0"
                  style={{
                    width: `${Math.max(0, currentStepIdx / (timelineSteps.length - 1)) * 100}%`,
                  }}
                />

                {timelineSteps.map((step, idx) => {
                  const done = idx <= currentStepIdx;
                  const active = idx === currentStepIdx;
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          done
                            ? 'bg-primary text-white shadow-md shadow-primary/25'
                            : 'bg-white ring-2 ring-muted text-muted-foreground'
                        } ${active ? 'scale-110' : ''}`}
                      >
                        {done ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cancelled banner */}
          {isCancelled && (
            <div className="bg-red-50 rounded-2xl p-5 ring-1 ring-red-200/50">
              <div className="flex items-center gap-3">
                <XCircle size={20} className="text-red-500" />
                <div>
                  <p className="font-bold text-sm text-red-700">
                    {order.status === 'cancelled' ? 'تم إلغاء هذا الطلب' : 'هذا الطلب في نزاع'}
                  </p>
                  {order.cancelReason && (
                    <p className="text-xs text-red-600 mt-1">السبب: {order.cancelReason}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Service details */}
          <div className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04]">
            <h3 className="text-sm font-bold mb-4">تفاصيل الخدمة</h3>
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted/30 shrink-0">
                {order.service?.image ? (
                  <img
                    src={`${API_BASE}${order.service.image}`}
                    alt={order.service?.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Package size={20} className="text-muted-foreground/20" />
                  </div>
                )}
              </div>
              <div>
                <Link
                  to={`/services/${order.serviceId}`}
                  className="font-bold text-sm hover:text-primary transition-colors"
                >
                  {order.service?.title || `خدمة #${order.serviceId}`}
                </Link>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBuyer ? `البائع: ${order.seller?.name}` : `المشتري: ${order.buyer?.name}`}
                </p>
              </div>
            </div>

            {/* Extras */}
            {order.selectedExtras?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/40">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">الإضافات المختارة:</h4>
                <div className="space-y-1">
                  {order.selectedExtras.map((extra: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{extra.name}</span>
                      <span className="font-semibold">{Number(extra.price).toFixed(0)} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buyer notes */}
            {order.buyerNotes && (
              <div className="mt-4 pt-4 border-t border-border/40">
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">ملاحظات المشتري:</h4>
                <p className="text-sm bg-[#f8f9fb] p-3 rounded-xl">{order.buyerNotes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04] space-y-3">
            <h3 className="text-sm font-bold mb-2">إجراءات</h3>

            {/* Buyer: Accept delivery → complete */}
            {isBuyer && order.status === 'delivered' && (
              <Button
                onClick={() => handleStatusUpdate('completed')}
                disabled={actionLoading}
                className="w-full sm:w-auto h-10 rounded-xl bg-gradient-to-l from-primary to-secondary text-white"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin ml-2" /> : <CheckCircle2 size={16} className="ml-2" />}
                قبول التسليم وإتمام الطلب
              </Button>
            )}

            {/* Seller: Accept order → in_progress */}
            {isSeller && order.status === 'pending' && (
              <Button
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={actionLoading}
                className="w-full sm:w-auto h-10 rounded-xl bg-gradient-to-l from-primary to-secondary text-white"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin ml-2" /> : <PlayCircle size={16} className="ml-2" />}
                قبول الطلب وبدء التنفيذ
              </Button>
            )}

            {/* Seller: Deliver */}
            {isSeller && order.status === 'in_progress' && (
              <Button
                onClick={() => handleStatusUpdate('delivered')}
                disabled={actionLoading}
                className="w-full sm:w-auto h-10 rounded-xl bg-gradient-to-l from-primary to-secondary text-white"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin ml-2" /> : <Truck size={16} className="ml-2" />}
                تسليم الطلب
              </Button>
            )}

            {/* Cancel (buyer: pending only, seller pending/in_progress) */}
            {((isBuyer && order.status === 'pending') ||
              (isSeller && ['pending', 'in_progress'].includes(order.status))) && (
              <>
                {!showCancel ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancel(true)}
                    className="w-full sm:w-auto h-10 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle size={16} className="ml-2" />
                    إلغاء الطلب
                  </Button>
                ) : (
                  <div className="space-y-3 p-4 rounded-xl bg-red-50/50 ring-1 ring-red-100">
                    <Textarea
                      placeholder="سبب الإلغاء..."
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                      className="min-h-[70px] text-sm rounded-xl"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStatusUpdate('cancelled', cancelReason)}
                        disabled={actionLoading}
                        className="h-9 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        {actionLoading && <Loader2 size={14} className="animate-spin ml-1" />}
                        تأكيد الإلغاء
                      </Button>
                      <Button variant="ghost" onClick={() => setShowCancel(false)} className="h-9 text-sm">
                        تراجع
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Review (buyer + completed + not reviewed) */}
            {isBuyer && order.status === 'completed' && !order.isReviewed && (
              <>
                {!showReview ? (
                  <Button
                    onClick={() => setShowReview(true)}
                    className="w-full sm:w-auto h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Star size={16} className="ml-2" />
                    أضف تقييمك
                  </Button>
                ) : (
                  <div className="space-y-4 p-4 rounded-xl bg-amber-50/50 ring-1 ring-amber-100">
                    <div>
                      <p className="text-sm font-semibold mb-2">التقييم:</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(v => (
                          <button key={v} onClick={() => setRating(v)}>
                            <Star
                              size={28}
                              className={`cursor-pointer transition-colors ${
                                v <= rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/20'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="اكتب تعليقك (اختياري)..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="min-h-[70px] text-sm rounded-xl"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleReview}
                        disabled={reviewLoading}
                        className="h-9 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm"
                      >
                        {reviewLoading && <Loader2 size={14} className="animate-spin ml-1" />}
                        إرسال التقييم
                      </Button>
                      <Button variant="ghost" onClick={() => setShowReview(false)} className="h-9 text-sm">
                        تراجع
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Already reviewed */}
            {isBuyer && order.isReviewed && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl">
                <CheckCircle2 size={16} />
                <span>تم إرسال تقييمك لهذا الطلب</span>
              </div>
            )}

            {/* No actions */}
            {order.status === 'completed' && order.isReviewed && isBuyer && null}
            {isCancelled && (
              <p className="text-sm text-muted-foreground">لا توجد إجراءات متاحة لهذا الطلب</p>
            )}
          </div>
        </div>

        {/* Sidebar - Order summary */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04]">
            <h3 className="text-sm font-bold mb-4">ملخص الطلب</h3>
            <div className="space-y-3">
              <InfoRow label="رقم الطلب" value={`#${order.id}`} />
              <InfoRow label="سعر الخدمة" value={`${Number(order.amount).toFixed(0)} ج.م`} />
              {Number(order.extrasAmount) > 0 && (
                <InfoRow label="الإضافات" value={`${Number(order.extrasAmount).toFixed(0)} ج.م`} />
              )}
              <div className="pt-2 border-t border-border/40">
                <InfoRow
                  label="الإجمالي"
                  value={
                    <span className="text-base font-extrabold text-primary">
                      {Number(order.totalAmount).toFixed(0)} ج.م
                    </span>
                  }
                />
              </div>
              <InfoRow label="مدة التسليم" value={`${order.deliveryDays} أيام`} />
              <InfoRow
                label="تاريخ الطلب"
                value={new Date(order.createdAt).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
              {order.completedAt && (
                <InfoRow
                  label="تاريخ الإتمام"
                  value={new Date(order.completedAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
              )}
            </div>
          </div>

          {/* Counterparty info */}
          <div className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04]">
            <h3 className="text-sm font-bold mb-4">{isBuyer ? 'البائع' : 'المشتري'}</h3>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-bl from-primary to-secondary flex items-center justify-center text-white font-bold">
                {(isBuyer ? order.seller?.name : order.buyer?.name)?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-bold text-sm">{isBuyer ? order.seller?.name : order.buyer?.name}</p>
                <p className="text-xs text-muted-foreground">{isBuyer ? order.seller?.email : order.buyer?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
