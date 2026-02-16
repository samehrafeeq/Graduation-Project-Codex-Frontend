import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 bg-gray-50/50">
      {/* Background gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl px-4 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center mb-6">
            <Logo iconClassName="w-14 h-14" textClassName="text-4xl" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">انضم إلى مجتمعنا</h1>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">اختر نوع الحساب الذي يناسب احتياجاتك لتبدأ رحلتك معنا</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Buyer Card */}
          <Link to="/register/buyer" className="group">
            <Card className="h-full border-0 shadow-xl shadow-black/5 bg-white hover:bg-white/90 transition-all hover:scale-[1.02] hover:shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20"></div>
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <User size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">مشتري</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  ابحث عن خدمات احترافية، تواصل مع المبدعين، وانجز مشاريعك بسهولة وأمان.
                </p>
                <Button className="mt-auto w-full bg-blue-600/10 text-blue-700 hover:bg-blue-600 hover:text-white font-bold h-12 rounded-xl transition-all">
                  سجل كمشتري
                  <ArrowLeadingIcon className="mr-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Seller Card */}
          <Link to="/register/seller" className="group">
            <Card className="h-full border-0 shadow-xl shadow-black/5 bg-white hover:bg-white/90 transition-all hover:scale-[1.02] hover:shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20"></div>
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-20 h-20 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                  <FileText size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">بائع خدمات</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  اعرض مهاراتك، قدم خدماتك للآلاف من العملاء، وابدأ في تحقيق دخل مستمر.
                </p>
                <Button className="mt-auto w-full bg-purple-600/10 text-purple-700 hover:bg-purple-600 hover:text-white font-bold h-12 rounded-xl transition-all">
                  سجل كبائع
                  <ArrowLeadingIcon className="mr-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Login Link */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-primary font-bold hover:underline transition-all text-lg">
              تسجيل الدخول
            </Link>
          </p>
        </div>

           {/* Back to home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-2 group">
            <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform" />
            العودة للرئيسية
          </Link>
        </div>

      </div>
    </div>
  );
};

const ArrowLeadingIcon = ({className}: {className?: string}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
)

export default Register;
