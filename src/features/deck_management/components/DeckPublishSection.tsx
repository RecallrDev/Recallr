import React, { useState } from 'react';
import { Share2, Copy } from 'lucide-react';
import { authTokenManager } from '../../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

interface DeckPublishSectionProps {
  deckId: string;
  isPublic: boolean;
  onPublishChange: (isPublic: boolean) => void;
}

const DeckPublishSection: React.FC<DeckPublishSectionProps> = ({
  deckId,
  isPublic,
  onPublishChange,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handlePublishToggle = async () => {
    const token = await authTokenManager.getToken();
    if (!token) return;
    const headers = await authTokenManager.getAuthHeaders();

    try {
      const response = await fetch(`${API_URL}/decks/publish/${deckId}?is_public=${!isPublic}`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to update publish status');
      }

      onPublishChange(!isPublic);
    } catch (err: any) {
      console.error('Error updating publish status:', err);
    }
  };

  const handleCopyShareLink = async () => {
    const shareUrl = `${window.location.origin}/public/${deckId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="px-8 py-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Publish Deck</h3>
          <p className="text-sm text-gray-500">
            Make this deck available for others to study
          </p>
        </div>
        <button
          onClick={handlePublishToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isPublic ? 'bg-green-500' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isPublic ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Share Link Section */}
      {isPublic && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Share2 size={16} className="text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Share Link</h4>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/public/${deckId}`}
              className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {copySuccess ? (
                <>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckPublishSection; 