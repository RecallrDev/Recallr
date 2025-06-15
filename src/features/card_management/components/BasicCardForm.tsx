import React, { useState } from 'react';
import { Image, X, Type, FileText } from 'lucide-react';
import { ImageUploadModal } from '../../card_image_upload';
import { type ImageUploadResult } from '../../card_image_upload';

export interface BasicCardFormProps {
  deckColor: string;
  initialFrontText?: string;
  initialBackText?: string;
  initialFrontImage?: string | null;
  initialBackImage?: string | null;
  isSubmitting: boolean;
  onSubmit: (data: {
    frontText: string;
    backText: string;
    frontImage: string | null;
    backImage: string | null;
  }) => void;
  onCancel: () => void;
  onDelete?: () => void;
  submitLabel: string;
}

const BasicCardForm: React.FC<BasicCardFormProps> = ({
  deckColor,
  initialFrontText = '',
  initialBackText = '',
  initialFrontImage = null,
  initialBackImage = null,
  isSubmitting,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel,
}) => {
  const [frontText, setFrontText] = useState(initialFrontText);
  const [backText, setBackText] = useState(initialBackText);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLocation, setUploadLocation] = useState<'front' | 'back'>('front');

  const [frontImage, setFrontImage] = useState<string | null>(initialFrontImage);
  const [backImage, setBackImage] = useState<string | null>(initialBackImage);
  const [frontThumbnail, setFrontThumbnail] = useState<string | null>(initialFrontImage);
  const [backThumbnail, setBackThumbnail] = useState<string | null>(initialBackImage);

  const openImageUpload = (location: 'front' | 'back') => {
    setUploadLocation(location);
    setShowUploadModal(true);
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

  const handleImageUpload = (result: ImageUploadResult, location: 'front' | 'back') => {
    const url = result.url.startsWith('http')
      ? result.url
      : `${import.meta.env.VITE_API_URL}${result.url}`;
    const thumb = result.thumbnail_url
      ? (result.thumbnail_url.startsWith('http')
          ? result.thumbnail_url
          : `${import.meta.env.VITE_API_URL}${result.thumbnail_url}`)
      : url;

    if (location === 'front') {
      setFrontImage(url);
      setFrontThumbnail(thumb);
    } else {
      setBackImage(url);
      setBackThumbnail(thumb);
    }
    setShowUploadModal(false);
  };

  const handleSubmit = () => {
    if ((!frontText.trim() && !frontImage) || (!backText.trim() && !backImage)) return;
    onSubmit({ frontText: frontText.trim(), backText: backText.trim(), frontImage, backImage });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Front Side */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 text-white relative" style={{ backgroundColor: deckColor }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center gap-2">
            <Type size={20} />
            <h3 className="text-lg font-bold">Front Side</h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <FileText size={16} />
              Question/Prompt
            </label>
            <textarea
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg resize-none"
              placeholder="What do you want to remember?"
              rows={4}
            />
          </div>

          {frontThumbnail ? (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
              <div className="relative inline-block">
                <img src={frontThumbnail} alt="Front preview" className="h-32 w-auto rounded-xl border border-gray-200 shadow-sm" />
                <button
                  onClick={() => removeImage('front')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openImageUpload('front')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-700"
            >
              <Image size={20} />
              Add Image
            </button>
          )}
        </div>
      </div>

      {/* Back Side */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 text-white relative" style={{ backgroundColor: deckColor }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center gap-2">
            <FileText size={20} />
            <h3 className="text-lg font-bold">Back Side</h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Type size={16} />
              Answer/Explanation
            </label>
            <textarea
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg resize-none"
              placeholder="What's the answer?"
              rows={4}
            />
          </div>

          {backThumbnail ? (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
              <div className="relative inline-block">
                <img src={backThumbnail} alt="Back preview" className="h-32 w-auto rounded-xl border border-gray-200 shadow-sm" />
                <button
                  onClick={() => removeImage('back')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openImageUpload('back')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-700"
            >
              <Image size={20} />
              Add Image
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex gap-4">
            {onDelete && (
              <button
                onClick={onDelete}
                disabled={isSubmitting}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={
                (!frontText.trim() && !frontImage) ||
                (!backText.trim() && !backImage) ||
                isSubmitting
              }
              className="flex-1 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:scale-100 relative overflow-hidden group"
              style={{ backgroundColor: deckColor }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">
                {isSubmitting ? `${submitLabel}...` : submitLabel}
              </span>
            </button>
            <button
              onClick={onCancel}
              className="px-8 py-4 bg-white border-2 hover:bg-gray-50 transition-all duration-200 font-semibold rounded-xl hover:scale-105"
              style={{ borderColor: deckColor, color: deckColor }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Upload Image Modal */}
      {showUploadModal && (
        <ImageUploadModal
          cardType="basic"
          onCancel={() => setShowUploadModal(false)}
          onUpload={(result) => handleImageUpload(result, uploadLocation)}
        />
      )}
    </div>
  );
};

export default BasicCardForm;
