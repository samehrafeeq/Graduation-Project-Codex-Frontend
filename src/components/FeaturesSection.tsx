import { Shield, Star, Lock, CreditCard, ShieldCheck, Headphones } from "lucide-react";

const features = [
  { icon: Shield, title: "نظام ضمان متكامل", description: "حماية كاملة لحقوق البائع والمشتري" },
  { icon: Star, title: "نظام تقييم شفاف", description: "تقييمات حقيقية من مستخدمين موثوقين" },
  { icon: Lock, title: "دفع آمن ومضمون", description: "معاملات مالية محمية بأعلى معايير الأمان" },
  { icon: CreditCard, title: "طرق دفع متعددة", description: "ادفع بالطريقة التي تناسبك" },
  { icon: ShieldCheck, title: "أعلى تشفير", description: "تشفير بياناتك بتقنيات متقدمة" },
  { icon: Headphones, title: "دعم على مدار الساعة", description: "فريق دعم جاهز لمساعدتك دائماً" },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary bg-accent rounded-full px-4 py-1.5 inline-block mb-4">المميزات</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">لماذا تختار خدماتي؟</h2>
          <p className="text-muted-foreground">نوفر لك بيئة آمنة وموثوقة لإنجاز أعمالك</p>
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
