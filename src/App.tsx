import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UiPreferencesProvider } from "@/contexts/UiPreferencesContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestRoute from "@/components/GuestRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterBuyer from "./pages/RegisterBuyer";
import RegisterSeller from "./pages/RegisterSeller";
import NotFound from "./pages/NotFound";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfilePage from "./pages/dashboard/ProfilePage";
import VerificationPage from "./pages/dashboard/VerificationPage";
import SellerServices from "./pages/dashboard/SellerServices";
import ServiceForm from "./pages/dashboard/ServiceForm";
import SellerWallet from "./pages/dashboard/SellerWallet";
import SellerStats from "./pages/dashboard/SellerStats";
import BrowseServices from "./pages/BrowseServices";
import ServiceDetail from "./pages/ServiceDetail";
import UserProfile from "./pages/UserProfile";
import BuyerOrders from "./pages/dashboard/BuyerOrders";
import OrderDetail from "./pages/dashboard/OrderDetail";
import ChatPage from "./pages/dashboard/ChatPage";
import FavoritesPage from "./pages/dashboard/FavoritesPage";
import SupportTicketsPage from "./pages/dashboard/SupportTicketsPage";
import AISupportChatPage from "./pages/dashboard/AISupportChatPage";
import MissingServiceRequestsPage from "./pages/dashboard/MissingServiceRequestsPage";
import NewMissingServiceRequestPage from "./pages/dashboard/NewMissingServiceRequestPage";
import SellerMissingServiceRequestReplyPage from "./pages/dashboard/SellerMissingServiceRequestReplyPage";
import DashboardLayout from "./components/DashboardLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminBuyers from "./pages/admin/AdminBuyers";
import AdminWhatsApp from "./pages/admin/AdminWhatsApp";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminServicesReview from "./pages/admin/AdminServicesReview";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminChat from "./pages/admin/AdminChat";
import AdminWallet from "./pages/admin/AdminWallet";
import AdminSupportTickets from "./pages/admin/AdminSupportTickets";
import AdminMissingServiceRequests from "./pages/admin/AdminMissingServiceRequests";
import AdminPaymentMethods from "./pages/admin/AdminPaymentMethods";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UiPreferencesProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/register/buyer" element={<GuestRoute><RegisterBuyer /></GuestRoute>} />
            <Route path="/register/seller" element={<GuestRoute><RegisterSeller /></GuestRoute>} />

            {/* Service browsing (inside dashboard) */}
            <Route
              path="/services"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <BrowseServices />
                </ProtectedRoute>
              }
            />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/profile/:id" element={<UserProfile />} />

            {/* Favorites */}
            <Route
              path="/dashboard/favorites"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />

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
            <Route
              path="/dashboard/services"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/services/new"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <ServiceForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/services/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <ServiceForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/wallet"
              element={
                <ProtectedRoute allowedRoles={['seller', 'buyer']}>
                  <SellerWallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/stats"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerStats />
                </ProtectedRoute>
              }
            />

            {/* Buyer Order Routes */}
            <Route
              path="/dashboard/orders"
              element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <DashboardLayout>
                    <BuyerOrders />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/orders/:id"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <DashboardLayout>
                    <OrderDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Chat Route */}
            <Route
              path="/dashboard/chat"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <DashboardLayout>
                    <ChatPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/support"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <SupportTicketsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/missing-services"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <MissingServiceRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/missing-services/new"
              element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <NewMissingServiceRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/missing-services/:id/reply"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerMissingServiceRequestReplyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/support/ai"
              element={
                <ProtectedRoute allowedRoles={['buyer', 'seller']}>
                  <AISupportChatPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />
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
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminServicesReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/chat"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/wallet"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminWallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payment-methods"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPaymentMethods />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/support"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSupportTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/missing-services"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminMissingServiceRequests />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </UiPreferencesProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
