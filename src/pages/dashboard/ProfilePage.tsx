import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
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
  const [form, setForm] = useState({
    name: '',
    phone: '',
    country: '',
    city: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        country: user.country || '',
        city: user.city || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await usersApi.updateProfile(form);
      await refreshProfile();
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث بيانات الحساب بنجاح',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء التحديث',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">حسابي</h1>
          <p className="text-muted-foreground mt-1">تحديث بيانات حسابك الشخصية</p>
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  الاسم الكامل
                </Label>
                <div className="relative group">
                  <User className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="pr-10 h-12 bg-gray-100 border-gray-200 rounded-xl opacity-60"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  رقم الهاتف
                </Label>
                <div className="relative group">
                  <Phone className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Country & City */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
                    الدولة
                  </Label>
                  <div className="relative group">
                    <MapPin className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <Input
                      id="country"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      placeholder="مثال: السعودية"
                      className="pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                    المدينة
                  </Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="مثال: الرياض"
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">
                  نبذة عنك
                </Label>
                <div className="relative group">
                  <FileText className="absolute top-3 right-3.5 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="اكتب نبذة مختصرة عنك..."
                    className="pr-10 min-h-[100px] bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#5b4be3] hover:bg-[#4d3dc6] text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin ml-2" size={20} />
                ) : (
                  <Save size={20} className="ml-2" />
                )}
                حفظ التغييرات
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
