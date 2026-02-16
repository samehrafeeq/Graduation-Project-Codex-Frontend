import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, Phone, Camera, ShieldCheck, Upload, ScanFace, CheckCircle2, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { Logo } from "@/components/Logo";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const RegisterSeller = () => {
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
  });

  // KYC file state
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const startCooldown = useCallback(() => setResendCooldown(60), []);

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0645\u062a\u0637\u0627\u0628\u0642\u0629');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await authApi.registerSeller({
        name: form.name, email: form.email, phone: form.phone, password: form.password,
      });
      setUserId(res.data.userId);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || '\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062a\u0633\u062c\u064a\u0644');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !idFile || !selfieFile) {
      setError('\u064a\u0631\u062c\u0649 \u0631\u0641\u0639 \u062c\u0645\u064a\u0639 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('idDocument', idFile);
      formData.append('selfie', selfieFile);
      await authApi.submitSellerKyc(userId, formData);
      setStep(3);
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.message || '\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u0631\u0641\u0639 \u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!userId || otpCode.length !== 6) return;
    setIsLoading(true);
    try {
      await authApi.verifyOtp({ userId, code: otpCode });
      toast({
        title: '\u062a\u0645 \u0627\u0644\u062a\u0633\u062c\u064a\u0644 \u0628\u0646\u062c\u0627\u062d',
        description: '\u062d\u0633\u0627\u0628\u0643 \u0642\u064a\u062f \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629. \u0633\u064a\u062a\u0645 \u0625\u0628\u0644\u0627\u063a\u0643 \u0639\u0646\u062f \u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u062d\u0633\u0627\u0628\u0643.',
      });
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 bg-gray-50/50">
      {/* Background gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[600px] px-4 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
            <Logo iconClassName="w-12 h-12" textClassName="text-3xl" />
          </Link>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 1 && "إنشاء حساب بائع جديد"}
            {step === 2 && "توثيق الهوية (KYC)"}
            {step === 3 && "تأكيد رقم الهاتف"}
          </h1>
          <p className="text-sm text-gray-500">
            {step === 1 && "ابدأ رحلتك في بيع الخدمات والوصول لآلاف العملاء"}
            {step === 2 && "لضمان بيئة آمنة نحتاج للتحقق من هويتك"}
            {step === 3 && "سيصلك كود التفعيل عبر واتساب"}
          </p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mt-6 dir-rtl">
            <div className={`h-2 rounded-full transition-all duration-500 ${step >= 1 ? "w-8 bg-primary" : "w-2 bg-gray-200"}`} />
            <div className={`h-2 rounded-full transition-all duration-500 ${step >= 2 ? "w-8 bg-primary" : "w-2 bg-gray-200"}`} />
            <div className={`h-2 rounded-full transition-all duration-500 ${step >= 3 ? "w-8 bg-primary" : "w-2 bg-gray-200"}`} />
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-2xl shadow-black/5 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <form className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500" onSubmit={handleBasicSubmit}>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                   <h3 className="font-bold text-gray-700">البيانات الأساسية</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                   {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">الاسم الكامل</Label>
                    <div className="relative group">
                      <User className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                      <Input id="name" placeholder="الاسم كما في الهوية" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl" required />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">البريد الإلكتروني</Label>
                    <div className="relative group">
                      <Mail className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                      <Input id="email" type="email" placeholder="example@mail.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl" required />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">رقم الهاتف</Label>
                    <div className="relative group">
                      <Phone className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                      <Input id="phone" type="tel" placeholder="05xxxxxxxx" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl" required />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">سيتم استخدام هذا الرقم للتحقق عبر واتساب</p>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">كلمة المرور</Label>
                    <div className="relative group">
                      <Lock className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder=""
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        className="pr-10 pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">تأكيد كلمة المرور</Label>
                    <div className="relative group">
                      <Lock className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder=""
                        value={form.confirmPassword}
                        onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                        className="pr-10 pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                 {/* Terms */}
                 <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Checkbox id="terms" className="rounded-[4px] border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5" required />
                    <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer leading-relaxed">
                      أوافق على <a href="#" className="text-primary hover:underline font-bold">الشروط والأحكام</a> الخاص بالبائعين
                    </label>
                  </div>

                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-[#5b4be3] hover:bg-[#4d3dc6] text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>متابعة لخطوة التحقق<ArrowLeft size={18} className="mr-2" /></>}
                </Button>

                {/* Login link */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  لديك حساب بالفعل{" "}
                  <Link to="/login" className="text-[#7c3aed] font-bold hover:underline transition-all">
                    تسجيل الدخول
                  </Link>
                </p>
              </form>
            )}

            {/* STEP 2: KYC Verification */}
            {step === 2 && (
              <form className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500" onSubmit={handleKYCSubmit}>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-yellow-800 text-sm">
                   <ShieldCheck className="shrink-0 text-yellow-600" size={20} />
                   <p>لضمان حقوق الجميع ومنع الاحتيال يجب التحقق من هويتك قبل تفعيل حساب البائع. هذه المعلومات سرية ومشفرة.</p>
                </div>

                {/* ID Card Upload */}
                <div className="space-y-3">
                   <Label className="font-semibold text-gray-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">1</div>
                      صورة إثبات الهوية (بطاقة الرقم القومي / جواز السفر)
                   </Label>
                   
                   <div className="grid grid-cols-2 gap-4">
                      {/* Upload ID Button */}
                      <label className="h-32 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 group cursor-pointer">
                         <Upload size={24} className="text-gray-400 group-hover:text-primary transition-colors" />
                         <span className="text-sm font-semibold">{idFile ? idFile.name.slice(0, 20) : 'رفع صورة الهوية'}</span>
                         <input ref={idInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
                      </label>
                      
                      {/* Preview */}
                      <div className="h-32 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
                         {idFile ? (
                           <img src={URL.createObjectURL(idFile)} alt="ID Preview" className="h-full w-full object-cover rounded-xl" />
                         ) : (
                           <><Camera size={24} /><span className="text-sm">معاينة</span></>
                         )}
                      </div>
                   </div>
                   <p className="text-xs text-gray-400 mr-1">يجب أن تكون الصورة واضحة وتظهر كافة البيانات (الوجه الأمامي).</p>
                </div>

                {/* Selfie Cam/Upload */}
                <div className="space-y-3">
                   <Label className="font-semibold text-gray-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">2</div>
                      صورة سيلفي للتحقق
                   </Label>
                   <div className="grid grid-cols-2 gap-4">
                      {/* Upload Selfie Button */}
                      <label className="h-32 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-600 cursor-pointer">
                         <ScanFace size={24} className="text-gray-400" />
                         <span className="text-sm font-semibold">{selfieFile ? selfieFile.name.slice(0, 20) : 'رفع صورة سيلفي'}</span>
                         <input ref={selfieInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => setSelfieFile(e.target.files?.[0] || null)} />
                      </label>
                      
                      {/* Preview */}
                      <div className="h-32 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400">
                         {selfieFile ? (
                           <img src={URL.createObjectURL(selfieFile)} alt="Selfie Preview" className="h-full w-full object-cover rounded-xl" />
                         ) : (
                           <><Camera size={24} /><span className="text-sm">معاينة</span></>
                         )}
                      </div>
                   </div>
                   <p className="text-xs text-gray-400 mr-1">يجب أن تكون الصورة حديثة واضحة وبدون فلاتر أو نظارات شمسية.</p>
                </div>

                <div className="flex gap-3">
                   <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-600">
                      رجوع
                   </Button>
                   <Button type="submit" disabled={isLoading || !idFile || !selfieFile} className="flex-[2] h-12 bg-[#5b4be3] hover:bg-[#4d3dc6] text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>تأكيد ومتابعة<ArrowLeft size={18} className="mr-2" /></>}
                   </Button>
                </div>

              </form>
            )}

            {/* STEP 3: OTP Verification */}
            {step === 3 && (
              <div className="space-y-8 py-4 animate-in fade-in slide-in-from-right-10 duration-500">
                <div className="flex flex-col items-center justify-center space-y-4">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
                      <CheckCircle2 size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-center text-gray-800">تأكيد رقم واتساب</h3>
                   <p className="text-center text-gray-500 max-w-xs leading-relaxed">
                      لإتمام التسجيل أدخل الرمز المكون من 6 أرقام المرسل إلى الرقم المسجل.
                   </p>
                </div>

                <div className="flex justify-center dir-ltr">
                  <InputOTP maxLength={6} value={otpCode} onChange={(val) => setOtpCode(val)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={1} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={2} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={3} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={4} className="w-12 h-12 text-lg border-gray-300" />
                      <InputOTPSlot index={5} className="w-12 h-12 text-lg border-gray-300" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex flex-col gap-3">
                   <Button 
                     className="w-full h-12 bg-[#5b4be3] hover:bg-[#4d3dc6] text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                     disabled={isLoading || otpCode.length !== 6}
                     onClick={handleVerifyOtp}
                   >
                     {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'تحقق وإرسال الطلب'}
                   </Button>
                   <Button 
                     variant="ghost" 
                     className="text-gray-500 hover:text-gray-900"
                     onClick={() => setStep(2)}
                   >
                     تعديل بيانات الهوية
                   </Button>
                </div>

                <div className="text-center text-sm">
                   <p className="text-gray-400">لم يصلك الكود {resendCooldown > 0 ? (
                     <span className="text-gray-500">إعادة الإرسال بعد <span className="text-primary font-bold" dir="ltr">{resendCooldown}</span> ثانية</span>
                   ) : (
                     <button type="button" onClick={handleResendOtp} className="text-primary font-bold hover:underline">إعادة الإرسال</button>
                   )}</p>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Home Button (only on step 1) */}
        {step === 1 && (
          <div className="text-center mt-8">
            <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center gap-2 group">
              <ArrowLeft size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              العودة لصفحة التسجيل
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterSeller;
