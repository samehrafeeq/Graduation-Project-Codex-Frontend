import { Button } from "@/components/ui/button";
import { Menu, X, User, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <Logo iconClassName="w-9 h-9" textClassName="text-xl" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-primary">الرئيسية</Link>
          <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">تصفح الخدمات</Link>
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">التصنيفات</a>
          <a href="#steps" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">كيف تعمل</a>
        </div>

        {user ? (
          /* === Authenticated user === */
          <div className="hidden md:flex items-center gap-3">
            <Link to={dashboardPath}>
              <Button variant="ghost" size="sm" className="gap-2 text-sm">
                <LayoutDashboard className="h-4 w-4" />
                لوحة التحكم
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 pl-3 pr-1.5 py-1 hover:bg-muted transition-colors">
                  {user.avatar ? (
                    <img
                      src={`${API_BASE}/uploads/avatars/${user.avatar}`}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {user.name?.charAt(0)}
                    </span>
                  )}
                  <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard/profile')} className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  حسابي
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin/dashboard')} className="gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" />
                    لوحة الإدارة
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          /* === Guest === */
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              تسجيل الدخول
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-l from-primary to-secondary text-primary-foreground rounded-full px-6 hover:opacity-90 transition-opacity">
                إنشاء حساب
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border p-4 flex flex-col gap-4">
          <Link to="/" className="text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>الرئيسية</Link>
          <Link to="/services" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>تصفح الخدمات</Link>
          <a href="#services" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>التصنيفات</a>
          <a href="#steps" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>كيف تعمل</a>

          <div className="border-t border-border pt-3 mt-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  {user.avatar ? (
                    <img
                      src={`${API_BASE}/uploads/avatars/${user.avatar}`}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {user.name?.charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  لوحة التحكم
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 py-2 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>تسجيل الدخول</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="bg-gradient-to-l from-primary to-secondary text-primary-foreground rounded-full w-full mt-2">إنشاء حساب</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
