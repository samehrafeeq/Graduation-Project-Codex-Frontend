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
import { Loader2, Plus, Trash2, Upload, ArrowRight, Save, Info, Sparkles, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

interface ExtraItem {
  name: string;
  price: number;
  extraDeliveryDays: number;
}

const normalizeSpaces = (value: string) => value.replace(/\s+/g, ' ').trim();

const toTitleCaseEn = (value: string) =>
  value
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(' ');

const generateServiceTitleSuggestions = (
  rawTitle: string,
  categoryName: string,
  variationOffset = 0,
): string[] => {
  const base = normalizeSpaces(rawTitle);
  if (!base || base.length < 4) return [];

  const isArabic = /[\u0600-\u06FF]/.test(base);
  const safeCategory = normalizeSpaces(categoryName || '');
  const categoryPrefix = safeCategory ? (isArabic ? `في ${safeCategory}` : `for ${safeCategory}`) : '';

  const baseTitle = isArabic ? base : toTitleCaseEn(base);

  const variants = isArabic
    ? [
        `${baseTitle} باحترافية وجودة عالية`,
        `${baseTitle} بأسلوب احترافي ونتائج مميزة`,
        `خدمة ${baseTitle} مع دعم كامل`,
        `${baseTitle} مع تعديلات مجانية`,
        `${baseTitle} بسرعة ودقة ${categoryPrefix}`.trim(),
        `${baseTitle} بجودة ممتازة وتفاصيل دقيقة`,
        `${baseTitle} بنتيجة احترافية مضمونة`,
        `${baseTitle} وفق أفضل ممارسات المجال`,
      ]
    : [
        `${baseTitle} with Professional Quality`,
        `Premium ${baseTitle} for Better Results`,
        `${baseTitle} with Full Support`,
        `${baseTitle} with Free Revisions`,
        `Fast and Accurate ${baseTitle} ${categoryPrefix}`.trim(),
        `${baseTitle} with Outstanding Quality`,
        `${baseTitle} with a Professional Finish`,
        `${baseTitle} Based on Best Practices`,
      ];

  const rotated = variants
    .map((_, index, arr) => arr[(index + variationOffset) % arr.length]);

  const cleaned = rotated
    .map(normalizeSpaces)
    .filter((item) => item.length >= 10 && item.length <= 80);

  return Array.from(new Set(cleaned)).filter((item) => item.toLowerCase() !== base.toLowerCase()).slice(0, 6);
};

const generateServiceDescriptionSuggestions = (
  rawTitle: string,
  categoryName: string,
  price: number | '',
  deliveryDays: number,
  variationOffset = 0,
): string[] => {
  const title = normalizeSpaces(rawTitle);
  if (!title || title.length < 4) return [];

  const isArabic = /[\u0600-\u06FF]/.test(title);
  const category = normalizeSpaces(categoryName || 'الخدمات الرقمية');
  const priceText = Number(price) > 0 ? `${price}` : isArabic ? 'حسب المتطلبات' : 'based on requirements';
  const deliveryText = Math.max(1, Number(deliveryDays) || 1);

  const arTemplates = [
    `أقدم خدمة ${title} بجودة احترافية تناسب احتياجاتك في مجال ${category}.\n\nماذا ستحصل عليه:\n- تنفيذ دقيق ومتقن\n- تواصل مستمر حتى التسليم\n- مراجعات لتحسين النتيجة النهائية\n\nسعر الخدمة يبدأ من ${priceText} ج.م، ومدة التنفيذ المتوقعة ${deliveryText} أيام.`,
    `إذا كنت تبحث عن ${title} بشكل احترافي، فهذه الخدمة مصممة لتمنحك نتيجة عملية وواضحة في ${category}.\n\nيشمل العمل:\n- فهم المتطلبات قبل البدء\n- تنفيذ بمعايير جودة عالية\n- دعم بعد التسليم لضمان رضاك\n\nالسعر يبدأ من ${priceText} ج.م مع تنفيذ خلال ${deliveryText} أيام.`,
    `خدمة ${title} موجهة للأفراد والشركات الراغبين في نتائج قوية ضمن ${category}.\n\nمميزات الخدمة:\n- جودة ثابتة واهتمام بالتفاصيل\n- التزام كامل بالاتفاق\n- مرونة في التعديلات عند الحاجة\n\nالبدء من ${priceText} ج.م والتسليم خلال ${deliveryText} أيام تقريبًا.`,
    `مع خدمة ${title} ستحصل على تنفيذ احترافي يساعدك على تحقيق هدفك بسرعة ووضوح في ${category}.\n\nما يميزني:\n- خبرة عملية في التنفيذ\n- وضوح في خطوات العمل\n- تسليم منظم وقابل للاستخدام مباشرة\n\nالسعر الابتدائي ${priceText} ج.م ومدة التنفيذ ${deliveryText} أيام.`,
  ];

  const enTemplates = [
    `I provide ${title} with professional quality tailored to your needs in ${category}.\n\nWhat you get:\n- Accurate and polished execution\n- Consistent communication\n- Revisions to refine the final result\n\nStarting price: ${priceText}. Estimated delivery: ${deliveryText} days.`,
    `If you need ${title} done professionally, this service is built to deliver clear and practical results in ${category}.\n\nThis service includes:\n- Requirement analysis before starting\n- High-quality implementation\n- Post-delivery support\n\nStarting from ${priceText} with delivery in ${deliveryText} days.`,
    `${title} service for individuals and businesses looking for strong outcomes in ${category}.\n\nKey benefits:\n- Reliable quality and attention to detail\n- Full commitment to the agreed scope\n- Flexible revisions when needed\n\nPrice starts at ${priceText} and delivery is around ${deliveryText} days.`,
    `With ${title}, you get a professional implementation that helps you achieve your goal quickly in ${category}.\n\nWhy this service:\n- Practical experience\n- Clear workflow and milestones\n- Structured, ready-to-use delivery\n\nBase price: ${priceText}. Delivery time: ${deliveryText} days.`,
  ];

  const templates = isArabic ? arTemplates : enTemplates;
  const rotated = templates.map((_, index, arr) => arr[(index + variationOffset) % arr.length]);

  return rotated.map(normalizeSpaces).slice(0, 3);
};

const ServiceForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [titleGenerationCount, setTitleGenerationCount] = useState(0);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<string[]>([]);
  const [descriptionGenerationCount, setDescriptionGenerationCount] = useState(0);
  const [isGeneratingDescriptions, setIsGeneratingDescriptions] = useState(false);
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

  const handleGenerateTitleSuggestions = () => {
    const cleanTitle = normalizeSpaces(title);
    if (!cleanTitle || cleanTitle.length < 4) {
      toast({ title: 'تنبيه', description: 'اكتب اسمًا مبدئيًا للخدمة أولاً (4 أحرف على الأقل)' });
      return;
    }

    const selectedCategoryName = categories.find((c) => c.id === Number(categoryId))?.name || '';
    const nextCount = titleGenerationCount + 1;
    setIsGeneratingTitles(true);

    setTimeout(() => {
      setTitleSuggestions(generateServiceTitleSuggestions(cleanTitle, selectedCategoryName, nextCount));
      setTitleGenerationCount(nextCount);
      setIsGeneratingTitles(false);
    }, 180);
  };

  const handleGenerateDescriptionSuggestions = () => {
    const cleanTitle = normalizeSpaces(title);
    if (!cleanTitle || cleanTitle.length < 4) {
      toast({ title: 'تنبيه', description: 'اكتب اسمًا مبدئيًا للخدمة أولاً لتوليد وصف مناسب' });
      return;
    }

    const selectedCategoryName = categories.find((c) => c.id === Number(categoryId))?.name || '';
    const nextCount = descriptionGenerationCount + 1;
    setIsGeneratingDescriptions(true);

    setTimeout(() => {
      setDescriptionSuggestions(
        generateServiceDescriptionSuggestions(cleanTitle, selectedCategoryName, price, deliveryDays, nextCount),
      );
      setDescriptionGenerationCount(nextCount);
      setIsGeneratingDescriptions(false);
    }, 220);
  };

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
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <Label htmlFor="title" className="text-sm font-semibold">عنوان الخدمة *</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateTitleSuggestions}
                      className="h-8 rounded-lg gap-1.5"
                    >
                      <Sparkles size={14} />
                      توليد أسماء بخدماتي AI
                    </Button>
                    {titleSuggestions.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateTitleSuggestions}
                        className="h-8 rounded-lg gap-1.5"
                      >
                        <RefreshCw size={14} className={isGeneratingTitles ? 'animate-spin' : ''} />
                        إعادة التوليد
                      </Button>
                    )}
                  </div>
                </div>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: تصميم شعار احترافي"
                  className="mt-1.5 h-11 rounded-xl bg-muted/30 focus:bg-white"
                />
                {titleSuggestions.length > 0 && (
                  <div className="mt-3 rounded-xl border border-border/70 bg-muted/20 p-3">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">اقتراحات لتحسين اسم الخدمة:</p>
                    <div className="flex flex-wrap gap-2">
                      {titleSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setTitle(suggestion)}
                          className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">
                  لن يتم توليد الأسماء تلقائيًا. اضغط زر التوليد عند الحاجة، ولا تضع مدة التسليم في اسم الخدمة.
                </p>
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
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <Label htmlFor="description" className="text-sm font-semibold">وصف الخدمة *</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateDescriptionSuggestions}
                      className="h-8 rounded-lg gap-1.5"
                    >
                      <Sparkles size={14} />
                      توليد وصف بخدماتي AI
                    </Button>
                    {descriptionSuggestions.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateDescriptionSuggestions}
                        className="h-8 rounded-lg gap-1.5"
                      >
                        <RefreshCw size={14} className={isGeneratingDescriptions ? 'animate-spin' : ''} />
                        إعادة التوليد
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="اكتب وصفاً تفصيلياً يوضح ما ستقدمه..."
                  className="mt-1.5 min-h-[130px] rounded-xl bg-muted/30 focus:bg-white resize-none"
                />
                {descriptionSuggestions.length > 0 && (
                  <div className="mt-3 space-y-2 rounded-xl border border-border/70 bg-muted/20 p-3">
                    <p className="text-xs font-semibold text-muted-foreground">وصف مقترح بالتوليد:</p>
                    {descriptionSuggestions.map((suggestion) => (
                      <div key={suggestion} className="rounded-lg border border-border/70 bg-background p-3">
                        <p className="text-xs leading-6 text-foreground/90 whitespace-pre-line">{suggestion}</p>
                        <div className="mt-2 flex justify-end">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setDescription(suggestion)}
                            className="h-7 rounded-md text-xs"
                          >
                            استخدام هذا الوصف
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
