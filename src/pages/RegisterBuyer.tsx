import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, Phone, MapPin, Globe, FileText, Camera, CheckCircle2, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Logo } from "@/components/Logo";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ThemeLanguageSwitcher from "@/components/ThemeLanguageSwitcher";

const RegisterBuyer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    country: '', city: '', bio: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Start cooldown when entering OTP step
  const startCooldown = useCallback(() => setResendCooldown(60), []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0645\u062a\u0637\u0627\u0628\u0642\u0629');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await authApi.registerBuyer({
        name: form.name, email: form.email, phone: form.phone,
        password: form.password, country: form.country || undefined,
        city: form.city || undefined, bio: form.bio || undefined,
      });
      setUserId(res.data.userId);
      setStep(2);
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.message || '\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062a\u0633\u062c\u064a\u0644');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!userId || otpCode.length !== 6) return;
    setIsLoading(true);
    try {
      await authApi.verifyOtp({ userId, code: otpCode });
      toast({ title: '\u062a\u0645 \u0627\u0644\u062a\u062d\u0642\u0642', description: '\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628\u0643 \u0628\u0646\u062c\u0627\u062d! \u064a\u0645\u0643\u0646\u0643 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0627\u0644\u0622\u0646.' });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || '\u0631\u0645\u0632 \u0627\u0644\u062a\u062d\u0642\u0642 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userId || resendCooldown > 0) return;
    try {
      await authApi.resendOtp(userId);
      startCooldown();
      toast({ title: '\u062a\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644', description: '\u062a\u0645 \u0625\u0639\u0627\u062f\u0629 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062a\u062d\u0642\u0642' });
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 bg-muted/30">
      {/* Background gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[600px] px-4 animate-in fade-in zoom-in-95 duration-500">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
            <Logo iconClassName="w-12 h-12" textClassName="text-3xl" />
          </Link>
          <div className="flex justify-center mb-4">
            <ThemeLanguageSwitcher compact />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 1 ? "إنشاء حساب مشتري" : "تأكيد رقم الهاتف"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === 1 ? "انضم كمشتري وابدأ في طلب الخدمات" : "يرجى إدخال رمز التحقق المرسل إليك عبر واتساب"}
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            {step === 1 ? (
              <form className="space-y-6" onSubmit={handleRegister}>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              {/* Mandatory Information Header */}
              <div className="flex items-center gap-2 border-b border-border pb-2">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <h3 className="font-bold text-foreground">البيانات الأساسية</h3>
                 <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mr-auto">إلزامية</span>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                 {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-foreground">الاسم الكامل</Label>
                  <div className="relative group">
                    <User className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                    <Input id="name" placeholder="الاسم الكامل" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="pr-10 h-11 bg-background border-input focus:bg-background focus:border-primary rounded-xl" required />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground">البريد الإلكتروني</Label>
                  <div className="relative group">
                    <Mail className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                    <Input id="email" type="email" placeholder="example@mail.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="pr-10 h-11 bg-background border-input focus:bg-background focus:border-primary rounded-xl" required />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-foreground">رقم الهاتف</Label>
                  <div className="relative group">
                    <Phone className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                    <Input id="phone" type="tel" placeholder="05xxxxxxxx" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="pr-10 h-11 bg-background border-input focus:bg-background focus:border-primary rounded-xl" required />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">كلمة المرور</Label>
                  <div className="relative group">
                    <Lock className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({...form, password: e.target.value})}
                      className="pr-10 pl-10 h-11 bg-background border-input focus:bg-background focus:border-primary rounded-xl"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">تأكيد كلمة المرور</Label>
                  <div className="relative group">
                    <Lock className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                      className="pr-10 pl-10 h-11 bg-background border-input focus:bg-background focus:border-primary rounded-xl"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Information Header */}
              <div className="flex items-center gap-2 border-b border-border pb-2 pt-2">
                 <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                 <h3 className="font-bold text-foreground">بيانات إضافية</h3>
                 <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mr-auto">اختياري</span>
              </div>

              <div className="space-y-5">
                 {/* Avatar Upload */}
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground relative overflow-hidden group hover:border-primary cursor-pointer transition-colors">
                       {avatarPreview ? (
                         <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                         <Camera size={24} className="group-hover:text-primary transition-colors" />
                       )}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleAvatarChange} />
                    </div>
                    <div className="flex-1">
                       <h4 className="text-sm font-semibold text-foreground">الصورة الشخصية</h4>
                       <p className="text-xs text-muted-foreground mt-1">عزز ملفك الشخصي بصورة احترافية. (PNG, JPG بحد أقصى 2MB)</p>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-5">
                    {/* Country/City */}
                    <div className="space-y-2">
                       <Label className="text-sm font-semibold text-foreground">الدولة / المدينة</Label>
                       <div className="relative">
                          <MapPin className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground z-10" size={16} />
                           <Select>
                             <SelectTrigger className="h-11 pr-10 bg-background border-input rounded-xl focus:ring-primary">
                               <SelectValue placeholder="اختر الدولة" />
                             </SelectTrigger>
                             <SelectContent align="end">
                               <SelectItem value="sa">السعودية</SelectItem>
                               <SelectItem value="eg">مصر</SelectItem>
                               <SelectItem value="ae">الإمارات</SelectItem>
                               <SelectItem value="kw">الكويت</SelectItem>
                               <SelectItem value="other">أخرى</SelectItem>
                             </SelectContent>
                           </Select>
                       </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                       <Label className="text-sm font-semibold text-foreground">اللغة المفضلة</Label>
                       <div className="relative">
                          <Globe className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground z-10" size={16} />
                           <Select>
                             <SelectTrigger className="h-11 pr-10 bg-background border-input rounded-xl focus:ring-primary">
                               <SelectValue placeholder="العربية" />
                             </SelectTrigger>
                             <SelectContent align="end">
                               <SelectItem value="ar">العربية</SelectItem>
                               <SelectItem value="en">English</SelectItem>
                             </SelectContent>
                           </Select>
                       </div>
                    </div>
                 </div>

                 {/* Bio */}
                 <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-semibold text-foreground">نبذة عنك</Label>
                    <div className="relative group">
                       <FileText className="absolute top-3 right-3 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                       <Textarea id="bio" placeholder="أخبرنا قليلاً عن نفسك وما تبحث عنه..." className="min-h-[80px] pr-10 bg-background border-input focus:bg-background focus:border-primary rounded-xl resize-none" />
                    </div>
                 </div>
              </div>

               {/* Terms */}
               <div className="flex items-start gap-2 bg-muted/40 p-3 rounded-lg border border-border">
                  <Checkbox id="terms" className="rounded-[4px] border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5" />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    أوافق على <a href="#" className="text-primary hover:underline font-bold">الشروط والأحكام</a> و <a href="#" className="text-primary hover:underline font-bold">سياسة الخصوصية</a>
                  </label>
                </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#5b4be3] hover:bg-[#4d3dc6] text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>إنشاء حساب<ArrowLeft size={18} className="mr-2" /></>}
              </Button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">أو سجل باستخدام</span>
                </div>
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" className="h-11 font-medium border-input hover:bg-muted/40 hover:text-foreground hover:border-border rounded-xl transition-all">
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="h-11 font-medium border-input hover:bg-muted/40 hover:text-foreground hover:border-border rounded-xl transition-all">
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>
            ) : (
              // Verification Step
              <div className="space-y-8 py-4 animate-in fade-in slide-in-from-right-10 duration-500">
                <div className="flex flex-col items-center justify-center space-y-4">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle2 size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-center text-foreground">تأكيد رقم واتساب</h3>
                   <p className="text-center text-muted-foreground max-w-xs leading-relaxed">
                      تم إرسال رمز التحقق المكون من 6 أرقام إلى رقم هاتفك المسجل عبر واتساب
                   </p>
                </div>

                <div className="flex justify-center dir-ltr">
                  <InputOTP maxLength={6} value={otpCode} onChange={(val) => setOtpCode(val)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg border-input" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg border-input" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg border-input" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg border-input" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg border-input" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg border-input" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex flex-col gap-3">
                   <Button 
                     className="w-full h-12 bg-[#5b4be3] hover:bg-[#4d3dc6] text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                     disabled={isLoading || otpCode.length !== 6}
                     onClick={handleVerifyOtp}
                   >
                     {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'تحقق وتفعيل الحساب'}
                   </Button>
                   <Button 
                     variant="ghost" 
                     className="text-muted-foreground hover:text-foreground"
                     onClick={() => setStep(1)}
                   >
                     الرجوع للتعديل
                   </Button>
                </div>

                <div className="text-center text-sm">
                   <p className="text-muted-foreground">لم يصلك الكود؟ {resendCooldown > 0 ? (
                     <span className="text-muted-foreground">إعادة الإرسال بعد <span className="text-primary font-bold" dir="ltr">{resendCooldown}</span> ثانية</span>
                   ) : (
                     <button type="button" onClick={handleResendOtp} className="text-primary font-bold hover:underline">إعادة الإرسال</button>
                   )}</p>
                </div>
              </div>
            )}


            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-[#7c3aed] font-bold hover:underline transition-all">
                تسجيل الدخول
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group">
            <ArrowLeft size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            العودة لصفحة التسجيل
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterBuyer;
