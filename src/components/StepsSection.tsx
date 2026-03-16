import { Search, ShoppingCart, MessageCircle, CheckCircle } from "lucide-react";
import { useUiPreferences } from "@/contexts/UiPreferencesContext";

const steps = [
  { icon: Search, title: "ابحث عن الخدمة", description: "تصفح آلاف الخدمات واختر ما يناسبك", num: "1", color: "bg-blue-500", shadow: "shadow-blue-500/20" },
  { icon: ShoppingCart, title: "اطلب الخدمة", description: "أضف التفاصيل وأكمل الطلب بسهولة", num: "2", color: "bg-purple-500", shadow: "shadow-purple-500/20" },
  { icon: MessageCircle, title: "تواصل مع البائع", description: "تحدث مباشرة مع مقدم الخدمة", num: "3", color: "bg-indigo-500", shadow: "shadow-indigo-500/20" },
  { icon: CheckCircle, title: "استلم وقيّم", description: "استلم عملك وشارك تجربتك", num: "4", color: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
];

const StepsSection = () => {
  const { isArabic } = useUiPreferences();

  const steps = isArabic
    ? [
        { icon: Search, title: "ابحث عن الخدمة", description: "تصفح آلاف الخدمات واختر ما يناسبك", num: "1", color: "bg-blue-500", shadow: "shadow-blue-500/20" },
        { icon: ShoppingCart, title: "اطلب الخدمة", description: "أضف التفاصيل وأكمل الطلب بسهولة", num: "2", color: "bg-purple-500", shadow: "shadow-purple-500/20" },
        { icon: MessageCircle, title: "تواصل مع البائع", description: "تحدث مباشرة مع مقدم الخدمة", num: "3", color: "bg-indigo-500", shadow: "shadow-indigo-500/20" },
        { icon: CheckCircle, title: "استلم وقيّم", description: "استلم عملك وشارك تجربتك", num: "4", color: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
      ]
    : [
        { icon: Search, title: "Find a Service", description: "Browse thousands of services and pick what fits your needs", num: "1", color: "bg-blue-500", shadow: "shadow-blue-500/20" },
        { icon: ShoppingCart, title: "Place an Order", description: "Add requirements and complete your order easily", num: "2", color: "bg-purple-500", shadow: "shadow-purple-500/20" },
        { icon: MessageCircle, title: "Chat with Seller", description: "Talk directly with the service provider", num: "3", color: "bg-indigo-500", shadow: "shadow-indigo-500/20" },
        { icon: CheckCircle, title: "Receive & Rate", description: "Get your delivery and share your feedback", num: "4", color: "bg-emerald-500", shadow: "shadow-emerald-500/20" },
      ];

  const text = {
    badge: isArabic ? 'كيف تعمل المنصة' : 'How It Works',
    title: isArabic ? 'أربع خطوات بسيطة' : 'Four Simple Steps',
    titleAccent: isArabic ? 'للبدء' : 'to Start',
    description: isArabic ? 'ابدأ رحلتك في دقائق معدودة وانجز أعمالك' : 'Start your journey in minutes and get work done faster',
  };

  return (
    <section id="steps" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <span className="text-sm font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 inline-block mb-4">{text.badge}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            {text.title} <span className="text-primary">{text.titleAccent}</span>
          </h2>
          <p className="text-lg text-muted-foreground/80">{text.description}</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5 border-t-2 border-dashed border-muted-foreground/20 -z-10" />

          {steps.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              <div className={`relative w-24 h-24 rounded-3xl ${s.color} flex items-center justify-center mb-6 shadow-xl ${s.shadow} transform transition-all duration-300 group-hover:-translate-y-2 group-hover:rotate-3`}>
                <s.icon size={36} className="text-white relative z-10" />
                <div className="absolute inset-0 bg-black/10 rounded-3xl z-0" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border-4 border-muted flex items-center justify-center font-bold text-sm text-foreground shadow-sm z-20">
                  {s.num}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-[250px]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
