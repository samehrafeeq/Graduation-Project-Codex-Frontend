import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { PageHeader, DataCard, PageLoader, StatusBadge } from '@/components/dashboard';
import { kycApi } from '@/lib/api';
import { ShieldCheck, Clock, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

type KycVariant = 'success' | 'warning' | 'error' | 'neutral';

interface StatusDisplay {
  icon: typeof CheckCircle2;
  variant: KycVariant;
  title: string;
  description: string;
  badge: string;
  bgClass: string;
  iconColor: string;
  titleColor: string;
}

const statusMap: Record<string, Omit<StatusDisplay, 'description'>> = {
  verified: { icon: CheckCircle2, variant: 'success', title: 'تم التحقق من هويتك',   badge: 'محققة',       bgClass: 'bg-green-50',  iconColor: 'text-green-500', titleColor: 'text-green-700' },
  pending:  { icon: Clock,        variant: 'warning', title: 'قيد المراجعة',           badge: 'قيد المراجعة', bgClass: 'bg-yellow-50', iconColor: 'text-yellow-500', titleColor: 'text-yellow-700' },
  rejected: { icon: XCircle,      variant: 'error',   title: 'تم رفض التحقق',          badge: 'مرفوضة',      bgClass: 'bg-red-50',    iconColor: 'text-red-500', titleColor: 'text-red-700' },
};

const defaultStatus: Omit<StatusDisplay, 'description'> = {
  icon: AlertCircle, variant: 'neutral', title: 'لم يتم تقديم وثائق', badge: 'غير مقدمة', bgClass: 'bg-muted/30', iconColor: 'text-muted-foreground', titleColor: 'text-muted-foreground',
};

const descMap: Record<string, string> = {
  verified: 'هويتك محققة بنجاح. يمكنك الآن استخدام جميع ميزات المنصة.',
  pending:  'تم استلام وثائقك وهي قيد المراجعة من قبل فريق الإدارة. سيتم إعلامك عند اكتمال المراجعة.',
  default:  'لم يتم تقديم وثائق التحقق من الهوية بعد.',
};

const VerificationPage = () => {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchKycStatus(); }, []);

  const fetchKycStatus = async () => {
    try { const res = await kycApi.getStatus(); setKycStatus(res.data); }
    catch { /* */ }
    finally { setLoading(false); }
  };

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  const st = statusMap[kycStatus?.status] || defaultStatus;
  const Icon = st.icon;
  const description = kycStatus?.status === 'rejected'
    ? (kycStatus.rejectionReason || 'تم رفض وثائق التحقق. يرجى التواصل مع الدعم.')
    : (descMap[kycStatus?.status] || descMap.default);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader title="حالة التحقق من الهوية" description="متابعة حالة توثيق هويتك" />

        {/* Status card */}
        <div className={`rounded-2xl ${st.bgClass} ring-1 ring-black/[0.04] p-8 text-center space-y-4`}>
          <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/70 mx-auto ${st.iconColor}`}>
            <Icon size={32} />
          </div>
          <StatusBadge label={st.badge} variant={st.variant} />
          <h2 className={`text-xl font-bold ${st.titleColor}`}>{st.title}</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">{description}</p>
          {kycStatus?.reviewedAt && (
            <p className="text-[12px] text-muted-foreground/70 pt-2">
              تاريخ المراجعة: {new Date(kycStatus.reviewedAt).toLocaleDateString('ar-SA')}
            </p>
          )}
        </div>

        {/* Info card */}
        <DataCard>
          <div className="flex items-start gap-3">
            <div className="shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 text-primary">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold">لماذا التحقق من الهوية؟</h3>
              <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                التحقق من الهوية يضمن بيئة آمنة وموثوقة لجميع المستخدمين. يساعد في حماية حقوقك
                ويزيد من ثقة العملاء بخدماتك.
              </p>
            </div>
          </div>
        </DataCard>
      </div>
    </DashboardLayout>
  );
};

export default VerificationPage;
