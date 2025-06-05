import React, { useState, useRef } from 'react';
import { XCircle, Upload, Image as ImageIcon } from 'lucide-react';

export type ImageUploadModalProps = {
  onCancel: () => void;
  onUpload: (file: File, location: 'front' | 'back') => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, cardType === 'basic' ? selectedLocation : 'front');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upload Image</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-purple-600">
            <XCircle size={24} />
          </button>
        </div>

        {/* Side Selection (only for basic cards) */}
        {cardType === 'basic' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add image to:
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLocation('front')}
                className={`flex-1 px-3 py-2 rounded-lg border transition ${
                  selectedLocation === 'front'
                    ? 'bg-purple-50 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setSelectedLocation('back')}
                className={`flex-1 px-3 py-2 rounded-lg border transition ${
                  selectedLocation === 'back'
                    ? 'bg-purple-50 border-purple-300 text-purple-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
            dragActive
              ? 'border-purple-400 bg-purple-50'
              : selectedFile
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="space-y-2">
              <ImageIcon className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
              <p className="text-xs text-green-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              selectedFile
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-purple-100 text-purple-400 cursor-not-allowed'
            }`}
          >
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;