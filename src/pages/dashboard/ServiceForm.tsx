import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { PageHeader, DataCard, PageLoader } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { servicesApi, categoriesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Upload, ArrowRight, Save, Info } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

interface ExtraItem {
  name: string;
  price: number;
  extraDeliveryDays: number;
}

const ServiceForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [deliveryDays, setDeliveryDays] = useState<number>(3);
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [discountEndsAt, setDiscountEndsAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extras, setExtras] = useState<ExtraItem[]>([]);

  useEffect(() => {
    loadCategories();
    if (isEdit) loadService();
  }, [id]);

  const loadCategories = async () => {
    try {
      const res = await categoriesApi.getActive();
      setCategories(res.data);
    } catch { /* */ }
  };

  const loadService = async () => {
    setLoading(true);
    try {
      const res = await servicesApi.getOne(Number(id));
      const s = res.data;
      setTitle(s.title);
      setDescription(s.description);
      setCategoryId(s.categoryId);
      setPrice(s.price);
      setDeliveryDays(s.deliveryDays);
      setDiscountPrice(s.discountPrice || '');
      setDiscountEndsAt(s.discountEndsAt ? s.discountEndsAt.split('T')[0] : '');
      setIsActive(s.isActive);
      if (s.image) setImagePreview(`${API_BASE}${s.image}`);
      if (s.extras) setExtras(s.extras.map((e: any) => ({
        name: e.name, price: e.price, extraDeliveryDays: e.extraDeliveryDays,
      })));
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل بيانات الخدمة', variant: 'destructive' });
      navigate('/dashboard/services');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addExtra = () => setExtras([...extras, { name: '', price: 0, extraDeliveryDays: 1 }]);
  const removeExtra = (i: number) => setExtras(extras.filter((_, idx) => idx !== i));
  const updateExtra = (i: number, field: keyof ExtraItem, value: any) => {
    const updated = [...extras];
    updated[i] = { ...updated[i], [field]: value };
    setExtras(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: 'خطأ', description: 'عنوان الخدمة مطلوب', variant: 'destructive' });
      return;
    }
    if (!description.trim()) {
      toast({ title: 'خطأ', description: 'وصف الخدمة مطلوب', variant: 'destructive' });
      return;
    }
    if (!categoryId) {
      toast({ title: 'خطأ', description: 'يرجى اختيار القسم', variant: 'destructive' });
      return;
    }
    if (!price || Number(price) <= 0) {
      toast({ title: 'خطأ', description: 'السعر مطلوب ويجب أن يكون أكبر من 0', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', String(categoryId));
      formData.append('price', String(price));
      formData.append('deliveryDays', String(deliveryDays));
      if (discountPrice) formData.append('discountPrice', String(discountPrice));
      if (discountEndsAt) formData.append('discountEndsAt', discountEndsAt);
      if (isEdit) formData.append('isActive', String(isActive));
      if (image) formData.append('image', image);
      if (extras.length > 0) formData.append('extras', JSON.stringify(extras));

      if (isEdit) {
        await servicesApi.update(Number(id), formData);
        toast({ title: 'تم التحديث', description: 'تم تحديث الخدمة وإرسالها للمراجعة' });
      } else {
        await servicesApi.create(formData);
        toast({ title: 'تمت الإضافة', description: 'تم إضافة الخدمة وإرسالها للمراجعة' });
      }
      navigate('/dashboard/services');
    } catch (err: any) {
      toast({ title: 'خطأ', description: err.response?.data?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title={isEdit ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
          description={isEdit ? 'عند التعديل ستُرسل الخدمة للمراجعة مجدداً' : 'ستتم مراجعة الخدمة من الإدارة قبل نشرها'}
        >
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/services')} className="gap-1.5 rounded-lg">
            <ArrowRight size={16} />
            رجوع
          </Button>
        </PageHeader>

        {/* Info banner */}
        <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4 text-sm text-primary">
          <Info size={18} className="shrink-0" />
          <span>جميع الخدمات تمر بمرحلة مراجعة قبل نشرها. تأكد من ملء جميع البيانات بدقة.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <DataCard title="البيانات الأساسية">
            <div className="space-y-5">
              <div>
                <Label htmlFor="title" className="text-sm font-semibold">عنوان الخدمة *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: تصميم شعار احترافي"
                  className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-semibold">القسم *</Label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={e => setCategoryId(Number(e.target.value))}
                  className="mt-1.5 w-full h-11 rounded-xl border border-input bg-muted/30 px-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">اختر القسم</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold">وصف الخدمة *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="اكتب وصفاً تفصيلياً يوضح ما ستقدمه..."
                  className="mt-1.5 min-h-[130px] rounded-xl bg-muted/30 focus:bg-white resize-none"
                />
              </div>

              {/* Image upload */}
              <div>
                <Label className="text-sm font-semibold">صورة الخدمة</Label>
                <div className="mt-1.5">
                  {imagePreview ? (
                    <div className="relative max-w-sm">
                      <img src={imagePreview} alt="صورة الخدمة" className="w-full h-48 rounded-xl object-cover ring-1 ring-black/5" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 left-2 h-8 w-8 rounded-lg shadow-md"
                        onClick={() => { setImage(null); setImagePreview(null); }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full max-w-sm h-48 rounded-xl border-2 border-dashed border-border/60 bg-muted/20 cursor-pointer hover:bg-muted/40 hover:border-primary/30 transition-all">
                      <Upload size={28} className="text-muted-foreground/50 mb-2" />
                      <span className="text-sm font-medium text-muted-foreground">اضغط لرفع صورة</span>
                      <span className="text-[11px] text-muted-foreground/70 mt-1">PNG, JPG حتى 5MB</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </DataCard>

          {/* Price & delivery */}
          <DataCard title="السعر والتسليم">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-semibold">السعر (ج.م) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={1}
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    placeholder="50"
                    className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryDays" className="text-sm font-semibold">مدة التنفيذ (أيام) *</Label>
                  <Input
                    id="deliveryDays"
                    type="number"
                    min={1}
                    value={deliveryDays}
                    onChange={e => setDeliveryDays(Number(e.target.value))}
                    className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountPrice" className="text-sm font-semibold">سعر الخصم (ج.م)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    min={0}
                    value={discountPrice}
                    onChange={e => setDiscountPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="اختياري"
                    className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="discountEndsAt" className="text-sm font-semibold">تاريخ انتهاء الخصم</Label>
                  <Input
                    id="discountEndsAt"
                    type="date"
                    value={discountEndsAt}
                    onChange={e => setDiscountEndsAt(e.target.value)}
                    className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                  />
                </div>
              </div>

              {isEdit && (
                <div className="flex items-center gap-3 rounded-xl bg-muted/30 p-4">
                  <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
                  <Label htmlFor="isActive" className="text-sm">الخدمة فعّالة (تظهر للمشترين)</Label>
                </div>
              )}
            </div>
          </DataCard>

          {/* Extras */}
          <DataCard
            title="إضافات الخدمة"
            description="خدمات إضافية اختيارية بسعر ومدة منفصلة"
            action={
              <Button type="button" variant="outline" size="sm" onClick={addExtra} className="gap-1.5 rounded-lg text-xs">
                <Plus size={14} />
                إضافة
              </Button>
            }
          >
            {extras.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">
                لم تضف إضافات بعد. يمكنك إضافة خدمات مكملة بسعر إضافي.
              </p>
            ) : (
              <div className="space-y-3">
                {extras.map((extra, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-muted/20 p-4 ring-1 ring-black/[0.03]">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-[11px] text-muted-foreground">الاسم</Label>
                        <Input
                          value={extra.name}
                          onChange={e => updateExtra(i, 'name', e.target.value)}
                          placeholder="تصميم إضافي"
                          className="mt-1 h-9 rounded-lg text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">السعر (ج.م)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={extra.price}
                          onChange={e => updateExtra(i, 'price', Number(e.target.value))}
                          className="mt-1 h-9 rounded-lg text-sm bg-white"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-muted-foreground">أيام إضافية</Label>
                        <Input
                          type="number"
                          min={0}
                          value={extra.extraDeliveryDays}
                          onChange={e => updateExtra(i, 'extraDeliveryDays', Number(e.target.value))}
                          className="mt-1 h-9 rounded-lg text-sm bg-white"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-5 h-9 w-9 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeExtra(i)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </DataCard>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/services')} className="rounded-xl">
              إلغاء
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2 rounded-xl min-w-[150px] shadow-md shadow-primary/20">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEdit ? 'حفظ التعديلات' : 'إضافة الخدمة'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ServiceForm;
