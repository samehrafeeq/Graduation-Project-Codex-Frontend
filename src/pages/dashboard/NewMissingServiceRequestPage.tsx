import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { missingServiceRequestsApi } from '@/lib/api';
import { Loader2, Send } from 'lucide-react';

const NewMissingServiceRequestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    averageBudget: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: 'خطأ', description: 'يرجى إدخال اسم الخدمة والوصف', variant: 'destructive' });
      return;
    }

    const budget = Number(form.averageBudget);
    if (!budget || budget <= 0) {
      toast({ title: 'خطأ', description: 'يرجى إدخال متوسط سعر صحيح', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      await missingServiceRequestsApi.create({
        title: form.title.trim(),
        description: form.description.trim(),
        averageBudget: budget,
      });
      toast({ title: 'تم الإرسال', description: 'تم إنشاء طلب الخدمة غير الموجودة بنجاح' });
      navigate('/dashboard/missing-services');
    } catch (err: any) {
      toast({
        title: 'خطأ',
        description: err?.response?.data?.message || 'تعذر إرسال الطلب',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">طلب خدمة غير موجودة</h1>
          <p className="text-muted-foreground mt-1">
            اكتب تفاصيل الخدمة التي لم تجدها. سيشاهد البائعون الطلب ويمكنهم التعليق عليها.
          </p>
        </div>

        <Card className="bg-card shadow-sm ring-1 ring-black/[0.04]">
          <CardHeader>
            <CardTitle className="text-base">بيانات الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">اسم الخدمة المطلوبة</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                  placeholder="مثال: كتابة خطة تسويق لمتجر إلكتروني"
                  required
                />
              </div>

              <div>
                <Label htmlFor="averageBudget">متوسط السعر المتوقع (ج.م)</Label>
                <Input
                  id="averageBudget"
                  type="number"
                  min={1}
                  value={form.averageBudget}
                  onChange={(e) => setForm((prev) => ({ ...prev, averageBudget: e.target.value }))}
                  className="mt-1"
                  placeholder="مثال: 1500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">وصف الخدمة المطلوبة</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="mt-1 min-h-[150px]"
                  placeholder="اكتب تفاصيل دقيقة: المطلوب، النتيجة المتوقعة، المدة المناسبة، وأي ملاحظات مهمة"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/missing-services')}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  إرسال الطلب
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewMissingServiceRequestPage;
