import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { CheckCircle, AlertCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        
        // An diesem Punkt wird der Auth-Callback automatisch von Supabase verarbeitet
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Nach kurzer Verzögerung zur Profilseite weiterleiten
        setTimeout(() => {
          if (data.session) {
            navigate('/profile');
          } else {
            navigate('/');
          }
        }, 2000);
      } catch (error: any) {
        console.error('Fehler im Auth-Callback:', error.message);
        setError(error.message);
        
        // Bei Fehler nach kurzer Verzögerung zur Startseite weiterleiten
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <h2 className="mt-6 text-xl font-bold text-gray-800">Authentifizierung wird verarbeitet...</h2>
            <p className="mt-2 text-gray-600">Bitte warten, du wirst gleich weitergeleitet.</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h2 className="mt-2 text-xl font-bold text-gray-800">Authentifizierungsfehler</h2>
            <p className="mt-2 text-red-600">{error}</p>
            <p className="mt-2 text-gray-600">Du wirst zur Startseite weitergeleitet...</p>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h2 className="mt-2 text-xl font-bold text-gray-800">Authentifizierung erfolgreich</h2>
            <p className="mt-2 text-gray-600">Du wirst zur Profilseite weitergeleitet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;