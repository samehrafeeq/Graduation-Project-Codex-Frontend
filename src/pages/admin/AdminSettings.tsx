import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { settingsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Settings, Percent, Clock, Banknote } from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [withdrawalHoldDays, setWithdrawalHoldDays] = useState<number>(14);
  const [minWithdrawalAmount, setMinWithdrawalAmount] = useState<number>(50);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await settingsApi.getAll();
      const settings = res.data;
      if (settings.commission_rate !== undefined)
        setCommissionRate(Number(settings.commission_rate));
      if (settings.withdrawal_hold_days !== undefined)
        setWithdrawalHoldDays(Number(settings.withdrawal_hold_days));
      if (settings.min_withdrawal_amount !== undefined)
        setMinWithdrawalAmount(Number(settings.min_withdrawal_amount));
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل الإعدادات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.updateMany({
        commission_rate: String(commissionRate),
        withdrawal_hold_days: String(withdrawalHoldDays),
        min_withdrawal_amount: String(minWithdrawalAmount),
      });
      toast({ title: 'تم', description: 'تم حفظ الإعدادات بنجاح' });
    } catch (err: any) {
      toast({
        title: 'خطأ',
        description: err.response?.data?.message || 'فشل حفظ الإعدادات',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Settings className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">إعدادات المنصة</h1>
            <p className="text-muted-foreground mt-1">تخصيص العمولة والسحب والحد الأدنى</p>
          </div>
        </div>

        {/* Commission */}
        <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Percent size={20} className="text-primary" />
              نسبة العمولة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              النسبة المئوية التي تأخذها المنصة من كل طلب مكتمل. يتم حسابها تلقائياً عند إتمام الطلب.
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-32 text-lg font-bold"
              />
              <span className="text-xl text-muted-foreground font-bold">%</span>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg text-sm text-primary">
              مثال: إذا كان سعر الطلب 100 ج.م والعمولة {commissionRate}%، فستحصل المنصة على{' '}
              <span className="font-bold">{commissionRate} ج.م</span> والبائع على{' '}
              <span className="font-bold">{(100 - commissionRate).toFixed(1)} ج.م</span>
            </div>
          </CardContent>
        </Card>

        {/* Hold Period */}
        <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock size={20} className="text-yellow-500" />
              مدة حجز الرصيد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              عدد الأيام التي يُحجز فيها الرصيد قبل إتاحته للسحب. هذا يحمي المنصة والمشترين في حالة النزاعات.
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={0}
                max={90}
                value={withdrawalHoldDays}
                onChange={(e) => setWithdrawalHoldDays(Number(e.target.value))}
                className="w-32 text-lg font-bold"
              />
              <span className="text-lg text-muted-foreground">يوم</span>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg text-sm text-yellow-700">
              أرباح البائع من طلب مكتمل اليوم ستتوفر للسحب بعد{' '}
              <span className="font-bold">{withdrawalHoldDays} يوم</span> (
              {new Date(
                Date.now() + withdrawalHoldDays * 24 * 60 * 60 * 1000
              ).toLocaleDateString('ar-EG')}
              )
            </div>
          </CardContent>
        </Card>

        {/* Min Withdrawal */}
        <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Banknote size={20} className="text-green-500" />
              الحد الأدنى للسحب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              أقل مبلغ يمكن للبائع طلب سحبه من رصيده المتاح.
            </p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={0}
                value={minWithdrawalAmount}
                onChange={(e) => setMinWithdrawalAmount(Number(e.target.value))}
                className="w-32 text-lg font-bold"
              />
              <span className="text-lg text-muted-foreground">ج.م</span>
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 gap-2 min-w-[160px]"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            <Save size={16} />
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
