import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { categoriesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  GripVertical,
} from 'lucide-react';

// ─── Icon groups for the picker ───
const ICON_GROUPS: { label: string; icons: string[] }[] = [
  {
    label: 'تصميم وإبداع',
    icons: ['🎨', '🖌️', '✏️', '🖼️', '📐', '🎭', '🎬', '📸', '🎥', '🎞️', '🖍️', '✂️'],
  },
  {
    label: 'برمجة وتطوير',
    icons: ['💻', '🖥️', '⌨️', '🔧', '⚙️', '🛠️', '🧑‍💻', '📱', '🌐', '🔌', '🤖', '🧩'],
  },
  {
    label: 'كتابة وترجمة',
    icons: ['📝', '✍️', '📖', '📚', '🗒️', '📰', '🔤', '🌍', '📋', '🗞️', '📄', '🖊️'],
  },
  {
    label: 'تسويق وأعمال',
    icons: ['📈', '📊', '💰', '💳', '🏷️', '📣', '📢', '💡', '🎯', '🤝', '🏪', '🛒'],
  },
  {
    label: 'صوت وموسيقى',
    icons: ['🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🎺', '🥁', '📻', '🔊', '🎙️', '🎼'],
  },
  {
    label: 'تعليم وتدريب',
    icons: ['🎓', '📕', '📗', '📘', '🧑‍🏫', '🧠', '🏆', '⭐', '🔬', '🧪', '📊', '🗂️'],
  },
  {
    label: 'عام',
    icons: ['🏠', '💼', '🔑', '📦', '🚀', '💎', '👑', '🌟', '💫', '❤️', '🔥', '✅'],
  },
];

const AdminCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeIconGroup, setActiveIconGroup] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data);
    } catch {
      toast({ title: 'خطأ', description: 'فشل تحميل الأقسام', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('');
    setSortOrder(0);
    setIsActive(true);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || '');
    setSortOrder(cat.sortOrder || 0);
    setIsActive(cat.isActive);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({ title: 'خطأ', description: 'اسم القسم مطلوب', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const data = { name, description, icon, sortOrder, isActive };
      if (editingId) {
        await categoriesApi.update(editingId, data);
        toast({ title: 'تم', description: 'تم تحديث القسم' });
      } else {
        await categoriesApi.create(data);
        toast({ title: 'تم', description: 'تم إضافة القسم' });
      }
      resetForm();
      loadCategories();
    } catch (err: any) {
      toast({
        title: 'خطأ',
        description: err.response?.data?.message || 'حدث خطأ',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    try {
      await categoriesApi.delete(id);
      toast({ title: 'تم', description: 'تم حذف القسم' });
      loadCategories();
    } catch (err: any) {
      toast({
        title: 'خطأ',
        description: err.response?.data?.message || 'فشل الحذف',
        variant: 'destructive',
      });
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">إدارة الأقسام</h1>
            <p className="text-muted-foreground mt-1">
              {categories.length} قسم
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <Plus size={16} />
            إضافة قسم
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground text-lg">
                {editingId ? 'تعديل القسم' : 'إضافة قسم جديد'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm} className="text-muted-foreground">
                <X size={18} />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <Label className="text-foreground/80">اسم القسم *</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: تصميم وجرافيك"
                    className="mt-1"
                  />
                </div>

                {/* Icon Picker — always visible */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground/80">
                      أيقونة القسم
                      {icon && <span className="text-2xl mr-2 align-middle">{icon}</span>}
                    </Label>
                    {icon && (
                      <button
                        type="button"
                        onClick={() => setIcon('')}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition"
                      >
                        <X size={12} />
                        إزالة الأيقونة
                      </button>
                    )}
                  </div>

                  <div className="rounded-xl bg-[#f8f9fb] ring-1 ring-black/[0.04] overflow-hidden">
                    {/* Group tabs */}
                    <div className="flex gap-1 p-2 overflow-x-auto border-b border-border/40 scrollbar-none">
                      {ICON_GROUPS.map((group, idx) => (
                        <button
                          key={group.label}
                          type="button"
                          onClick={() => setActiveIconGroup(idx)}
                          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 ${
                            activeIconGroup === idx
                              ? 'bg-primary text-white shadow-sm'
                              : 'bg-white text-muted-foreground ring-1 ring-black/[0.06] hover:text-foreground'
                          }`}
                        >
                          {group.icons[0]} {group.label}
                        </button>
                      ))}
                    </div>

                    {/* Icons grid */}
                    <div className="p-3">
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5">
                        {ICON_GROUPS[activeIconGroup].icons.map((ic, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setIcon(ic)}
                            className={`flex items-center justify-center h-10 w-full rounded-lg text-xl transition-all duration-150 ${
                              icon === ic
                                ? 'bg-primary/10 ring-2 ring-primary scale-110 shadow-sm'
                                : 'bg-white ring-1 ring-black/[0.06] hover:ring-primary/30 hover:scale-110 hover:shadow-sm'
                            }`}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-foreground/80">الوصف (اختياري)</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="وصف مختصر للقسم"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-foreground/80">الترتيب</Label>
                    <Input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="mt-1 w-24"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground/80 mb-1 block">الحالة</Label>
                    <button
                      type="button"
                      onClick={() => setIsActive(!isActive)}
                      className={`mt-1 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                          : 'bg-gray-50 text-gray-500 ring-1 ring-gray-200'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {isActive ? 'فعّال' : 'معطّل'}
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 gap-2">
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    <Check size={16} />
                    {editingId ? 'حفظ التعديلات' : 'إضافة'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={resetForm} className="text-muted-foreground">
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Categories Table */}
        <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
          <CardContent className="p-0">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد أقسام بعد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-muted-foreground">
                      <th className="text-right py-3 px-4">#</th>
                      <th className="text-right py-3 px-4">القسم</th>
                      <th className="text-right py-3 px-4">الوصف</th>
                      <th className="text-center py-3 px-4">الترتيب</th>
                      <th className="text-center py-3 px-4">الحالة</th>
                      <th className="text-center py-3 px-4">الخدمات</th>
                      <th className="text-center py-3 px-4">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, i) => (
                      <tr
                        key={cat.id}
                        className="border-b border-border/40 hover:bg-accent/30 transition"
                      >
                        <td className="py-3 px-4 text-muted-foreground">{i + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {cat.icon && <span className="text-xl">{cat.icon}</span>}
                            <span className="text-foreground font-medium">{cat.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">
                          {cat.description || '-'}
                        </td>
                        <td className="py-3 px-4 text-center text-muted-foreground">
                          <div className="flex items-center justify-center gap-1">
                            <GripVertical size={14} className="text-muted-foreground" />
                            {cat.sortOrder}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {cat.isActive ? (
                            <Badge className="bg-green-500/10 text-green-600">فعّال</Badge>
                          ) : (
                            <Badge className="bg-gray-500/10 text-gray-600">معطّل</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-foreground">
                          {cat.servicesCount ?? cat.services?.length ?? 0}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(cat)}
                              className="text-primary hover:text-primary/80 h-8 w-8"
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(cat.id)}
                              className="text-red-400 hover:text-red-300 h-8 w-8"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
