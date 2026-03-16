import { Code, Palette, PenTool, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiPreferences } from "@/contexts/UiPreferencesContext";

const services = [
  {
    icon: Code,
    title: "البرمجة والتطوير",
    description: "تطوير مواقع وتطبيقات الويب والموبايل بأحدث التقنيات",
    price: "يبدأ من $25",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Palette,
    title: "التصميم الجرافيكي",
    description: "تصميم شعارات وهويات بصرية ومنشورات سوشال ميديا",
    price: "يبدأ من $15",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: PenTool,
    title: "الكتابة والترجمة",
    description: "كتابة محتوى إبداعي وترجمة احترافية بجميع اللغات",
    price: "يبدأ من $10",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "التسويق الإلكتروني",
    description: "إدارة حملات إعلانية وتحسين محركات البحث SEO",
    price: "يبدأ من $30",
    color: "bg-green-50 text-green-600",
  },
];

const ServicesSection = () => {
  const { isArabic } = useUiPreferences();

  const services = isArabic
    ? [
        {
          icon: Code,
          title: "البرمجة والتطوير",
          description: "تطوير مواقع وتطبيقات الويب والموبايل بأحدث التقنيات",
          price: "يبدأ من $25",
          color: "bg-blue-50 text-blue-600",
        },
        {
          icon: Palette,
          title: "التصميم الجرافيكي",
          description: "تصميم شعارات وهويات بصرية ومنشورات سوشال ميديا",
          price: "يبدأ من $15",
          color: "bg-pink-50 text-pink-600",
        },
        {
          icon: PenTool,
          title: "الكتابة والترجمة",
          description: "كتابة محتوى إبداعي وترجمة احترافية بجميع اللغات",
          price: "يبدأ من $10",
          color: "bg-amber-50 text-amber-600",
        },
        {
          icon: TrendingUp,
          title: "التسويق الإلكتروني",
          description: "إدارة حملات إعلانية وتحسين محركات البحث SEO",
          price: "يبدأ من $30",
          color: "bg-green-50 text-green-600",
        },
      ]
    : [
        {
          icon: Code,
          title: "Development",
          description: "Build modern web and mobile apps using the latest technologies",
          price: "Starting at $25",
          color: "bg-blue-50 text-blue-600",
        },
        {
          icon: Palette,
          title: "Graphic Design",
          description: "Create logos, visual identities, and social media assets",
          price: "Starting at $15",
          color: "bg-pink-50 text-pink-600",
        },
        {
          icon: PenTool,
          title: "Writing & Translation",
          description: "Creative writing and professional translation in multiple languages",
          price: "Starting at $10",
          color: "bg-amber-50 text-amber-600",
        },
        {
          icon: TrendingUp,
          title: "Digital Marketing",
          description: "Run ad campaigns and improve SEO performance",
          price: "Starting at $30",
          color: "bg-green-50 text-green-600",
        },
      ];

  const text = {
    badge: isArabic ? 'الخدمات' : 'Services',
    title: isArabic ? 'الخدمات المتاحة' : 'Available Services',
    description: isArabic
      ? 'اكتشف مجموعة واسعة من الخدمات الاحترافية التي يقدمها أفضل المستقلين'
      : 'Discover a wide range of professional services from top freelancers',
    allCategories: isArabic ? 'عرض جميع الفئات' : 'View All Categories',
  };

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary bg-accent rounded-full px-4 py-1.5 inline-block mb-4">{text.badge}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{text.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{text.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {services.map((s, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                <s.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.description}</p>
              <span className="text-sm font-semibold text-primary">{s.price}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="rounded-full px-8">{text.allCategories}</Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
