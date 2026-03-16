import { Shield, Star, Lock, CreditCard, ShieldCheck, Headphones } from "lucide-react";
import { useUiPreferences } from "@/contexts/UiPreferencesContext";

const features = [
  { icon: Shield, title: "نظام ضمان متكامل", description: "حماية كاملة لحقوق البائع والمشتري" },
  { icon: Star, title: "نظام تقييم شفاف", description: "تقييمات حقيقية من مستخدمين موثوقين" },
  { icon: Lock, title: "دفع آمن ومضمون", description: "معاملات مالية محمية بأعلى معايير الأمان" },
  { icon: CreditCard, title: "طرق دفع متعددة", description: "ادفع بالطريقة التي تناسبك" },
  { icon: ShieldCheck, title: "أعلى تشفير", description: "تشفير بياناتك بتقنيات متقدمة" },
  { icon: Headphones, title: "دعم على مدار الساعة", description: "فريق دعم جاهز لمساعدتك دائماً" },
];

const FeaturesSection = () => {
  const { isArabic } = useUiPreferences();

  const features = isArabic
    ? [
        { icon: Shield, title: "نظام ضمان متكامل", description: "حماية كاملة لحقوق البائع والمشتري" },
        { icon: Star, title: "نظام تقييم شفاف", description: "تقييمات حقيقية من مستخدمين موثوقين" },
        { icon: Lock, title: "دفع آمن ومضمون", description: "معاملات مالية محمية بأعلى معايير الأمان" },
        { icon: CreditCard, title: "طرق دفع متعددة", description: "ادفع بالطريقة التي تناسبك" },
        { icon: ShieldCheck, title: "أعلى تشفير", description: "تشفير بياناتك بتقنيات متقدمة" },
        { icon: Headphones, title: "دعم على مدار الساعة", description: "فريق دعم جاهز لمساعدتك دائماً" },
      ]
    : [
        { icon: Shield, title: "Full Escrow Protection", description: "Complete protection for both buyers and sellers" },
        { icon: Star, title: "Transparent Ratings", description: "Real ratings from verified users" },
        { icon: Lock, title: "Secure Payments", description: "Transactions protected with top security standards" },
        { icon: CreditCard, title: "Multiple Payment Methods", description: "Pay the way that works best for you" },
        { icon: ShieldCheck, title: "Advanced Encryption", description: "Your data is encrypted with modern standards" },
        { icon: Headphones, title: "24/7 Support", description: "Our support team is always ready to help" },
      ];

  const text = {
    badge: isArabic ? 'المميزات' : 'Features',
    title: isArabic ? 'لماذا تختار خدماتي؟' : 'Why Choose Khadamati?',
    description: isArabic ? 'نوفر لك بيئة آمنة وموثوقة لإنجاز أعمالك' : 'A secure and trusted environment to get your work done',
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary bg-accent rounded-full px-4 py-1.5 inline-block mb-4">{text.badge}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{text.title}</h2>
          <p className="text-muted-foreground">{text.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                <f.icon size={22} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
