import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import {
  User,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Package,
  Wallet,
  BarChart3,
  Home,
  ChevronLeft,
  ShoppingBag,
  Search,
  MessageSquare,
  Heart,
} from 'lucide-react';
import { useState } from 'react';
import NotificationBell from '@/components/NotificationBell';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNav = [
    { label: 'الرئيسية', href: '/dashboard', icon: LayoutDashboard },
    { label: 'المحادثات', href: '/dashboard/chat', icon: MessageSquare },
    { label: 'حسابي', href: '/dashboard/profile', icon: User },
  ];

  const sellerNav = user?.role === 'seller' ? [
    { label: 'حالة التحقق', href: '/dashboard/verification', icon: ShieldCheck },
    { label: 'خدماتي', href: '/dashboard/services', icon: Package },
    { label: 'إحصائيات', href: '/dashboard/stats', icon: BarChart3 },
    { label: 'المحفظة', href: '/dashboard/wallet', icon: Wallet },
  ] : [];

  const buyerNav = user?.role === 'buyer' ? [
    { label: 'تصفح الخدمات', href: '/services', icon: Search },
    { label: 'المفضلة', href: '/dashboard/favorites', icon: Heart },
    { label: 'طلباتي', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'المحفظة', href: '/dashboard/wallet', icon: Wallet },
  ] : [];

  const renderNavItem = (item: { label: string; href: string; icon: any }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? 'bg-primary text-white shadow-md shadow-primary/25'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }`}
      >
        <item.icon size={18} className={isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'} />
        <span className="flex-1">{item.label}</span>
        {isActive && <ChevronLeft size={14} className="text-white/70" />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] lg:flex" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[260px] flex-col bg-white shadow-xl shadow-black/5 transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none lg:border-l lg:border-border/50 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border/40">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo iconClassName="w-8 h-8" textClassName="text-lg" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* User card */}
        <div className="mx-4 mt-4 mb-2 rounded-xl bg-gradient-to-l from-primary/5 to-primary/10 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-bl from-primary to-secondary text-white text-sm font-bold shadow-md shadow-primary/20">
              {user?.name?.charAt(0) || '؟'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {user?.role === 'buyer' ? 'مشتري' : 'بائع خدمات'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-0.5">
            {mainNav.map(renderNavItem)}
          </div>

          {sellerNav.length > 0 && (
            <>
              <div className="mx-3 my-3 border-t border-border/40" />
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                أدوات البائع
              </p>
              <div className="space-y-0.5">
                {sellerNav.map(renderNavItem)}
              </div>
            </>
          )}

          {buyerNav.length > 0 && (
            <>
              <div className="mx-3 my-3 border-t border-border/40" />
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                المشتريات
              </p>
              <div className="space-y-0.5">
                {buyerNav.map(renderNavItem)}
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/40 p-3 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          >
            <Home size={18} />
            الصفحة الرئيسية
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col lg:mr-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/40 bg-white/80 px-4 backdrop-blur-xl lg:px-6">
          <button
            className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb or spacer */}
          <div className="flex-1" />

          {/* Quick info */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              متصل
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-bl from-primary to-secondary flex items-center justify-center text-white text-xs font-bold lg:hidden">
              {user?.name?.charAt(0) || '؟'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
