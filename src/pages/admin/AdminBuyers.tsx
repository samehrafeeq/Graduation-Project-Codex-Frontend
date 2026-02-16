import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { adminApi } from '@/lib/api';
import { User, Mail, Phone } from 'lucide-react';

const AdminBuyers = () => {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const res = await adminApi.getAllBuyers();
      setBuyers(res.data);
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

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">إدارة المشترين</h1>
          <p className="text-gray-400 mt-1">عرض المشترين المسجلين في المنصة</p>
        </div>

        <div className="space-y-4">
          {buyers.length === 0 ? (
            <Card className="border-0 bg-gray-800">
              <CardContent className="p-12 text-center">
                <User size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">لا يوجد مشترين مسجلين حالياً</p>
              </CardContent>
            </Card>
          ) : (
            buyers.map((buyer) => (
              <Card key={buyer.id} className="border-0 bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {buyer.name?.charAt(0) || '؟'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{buyer.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail size={14} /> {buyer.email}
                        </span>
                        <span className="text-sm text-gray-400 flex items-center gap-1" dir="ltr">
                          <Phone size={14} /> {buyer.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400">
                          نشط
                        </span>
                        <span className={`text-xs ${buyer.isPhoneVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                          {buyer.isPhoneVerified ? 'الهاتف محقق ✓' : 'الهاتف غير محقق'}
                        </span>
                        <span className="text-xs text-gray-500">
                          تسجيل: {new Date(buyer.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBuyers;
