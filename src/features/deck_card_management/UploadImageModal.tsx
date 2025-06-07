import React, { useState, useRef } from 'react';
import { XCircle, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useImageUpload, type ImageUploadResult } from '../../app/hooks/useImageUpload';

export type ImageUploadModalProps = {
  onCancel: () => void;
  onUpload: (result: ImageUploadResult, location: 'front' | 'back') => void;
  cardType: 'basic' | 'mc';
};

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ 
  onCancel, 
  onUpload, 
  cardType 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<'front' | 'back'>('front');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, uploading, error } = useImageUpload();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadImage(selectedFile);
      const location = cardType === 'basic' ? selectedLocation : 'front';
      onUpload(result, location);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Upload Image</h2>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-purple-600 transition-colors"
            disabled={uploading}
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Side Selection (only for basic cards) */}
          {cardType === 'basic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add image to:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLocation('front')}
                  disabled={uploading}
                  className={`flex-1 px-3 py-2 rounded-lg border transition ${
                    selectedLocation === 'front'
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  } disabled:opacity-50`}
                >
                  Front
                </button>
                <button
                  onClick={() => setSelectedLocation('back')}
                  disabled={uploading}
                  className={`flex-1 px-3 py-2 rounded-lg border transition ${
                    selectedLocation === 'back'
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  } disabled:opacity-50`}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
              dragActive
                ? 'border-purple-400 bg-purple-50'
                : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={!uploading ? openFileDialog : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            
            {uploading ? (
              <div className="space-y-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-sm font-medium text-purple-700">Uploading...</p>
              </div>
            ) : selectedFile ? (
              <div className="space-y-3">
                {preview && (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="mx-auto h-20 w-20 object-cover rounded-lg"
                  />
                )}
                <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                  <p className="text-xs text-green-600">{formatFileSize(selectedFile.size)}</p>
                </div>
                <p className="text-xs text-gray-500">Click to choose a different file</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={uploading}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                selectedFile && !uploading
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-100 text-purple-400 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;