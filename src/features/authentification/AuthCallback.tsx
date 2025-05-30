import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase_client';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { config } from '../../lib/config';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        
        // Session abrufen
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Profil überprüfen bei OAuth-Login
        if (data.session) {
          try {
            // Prüfen, ob ein Profil existiert
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single();
              
            if (profileError || !profileData) {
              // Wenn kein Profil existiert, eines erstellen
              const userMetadata = data.session.user.user_metadata;
              const fullName = userMetadata.full_name || 
                               userMetadata.name || 
                               userMetadata.user_name || 
                               'User';
                               
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: data.session.user.id,
                  full_name: fullName,
                  username: '',
                  avatar_url: userMetadata.avatar_url || null,
                  updated_at: new Date().toISOString()
                });
                
              if (insertError) {
                console.warn('Error creating profile:', insertError);
                // Nicht kritisch, weitermachen
              }
            }
          } catch (profileCheckError) {
            console.warn('Error checking profile:', profileCheckError);
            // Nicht kritisch, weitermachen
          }
          
          setMessage('Authentication successful!');
          
          // Nach kurzer Verzögerung zur Profilseite weiterleiten
          setTimeout(() => {
            navigate(config.redirectUrls.profile);
          }, 1500);
        } else {
          // Wenn keine Session vorhanden ist, zur Startseite weiterleiten
          setMessage('No active session found.');
          setTimeout(() => {
            navigate(config.redirectUrls.home);
          }, 1500);
        }
      } catch (error: any) {
        console.error('Error in auth callback:', error);
        
        // Bessere Fehlerbehandlung
        let errorMsg = 'An error occurred during authentication.';
        if (error.message.includes('Email link is invalid')) {
          errorMsg = 'The email link has expired or is invalid. Please try signing in again.';
        } else if (error.message.includes('Token has expired')) {
          errorMsg = 'The authentication token has expired. Please try signing in again.';
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        setError(errorMsg);
        
        // Bei Fehler nach kurzer Verzögerung zur Startseite weiterleiten
        setTimeout(() => {
          navigate(config.redirectUrls.home);
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
            <h2 className="mt-6 text-xl font-bold text-gray-800">{message}</h2>
            <p className="mt-2 text-gray-600">Please wait, you will be redirected shortly.</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h2 className="mt-2 text-xl font-bold text-gray-800">Authentication error</h2>
            <p className="mt-2 text-red-600">{error}</p>
            <p className="mt-2 text-gray-600">You will be redirected to the home page...</p>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h2 className="mt-2 text-xl font-bold text-gray-800">{message}</h2>
            <p className="mt-2 text-gray-600">You will be redirected...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;