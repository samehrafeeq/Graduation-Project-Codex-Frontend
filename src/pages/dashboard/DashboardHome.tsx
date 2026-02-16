import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { User, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            مرحباً، {user?.name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'buyer'
              ? 'مرحباً بك في لوحة تحكم المشتري'
              : 'مرحباً بك في لوحة تحكم البائع'}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نوع الحساب</p>
                  <p className="text-lg font-bold text-foreground">
                    {user?.role === 'buyer' ? 'مشتري' : 'بائع خدمات'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    user?.status === 'active'
                      ? 'bg-green-50 text-green-600'
                      : user?.status === 'pending'
                      ? 'bg-yellow-50 text-yellow-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {user?.status === 'active' ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Clock size={24} />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">حالة الحساب</p>
                  <p className="text-lg font-bold text-foreground">
                    {user?.status === 'active'
                      ? 'نشط'
                      : user?.status === 'pending'
                      ? 'قيد المراجعة'
                      : 'معلق'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.role === 'seller' && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      user?.kyc?.status === 'verified'
                        ? 'bg-green-50 text-green-600'
                        : user?.kyc?.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-600'
                        : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">حالة الهوية</p>
                    <p className="text-lg font-bold text-foreground">
                      {user?.kyc?.status === 'verified'
                        ? 'محققة ✓'
                        : user?.kyc?.status === 'pending'
                        ? 'قيد المراجعة'
                        : user?.kyc?.status === 'rejected'
                        ? 'مرفوضة'
                        : 'غير مقدمة'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Section */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">معلومات الحساب</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">الاسم</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">البريد الإلكتروني</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">رقم الهاتف</span>
                <span className="font-medium" dir="ltr">{user?.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">تحقق الهاتف</span>
                <span className={`font-medium ${user?.isPhoneVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user?.isPhoneVerified ? 'محقق ✓' : 'غير محقق'}
                </span>
              </div>
              {user?.country && (
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">الدولة / المدينة</span>
                  <span className="font-medium">{user.country}{user.city ? ` - ${user.city}` : ''}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
