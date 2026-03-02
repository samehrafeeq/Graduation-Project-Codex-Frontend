import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { whatsappApi } from '@/lib/api';
import { MessageCircle, Wifi, WifiOff, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminWhatsApp = () => {
  const [status, setStatus] = useState<any>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const statusRes = await whatsappApi.getStatus();
      setStatus(statusRes.data);

      if (statusRes.data.hasQrCode) {
        const qrRes = await whatsappApi.getQrCode();
        setQrCode(qrRes.data.qrCode);
      } else {
        setQrCode(null);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await whatsappApi.connect();
      toast({ title: 'جاري الاتصال', description: 'يرجى مسح رمز QR من تطبيق واتساب' });
      // Start polling more frequently
      setTimeout(fetchStatus, 2000);
    } catch (err: any) {
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء الاتصال', variant: 'destructive' });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await whatsappApi.disconnect();
      toast({ title: 'تم قطع الاتصال', description: 'تم قطع اتصال واتساب بنجاح' });
      fetchStatus();
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' });
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">إدارة واتساب</h1>
          <p className="text-muted-foreground mt-1">ربط حساب واتساب لإرسال رسائل التحقق</p>
        </div>

        {/* Connection Status */}
        <Card className="bg-white shadow-sm ring-1 ring-black/[0.04] mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    status?.status === 'connected'
                      ? 'bg-green-500/10 text-green-600'
                      : status?.status === 'connecting'
                      ? 'bg-yellow-500/10 text-yellow-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {status?.status === 'connected' ? (
                    <Wifi size={28} />
                  ) : (
                    <WifiOff size={28} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    {status?.status === 'connected'
                      ? 'متصل'
                      : status?.status === 'connecting'
                      ? 'جاري الاتصال...'
                      : 'غير متصل'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {status?.status === 'connected' && status?.phoneNumber
                      ? `الرقم: ${status.phoneNumber}`
                      : 'لم يتم ربط حساب واتساب'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-accent text-foreground hover:bg-accent/80 border border-border"
                  onClick={fetchStatus}
                >
                  <RefreshCw size={16} />
                </Button>

                {status?.status === 'connected' ? (
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-500 text-white"
                    disabled={disconnecting}
                    onClick={handleDisconnect}
                  >
                    {disconnecting ? (
                      <Loader2 size={16} className="animate-spin ml-1" />
                    ) : (
                      <WifiOff size={16} className="ml-1" />
                    )}
                    قطع الاتصال
                  </Button>
                ) : status?.status !== 'connecting' ? (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-500 text-white"
                    disabled={connecting}
                    onClick={handleConnect}
                  >
                    {connecting ? (
                      <Loader2 size={16} className="animate-spin ml-1" />
                    ) : (
                      <MessageCircle size={16} className="ml-1" />
                    )}
                    اتصال
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        {qrCode && (
          <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">مسح رمز QR</h3>
              <p className="text-muted-foreground text-sm mb-6">
                افتح واتساب على هاتفك → الأجهزة المرتبطة → ربط جهاز → امسح الرمز التالي
              </p>
              <div className="inline-block bg-white p-4 rounded-2xl">
                <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
              </div>
              <p className="text-muted-foreground text-xs mt-4">
                يتم تحديث الرمز تلقائياً
              </p>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        {status?.status === 'connected' && (
          <Card className="bg-white shadow-sm ring-1 ring-black/[0.04] mt-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MessageCircle size={20} className="text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground mb-1">واتساب متصل بنجاح</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    سيتم إرسال رسائل التحقق (OTP) تلقائياً عبر واتساب عند تسجيل مستخدمين جدد.
                    يمكنك قطع الاتصال في أي وقت من هنا.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminWhatsApp;
