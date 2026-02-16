import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { kycApi } from '@/lib/api';
import { ShieldCheck, Clock, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

const VerificationPage = () => {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const res = await kycApi.getStatus();
      setKycStatus(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = () => {
    if (!kycStatus) return null;

    switch (kycStatus.status) {
      case 'verified':
        return {
          icon: <CheckCircle2 size={48} className="text-green-500" />,
          title: 'تم التحقق من هويتك',
          description: 'هويتك محققة بنجاح. يمكنك الآن استخدام جميع ميزات المنصة.',
          color: 'bg-green-50 border-green-200',
          textColor: 'text-green-700',
          badge: 'محققة ✓',
          badgeColor: 'bg-green-100 text-green-700',
        };
      case 'pending':
        return {
          icon: <Clock size={48} className="text-yellow-500" />,
          title: 'قيد المراجعة',
          description: 'تم استلام وثائقك وهي قيد المراجعة من قبل فريق الإدارة. سيتم إعلامك عند اكتمال المراجعة.',
          color: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-700',
          badge: 'قيد المراجعة',
          badgeColor: 'bg-yellow-100 text-yellow-700',
        };
      case 'rejected':
        return {
          icon: <XCircle size={48} className="text-red-500" />,
          title: 'تم رفض التحقق',
          description: kycStatus.rejectionReason || 'تم رفض وثائق التحقق. يرجى التواصل مع الدعم.',
          color: 'bg-red-50 border-red-200',
          textColor: 'text-red-700',
          badge: 'مرفوضة',
          badgeColor: 'bg-red-100 text-red-700',
        };
      default:
        return {
          icon: <AlertCircle size={48} className="text-gray-400" />,
          title: 'لم يتم تقديم وثائق',
          description: 'لم يتم تقديم وثائق التحقق من الهوية بعد.',
          color: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-600',
          badge: 'غير مقدمة',
          badgeColor: 'bg-gray-100 text-gray-600',
        };
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">حالة التحقق من الهوية</h1>
          <p className="text-muted-foreground mt-1">متابعة حالة توثيق هويتك</p>
        </div>

        {statusDisplay && (
          <Card className={`border shadow-md ${statusDisplay.color}`}>
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">{statusDisplay.icon}</div>
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 ${statusDisplay.badgeColor}`}
              >
                {statusDisplay.badge}
              </span>
              <h2 className={`text-xl font-bold mb-2 ${statusDisplay.textColor}`}>
                {statusDisplay.title}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {statusDisplay.description}
              </p>

              {kycStatus?.reviewedAt && (
                <p className="text-sm text-muted-foreground mt-4">
                  تاريخ المراجعة:{' '}
                  {new Date(kycStatus.reviewedAt).toLocaleDateString('ar-SA')}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="border-0 shadow-md mt-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-primary mt-0.5" />
              <div>
                <h3 className="font-bold text-foreground mb-1">لماذا التحقق من الهوية؟</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  التحقق من الهوية يضمن بيئة آمنة وموثوقة لجميع المستخدمين. يساعد في حماية حقوقك
                  ويزيد من ثقة العملاء بخدماتك.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VerificationPage;
