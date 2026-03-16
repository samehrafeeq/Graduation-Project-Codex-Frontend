import { useUiPreferences } from "@/contexts/UiPreferencesContext";

const Footer = () => {
  const { isArabic, language, setLanguage } = useUiPreferences();

  const text = {
    brand: isArabic ? 'خدماتي' : 'Khadamati',
    desc: isArabic
      ? 'منصة عربية رائدة للخدمات المصغرة تربط بين المستقلين وأصحاب الأعمال بسهولة وأمان.'
      : 'A leading marketplace connecting freelancers and clients with trust and simplicity.',
    services: isArabic ? 'الخدمات' : 'Services',
    company: isArabic ? 'الشركة' : 'Company',
    support: isArabic ? 'الدعم' : 'Support',
    about: isArabic ? 'من نحن' : 'About Us',
    terms: isArabic ? 'الشروط والأحكام' : 'Terms & Conditions',
    privacy: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy',
    blog: isArabic ? 'المدونة' : 'Blog',
    helpCenter: isArabic ? 'مركز المساعدة' : 'Help Center',
    faq: isArabic ? 'الأسئلة الشائعة' : 'FAQ',
    contact: isArabic ? 'تواصل معنا' : 'Contact Us',
    rights: isArabic ? '© 2026 خدماتي. جميع الحقوق محفوظة.' : '© 2026 Khadamati. All rights reserved.',
    dev: isArabic ? 'البرمجة والتطوير' : 'Development',
    design: isArabic ? 'التصميم الجرافيكي' : 'Graphic Design',
    writing: isArabic ? 'الكتابة والترجمة' : 'Writing & Translation',
    marketing: isArabic ? 'التسويق الإلكتروني' : 'Digital Marketing',
  };

  return (
    <footer className="bg-slate-950 text-white/70 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-bl from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">خ</span>
              </div>
              <span className="text-xl font-bold text-white">{text.brand}</span>
            </div>
            <p className="text-sm leading-relaxed">{text.desc}</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4">{text.services}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{text.dev}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{text.design}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{text.writing}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{text.marketing}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-4">{text.company}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{text.about}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{text.terms}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{text.privacy}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{text.blog}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">{text.support}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{text.helpCenter}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{text.faq}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{text.contact}</a></li>
              <li className="text-white/50">info@khadamati.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm">{text.rights}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`text-sm rounded-full px-3 py-1 transition-colors ${language === 'ar' ? 'bg-white/10 hover:bg-white/20' : 'text-white/40 hover:text-white/70'}`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`text-sm rounded-full px-3 py-1 transition-colors ${language === 'en' ? 'bg-white/10 hover:bg-white/20' : 'text-white/40 hover:text-white/70'}`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
