import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MessageCircle,
  MessageSquare,
  Wallet,
  LogOut,
  Menu,
  X,
  FolderTree,
  Package,
  Settings,
  ChevronLeft,
  Home,
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'لوحة التحكم', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'البائعين', href: '/admin/sellers', icon: UserCheck },
    { label: 'المشترين', href: '/admin/buyers', icon: Users },
    { label: 'الأقسام', href: '/admin/categories', icon: FolderTree },
    { label: 'الخدمات', href: '/admin/services', icon: Package },
    { label: 'واتساب', href: '/admin/whatsapp', icon: MessageCircle },
    { label: 'المحادثات', href: '/admin/chat', icon: MessageSquare },
    { label: 'الأرصدة', href: '/admin/wallet', icon: Wallet },
    { label: 'الإعدادات', href: '/admin/settings', icon: Settings },
  ];

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
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <Logo iconClassName="w-8 h-8" textClassName="text-lg" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Admin card */}
        <div className="mx-4 mt-4 mb-2 rounded-xl bg-gradient-to-l from-primary/5 to-primary/10 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-bl from-primary to-secondary text-white text-sm font-bold shadow-md shadow-primary/20">
              م
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground">مدير النظام</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {navItems.map((item) => {
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
          })}
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
          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            متصل
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

export default AdminLayout;
