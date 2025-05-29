import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase/client';
import { User, CheckCircle, AlertCircle, Mail, Edit, Save, LogOut, Lock, Trash2, Upload, X } from 'lucide-react';

type Profile = {
  username: string;
  full_name: string;
  avatar_url: string | null;
  email_verified: boolean;
};

const ProfilePage: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

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
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Fehler beim Laden des Profils:', error.message);
          setError('Fehler beim Laden des Profils');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    getProfile();
  }, [user]);

  // Username validation
  const checkUsername = async (newUsername: string) => {
    if (!newUsername) {
      setUsernameError(null);
      return;
    }

    if (newUsername === profile?.username) {
      setUsernameError(null);
      return;
    }

    try {
      setIsCheckingUsername(true);
      setUsernameError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        throw error;
      }

      if (data) {
        setUsernameError('Dieser Benutzername ist bereits vergeben');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fehler bei der Benutzernamen-Validierung:', error.message);
        setUsernameError('Fehler bei der Benutzernamen-Validierung');
      }
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Update username with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUsername(username);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [username]);

  // Profil aktualisieren
  const updateProfile = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      if (!user) return;

      if (usernameError) {
        setError('Bitte wähle einen anderen Benutzernamen');
        return;
      }
      
      const updates = {
        id: user.id,
        full_name: fullName,
        username,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) {
        throw error;
      }

      setSuccess('Profil erfolgreich aktualisiert');
      setProfile(prev => prev ? { ...prev, full_name: fullName, username } : null);
      setIsEditing(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fehler beim Aktualisieren des Profils:', error.message);
        setError('Fehler beim Aktualisieren des Profils');
      }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fehler beim Senden der E-Mail:', error.message);
        setError('Fehler beim Senden der E-Mail');
      }
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setSuccess(null);
      setUploadingAvatar(true);

      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Bitte wähle eine Bilddatei aus');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Die Datei ist zu groß. Maximale Größe: 5MB');
      }

      if (!user) return;

      // Delete old avatar if it exists
      if (profile?.avatar_url) {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([user.id]);

        if (deleteError) {
          console.warn('Fehler beim Löschen des alten Profilbilds:', deleteError);
          // Continue with upload even if delete fails
        }
      }

      // Upload to Supabase Storage using user ID as filename
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(user.id, file, {
          upsert: true // This will overwrite the file if it exists
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get signed URL (valid for 1 hour)
      const { data } = await supabase.storage
        .from('avatars')
        .createSignedUrl(user.id, 3600);

      if (!data?.signedUrl) {
        throw new Error('Konnte keine signierte URL erstellen');
      }

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.signedUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, avatar_url: data.signedUrl } : null);
      setSuccess('Profilbild erfolgreich aktualisiert');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fehler beim Hochladen des Profilbilds:', error.message);
        setError(error.message || 'Fehler beim Hochladen des Profilbilds');
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Function to refresh avatar URL
  const refreshAvatarUrl = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase.storage
        .from('avatars')
        .createSignedUrl(user.id, 3600);

      if (data?.signedUrl) {
        setProfile(prev => prev ? { ...prev, avatar_url: data.signedUrl } : null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fehler beim Aktualisieren der Avatar-URL:', error.message);
      }
    }
  };

  // Refresh avatar URL every 50 minutes (before the 1-hour expiry)
  useEffect(() => {
    if (profile?.avatar_url) {
      const interval = setInterval(() => {
        refreshAvatarUrl();
      }, 50 * 60 * 1000); // 50 minutes

      return () => clearInterval(interval);
    }
  }, [profile?.avatar_url]);

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      // Basic client-side validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError('Bitte fülle alle Felder aus');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Die Passwörter stimmen nicht überein');
        return;
      }

      // Use the secure server-side validation
      const { error: validationError } = await supabase.rpc('validate_and_update_password', {
        current_password: currentPassword,
        new_password: newPassword
      });

      if (validationError) {
        setError(validationError.message);
        return;
      }

      setSuccess('Passwort erfolgreich geändert');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fehler beim Ändern des Passworts:', error.message);
        setError(error.message || 'Fehler beim Ändern des Passworts');
      }
    }
  };

  // Profile deletion handler
  const handleProfileDeletion = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (deleteConfirmation !== 'DELETE') {
        setError('Bitte gib "DELETE" ein, um dein Profil zu löschen');
        return;
      }

      if (!user) {
        setError('Kein Benutzer gefunden');
        setShowDeleteModal(false);
        return;
      }

      // Delete user account using RPC function
      const { error: deleteError } = await supabase.rpc('delete_user');
      
      if (deleteError) {
        console.error('Fehler beim Löschen des Accounts:', deleteError);
        setError('Fehler beim Löschen des Accounts: ' + deleteError.message);
        setShowDeleteModal(false);
        return;
      }

      // If we get here, deletion was successful
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      
      // Wait for 2 seconds to show the success message
      setTimeout(async () => {
        setShowSuccessModal(false);
        await signOut();
        navigate('/');
      }, 5000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Fehler beim Löschen des Profils:', error.message);
        setError(error.message || 'Fehler beim Löschen des Profils');
      }
      setShowDeleteModal(false);
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
            <h1 className="text-xl font-bold text-white">My profile</h1>
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
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profilbild"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-purple-600" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 aspect-square"
                disabled={uploadingAvatar}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
                disabled={uploadingAvatar}
              />
            </div>
            
            {uploadingAvatar && (
              <div className="mt-2 text-sm text-gray-500">
                Profilbild wird hochgeladen...
              </div>
            )}
            
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
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full px-4 py-2 border ${usernameError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition`}
                    />
                    {isCheckingUsername && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      </div>
                    )}
                  </div>
                  {usernameError && (
                    <p className="mt-1 text-sm text-red-600">{usernameError}</p>
                  )}
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
                  Edit profile
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
                    <span className="text-xs">Verified</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-amber-600 mb-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">Not verified</span>
                    </div>
                    <button
                      onClick={resendVerificationEmail}
                      className="text-xs text-purple-600 hover:text-purple-500 flex items-center"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Resend e-mail
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                Passwort ändern
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Profil löschen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Passwort ändern</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Aktuelles Passwort
                </label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  Passwort ändern
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setError(null);
                    setSuccess(null);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Profile Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Profil löschen</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Bist du sicher, dass du dein Profil löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="mb-4">
              <label htmlFor="delete-confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Bitte gib "DELETE" ein, um zu bestätigen
              </label>
              <input
                type="text"
                id="delete-confirmation"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="DELETE"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleProfileDeletion}
                className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Profil löschen
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Profil erfolgreich gelöscht</h2>
              <p className="text-gray-600">Du wirst in Kürze zur Startseite weitergeleitet...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;