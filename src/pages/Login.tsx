import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useUiPreferences } from "@/contexts/UiPreferencesContext";
import ThemeLanguageSwitcher from "@/components/ThemeLanguageSwitcher";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isArabic } = useUiPreferences();

  const text = {
    title: isArabic ? 'تسجيل الدخول' : 'Login',
    subtitle: isArabic ? 'أدخل بياناتك للوصول إلى حسابك' : 'Enter your details to access your account',
    invalidCredentials: isArabic ? 'بيانات الدخول غير صحيحة' : 'Invalid login credentials',
    email: isArabic ? 'البريد الإلكتروني' : 'Email',
    emailPlaceholder: isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email',
    password: isArabic ? 'كلمة المرور' : 'Password',
    passwordPlaceholder: isArabic ? 'أدخل كلمة المرور' : 'Enter your password',
    forgot: isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?',
    remember: isArabic ? 'تذكرني' : 'Remember me',
    login: isArabic ? 'تسجيل الدخول' : 'Login',
    or: isArabic ? 'أو' : 'or',
    noAccount: isArabic ? 'ليس لديك حساب؟' : "Don't have an account?",
    create: isArabic ? 'إنشاء حساب جديد' : 'Create a new account',
    backHome: isArabic ? 'العودة للرئيسية' : 'Back to home',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || text.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-muted/30">
      {/* Background gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px] px-4 animate-in fade-in zoom-in-95 duration-500">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
             <Logo iconClassName="w-12 h-12" textClassName="text-3xl" />
          </Link>
          <div className="flex justify-center mb-4">
            <ThemeLanguageSwitcher compact />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{text.title}</h1>
          <p className="text-sm text-muted-foreground">{text.subtitle}</p>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center">
                  {error}
                </div>
              )}
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  {text.email}
                </Label>
                <div className="relative group">
                  <Mail className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={text.emailPlaceholder}
                    className="pr-10 h-12 bg-background border-input focus:bg-background focus:border-primary transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                    {text.password}
                  </Label>
                  <a href="#" className="text-xs text-[#7c3aed] hover:text-[#6d28d9] hover:underline font-medium transition-colors">
                    {text.forgot}
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={text.passwordPlaceholder}
                    className="pr-10 pl-10 h-12 bg-background border-input focus:bg-background focus:border-primary transition-all rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="rounded-[4px] border-gray-300 data-[state=checked]:bg-[#7c3aed] data-[state=checked]:border-[#7c3aed]" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                  {text.remember}
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#5b4be3] hover:bg-[#4d3dc6] text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {text.login}
                    <ArrowLeft size={18} className="mr-2" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">{text.or}</span>
                </div>
              </div>

              {/* Google & Facebook */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" className="h-11 font-medium border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 rounded-xl transition-all">
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="h-11 font-medium border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 rounded-xl transition-all">
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              {text.noAccount}{" "}
              <Link to="/register" className="text-[#7c3aed] font-bold hover:underline transition-all">
                {text.create}
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 group">
            <ArrowLeft size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
            {text.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
