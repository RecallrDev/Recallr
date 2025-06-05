import React, { useState } from 'react';
import { supabase } from '../../lib/supabase_client';
import { Image } from 'lucide-react';
import UploadImageModal from './UploadImageModal';

export type CreateMCProps = {
  deckId: string;
  deckColor: string;
  onCreateSuccess: () => void;
  onCancel: () => void;
};

type ChoiceInput = {
  answer_text: string;
  is_correct: boolean;
};

const CreateMultipleChoiceCard: React.FC<CreateMCProps> = ({
  deckId,
  deckColor,
  onCreateSuccess,
  onCancel,
}) => {
  // 1) Track the question itself
  const [question, setQuestion] = useState('');

  // 2) Track up to 5 answers
  const [choices, setChoices] = useState<ChoiceInput[]>(
    Array.from({ length: 5 }, () => ({ answer_text: '', is_correct: false }))
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleChoiceTextChange = (index: number, newText: string) => {
    const updated = [...choices];
    updated[index].answer_text = newText;
    setChoices(updated);
  };

  const handleChoiceCorrectToggle = (index: number) => {
    const updated = [...choices];
    updated[index].is_correct = !updated[index].is_correct;
    setChoices(updated);
  };

  const handleCreateMC = async () => {
    // 1) Basic validation: question must not be empty, at least two answers filled, at least one correct
    if (!question.trim()) {
      return;
    }
    // Count how many choice texts are non‐empty
    const filledChoices = choices.filter((c) => c.answer_text.trim() !== '');
    if (filledChoices.length < 2) {
      // require at least 2 answers
      return;
    }
    // Must have at least one is_correct = true among the filled choices
    if (!filledChoices.some((c) => c.is_correct)) {
      return;
    }

    setIsSubmitting(true);

    // 2) Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('You must be logged in to create a multiple choice card', userError);
      setIsSubmitting(false);
      return;
    }

    // 3) Insert into mc_cards
    const { data: mcCardData, error: insertCardError } = await supabase
      .from('mc_cards')
      .insert({
        deck_id: deckId,
        user_id: user.id,
        question: question.trim(),
      })
      .select()
      .single();

    if (insertCardError || !mcCardData) {
      console.error('Error creating MC card:', insertCardError);
      setIsSubmitting(false);
      return;
    }

    const newMcCardId = mcCardData.id;

    // 4) Insert each filled choice into mc_choices
    const choicesToInsert = choices
      .map((c) => ({
        mc_card_id: newMcCardId,
        answer_text: c.answer_text.trim(),
        is_correct: c.is_correct,
      }))
      .filter((c) => c.answer_text !== '');

    // Insert all non‐empty choices
    const { error: insertChoicesError } = await supabase
      .from('mc_choices')
      .insert(choicesToInsert);

    if (insertChoicesError) {
      console.error('Error inserting MC choices:', insertChoicesError);
      setIsSubmitting(false);
      return;
    }

    // 5) Clear form
    setQuestion('');
    setChoices(Array.from({ length: 5 }, () => ({ answer_text: '', is_correct: false })));
    setIsSubmitting(false);

    // 6) Notify parent to re‐fetch deck
    onCreateSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
        {/* Question Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the question..."
            rows={3}
          />
        </div>

        {/* Answers Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer Choices (up to 5)
          </label>
          <div className="space-y-4">
            {choices.map((choice, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={choice.is_correct}
                  onChange={() => handleChoiceCorrectToggle(idx)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={choice.answer_text}
                  onChange={(e) => handleChoiceTextChange(idx, e.target.value)}
                  placeholder={`Choice ${idx + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Check the box next to each correct answer. Leave wrong choices blank.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreateMC}
            style={{ backgroundColor: deckColor || '#3B82F6' }}
            disabled={
              !question.trim() ||
              choices.filter((c) => c.answer_text.trim() !== '').length < 2 ||
              !choices.some((c) => c.is_correct && c.answer_text.trim() !== '') ||
              isSubmitting
            }
            className="text-white px-6 py-2 rounded-lg hover:scale-105 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving…' : 'Create MC Card'}
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
            <Image className="inline-block" />
          </button>
        </div>

        {/* Upload Image Modal */}
          {showUploadModal && (
          <UploadImageModal
            cardType="mc"
            onCancel={() => setShowUploadModal(false)}
            onUpload={async (file, location) => {
              // Handle the file upload
              console.log('Uploading file:', file, 'to location:', location);
              setShowUploadModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CreateMultipleChoiceCard;
