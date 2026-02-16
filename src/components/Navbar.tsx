import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <Logo iconClassName="w-9 h-9" textClassName="text-xl" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-primary">الرئيسية</a>
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">التصنيفات</a>
          <a href="#steps" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">كيف تعمل</a>
        </div>

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

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border p-4 flex flex-col gap-4">
          <a href="#" className="text-sm font-medium text-primary">الرئيسية</a>
          <a href="#services" className="text-sm font-medium text-muted-foreground">التصنيفات</a>
          <a href="#steps" className="text-sm font-medium text-muted-foreground">كيف تعمل</a>
          <Link to="/login" className="text-sm font-medium text-muted-foreground">تسجيل الدخول</Link>
          <Link to="/register">
            <Button className="bg-gradient-to-l from-primary to-secondary text-primary-foreground rounded-full w-full">إنشاء حساب</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
