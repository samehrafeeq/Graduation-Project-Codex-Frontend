import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { servicesApi, categoriesApi, favoritesApi } from '@/lib/api';
import {
  Search,
  Star,
  Clock,
  Loader2,
  LayoutGrid,
  Package,
  SlidersHorizontal,
  ArrowUpDown,
  TrendingUp,
  Heart,
} from 'lucide-react';

const API_BASE =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating';

const BrowseServices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category')
    ? Number(searchParams.get('category'))
    : 0;

  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<number>(initialCat);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    Promise.all([
      servicesApi.getPublic().then((r) => {
        setServices(r.data);
        // Check which services are favorited
        const ids = r.data.map((s: any) => s.id);
        if (ids.length) {
          favoritesApi.checkMany(ids).then((res) => {
            setFavoritedIds(new Set(res.data.favoritedIds));
          }).catch(() => {});
        }
      }),
      categoriesApi.getActive().then((r) => setCategories(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleToggleFavorite = useCallback(async (e: React.MouseEvent, serviceId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await favoritesApi.toggle(serviceId);
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        if (res.data.favorited) next.add(serviceId);
        else next.delete(serviceId);
        return next;
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCategoryChange = (catId: number) => {
    setActiveCategory(catId);
    if (catId) setSearchParams({ category: String(catId) });
    else setSearchParams({});
  };

  const filtered = useMemo(() => {
    let result = [...services];

    // Category filter
    if (activeCategory)
      result = result.filter((s) => s.categoryId === activeCategory);

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.seller?.name?.toLowerCase().includes(q),
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return result;
  }, [services, activeCategory, search, sortBy]);

  const activeCategoryName = categories.find(
    (c) => c.id === activeCategory,
  )?.name;

  const sortOptions: { value: SortOption; label: string; icon: any }[] = [
    { value: 'newest', label: 'الأحدث', icon: Clock },
    { value: 'price_asc', label: 'السعر: الأقل', icon: ArrowUpDown },
    { value: 'price_desc', label: 'السعر: الأعلى', icon: ArrowUpDown },
    { value: 'rating', label: 'الأعلى تقييماً', icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              تصفح الخدمات
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {activeCategory
                ? `عرض خدمات ${activeCategoryName}`
                : 'اكتشف خدمات احترافية من أفضل البائعين'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0 px-3 py-1.5"
            >
              <Package size={13} className="ml-1" />
              {filtered.length} خدمة
            </Badge>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl ring-1 ring-black/[0.04] shadow-sm p-4 space-y-4">
          {/* Top row: search + toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="ابحث عن خدمة، بائع..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9 h-11 rounded-xl bg-[#f8f9fb] border-0 ring-1 ring-black/[0.04] focus:ring-primary/30"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 h-11 rounded-xl text-sm font-medium transition-all ${
                showFilters
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-[#f8f9fb] text-muted-foreground ring-1 ring-black/[0.04] hover:bg-accent'
              }`}
            >
              <SlidersHorizontal size={15} />
              الفلاتر
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="space-y-4 pt-3 border-t border-border/40">
              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  الترتيب
                </p>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        sortBy === opt.value
                          ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                          : 'bg-[#f8f9fb] text-muted-foreground hover:text-foreground ring-1 ring-black/[0.04]'
                      }`}
                    >
                      <opt.icon size={12} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleCategoryChange(0)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === 0
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-white text-muted-foreground ring-1 ring-black/[0.06] hover:bg-accent'
            }`}
          >
            <LayoutGrid size={14} />
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white text-muted-foreground ring-1 ring-black/[0.06] hover:bg-accent'
              }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-9 w-9 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl ring-1 ring-black/[0.04]">
            <Package size={48} className="text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              لا توجد خدمات
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {search
                ? 'حاول تغيير كلمة البحث أو اختيار قسم مختلف'
                : 'لم تتم إضافة خدمات بعد في هذا القسم'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((service) => {
              const hasDiscount =
                service.discountPrice &&
                new Date(service.discountEndsAt) > new Date();
              const isFav = favoritedIds.has(service.id);
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="group bg-white rounded-2xl ring-1 ring-black/[0.04] overflow-hidden hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-[#f8f9fb]">
                    {service.image ? (
                      <img
                        src={`${API_BASE}${service.image}`}
                        alt={service.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package
                          size={36}
                          className="text-muted-foreground/15"
                        />
                      </div>
                    )}
                    {/* Category pill */}
                    {service.category && (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
                        {service.category.icon && (
                          <span className="ml-1">{service.category.icon}</span>
                        )}
                        {service.category.name}
                      </span>
                    )}
                    {/* Favorite heart */}
                    <button
                      onClick={(e) => handleToggleFavorite(e, service.id)}
                      className={`absolute bottom-2.5 left-2.5 rounded-full p-1.5 backdrop-blur shadow-sm transition-all duration-200 ${
                        isFav
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-white/90 text-muted-foreground hover:bg-white hover:text-red-500'
                      }`}
                    >
                      <Heart size={14} className={isFav ? 'fill-white' : ''} />
                    </button>
                    {/* Discount badge */}
                    {hasDiscount && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold shadow-sm">
                        خصم
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-3.5 space-y-2.5">
                    <h3 className="font-bold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-relaxed">
                      {service.title}
                    </h3>

                    {/* Seller */}
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-bl from-primary/80 to-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {service.seller?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">
                        {service.seller?.name}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {service.averageRating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star
                            size={11}
                            className="text-amber-500 fill-amber-500"
                          />
                          {Number(service.averageRating).toFixed(1)}
                          <span className="text-muted-foreground/50">
                            ({service.totalReviews})
                          </span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {service.deliveryDays} يوم
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-2 border-t border-border/30">
                      <span className="text-base font-extrabold text-primary">
                        {hasDiscount
                          ? Number(service.discountPrice).toFixed(0)
                          : Number(service.price).toFixed(0)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        ج.م
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-muted-foreground/60 line-through mr-1">
                          {Number(service.price).toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BrowseServices;
