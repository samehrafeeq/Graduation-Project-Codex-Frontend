import { Sparkles, ShieldAlert, BarChart3 } from "lucide-react";
import { useUiPreferences } from "@/contexts/UiPreferencesContext";

const AISection = () => {
  const { isArabic } = useUiPreferences();

  const points = isArabic
    ? [
        { icon: Sparkles, title: "توصية الخدمات", description: "نظام ذكي يقترح عليك أفضل الخدمات بناءً على احتياجاتك" },
        { icon: ShieldAlert, title: "كشف الاحتيال", description: "حماية متقدمة تكتشف المعاملات المشبوهة تلقائياً" },
        { icon: BarChart3, title: "تحسين جودة الخدمات", description: "تحليل مستمر لضمان أعلى مستويات الجودة" },
      ]
    : [
        { icon: Sparkles, title: "Smart Recommendations", description: "An intelligent engine suggests the best services for your needs" },
        { icon: ShieldAlert, title: "Fraud Detection", description: "Advanced protection that flags suspicious activity automatically" },
        { icon: BarChart3, title: "Quality Optimization", description: "Continuous analysis to ensure high service quality" },
      ];

  const text = {
    badge: isArabic ? 'تقنيات متقدمة' : 'Advanced Technology',
    title: isArabic ? 'ذكاء اصطناعي يجعل تجربتك' : 'AI that makes your experience',
    titleAccent: isArabic ? 'أفضل' : 'better',
    description: isArabic
      ? 'نستخدم أحدث تقنيات الذكاء الاصطناعي لتوفير تجربة فريدة ومخصصة لكل مستخدم. احصل على توصيات دقيقة وحماية متقدمة.'
      : 'We use modern AI to deliver a personalized experience for each user with better recommendations and stronger protection.',
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#6d28d9] to-secondary" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium text-white/90 bg-white/20 border border-white/20 rounded-full px-4 py-1.5 inline-block mb-4">{text.badge}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {text.title}{" "}
              <span className="text-yellow-300 relative inline-block">
                {text.titleAccent}
                <svg className="absolute w-full h-2 bottom-0 left-0 text-yellow-300/50" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </span>
            </h2>
            <p className="text-indigo-100 mb-8 text-lg leading-relaxed">{text.description}</p>

            <div className="space-y-6">
              {points.map((p, i) => (
                <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <p.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1 text-lg">{p.title}</h3>
                    <p className="text-sm text-indigo-200">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center relative">
            {/* Radar / Scan Animation Effect */}
            <div className="relative w-[400px] h-[400px] flex items-center justify-center">
               <div className="absolute inset-0 border border-white/10 rounded-full"></div>
               <div className="absolute inset-24 border border-white/20 rounded-full"></div>
               <div className="absolute inset-48 border border-white/30 rounded-full"></div>
               
               {/* Scanning Line */}
               <div className="absolute inset-0 w-full h-full animate-spin [animation-duration:4s]">
                  <div className="h-1/2 w-full bg-gradient-to-t from-white/20 to-transparent opacity-50 blur-sm" style={{clipPath: 'polygon(50% 100%, 100% 0, 100% 100%)'}}></div>
               </div>

               {/* Center Icon */}
               <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                  <Sparkles size={40} className="text-white fill-white" />
               </div>

               {/* Floating Icons */}
               <div className="absolute top-10 right-20 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 animate-bounce delay-75">
                  <ShieldAlert size={20} className="text-white" />
               </div>
               <div className="absolute bottom-20 left-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 animate-bounce delay-500">
                  <BarChart3 size={20} className="text-white" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
