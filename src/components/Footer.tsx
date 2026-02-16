const Footer = () => {
  return (
    <footer className="bg-foreground text-white/70 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-bl from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">خ</span>
              </div>
              <span className="text-xl font-bold text-white">خدماتي</span>
            </div>
            <p className="text-sm leading-relaxed">منصة عربية رائدة للخدمات المصغرة تربط بين المستقلين وأصحاب الأعمال بسهولة وأمان.</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4">الخدمات</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">البرمجة والتطوير</a></li>
              <li><a href="#" className="hover:text-white transition-colors">التصميم الجرافيكي</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الكتابة والترجمة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">التسويق الإلكتروني</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-4">الشركة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a></li>
              <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المدونة</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">مركز المساعدة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">تواصل معنا</a></li>
              <li className="text-white/50">info@khadamati.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm">© 2026 خدماتي. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3">
            <button className="text-sm bg-white/10 rounded-full px-3 py-1 hover:bg-white/20 transition-colors">عربي</button>
            <button className="text-sm text-white/40 hover:text-white/70 transition-colors">English</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
