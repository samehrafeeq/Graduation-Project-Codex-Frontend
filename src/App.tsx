import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterBuyer from "./pages/RegisterBuyer";
import RegisterSeller from "./pages/RegisterSeller";
import NotFound from "./pages/NotFound";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfilePage from "./pages/dashboard/ProfilePage";
import VerificationPage from "./pages/dashboard/VerificationPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminBuyers from "./pages/admin/AdminBuyers";
import AdminWhatsApp from "./pages/admin/AdminWhatsApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/buyer" element={<RegisterBuyer />} />
            <Route path="/register/seller" element={<RegisterSeller />} />

            {/* Dashboard Routes (Buyer & Seller) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <DashboardHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/verification"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <VerificationPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/sellers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSellers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/buyers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminBuyers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/whatsapp"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminWhatsApp />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
