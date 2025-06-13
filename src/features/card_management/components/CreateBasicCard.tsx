import React, { useState } from 'react';
import { Image, X } from 'lucide-react';
import { ImageUploadModal } from '../../card_image_upload';
import { type ImageUploadResult } from '../../card_image_upload';
import { authTokenManager } from '../../../util/AuthTokenManager'

const API_URL = import.meta.env.VITE_API_URL

export type CreateBasicCardProps = {
  deckId: string;
  deckColor: string;
  onCreateSuccess: () => void;
  onCancel: () => void;
};

const CreateBasicCard: React.FC<CreateBasicCardProps> = ({ 
  deckId, 
  deckColor, 
  onCreateSuccess, 
  onCancel 
}) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Image states
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontThumbnail, setFrontThumbnail] = useState<string | null>(null);
  const [backThumbnail, setBackThumbnail] = useState<string | null>(null);

  const handleImageUpload = (result: ImageUploadResult, location: 'front' | 'back') => {
    const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${result.url}`;
    const thumbnailUrl = result.thumbnail_url 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${result.thumbnail_url}`
      : fullUrl;

    if (location === 'front') {
      setFrontImage(fullUrl);
      setFrontThumbnail(thumbnailUrl);
    } else {
      setBackImage(fullUrl);
      setBackThumbnail(thumbnailUrl);
    }
    
    setShowUploadModal(false);
  };

  const removeImage = (location: 'front' | 'back') => {
    if (location === 'front') {
      setFrontImage(null);
      setFrontThumbnail(null);
    } else {
      setBackImage(null);
      setBackThumbnail(null);
    }
  };

  const handleCreateCard = async () => {
    if (!frontText.trim() || !backText.trim()) {
      return;
    }

    setIsSubmitting(true);

    // 1) Authenticate current user
    if (!(await authTokenManager.isAuthenticated())) {
      setIsSubmitting(false);
      console.error('User is not authenticated');
      return;
    }

    // 2) Insert into basic_cards
    const headers = await authTokenManager.getAuthHeaders();

    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        deck_id: deckId,
        front: frontText.trim(),
        back: backText.trim(),
        type: 'basic',
        front_image: frontImage,
        back_image: backImage,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const insertError = errorData.error || `HTTP error! Status: ${response.status}`;
      console.error('Error creating card:', insertError);
      setIsSubmitting(false);
    } else {
      // 3) Clear inputs
      setFrontText('');
      setBackText('');
      setIsSubmitting(false);
      setFrontImage(null);
      setBackImage(null);
      setFrontThumbnail(null);
      setBackThumbnail(null);

      // 4) Notify parent so it can re‐fetch counts, etc.
      onCreateSuccess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
        {/* Front Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Front
          </label>
          <textarea
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter front text..."
            rows={3}
          />
        </div>

        {/* Front Image Preview */}
        {frontThumbnail && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Front Image
            </label>
            <div className="relative inline-block">
              <img 
                src={frontThumbnail} 
                alt="Front preview" 
                className="h-24 w-auto rounded-lg border border-gray-200"
              />
              <button
                onClick={() => removeImage('front')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Back Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Back
          </label>
          <textarea
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter back text..."
            rows={3}
          />
        </div>

        {/* Back Image Preview */}
        {backThumbnail && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Back Image
            </label>
            <div className="relative inline-block">
              <img 
                src={backThumbnail} 
                alt="Back preview" 
                className="h-24 w-auto rounded-lg border border-gray-200"
              />
              <button
                onClick={() => removeImage('back')}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreateCard}
            style={{ backgroundColor: deckColor || '#3B82F6' }}
            disabled={
              (!frontText.trim() && !frontImage) || 
              (!backText.trim() && !backImage) || 
              isSubmitting
            }
            className="text-white px-6 py-2 rounded-lg hover:scale-105 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving…' : 'Create Card'}
          </button>
          <button
            onClick={onCancel}
            className="bg-white text-gray-600 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{ backgroundColor: deckColor || '#3B82F6' }}
            disabled={isSubmitting}
            className="text-white px-6 py-2 rounded-lg hover:scale-105 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            <Image className="inline-block" size={20} />
          </button>
        </div>

        {/* Upload Image Modal */}
        {showUploadModal && (
          <ImageUploadModal
            cardType="basic"
            onCancel={() => setShowUploadModal(false)}
            onUpload={handleImageUpload}
          />
        )}
      </div>
    </div>
  );
};

export default CreateBasicCard;