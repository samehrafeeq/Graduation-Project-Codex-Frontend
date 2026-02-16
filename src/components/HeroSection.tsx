import { Button } from "@/components/ui/button";
import { Play, Star, Users, Briefcase, CheckCircle2, TrendingUp, Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-bl from-[hsl(258,65%,55%)] via-[hsl(240,60%,50%)] to-[hsl(220,60%,50%)] opacity-[0.03]" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-accent/50 border border-primary/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">منصة الخدمات المصغرة الأولى عربياً</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.2] mb-6">
              حوّل مهاراتك إلى <br className="hidden lg:block"/>
              <span className="relative inline-block">
                <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent relative z-10">دخل مستمر</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/10 -rotate-2 -z-0"></span>
              </span>
              <br />
              أو انجز أعمالك باحترافية
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              منصة خدماتي تجمع بين المبدعين وأصحاب الأعمال في بيئة آمنة وموثوقة. اعرض خدماتك أو اطلب ما تحتاج من البرمجة، التصميم، الكتابة والمزيد بكل سهولة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-l from-primary to-secondary text-primary-foreground rounded-full px-8 text-base h-14 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                ابدأ الآن مجاناً
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 text-base h-14 gap-2 border-primary/20 hover:bg-primary/5">
                <Play size={18} className="fill-current" />
                شاهد كيف تعمل
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-14 border-t border-border/50 pt-8">
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  <span className="text-2xl font-bold text-primary">+10,000</span>
                </div>
                <span className="text-sm text-muted-foreground">مستخدم نشط</span>
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  <span className="text-2xl font-bold text-secondary">+25,000</span>
                </div>
                <span className="text-sm text-muted-foreground">خدمة منجزة</span>
              </div>
              <div className="text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  <span className="text-2xl font-bold text-foreground">4.9/5</span>
                </div>
                <span className="text-sm text-muted-foreground">متوسط التقييم</span>
              </div>
            </div>
          </div>

          {/* Graphical Representation / Mockup */}
          <div className="relative order-1 lg:order-2">
            <div className="relative z-10 mx-auto max-w-[500px] aspect-[4/3] bg-background rounded-3xl shadow-2xl border border-border/60 p-2 lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Mockup Window */}
              <div className="w-full h-full bg-muted/20 rounded-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="h-10 bg-white border-b border-border/50 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto w-1/3 h-2 bg-muted rounded-full"></div>
                </div>
                
                {/* Body */}
                <div className="flex-1 flex">
                  {/* Sidebar */}
                  <div className="w-16 bg-white border-l border-border/50 flex flex-col items-center py-4 gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Users size={16} /></div>
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Briefcase size={16} /></div>
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><TrendingUp size={16} /></div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-6 relative">
                     {/* Skeleton Content */}
                     <div className="flex justify-between items-center mb-6">
                        <div className="w-32 h-6 bg-muted-foreground/10 rounded-md"></div>
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/10"></div>
                     </div>
                     <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-border/50 p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><CheckCircle2 size={20}/></div>
                          <div className="space-y-2 flex-1">
                             <div className="w-2/3 h-4 bg-muted-foreground/10 rounded"></div>
                             <div className="w-1/2 h-3 bg-muted-foreground/10 rounded"></div>
                          </div>
                          <div className="text-indigo-600 font-bold text-sm">$150</div>
                        </div>
                     </div>
                     <div className="w-full h-20 bg-white rounded-xl shadow-sm border border-border/50 p-4 opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements (Decorations) */}
            <div className="absolute top-10 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-border/50 animate-bounce delay-100 dark:bg-card">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">$</div>
                 <div>
                    <div className="text-[10px] text-muted-foreground">الارباح الشهرية</div>
                    <div className="font-bold text-sm">$2,450</div>
                 </div>
              </div>
            </div>

             <div className="absolute bottom-20 -left-8 bg-white p-3 rounded-2xl shadow-xl border border-border/50 animate-bounce delay-300 dark:bg-card">
              <div className="flex items-center gap-2">
                 <div className="flex -space-x-2 space-x-reverse">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400"></div>
                 </div>
                 <div className="pr-2">
                    <div className="text-[10px] text-muted-foreground">عملاء جدد</div>
                    <div className="font-bold text-sm">+180</div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
