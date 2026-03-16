import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useUiPreferences } from "@/contexts/UiPreferencesContext";

const CTASection = () => {
  const { isArabic } = useUiPreferences();

  const text = {
    badge: isArabic ? 'انضم لمجتمع المبدعين' : 'Join the Creators Community',
    title: isArabic ? 'مستعد لبدء' : 'Ready to start',
    titleAccent: isArabic ? 'رحلتك؟' : 'your journey?',
    description: isArabic
      ? 'انضم إلى آلاف المستخدمين الذين يثقون بمنصة خدماتي لإنجاز أعمالهم وزيادة دخلهم. سجل الآن وابدأ في دقائق.'
      : 'Join thousands of users who trust Khadamati to get work done and grow their income. Sign up now and start in minutes.',
    sellerCta: isArabic ? 'سجل كبائع خدمات' : 'Sign Up as Seller',
    buyerCta: isArabic ? 'ابدأ كمشتري' : 'Start as Buyer',
    free: isArabic ? 'تسجيل مجاني' : 'Free signup',
    noHidden: isArabic ? 'لا توجد رسوم مخفية' : 'No hidden fees',
    support: isArabic ? 'دعم فني 24/7' : '24/7 support',
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#7c3aed] to-secondary" />
      
      {/* Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white mix-blend-overlay blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-white mix-blend-overlay blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 mb-6 animate-fade-in">
          <Sparkles size={14} className="text-yellow-300" />
          <span className="text-white font-medium text-sm">{text.badge}</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
          {text.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">{text.titleAccent}</span>
        </h2>
        
        <p className="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          {text.description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link to="/register/seller">
            <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-black/10">
              {text.sellerCta}
            </Button>
          </Link>
          <Link to="/register/buyer">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white rounded-full px-10 h-14 text-lg backdrop-blur-sm">
              {text.buyerCta}
              <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>{text.free}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>{text.noHidden}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>{text.support}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
