import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import type { DragDropZoneProps } from '../types/upload';

export const DragDropZone: React.FC<DragDropZoneProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  }, [onFileSelect]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleZoneClick = () => {
    document.getElementById('file-upload')?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
        isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={handleZoneClick}
    >
      <div className="text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop your .apkg file here, or click anywhere to browse files
        </p>
        <input
          type="file"
          accept=".apkg"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-500">
            Selected file: {selectedFile.name}
          </p>
        )}
      </div>
    </div>
  );
}; 