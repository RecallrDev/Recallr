import React, { useState } from 'react';
import { supabase } from '../supabase/client';

export type CreateBasicCardProps = {
  deckId: string;
  deckColor: string;
  onCreateSuccess: () => void;
  onCancel: () => void;
};

const CreateBasicCard: React.FC<CreateBasicCardProps> = ({ deckId, deckColor, onCreateSuccess, onCancel }) => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCard = async () => {
    if (!frontText.trim() || !backText.trim()) {
      return;
    }

    setIsSubmitting(true);

    // 1) Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('You must be logged in to create a card!', userError);
      setIsSubmitting(false);
      return;
    }

    // 2) Insert into basic_cards
    const { error: insertError } = await supabase
      .from('basic_cards')
      .insert({
        deck_id: deckId,
        front: frontText.trim(),
        back: backText.trim(),
      });

    if (insertError) {
      console.error('Error creating card:', insertError);
      setIsSubmitting(false);
    } else {
      // 3) Clear inputs
      setFrontText('');
      setBackText('');
      setIsSubmitting(false);

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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreateCard}
            style={ { backgroundColor: deckColor || '#3B82F6' }}
            disabled={!frontText.trim() || !backText.trim() || isSubmitting}
            className=" text-white px-6 py-2 rounded-lg hover:scale-105 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving…' : 'Create Card'}
          </button>
          <button
            onClick={onCancel}
            className="bg-white text-gray-600 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBasicCard;
