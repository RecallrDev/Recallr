import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase/client';
import { User, CheckCircle, AlertCircle, Mail, Edit, Save, LogOut } from 'lucide-react';

type Profile = {
  username: string;
  full_name: string;
  avatar_url: string | null;
  email_verified: boolean;
};

const ProfilePage: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Prüfen, ob der Benutzer angemeldet ist
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Profil laden
  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoadingProfile(true);
        
        if (!user) return;
        
        // Profil aus der Datenbank abrufen
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile({
            username: data.username || '',
            full_name: data.full_name || user.user_metadata?.full_name || '',
            avatar_url: data.avatar_url,
            email_verified: user.email_confirmed_at !== null,
          });
          
          setFullName(data.full_name || user.user_metadata?.full_name || '');
          setUsername(data.username || '');
        }
      } catch (error: any) {
        console.error('Fehler beim Laden des Profils:', error.message);
        setError('Fehler beim Laden des Profils');
      } finally {
        setLoadingProfile(false);
      }
    };

    getProfile();
  }, [user]);

  // Profil aktualisieren
  const updateProfile = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      if (!user) return;
      
      const updates = {
        id: user.id,
        full_name: fullName,
        username,
        updated_at: new Date().toISOString(),
      };

      // Die 'returning' Option wurde entfernt, da sie in deiner Supabase-Version nicht unterstützt wird
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) {
        throw error;
      }

      setSuccess('Profil erfolgreich aktualisiert');
      setProfile(prev => prev ? { ...prev, full_name: fullName, username } : null);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Fehler beim Aktualisieren des Profils:', error.message);
      setError('Fehler beim Aktualisieren des Profils');
    }
  };

  // E-Mail erneut senden
  const resendVerificationEmail = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      // Füge Null-Check für die E-Mail hinzu
      const email = user?.email;
      if (!email) {
        throw new Error('Keine E-Mail-Adresse gefunden');
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      setSuccess('Bestätigungs-E-Mail wurde erneut gesendet');
    } catch (error: any) {
      console.error('Fehler beim Senden der E-Mail:', error.message);
      setError('Fehler beim Senden der E-Mail');
    }
  };

  // Abmelden und zur Startseite navigieren
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-center text-gray-600">Lade Profil...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h2 className="mt-2 text-xl font-bold text-gray-800">Kein Benutzer gefunden</h2>
            <p className="mt-1 text-gray-600">Bitte melde dich an, um dein Profil anzuzeigen.</p>
            <button
              className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => navigate('/')}
            >
              Zur Startseite
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Mein Profil</h1>
            <button
              onClick={handleSignOut}
              className="text-white hover:text-purple-200 transition-colors"
              aria-label="Abmelden"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profilbild"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-purple-600" />
              )}
            </div>
            
            {isEditing ? (
              <div className="w-full">
                <div className="mb-4">
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Vollständiger Name
                  </label>
                  <input
                    type="text"
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Benutzername
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={updateProfile}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(profile.full_name);
                      setUsername(profile.username);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800">{profile.full_name}</h2>
                {profile.username && (
                  <p className="text-gray-600">@{profile.username}</p>
                )}
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 py-1 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Profil bearbeiten
                </button>
              </>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">E-Mail</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <div className="flex items-center">
                {profile.email_verified ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Verifiziert</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-amber-600 mb-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">Nicht verifiziert</span>
                    </div>
                    <button
                      onClick={resendVerificationEmail}
                      className="text-xs text-purple-600 hover:text-purple-500 flex items-center"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      E-Mail erneut senden
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Account erstellt am: {new Date(user.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;