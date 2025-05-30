import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading state mit besserer UX
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-800">Checking authentication...</h2>
          <p className="mt-2 text-sm text-gray-600">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  // Wenn kein Benutzer vorhanden ist, zur Startseite weiterleiten
  // Aktuelle Route als "state" mitgeben für Redirect nach Login
  if (!user) {
    console.log('🚫 Access denied - no authenticated user. Redirecting to home...');
    return (
      <Navigate 
        to="/" 
        replace 
        state={{ 
          from: location.pathname,
          message: 'Please log in to access this page.' 
        }} 
      />
    );
  }

  // Auth-Status ist okay, Komponente rendern
  console.log('✅ Access granted for authenticated user:', user.email);
  return <>{children}</>;
};

export default ProtectedRoute;