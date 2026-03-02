import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usersApi, servicesApi, chatApi, reviewsApi } from '@/lib/api';
import { useOnlineStatus, formatLastSeen } from '@/hooks/useOnlineStatus';
import {
  User,
  MapPin,
  Calendar,
  Star,
  Clock,
  ShoppingCart,
  Package,
  Loader2,
  AlertCircle,
  MessageSquare,
  CircleDot,
  ArrowRight,
  Briefcase,
  Eye,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isOnline } = useOnlineStatus();

  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const userId = Number(id);
    setLoading(true);
    Promise.all([
      usersApi.getPublicProfile(userId).then(r => setProfile(r.data)),
      servicesApi.getSellerPublic(userId).then(r => setServices(r.data)).catch(() => setServices([])),
    ]).finally(() => setLoading(false));
  }, [id]);

  const handleContact = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'buyer') {
      toast({ title: 'التواصل متاح للمشترين فقط', variant: 'destructive' });
      return;
    }
    setContactLoading(true);
    try {
      const res = await chatApi.startConversation({
        sellerId: Number(id),
        message: `مرحباً، أود التواصل معك`,
      });
      navigate(`/dashboard/chat?id=${res.data.id}`);
    } catch (err: any) {
      toast({ title: err.response?.data?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setContactLoading(false);
    }
  };

  const userIsOnline = profile?.isOnline || isOnline(Number(id));

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]" dir="rtl">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <AlertCircle size={48} className="text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold">المستخدم غير موجود</h2>
          <Link to="/" className="text-primary text-sm mt-3 hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
  });
  const roleLabel = profile.role === 'seller' ? 'بائع' : profile.role === 'buyer' ? 'مشتري' : 'مستخدم';

  return (
    <div className="min-h-screen bg-[#f8f9fb]" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        {/* ===== Profile Header Card ===== */}
        <div className="relative bg-white rounded-3xl ring-1 ring-black/[0.04] overflow-hidden mb-8">
          {/* Cover gradient */}
          <div className="h-36 bg-gradient-to-l from-primary/80 via-primary to-secondary" />

          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar + basic info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-28 w-28 rounded-2xl bg-white p-1 shadow-lg">
                  {profile.avatar ? (
                    <img
                      src={`${API_BASE}/uploads/avatars/${profile.avatar}`}
                      alt={profile.name}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-xl bg-gradient-to-bl from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                      {profile.name?.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Online indicator */}
                <div
                  className={`absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-[3px] border-white ${
                    userIsOnline ? 'bg-emerald-500' : 'bg-gray-400'
                  }`}
                />
              </div>

              {/* Name & meta */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-extrabold">{profile.name}</h1>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      profile.role === 'seller'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Briefcase size={12} className="ml-1" />
                    {roleLabel}
                  </Badge>
                </div>

                {/* Online/Last Seen */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <CircleDot
                    size={13}
                    className={userIsOnline ? 'text-emerald-500' : 'text-gray-400'}
                  />
                  <span className={`text-sm ${userIsOnline ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}`}>
                    {userIsOnline ? 'متصل الآن' : `آخر ظهور ${formatLastSeen(profile.lastSeen)}`}
                  </span>
                </div>

                {/* Location + Member since */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                  {(profile.country || profile.city) && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {[profile.city, profile.country].filter(Boolean).join('، ')}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    عضو منذ {memberSince}
                  </span>
                </div>
              </div>

              {/* Contact button (for sellers only, visible to buyers) */}
              {profile.role === 'seller' && currentUser?.id !== Number(id) && (
                <div className="shrink-0 pb-1">
                  <Button
                    onClick={handleContact}
                    disabled={contactLoading}
                    className="rounded-xl bg-gradient-to-l from-primary to-secondary text-white px-6 h-10"
                  >
                    <MessageSquare size={16} className="ml-2" />
                    {contactLoading ? 'جاري...' : 'تواصل معي'}
                  </Button>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mt-6 bg-[#f8f9fb] rounded-xl p-5">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===== Stats Cards (for sellers) ===== */}
        {profile.role === 'seller' && services.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={<Package size={20} className="text-primary" />}
              label="الخدمات"
              value={services.length}
            />
            <StatsCard
              icon={<ShoppingCart size={20} className="text-emerald-500" />}
              label="إجمالي الطلبات"
              value={services.reduce((s, sv) => s + (sv.totalOrders || 0), 0)}
            />
            <StatsCard
              icon={<Star size={20} className="text-amber-500" />}
              label="متوسط التقييم"
              value={
                services.filter(s => s.averageRating > 0).length > 0
                  ? (
                      services.reduce((s, sv) => s + Number(sv.averageRating || 0), 0) /
                      services.filter(s => s.averageRating > 0).length
                    ).toFixed(1)
                  : '—'
              }
            />
            <StatsCard
              icon={<Eye size={20} className="text-blue-500" />}
              label="التقييمات"
              value={services.reduce((s, sv) => s + (sv.totalReviews || 0), 0)}
            />
          </div>
        )}

        {/* ===== Services Grid (for sellers) ===== */}
        {profile.role === 'seller' && (
          <div>
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Package size={20} className="text-primary" />
              خدمات {profile.name}
            </h2>

            {services.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center ring-1 ring-black/[0.04]">
                <Package size={40} className="mx-auto text-muted-foreground/20 mb-3" />
                <p className="text-muted-foreground">لا توجد خدمات حالياً</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((service: any) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== Buyer profile (simpler) ===== */}
        {profile.role === 'buyer' && (
          <div className="bg-white rounded-2xl p-8 ring-1 ring-black/[0.04] text-center">
            <User size={40} className="mx-auto text-muted-foreground/20 mb-3" />
            <p className="text-muted-foreground">هذا الملف الشخصي لمشتري</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

/* ===== Stats Card ===== */
function StatsCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04] text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

/* ===== Service Card ===== */
function ServiceCard({ service }: { service: any }) {
  const hasDiscount = service.discountPrice && new Date(service.discountEndsAt) > new Date();

  return (
    <Link
      to={`/services/${service.id}`}
      className="group bg-white rounded-2xl ring-1 ring-black/[0.04] overflow-hidden hover:ring-primary/20 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-video bg-[#f8f9fb] overflow-hidden relative">
        {service.image ? (
          <img
            src={`${API_BASE}${service.image}`}
            alt={service.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package size={32} className="text-muted-foreground/15" />
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            خصم
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>

        {service.category && (
          <Badge variant="secondary" className="text-[10px] mb-3 bg-primary/5 text-primary">
            {service.category.name}
          </Badge>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          {service.averageRating > 0 && (
            <span className="flex items-center gap-1">
              <Star size={11} className="text-amber-500 fill-amber-500" />
              {Number(service.averageRating).toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {service.deliveryDays} أيام
          </span>
          <span className="flex items-center gap-1">
            <ShoppingCart size={11} />
            {service.totalOrders || 0}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 pt-3 border-t border-border/40">
          <span className="text-lg font-extrabold text-primary">
            {hasDiscount ? Number(service.discountPrice).toFixed(0) : Number(service.price).toFixed(0)}
          </span>
          <span className="text-xs text-muted-foreground">ج.م</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through mr-1">
              {Number(service.price).toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default UserProfile;
