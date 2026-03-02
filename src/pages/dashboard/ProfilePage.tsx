import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { PageHeader, DataCard } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usersApi } from '@/lib/api';
import { User, Mail, Phone, MapPin, FileText, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', country: '', city: '', bio: '' });

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', country: user.country || '', city: user.city || '', bio: user.bio || '' });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await usersApi.updateProfile(form);
      await refreshProfile();
      toast({ title: 'تم التحديث', description: 'تم تحديث بيانات الحساب بنجاح' });
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.response?.data?.message || 'حدث خطأ أثناء التحديث', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = 'h-11 rounded-xl bg-muted/30 border-border/60 focus:bg-white focus:ring-2 focus:ring-primary/20';

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader title="حسابي" description="تحديث بيانات حسابك الشخصية" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <DataCard title="البيانات الشخصية">
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">الاسم الكامل</Label>
                <div className="relative mt-1.5 group">
                  <User className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={16} />
                  <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`${fieldClass} pr-10`} />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">البريد الإلكتروني</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground/40" size={16} />
                  <Input value={user?.email || ''} disabled className="h-11 rounded-xl bg-muted/40 border-border/40 pr-10 opacity-60" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">لا يمكن تغيير البريد الإلكتروني</p>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold">رقم الهاتف</Label>
                <div className="relative mt-1.5 group">
                  <Phone className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={16} />
                  <Input id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={`${fieldClass} pr-10`} />
                </div>
              </div>
            </div>
          </DataCard>

          {/* Location */}
          <DataCard title="الموقع">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-sm font-semibold">الدولة</Label>
                <div className="relative mt-1.5 group">
                  <MapPin className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={16} />
                  <Input id="country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="مثال: مصر" className={`${fieldClass} pr-10`} />
                </div>
              </div>
              <div>
                <Label htmlFor="city" className="text-sm font-semibold">المدينة</Label>
                <Input id="city" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="مثال: القاهرة" className={`${fieldClass} mt-1.5`} />
              </div>
            </div>
          </DataCard>

          {/* Bio */}
          <DataCard title="نبذة عنك">
            <div className="relative group">
              <FileText className="absolute top-3 right-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={16} />
              <Textarea
                id="bio"
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="اكتب نبذة مختصرة عنك وعن خبراتك..."
                className="pr-10 min-h-[120px] rounded-xl bg-muted/30 border-border/60 focus:bg-white focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </DataCard>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2 rounded-xl min-w-[160px] shadow-md shadow-primary/20">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
