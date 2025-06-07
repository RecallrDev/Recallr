import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { authTokenManager } from '../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

export type UploadAnkiDeckProps = {
  onUploadSuccess: () => void;
};

const UploadAnkiDeck: React.FC<UploadAnkiDeckProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an .apkg file
    if (!file.name.endsWith('.apkg')) {
      setError('Please upload an Anki deck file (.apkg)');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers = await authTokenManager.getAuthHeaders();
      // Remove Content-Type header to let the browser set it with the boundary
      delete headers['Content-Type'];

      const response = await fetch(`${API_URL}/upload/apkg`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload deck');
      }

      onUploadSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload deck');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".apkg"
        onChange={handleFileUpload}
        className="hidden"
        id="anki-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="anki-upload"
        className={`
          bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 
          hover:bg-purple-700 transition-colors font-medium cursor-pointer
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Upload size={20} />
        {isUploading ? 'Uploading...' : 'Upload Anki Deck'}
      </label>
      {error && (
        <div className="absolute top-full left-0 mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadAnkiDeck; 