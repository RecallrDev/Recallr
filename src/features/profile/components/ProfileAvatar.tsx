import React, { useRef } from 'react';
import { User, Upload } from 'lucide-react';
import type { Profile } from '../types/profile';

interface ProfileAvatarProps {
  profile: Profile;
  onAvatarUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profile,
  onAvatarUpload,
  uploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size: 5MB');
      return;
    }

    await onAvatarUpload(file);
  };

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 overflow-hidden">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <User className="w-12 h-12 text-purple-600" />
        )}
      </div>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 aspect-square"
        disabled={uploading}
      >
        <div className="flex items-center justify-center w-full h-full">
          <Upload className="w-6 h-6 text-white" />
        </div>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={uploading}
      />
      {uploading && (
        <div className="mt-2 text-sm text-gray-500">
          Uploading profile picture...
        </div>
      )}
    </div>
  );
}; 