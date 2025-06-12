import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { authTokenManager } from '../../../../util/AuthTokenManager';
import { BetaWarning } from './BetaWarning';
import { DragDropZone } from './DragDropZone';
import type { UploadModalProps } from '../types/upload';

const API_URL = import.meta.env.VITE_API_URL;

type ErrorResponse = {
  status: 'error';
  error: string;
  error_type: 'version_error' | 'unknown_error';
};

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess, onNavigateToStudy }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [hasConfirmedOwnership, setHasConfirmedOwnership] = useState(false);

  const handleFileUpload = async () => {
    if (!file) return;

    // Check if file is an .apkg file
    if (!file.name.endsWith('.apkg')) {
      setError('Please upload an .apkg file');
      return;
    }

    if (!hasConfirmedOwnership) {
      setError('Please confirm that you are the owner of this deck');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

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

      const data = await response.json() as ErrorResponse;

      if (data.status === 'error') {
          setError(data.error || 'Failed to upload deck');
        return;
      }

      setSuccess('Deck uploaded successfully!');
      setTimeout(() => {
        onClose();
        onUploadSuccess();
        onNavigateToStudy();
      }, 2000);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Upload Deck</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <BetaWarning className="mb-4" />

        <DragDropZone onFileSelect={setFile} selectedFile={file} />

        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Note: <br/>
            Images in .apkg decks are currently not supported. Cards containing images will not be imported correctly. 
            Please ensure your deck does not contain any images before uploading.
          </p>
        </div>

        <div className="mb-4 mt-2">
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={hasConfirmedOwnership}
              onChange={(e) => setHasConfirmedOwnership(e.target.checked)}
              className="mt-1"
              required
            />
            <span className="text-sm text-gray-700">
              I confirm that I am the owner of this file and that I created it myself.
              <span className="text-red-500 ml-1">*</span>
            </span>
          </label>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleFileUpload}
            disabled={!file || isUploading || !hasConfirmedOwnership}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              !file || isUploading || !hasConfirmedOwnership
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Deck'}
          </button>
        </div>
      </div>
    </div>
  );
}; 