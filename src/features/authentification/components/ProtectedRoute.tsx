import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Shield, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = '/',
  requireEmailVerification = false 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading state mit besserer UX
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="h-12 w-12 text-purple-600 mx-auto animate-pulse" />
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-800">
            Verifying Authentication
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we check your login status...
          </p>
        </div>
      </div>
    );
  }

  // Wenn kein Benutzer vorhanden ist, zur Fallback-Seite weiterleiten
  if (!user) {
    console.log('🚫 Access denied - no authenticated user. Redirecting to:', fallbackPath);
    
    return (
      <Navigate 
        to={fallbackPath} 
        replace 
        state={{ 
          from: location.pathname + location.search,
          message: 'Please log in to access this page.',
          redirectReason: 'authentication_required'
        }} 
      />
    );
  }

  // Optional: Email-Verifizierung prüfen
  if (requireEmailVerification && !user.email_confirmed_at) {
    console.log('🚫 Access denied - email not verified for user:', user.email);
    
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md mx-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-orange-600 mx-auto" />
            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Email Verification Required
            </h2>
            <p className="mt-2 text-gray-600">
              Please verify your email address to access this page.
            </p>
            <div className="mt-4 p-3 bg-orange-100 text-orange-700 rounded-lg text-sm">
              Check your email for a verification link, or contact support if you need help.
            </div>
            <button
              onClick={() => window.location.href = fallbackPath}
              className="mt-6 py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auth-Status ist okay, Komponente rendern
  console.log('✅ Access granted for authenticated user:', user.email);
  return <>{children}</>;
};

export default ProtectedRoute;