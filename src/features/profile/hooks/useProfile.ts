import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/authentification/AuthContext';
import { getProfile, updateProfile, uploadAvatar, changePassword, deleteProfile, resendVerificationEmail } from '../api/profileApi';
import type { Profile, ProfileUpdateData, PasswordChangeData } from '../types/profile';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getProfile(user.id);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleUpdateProfile = async (data: ProfileUpdateData) => {
    if (!user) return;
    
    try {
      setError(null);
      setSuccess(null);
      await updateProfile(user.id, data);
      setProfile(prev => prev ? { ...prev, ...data } : null);
      setSuccess('Profile successfully updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating profile');
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    
    try {
      setError(null);
      setSuccess(null);
      const avatarUrl = await uploadAvatar(user.id, file);
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      setSuccess('Profile picture successfully updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading profile picture');
    }
  };

  const handlePasswordChange = async (data: PasswordChangeData) => {
    if (!user) return;
    
    try {
      setError(null);
      setSuccess(null);
      await changePassword(data.currentPassword, data.newPassword);
      setSuccess('Password successfully changed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error changing password');
    }
  };

  const handleDeleteProfile = async () => {
    if (!user) return;
    
    try {
      setError(null);
      setSuccess(null);
      await deleteProfile();
      setSuccess('Profile successfully deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting profile');
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!user?.email) return;
    
    try {
      setError(null);
      setSuccess(null);
      await resendVerificationEmail(user.email);
      setSuccess('Verification email has been sent again');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending email');
    }
  };

  return {
    profile,
    loading,
    error,
    success,
    handleUpdateProfile,
    handleAvatarUpload,
    handlePasswordChange,
    handleDeleteProfile,
    handleResendVerificationEmail,
  };
}; 