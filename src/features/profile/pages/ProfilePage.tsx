import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentification/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { ProfileForm } from '../components/ProfileForm';
import { PasswordChangeModal } from '../components/PasswordChangeModal';
import { DeleteProfileModal } from '../components/DeleteProfileModal';
import { CheckCircle, AlertCircle, Mail, Lock, Trash2, LogOut } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    loading,
    error,
    success,
    handleUpdateProfile,
    handleAvatarUpload,
    handlePasswordChange,
    handleDeleteProfile,
    handleResendVerificationEmail,
  } = useProfile();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Close password modal on successful password change
  useEffect(() => {
    if (success === 'Password successfully changed') {
      setShowPasswordModal(false);
    }
  }, [success]);

  // Handle profile deletion success
  useEffect(() => {
    if (success === 'Profile successfully deleted') {
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setTimeout(async () => {
        setShowSuccessModal(false);
        await signOut();
        navigate('/');
      }, 5000);
    }
  }, [success, signOut, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-center text-gray-600">Loading profile...</p>
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
            <h2 className="mt-2 text-xl font-bold text-gray-800">No user found</h2>
            <p className="mt-1 text-gray-600">Please sign in to view your profile.</p>
            <button
              className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => navigate('/')}
            >
              Go to Homepage
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
              onClick={() => signOut()}
              className="text-white hover:text-purple-200 transition-colors"
              aria-label="Sign out"
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
            <ProfileAvatar
              profile={profile}
              onAvatarUpload={handleAvatarUpload}
              uploading={false}
            />
            
            <ProfileForm
              profile={profile}
              onUpdate={handleUpdateProfile}
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <div className="flex items-center">
                {user?.email_confirmed_at ? (
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
                      onClick={handleResendVerificationEmail}
                      className="text-xs text-purple-600 hover:text-purple-500 flex items-center"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Resend email
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
                Change Password
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordChange}
        error={error}
        success={success}
      />

      <DeleteProfileModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteProfile}
        error={error}
        success={success}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Profile successfully deleted</h2>
              <p className="text-gray-600">You will be redirected to the homepage shortly...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 