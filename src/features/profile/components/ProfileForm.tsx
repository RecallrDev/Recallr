import React, { useState, useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase_client';
import type { Profile, ProfileUpdateData } from '../types/profile';

interface ProfileFormProps {
  profile: Profile;
  onUpdate: (data: ProfileUpdateData) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name);
  const [username, setUsername] = useState(profile.username);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Username validation
  useEffect(() => {
    const checkUsername = async (newUsername: string) => {
      if (!newUsername) {
        setUsernameError(null);
        return;
      }

      if (newUsername === profile.username) {
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
          setUsernameError('This username is already taken');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error checking username:', error.message);
          setUsernameError('Error checking username');
        }
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(() => {
      checkUsername(username);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [username, profile.username]);

  const handleSubmit = async () => {
    if (usernameError) {
      return;
    }
    await onUpdate({ full_name: fullName, username });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
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
            Username
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
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
          
          <button
            onClick={() => {
              setIsEditing(false);
              setFullName(profile.full_name);
              setUsername(profile.username);
            }}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
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
  );
}; 