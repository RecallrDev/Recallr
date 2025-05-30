import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface DeleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (confirmation: string) => Promise<void>;
  error: string | null;
  success: string | null;
}

export const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  error,
  success,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleSubmit = async () => {
    await onDelete(deleteConfirmation);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Delete Profile</h2>
          <button
            onClick={onClose}
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

        <p className="text-gray-600 mb-4">
          Are you sure you want to delete your profile? This action cannot be undone.
        </p>

        <div className="mb-4">
          <label htmlFor="delete-confirmation" className="block text-sm font-medium text-gray-700 mb-1">
            Please type "DELETE" to confirm
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
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete Profile
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}; 