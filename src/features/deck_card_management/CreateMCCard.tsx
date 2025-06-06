import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { authTokenManager } from '../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

export type CreateMCProps = {
  deckId: string;
  deckColor: string;
  onCreateSuccess: () => void;
  onCancel: () => void;
};

type ChoiceInput = {
  text: string;
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

  // 2) Start with 2 choices
  const [choices, setChoices] = useState<ChoiceInput[]>(
    [
      { text: '', is_correct: false },
      { text: '', is_correct: false }
    ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChoiceTextChange = (index: number, newText: string) => {
    const updated = [...choices];
    updated[index].text = newText;
    setChoices(updated);
  };

  const handleChoiceCorrectToggle = (index: number) => {
    const updated = [...choices];
    updated[index].is_correct = !updated[index].is_correct;
    setChoices(updated);
  };

  const addChoice = () => {
    if (choices.length < 10) {
      setChoices([...choices, { text: '', is_correct: false }]);
    }
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) {
      const updated = choices.filter((_, idx) => idx !== index);
      setChoices(updated);
    }
  };

  const handleCreateMC = async () => {
    // 1) Basic validation: question must not be empty, at least two answers filled, at least one correct
    if (!question.trim()) {
      return;
    }
    // Count how many choice texts are non‐empty
    const filledChoices = choices.filter((c) => c.text.trim() !== '');
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
    if (!(await authTokenManager.isAuthenticated())) {
      setIsSubmitting(false);
      console.error('User is not authenticated');
      return;
    }

    // 3) Prepare headers
    const headers = await authTokenManager.getAuthHeaders();

    // 4) Insert into multiple_choice_cards - Fixed payload structure
    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        deck_id: deckId,
        created_at: new Date().toISOString(),
        type: 'multiple_choice',
        question: question.trim(),
        choices: filledChoices.map((c) => ({
          answer_text: c.text.trim(),
          is_correct: c.is_correct,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const insertError = errorData.error || `HTTP error! Status: ${response.status}`;
      console.error('Error creating MC card:', insertError);
      setIsSubmitting(false);
      return;
    } else {
      console.log('MC card created successfully');
    }

    // 5) Clear form
    setQuestion('');
    setChoices(
      [
        { text: '', is_correct: false },
        { text: '', is_correct: false }
      ]
    );
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
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Answer Choices ({choices.length}/10)
            </label>
            <button
              type="button"
              onClick={addChoice}
              disabled={choices.length >= 10}
              className="flex items-center gap-1 px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 "
              style={{ backgroundColor: deckColor || '#3B82F6', color: 'white' }}
            >
              <Plus size={16} />
              Add Choice
            </button>
          </div>
          
          <div className="space-y-3">
            {choices.map((choice, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={choice.is_correct}
                  onChange={() => handleChoiceCorrectToggle(idx)}
                  className="h-5 w-5 border-gray-300 rounded focus:ring-blue-500"
                  style={{ accentColor: deckColor }}
                  readOnly
                />
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) => handleChoiceTextChange(idx, e.target.value)}
                  placeholder={`Choice ${idx + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {choices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeChoice(idx)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <p className="mt-3 text-sm text-gray-500">
            Check the box next to each correct answer. You need at least 2 choices and 1 correct answer.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreateMC}
            style={{ backgroundColor: deckColor || '#3B82F6' }}
            disabled={
              !question.trim() ||
              choices.filter((c) => c.text.trim() !== '').length < 2 ||
              !choices.filter((c) => c.text.trim() !== '').some((c) => c.is_correct) ||
              isSubmitting
            }
            className="text-white px-6 py-2 rounded-lg hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving…' : 'Create MC Card'}
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

export default CreateMultipleChoiceCard;