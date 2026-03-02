import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { adminApi } from '@/lib/api';
import { Users, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then((r) => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { label: 'إجمالي المشترين', value: stats?.totalBuyers || 0, icon: Users, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'إجمالي البائعين', value: stats?.totalSellers || 0, icon: UserCheck, color: 'bg-purple-500/10 text-purple-600' },
    { label: 'بانتظار الموافقة', value: stats?.pendingSellers || 0, icon: Clock, color: 'bg-amber-500/10 text-amber-600' },
    { label: 'بائعون نشطون', value: stats?.activeSellers || 0, icon: CheckCircle2, color: 'bg-green-500/10 text-green-600' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-1">نظرة عامة على المنصة</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 ring-1 ring-black/[0.04] shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
