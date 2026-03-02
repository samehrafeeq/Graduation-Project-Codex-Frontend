import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PageHeader, StatCard, DataCard, PageLoader } from '@/components/dashboard';
import { servicesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingCart,
  Star,
  BarChart3,
  FileText,
  Image,
  Zap,
  MessageCircle,
} from 'lucide-react';

const tips = [
  { icon: FileText,      color: 'blue',   title: 'أضف وصفاً تفصيلياً',     desc: 'الخدمات ذات الأوصاف التفصيلية تحقق مبيعات أعلى بنسبة 40%.' },
  { icon: Image,         color: 'green',  title: 'استخدم صور جذابة',        desc: 'الصور الاحترافية تزيد من نسبة الطلبات بشكل ملحوظ.' },
  { icon: Zap,           color: 'purple', title: 'سرعة التسليم',            desc: 'التسليم السريع يحسّن تقييمك ويجذب المزيد من العملاء.' },
  { icon: MessageCircle, color: 'amber',  title: 'تفاعل مع العملاء',        desc: 'الرد السريع على الاستفسارات يبني الثقة ويزيد المبيعات.' },
] as const;

const tipColors: Record<string, { bg: string; icon: string; title: string }> = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-500',   title: 'text-blue-700' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-500',  title: 'text-green-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-500', title: 'text-purple-700' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-500',  title: 'text-amber-700' },
};

const SellerStats = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await servicesApi.getMyStats();
      setStats(res.data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل الإحصائيات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="الإحصائيات" description="نظرة عامة على أداء خدماتك" />

        {/* Primary stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Package}      label="إجمالي الخدمات"  value={stats?.totalServices ?? 0}  color="blue" />
          <StatCard icon={CheckCircle}  label="خدمات فعّالة"    value={stats?.activeServices ?? 0} color="green" />
          <StatCard icon={Clock}        label="قيد المراجعة"    value={stats?.pendingServices ?? 0} color="yellow" />
          <StatCard icon={XCircle}      label="مرفوضة"          value={stats?.rejectedServices ?? 0} color="red" />
        </div>

        {/* Secondary stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={ShoppingCart} label="إجمالي الطلبات"  value={stats?.totalOrders ?? 0}   color="purple" />
          <StatCard icon={Star}         label="إجمالي التقييمات" value={stats?.totalReviews ?? 0}  color="amber" />
          <StatCard icon={BarChart3}    label="متوسط التقييم"   value={stats?.averageRating?.toFixed(1) ?? '0.0'} color="teal" />
        </div>

        {/* Tips */}
        <DataCard title="نصائح لتحسين أدائك" description="اتبع هذه النصائح لزيادة مبيعاتك وتحسين تقييمك">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip, i) => {
              const c = tipColors[tip.color];
              return (
                <div key={i} className={`flex items-start gap-3 rounded-xl ${c.bg} p-4`}>
                  <div className={`shrink-0 mt-0.5 ${c.icon}`}>
                    <tip.icon size={20} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${c.title}`}>{tip.title}</h4>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </DataCard>
      </div>
    </DashboardLayout>
  );
};

export default SellerStats;
