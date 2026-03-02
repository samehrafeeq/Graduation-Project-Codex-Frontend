import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { favoritesApi } from '@/lib/api';
import {
  Heart,
  Star,
  Clock,
  Loader2,
  Package,
  Trash2,
} from 'lucide-react';

const API_BASE =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesApi
      .getAll()
      .then((r) => setFavorites(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = useCallback(async (e: React.MouseEvent, serviceId: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await favoritesApi.toggle(serviceId);
      setFavorites((prev) => prev.filter((f) => f.serviceId !== serviceId));
    } catch {
      // ignore
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Heart size={22} className="text-red-500 fill-red-500" />
              المفضلة
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              الخدمات التي أضفتها إلى قائمة المفضلة
            </p>
          </div>
          {favorites.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold">
              <Heart size={12} className="fill-red-500" />
              {favorites.length} خدمة
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-9 w-9 animate-spin text-primary" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl ring-1 ring-black/[0.04]">
            <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Heart size={32} className="text-red-300" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              لا توجد خدمات في المفضلة
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              تصفح الخدمات المتاحة وأضف ما يعجبك إلى قائمة المفضلة
            </p>
            <Link
              to="/services"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-medium shadow-md shadow-primary/25 hover:bg-primary/90 transition"
            >
              <Package size={15} />
              تصفح الخدمات
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((fav) => {
              const service = fav.service;
              if (!service) return null;
              const hasDiscount =
                service.discountPrice &&
                new Date(service.discountEndsAt) > new Date();
              return (
                <Link
                  key={fav.id}
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
                    {/* Remove from favorites */}
                    <button
                      onClick={(e) => handleRemove(e, service.id)}
                      className="absolute bottom-2.5 left-2.5 rounded-full p-1.5 bg-red-500 text-white backdrop-blur shadow-sm hover:bg-red-600 transition-all duration-200"
                    >
                      <Heart size={14} className="fill-white" />
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

export default FavoritesPage;
