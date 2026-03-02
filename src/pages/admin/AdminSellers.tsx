import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/api';
import { CheckCircle2, XCircle, Eye, User, Mail, Phone, Shield, Calendar, ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Base URL for uploads (remove /api suffix)
const UPLOADS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');

const AdminSellers = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSellerId, setRejectSellerId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await adminApi.getAllSellers();
      setSellers(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: number) => {
    try {
      await adminApi.approveSeller(sellerId);
      toast({ title: 'تمت الموافقة', description: 'تم تفعيل حساب البائع بنجاح' });
      fetchSellers();
      setSelectedSeller(null);
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء الموافقة', variant: 'destructive' });
    }
  };

  const handleReject = async () => {
    if (!rejectSellerId) return;
    try {
      await adminApi.rejectSeller(rejectSellerId, rejectReason);
      toast({ title: 'تم الرفض', description: 'تم رفض حساب البائع' });
      setShowRejectDialog(false);
      setRejectReason('');
      setRejectSellerId(null);
      setSelectedSeller(null);
      fetchSellers();
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء الرفض', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10">نشط</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/10">بانتظار الموافقة</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/10">مرفوض</Badge>;
      case 'suspended':
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/10">معلّق</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getKycBadge = (kycStatus?: string) => {
    if (!kycStatus) return <Badge variant="outline" className="text-muted-foreground border-border">لم يُقدَّم</Badge>;
    switch (kycStatus) {
      case 'verified':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10">✓ محقق</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/10">قيد المراجعة</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/10">مرفوض</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground border-border">{kycStatus}</Badge>;
    }
  };

  const getUploadUrl = (filePath: string) => {
    if (!filePath) return '';
    // filePath comes like "uploads/kyc/filename.jpg" or just the path
    const cleanPath = filePath.replace(/\\/g, '/');
    if (cleanPath.startsWith('http')) return cleanPath;
    return `${UPLOADS_BASE}/${cleanPath}`;
  };

  const filteredSellers = sellers.filter((s) => {
    if (activeTab === 'pending') return s.status === 'pending';
    if (activeTab === 'active') return s.status === 'active';
    if (activeTab === 'rejected') return s.status === 'rejected';
    return true;
  });

  const counts = {
    all: sellers.length,
    pending: sellers.filter((s) => s.status === 'pending').length,
    active: sellers.filter((s) => s.status === 'active').length,
    rejected: sellers.filter((s) => s.status === 'rejected').length,
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">إدارة البائعين</h1>
          <p className="text-muted-foreground mt-1">مراجعة وإدارة حسابات البائعين</p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-accent/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              الكل ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              بانتظار ({counts.pending})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              نشط ({counts.active})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              مرفوض ({counts.rejected})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sellers List */}
        <div className="space-y-4">
          {filteredSellers.length === 0 ? (
            <Card className="bg-white shadow-sm ring-1 ring-black/[0.04]">
              <CardContent className="p-12 text-center">
                <User size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">لا يوجد بائعين في هذا التصنيف</p>
              </CardContent>
            </Card>
          ) : (
            filteredSellers.map((seller) => (
              <Card key={seller.id} className="bg-white shadow-sm ring-1 ring-black/[0.04] hover:bg-accent/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Seller Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                        {seller.name?.charAt(0) || '؟'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-foreground truncate">{seller.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                            <Mail size={13} className="shrink-0" /> {seller.email}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1" dir="ltr">
                            <Phone size={13} className="shrink-0" /> {seller.phone}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {getStatusBadge(seller.status)}
                          {getKycBadge(seller.kyc?.status)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                        onClick={() => setSelectedSeller(seller)}
                      >
                        <Eye size={15} className="ml-1" />
                        عرض التفاصيل
                      </Button>
                      {seller.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="rounded-lg bg-green-600 hover:bg-green-500 text-white"
                            onClick={() => handleApprove(seller.id)}
                          >
                            <CheckCircle2 size={15} className="ml-1" />
                            موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="rounded-lg"
                            onClick={() => {
                              setRejectSellerId(seller.id);
                              setShowRejectDialog(true);
                            }}
                          >
                            <XCircle size={15} className="ml-1" />
                            رفض
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Seller Detail Dialog */}
        <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">تفاصيل البائع</DialogTitle>
            </DialogHeader>
            {selectedSeller && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4 bg-accent/30 rounded-xl p-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
                    {selectedSeller.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold truncate">{selectedSeller.name}</h3>
                    <p className="text-muted-foreground text-sm truncate">{selectedSeller.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getStatusBadge(selectedSeller.status)}
                      {getKycBadge(selectedSeller.kyc?.status)}
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-accent/30 rounded-lg p-3 flex items-center gap-3">
                    <Mail size={18} className="text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                      <p className="text-sm text-foreground truncate">{selectedSeller.email}</p>
                    </div>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3 flex items-center gap-3">
                    <Phone size={18} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                      <p className="text-sm text-foreground" dir="ltr">{selectedSeller.phone}</p>
                    </div>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3 flex items-center gap-3">
                    <Shield size={18} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">تحقق الهاتف</p>
                      <p className={`text-sm ${selectedSeller.isPhoneVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedSeller.isPhoneVerified ? 'محقق ✓' : 'غير محقق'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-3 flex items-center gap-3">
                    <Calendar size={18} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ التسجيل</p>
                      <p className="text-sm text-foreground">{new Date(selectedSeller.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* KYC Documents */}
                {selectedSeller.kyc && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <Shield size={18} className="text-primary" />
                      مستندات التحقق (KYC)
                    </h4>

                    {selectedSeller.kyc.rejectionReason && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-xs text-red-400 mb-1">سبب الرفض:</p>
                        <p className="text-sm text-red-300">{selectedSeller.kyc.rejectionReason}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* ID Document */}
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <ImageIcon size={14} /> صورة إثبات الهوية
                        </p>
                        {selectedSeller.kyc.idDocumentFront ? (
                          <div
                            className="relative rounded-lg overflow-hidden border border-border cursor-pointer group h-44"
                            onClick={() => setPreviewImage(getUploadUrl(selectedSeller.kyc.idDocumentFront))}
                          >
                            <img
                              src={getUploadUrl(selectedSeller.kyc.idDocumentFront)}
                              alt="ID Document"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 rounded-lg border border-border border-dashed flex items-center justify-center text-muted-foreground">
                            <p className="text-sm">لم يتم الرفع</p>
                          </div>
                        )}
                      </div>

                      {/* Selfie */}
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <ImageIcon size={14} /> صورة السيلفي
                        </p>
                        {selectedSeller.kyc.selfieImage ? (
                          <div
                            className="relative rounded-lg overflow-hidden border border-border cursor-pointer group h-44"
                            onClick={() => setPreviewImage(getUploadUrl(selectedSeller.kyc.selfieImage))}
                          >
                            <img
                              src={getUploadUrl(selectedSeller.kyc.selfieImage)}
                              alt="Selfie"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-44 rounded-lg border border-border border-dashed flex items-center justify-center text-muted-foreground">
                            <p className="text-sm">لم يتم الرفع</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedSeller.status === 'pending' && (
                  <div className="flex gap-3 pt-2 border-t border-border">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-lg h-11"
                      onClick={() => handleApprove(selectedSeller.id)}
                    >
                      <CheckCircle2 size={18} className="ml-2" />
                      موافقة وتفعيل الحساب
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 rounded-lg h-11"
                      onClick={() => {
                        setRejectSellerId(selectedSeller.id);
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle size={18} className="ml-2" />
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Preview Dialog */}
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="bg-black/95 border-gray-800 max-w-4xl p-2">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
            >
              <X size={18} />
            </button>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>رفض حساب البائع</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">يرجى كتابة سبب الرفض ليتم إرساله للبائع:</p>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="سبب الرفض..."
                className="min-h-[100px]"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectDialog(false)}
                >
                  إلغاء
                </Button>
                <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
                  تأكيد الرفض
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSellers;
