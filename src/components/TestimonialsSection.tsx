import { Star } from "lucide-react";

const testimonials = [
  {
    name: "أحمد محمد",
    role: "مطور ويب",
    content: "منصة رائعة ساعدتني في الحصول على عملاء جدد وزيادة دخلي بشكل ملحوظ. الدعم الفني ممتاز والتعامل سلس جداً.",
    rating: 5,
    initials: "أم",
  },
  {
    name: "سارة العلي",
    role: "مصممة جرافيك",
    content: "أفضل منصة عربية للخدمات المصغرة. واجهة سهلة الاستخدام ونظام دفع آمن. أنصح بها بشدة لكل مستقل.",
    rating: 5,
    initials: "سع",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary bg-accent rounded-full px-4 py-1.5 inline-block mb-4">آراء المستخدمين</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">ماذا يقول مستخدمونا؟</h2>
          <p className="text-muted-foreground">تجارب حقيقية من مستخدمين راضين</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-bl from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
