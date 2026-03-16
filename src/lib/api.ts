import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect if already on login pages
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// ===== Auth API =====
export const authApi = {
  registerBuyer: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    country?: string;
    city?: string;
    bio?: string;
  }) => api.post('/auth/register/buyer', data),

  registerSeller: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => api.post('/auth/register/seller', data),

  submitSellerKyc: (userId: number, formData: FormData) =>
    api.post(`/auth/register/seller/kyc/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  verifyOtp: (data: { userId: number; code: string }) =>
    api.post('/auth/verify-otp', data),

  resendOtp: (userId: number) => api.post(`/auth/resend-otp/${userId}`),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  adminLogin: (data: { email: string; password: string }) =>
    api.post('/auth/admin/login', data),

  getProfile: () => api.get('/auth/me'),
};

// ===== Users API =====
export const usersApi = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: {
    name?: string;
    phone?: string;
    country?: string;
    city?: string;
    bio?: string;
  }) => api.patch('/users/profile', data),

  uploadAvatar: (formData: FormData) =>
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getPublicProfile: (userId: number) => api.get(`/users/${userId}/public`),

  getOnlineUsers: () => api.get('/users/online/status'),
};

// ===== KYC API =====
export const kycApi = {
  getStatus: () => api.get('/kyc/status'),
};

// ===== Admin API =====
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getAllSellers: () => api.get('/admin/sellers'),
  getPendingSellers: () => api.get('/admin/sellers/pending'),
  getAllBuyers: () => api.get('/admin/buyers'),
  approveSeller: (sellerId: number) =>
    api.post(`/admin/sellers/${sellerId}/approve`),
  rejectSeller: (sellerId: number, reason: string) =>
    api.post(`/admin/sellers/${sellerId}/reject`, { reason }),
};

// ===== WhatsApp API =====
export const whatsappApi = {
  getStatus: () => api.get('/admin/whatsapp/status'),
  getQrCode: () => api.get('/admin/whatsapp/qr'),
  connect: () => api.post('/admin/whatsapp/connect'),
  disconnect: () => api.post('/admin/whatsapp/disconnect'),
  sendMessage: (phone: string, message: string) =>
    api.post('/admin/whatsapp/send', { phone, message }),
};

// ===== Categories API =====
export const categoriesApi = {
  getActive: () => api.get('/categories'),
  getAll: () => api.get('/categories/admin/all'),
  getOne: (id: number) => api.get(`/categories/${id}`),
  create: (data: { name: string; description?: string; icon?: string; sortOrder?: number; isActive?: boolean }) =>
    api.post('/categories', data),
  update: (id: number, data: any) => api.patch(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// ===== Services API =====
export const servicesApi = {
  // عامة
  getPublic: (categoryId?: number) =>
    api.get('/services', { params: categoryId ? { categoryId } : {} }),
  getOnePublic: (id: number) => api.get(`/services/details/${id}`),
  getSellerPublic: (sellerId: number) => api.get(`/services/seller/${sellerId}/public`),
  // البائع
  getMy: () => api.get('/services/seller/my'),
  getMyStats: () => api.get('/services/seller/stats'),
  getOne: (id: number) => api.get(`/services/seller/${id}`),
  create: (formData: FormData) =>
    api.post('/services/seller', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: number, formData: FormData) =>
    api.patch(`/services/seller/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (id: number) => api.delete(`/services/seller/${id}`),
  // أدمن
  adminGetAll: (params?: { status?: string }) =>
    api.get('/services/admin/all', { params }),
  adminReview: (id: number, data: { action: string; rejectionReason?: string }) =>
    api.post(`/services/admin/${id}/review`, data),
};

// ===== Orders API =====
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getByBuyer: () => api.get('/orders/buyer'),
  getBySeller: () => api.get('/orders/seller'),
  getOne: (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, data: { status: string; cancelReason?: string }) =>
    api.patch(`/orders/${id}/status`, data),
  getAllAdmin: () => api.get('/orders/admin/all'),
  getAdminStats: () => api.get('/orders/admin/stats'),
};

// ===== Reviews API =====
export const reviewsApi = {
  getByService: (serviceId: number) => api.get(`/reviews/service/${serviceId}`),
  getSummary: (serviceId: number) => api.get(`/reviews/service/${serviceId}/summary`),
  create: (data: { orderId: number; rating: number; comment?: string }) =>
    api.post('/reviews', data),
};

