import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Reverse of ProtectedRoute — only accessible to non-authenticated users.
 * Redirects logged-in users to their appropriate dashboard.
 */
const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
