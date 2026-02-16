import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Background */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px] px-4 animate-in fade-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">لوحة التحكم</h1>
          <p className="text-sm text-gray-400">تسجيل دخول مدير النظام</p>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-2xl bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border-gray-700">
          <CardContent className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-300">
                  البريد الإلكتروني
                </Label>
                <div className="relative group">
                  <Mail className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@khadamati.com"
                    className="pr-10 h-12 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:bg-gray-600 focus:border-indigo-500 transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-300">
                  كلمة المرور
                </Label>
                <div className="relative group">
                  <Lock className="absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10 pl-10 h-12 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:bg-gray-600 focus:border-indigo-500 transition-all rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-500/20 transition-all"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    تسجيل الدخول
                    <ArrowLeft size={18} className="mr-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
