import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Zeige Ladeindikator während der Auth-Status geprüft wird
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Wenn kein Benutzer vorhanden ist, zur Startseite weiterleiten
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Auth-Status ist okay, Komponente rendern
  return <>{children}</>;
};

export default ProtectedRoute;