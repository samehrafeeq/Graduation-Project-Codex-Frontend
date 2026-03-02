import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { servicesApi, reviewsApi, ordersApi, chatApi, walletApi } from '@/lib/api';
import { useOnlineStatus, formatLastSeen } from '@/hooks/useOnlineStatus';
import {
  Star,
  Clock,
  ShoppingCart,
  User,
  ArrowRight,
  Loader2,
  Package,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  CircleDot,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isOnline } = useOnlineStatus();

  const [service, setService] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewSummary, setReviewSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  const [contactLoading, setContactLoading] = useState(false);

  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [buyerNotes, setBuyerNotes] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [buyerBalance, setBuyerBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const sid = Number(id);
    setLoading(true);
    Promise.all([
      servicesApi.getOnePublic(sid).then(r => setService(r.data)),
      reviewsApi.getByService(sid).then(r => setReviews(r.data)).catch(() => {}),
      reviewsApi.getSummary(sid).then(r => setReviewSummary(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [id]);

  // جلب رصيد المشتري
  useEffect(() => {
    if (user?.role === 'buyer') {
      walletApi.getMyWallet()
        .then(r => setBuyerBalance(Number(r.data.availableBalance)))
        .catch(() => {});
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]" dir="rtl">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]" dir="rtl">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <AlertCircle size={48} className="text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold">الخدمة غير موجودة</h2>
          <Link to="/services" className="text-primary text-sm mt-3 hover:underline">
            العودة لتصفح الخدمات
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = service.discountPrice && new Date(service.discountEndsAt) > new Date();
  const basePrice = hasDiscount ? Number(service.discountPrice) : Number(service.price);
  const extrasTotal = selectedExtras.reduce((sum, idx) => {
    return sum + Number(service.extras?.[idx]?.price || 0);
  }, 0);
  const totalPrice = basePrice + extrasTotal;
  const totalDays =
    service.deliveryDays +
    selectedExtras.reduce((sum, idx) => sum + (Number(service.extras?.[idx]?.extraDeliveryDays) || 0), 0);

  const toggleExtra = (idx: number) => {
    setSelectedExtras(prev => (prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]));
  };

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'buyer') {
      toast({ title: 'هذه الميزة متاحة للمشترين فقط', variant: 'destructive' });
      return;
    }
    setContactLoading(true);
    try {
      const res = await chatApi.startConversation({
        sellerId: service.sellerId,
        serviceId: service.id,
        message: `مرحباً، أريد الاستفسار عن خدمة: ${service.title}`,
      });
      navigate(`/dashboard/chat?id=${res.data.id}`);
    } catch (err: any) {
      toast({ title: err.response?.data?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setContactLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'buyer') {
      toast({ title: 'هذه الخدمة متاحة للمشترين فقط', variant: 'destructive' });
      return;
    }

    setOrdering(true);
    try {
      const extras = selectedExtras.map(idx => ({
        name: service.extras[idx].name,
        price: Number(service.extras[idx].price),
        extraDeliveryDays: Number(service.extras[idx].extraDeliveryDays || 0),
      }));
      await ordersApi.create({
        serviceId: service.id,
        selectedExtras: extras.length ? extras : undefined,
        buyerNotes: buyerNotes.trim() || undefined,
      });
      toast({ title: 'تم إنشاء الطلب بنجاح!' });
      navigate('/dashboard/orders');
    } catch (err: any) {
      toast({
        title: err.response?.data?.message || 'حدث خطأ أثناء إنشاء الطلب',
        variant: 'destructive',
      });
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/services" className="hover:text-primary transition-colors">
            تصفح الخدمات
          </Link>
          <span>/</span>
          {service.category && (
            <>
              <Link
                to={`/services?category=${service.categoryId}`}
                className="hover:text-primary transition-colors"
              >
                {service.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground font-medium truncate max-w-xs">{service.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-white ring-1 ring-black/[0.04] aspect-video">
              {service.image ? (
                <img
                  src={`${API_BASE}${service.image}`}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Package size={64} className="text-muted-foreground/15" />
                </div>
              )}
            </div>

            {/* Title & meta */}
            <div className="bg-white rounded-2xl p-6 ring-1 ring-black/[0.04]">
              <h1 className="text-xl font-extrabold mb-3">{service.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
                {service.averageRating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-foreground">{Number(service.averageRating).toFixed(1)}</span>
                    <span>({service.totalReviews} تقييم)</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  مدة التسليم: {service.deliveryDays} أيام
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingCart size={14} />
                  {service.totalOrders || 0} طلب
                </span>
              </div>

              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {service.description}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 ring-1 ring-black/[0.04]">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                التقييمات
                {reviewSummary && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({reviewSummary.totalReviews} تقييم)
                  </span>
                )}
              </h2>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-sm py-6 text-center">لا توجد تقييمات بعد</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="flex gap-3 p-4 rounded-xl bg-[#f8f9fb]">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-bl from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {r.buyer?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{r.buyer?.name}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={11}
                                className={i < r.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/20'}
                              />
                            ))}
                          </div>
                        </div>
                        {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Sidebar (Seller + Order CTA) */}
          <div className="space-y-5">
            {/* Seller card */}
            <div className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04]">
              <h3 className="text-sm font-bold mb-4">عن البائع</h3>
              <Link to={`/profile/${service.sellerId}`} className="flex items-center gap-3 group">
                <div className="relative shrink-0">
                  {service.seller?.avatar ? (
                    <img
                      src={`${API_BASE}/uploads/avatars/${service.seller.avatar}`}
                      alt={service.seller.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-bl from-primary to-secondary flex items-center justify-center text-white text-lg font-bold">
                      {service.seller?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  {/* Online dot */}
                  <div
                    className={`absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                      service.seller?.isOnline || isOnline(service.sellerId)
                        ? 'bg-emerald-500'
                        : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm group-hover:text-primary transition-colors">{service.seller?.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <CircleDot
                      size={10}
                      className={
                        service.seller?.isOnline || isOnline(service.sellerId)
                          ? 'text-emerald-500'
                          : 'text-gray-400'
                      }
                    />
                    <span className={`text-xs ${
                      service.seller?.isOnline || isOnline(service.sellerId)
                        ? 'text-emerald-600'
                        : 'text-muted-foreground'
                    }`}>
                      {service.seller?.isOnline || isOnline(service.sellerId)
                        ? 'متصل الآن'
                        : `آخر ظهور ${formatLastSeen(service.seller?.lastSeen)}`}
                    </span>
                  </div>
                  {service.seller?.bio && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{service.seller.bio}</p>
                  )}
                </div>
              </Link>
              <Button
                onClick={handleContactSeller}
                disabled={contactLoading}
                variant="outline"
                className="w-full mt-4 h-10 rounded-xl text-sm"
              >
                <MessageSquare size={14} className="ml-2" />
                {contactLoading ? 'جاري التحميل...' : 'تواصل مع البائع'}
              </Button>
            </div>

            {/* Order card */}
            <div className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04] sticky top-24">
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-2xl font-extrabold text-primary">
                  {basePrice.toFixed(0)}
                </span>
                <span className="text-sm text-muted-foreground">ج.م</span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through mr-1">
                    {Number(service.price).toFixed(0)}
                  </span>
                )}
              </div>

              {/* Extras */}
              {service.extras?.length > 0 && (
                <div className="mb-5 space-y-3">
                  <h4 className="text-sm font-semibold">إضافات متاحة:</h4>
                  {service.extras.map((extra: any, idx: number) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedExtras.includes(idx) ? 'bg-primary/5 ring-1 ring-primary/20' : 'bg-[#f8f9fb]'
                      }`}
                    >
                      <Checkbox
                        checked={selectedExtras.includes(idx)}
                        onCheckedChange={() => toggleExtra(idx)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{extra.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          +{Number(extra.price).toFixed(0)} ج.م
                          {extra.extraDeliveryDays > 0 && ` · +${extra.extraDeliveryDays} أيام`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Summary */}
              <div className="space-y-2 text-sm border-t border-border/40 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">مدة التسليم</span>
                  <span className="font-semibold">{totalDays} أيام</span>
                </div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الإضافات</span>
                    <span className="font-semibold">+{extrasTotal.toFixed(0)} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-border/40">
                  <span>الإجمالي</span>
                  <span className="text-primary">{totalPrice.toFixed(0)} ج.م</span>
                </div>
                {/* رصيد المشتري */}
                {user?.role === 'buyer' && buyerBalance !== null && (
                  <div className="flex justify-between pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">رصيدك</span>
                    <span className={`font-bold ${
                      buyerBalance >= totalPrice ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {buyerBalance.toFixed(0)} ج.م
                    </span>
                  </div>
                )}
              </div>

              {/* تحذير رصيد غير كافي */}
              {user?.role === 'buyer' && buyerBalance !== null && buyerBalance < totalPrice && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-center">
                  <p className="text-sm text-red-600 font-medium">
                    رصيدك غير كافٍ لإتمام هذا الطلب
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    ينقصك {(totalPrice - buyerBalance).toFixed(0)} ج.م — تواصل مع الإدارة لشحن رصيدك
                  </p>
                </div>
              )}

              {/* Order button */}
              {!showOrderForm ? (
                <Button
                  onClick={() => {
                    if (!user) {
                      navigate('/login');
                      return;
                    }
                    if (user.role === 'buyer' && buyerBalance !== null && buyerBalance < totalPrice) {
                      toast({ title: 'رصيدك غير كافٍ لإتمام هذا الطلب', variant: 'destructive' });
                      return;
                    }
                    setShowOrderForm(true);
                  }}
                  disabled={user?.role === 'buyer' && buyerBalance !== null && buyerBalance < totalPrice}
                  className="w-full h-11 rounded-xl bg-gradient-to-l from-primary to-secondary text-white font-bold text-sm disabled:opacity-50"
                >
                  <ShoppingCart size={16} className="ml-2" />
                  اطلب الآن
                </Button>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="ملاحظات للبائع (اختياري)..."
                    value={buyerNotes}
                    onChange={e => setBuyerNotes(e.target.value)}
                    className="rounded-xl min-h-[80px] text-sm"
                  />
                  <Button
                    onClick={handleOrder}
                    disabled={ordering}
                    className="w-full h-11 rounded-xl bg-gradient-to-l from-primary to-secondary text-white font-bold text-sm"
                  >
                    {ordering ? (
                      <Loader2 size={16} className="animate-spin ml-2" />
                    ) : (
                      <CheckCircle2 size={16} className="ml-2" />
                    )}
                    {ordering ? 'جارٍ الإنشاء...' : 'تأكيد الطلب'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowOrderForm(false)}
                    className="w-full text-sm text-muted-foreground"
                  >
                    إلغاء
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
