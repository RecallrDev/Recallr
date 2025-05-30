import { supabase } from '../../../lib/supabase_client';
import type { Profile, ProfileUpdateData } from '../types/profile';

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;

  return data ? {
    username: data.username || '',
    full_name: data.full_name || '',
    avatar_url: data.avatar_url,
    email_verified: data.email_verified || false,
  } : null;
};

export const updateProfile = async (userId: string, data: ProfileUpdateData): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: data.full_name,
      username: data.username,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
};

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  // Delete old avatar if it exists
  const { error: deleteError } = await supabase.storage
    .from('avatars')
    .remove([userId]);

  if (deleteError) {
    console.warn('Error deleting old profile picture:', deleteError);
  }

  // Upload new avatar
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(userId, file, {
      upsert: true
    });

  if (uploadError) throw uploadError;

  // Get signed URL
  const { data } = await supabase.storage
    .from('avatars')
    .createSignedUrl(userId, 3600);

  if (!data?.signedUrl) {
    throw new Error('Could not create signed URL');
  }

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: data.signedUrl })
    .eq('id', userId);

  if (updateError) throw updateError;

  return data.signedUrl;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const { error } = await supabase.rpc('validate_and_update_password', {
    current_password: currentPassword,
    new_password: newPassword
  });

  if (error) throw error;
};

export const deleteProfile = async (): Promise<void> => {
  const { error } = await supabase.rpc('delete_user');
  if (error) throw error;
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });

  if (error) throw error;
}; 