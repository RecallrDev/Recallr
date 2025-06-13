import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UploadModal } from './components/UploadModal';
import type { UploadAnkiDeckProps } from './types/upload';

const UploadAnkiDeck: React.FC<UploadAnkiDeckProps> = ({ onUploadSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToStudy = () => {
    navigate('/study');
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 
          hover:bg-purple-700 transition-colors font-medium"
      >
        <Upload size={20} />
        
      </button>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={onUploadSuccess}
        onNavigateToStudy={handleNavigateToStudy}
      />
    </>
  );
};

export default UploadAnkiDeck; 