// ===== Wallet API =====
export const walletApi = {
  getMyWallet: () => api.get('/wallet'),
  getMyTransactions: () => api.get('/wallet/transactions'),
  requestWithdrawal: (data: { amount: number; phoneNumber: string }) => api.post('/wallet/withdraw', data),
  getPaymentMethods: () => api.get('/wallet/payment-methods'),
  createTopupRequest: (data: { paymentMethodId: number; amount: number; screenshot?: File | null }) => {
    const formData = new FormData();
    formData.append('paymentMethodId', String(data.paymentMethodId));
    formData.append('amount', String(data.amount));
    if (data.screenshot) {
      formData.append('screenshot', data.screenshot);
    }
    return api.post('/wallet/topup-requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyTopupRequests: () => api.get('/wallet/topup-requests/my'),
  getAdminStats: () => api.get('/wallet/admin/stats'),
  adminGetAll: () => api.get('/wallet/admin/all'),
  adminGetUserWallet: (userId: number) => api.get(`/wallet/admin/user/${userId}`),
  adminGetUserTransactions: (userId: number) => api.get(`/wallet/admin/user/${userId}/transactions`),
  adminDeposit: (data: { userId: number; amount: number; description?: string }) =>
    api.post('/wallet/admin/deposit', data),
  adminDeduct: (data: { userId: number; amount: number; description?: string }) =>
    api.post('/wallet/admin/deduct', data),
  adminGetPaymentMethods: () => api.get('/wallet/admin/payment-methods'),
  adminCreatePaymentMethod: (data: {
    name: string;
    type: string;
    accountNumber: string;
    isActive?: boolean;
  }) => api.post('/wallet/admin/payment-methods', data),
  adminUpdatePaymentMethod: (id: number, data: {
    name?: string;
    type?: string;
    accountNumber?: string;
    isActive?: boolean;
  }) => api.patch(`/wallet/admin/payment-methods/${id}`, data),
  adminDeletePaymentMethod: (id: number) => api.delete(`/wallet/admin/payment-methods/${id}`),
  adminGetTopupRequests: (params?: { status?: 'pending' | 'approved' | 'rejected' }) =>
    api.get('/wallet/admin/topup-requests', { params }),
  adminReviewTopupRequest: (id: number, data: { status: 'approved' | 'rejected'; reviewNote?: string }) =>
    api.patch(`/wallet/admin/topup-requests/${id}/review`, data),
  adminGetWithdrawalRequests: (params?: { status?: 'pending' | 'approved' | 'rejected' }) =>
    api.get('/wallet/admin/withdrawal-requests', { params }),
  adminReviewWithdrawalRequest: (id: number, data: { status: 'approved' | 'rejected'; reviewNote?: string }) =>
    api.patch(`/wallet/admin/withdrawal-requests/${id}/review`, data),
};

// ===== Settings API =====
export const settingsApi = {
  getPublic: () => api.get('/settings/public'),
  getAll: () => api.get('/settings/admin'),
  updateMany: (settings: Record<string, string>) =>
    api.patch('/settings/admin', { settings }),
};

// ===== Chat API =====
export const chatApi = {
  startConversation: (data: { sellerId: number; serviceId?: number; message: string }) =>
    api.post('/chat/start', data),
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId: number) => api.get(`/chat/conversations/${conversationId}/messages`),
  markAsRead: (conversationId: number) => api.post(`/chat/conversations/${conversationId}/read`),
  getUnreadCount: () => api.get('/chat/unread-count'),
  // أدمن
  adminGetAll: () => api.get('/chat/admin/all'),
  adminGetMessages: (conversationId: number) => api.get(`/chat/admin/${conversationId}/messages`),
};

// ===== Notifications API =====
export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: number) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
};

// ===== Favorites API =====
export const favoritesApi = {
  toggle: (serviceId: number) => api.post(`/favorites/${serviceId}`),
  getAll: () => api.get('/favorites'),
  check: (serviceId: number) => api.get(`/favorites/check/${serviceId}`),
  checkMany: (serviceIds: number[]) =>
    api.post('/favorites/check-many', { serviceIds }),
};

// ===== Support Tickets API =====
export const supportTicketsApi = {
  create: (data: { title: string; isIssue: boolean; issueType: string; description?: string }) =>
    api.post('/support-tickets', data),
  getMy: () => api.get('/support-tickets/my'),
  getOne: (ticketId: number) => api.get(`/support-tickets/${ticketId}`),
  addReply: (ticketId: number, data: { message: string; image?: File | null }) => {
    const formData = new FormData();
    formData.append('message', data.message);
    if (data.image) {
      formData.append('image', data.image);
    }
    return api.post(`/support-tickets/${ticketId}/replies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  adminGetAll: (params?: { status?: string }) =>
    api.get('/support-tickets/admin/all', { params }),
  adminUpdateStatus: (ticketId: number, data: { status: string; adminResponse?: string }) =>
    api.patch(`/support-tickets/admin/${ticketId}/status`, data),
};

// ===== AI Support API =====
export const aiSupportApi = {
  chat: (data: {
    message: string;
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }) => api.post('/ai-support/chat', data),
};

// ===== Missing Service Requests API =====
export const missingServiceRequestsApi = {
  create: (data: { title: string; description: string; averageBudget: number }) =>
    api.post('/missing-service-requests', data),
  getAll: (params?: { foundStatus?: 'pending' | 'found' | 'not_found' }) =>
    api.get('/missing-service-requests', { params }),
  getOne: (requestId: number) => api.get(`/missing-service-requests/${requestId}`),
  getMy: () => api.get('/missing-service-requests/my'),
  addSellerComment: (requestId: number, data: { comment: string }) =>
    api.post(`/missing-service-requests/${requestId}/comments`, data),
  updateFoundStatus: (requestId: number, data: { foundStatus: 'pending' | 'found' | 'not_found' }) =>
    api.patch(`/missing-service-requests/${requestId}/found-status`, data),
  adminGetAll: (params?: { foundStatus?: 'pending' | 'found' | 'not_found' }) =>
    api.get('/missing-service-requests/admin/all', { params }),
};

export default api;
