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

export default api;
