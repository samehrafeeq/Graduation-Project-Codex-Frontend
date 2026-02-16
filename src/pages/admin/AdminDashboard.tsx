import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { adminApi } from '@/lib/api';
import { Users, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      label: 'إجمالي المشترين',
      value: stats?.totalBuyers || 0,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      label: 'إجمالي البائعين',
      value: stats?.totalSellers || 0,
      icon: UserCheck,
      color: 'bg-purple-500/10 text-purple-400',
    },
    {
      label: 'بائعون بانتظار الموافقة',
      value: stats?.pendingSellers || 0,
      icon: Clock,
      color: 'bg-yellow-500/10 text-yellow-400',
    },
    {
      label: 'بائعون نشطون',
      value: stats?.activeSellers || 0,
      icon: CheckCircle2,
      color: 'bg-green-500/10 text-green-400',
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-gray-400 mt-1">نظرة عامة على المنصة</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <Card key={i} className="border-0 bg-gray-800 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                    <card.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{card.label}</p>
                    <p className="text-2xl font-bold text-white">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
