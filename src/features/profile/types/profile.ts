export type Profile = {
  username: string;
  full_name: string;
  avatar_url: string | null;
  email_verified: boolean;
};

export type ProfileUpdateData = {
  full_name: string;
  username: string;
};

export type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}; 