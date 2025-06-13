import { useState } from 'react';
import { supabase } from '../../../lib/supabase_client';

export interface ImageUploadResult {
  url: string;
  thumbnail_url?: string;
  filename: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<ImageUploadResult>;
  deleteImage: (imageUrl: string) => Promise<boolean>;
  uploading: boolean;
  error: string | null;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }
    
    return {
      'Authorization': `Bearer ${session.access_token}`,
    };
  };

  const uploadImage = async (file: File): Promise<ImageUploadResult> => {
    setUploading(true);
    setError(null);

    try {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File is too large. Maximum size is 10MB.');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      }

      const headers = await getAuthHeaders();
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/images/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    setError(null);

    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/images/delete?image_url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Delete failed with status ${response.status}`);
      }

      const result = await response.json();
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    error,
  };
};