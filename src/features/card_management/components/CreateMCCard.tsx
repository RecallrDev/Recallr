import React, { useState } from 'react';
import { Plus, X, Image, HelpCircle, CheckCircle2 } from 'lucide-react';
import { authTokenManager } from '../../../util/AuthTokenManager';
import { ImageUploadModal } from '../../card_image_upload';
import { type ImageUploadResult } from '../../card_image_upload';

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
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState<ChoiceInput[]>([
    { text: '', is_correct: false },
    { text: '', is_correct: false }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Image states
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [questionThumbnail, setQuestionThumbnail] = useState<string | null>(null);

  const handleImageUpload = (result: ImageUploadResult, location: 'front' | 'back') => {
    const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${result.url}`;
    const thumbnailUrl = result.thumbnail_url 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${result.thumbnail_url}`
      : fullUrl;

    setQuestionImage(fullUrl);
    setQuestionThumbnail(thumbnailUrl);
    setShowUploadModal(false);
  };

  const removeImage = () => {
    setQuestionImage(null);
    setQuestionThumbnail(null);
  };

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
    if (!question.trim()) {
      return;
    }
    
    const filledChoices = choices.filter((c) => c.text.trim() !== '');
    if (filledChoices.length < 2) {
      return;
    }
    
    if (!filledChoices.some((c) => c.is_correct)) {
      return;
    }

    setIsSubmitting(true);

    if (!(await authTokenManager.isAuthenticated())) {
      setIsSubmitting(false);
      console.error('User is not authenticated');
      return;
    }

    const headers = await authTokenManager.getAuthHeaders();

    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        deck_id: deckId,
        created_at: new Date().toISOString(),
        type: 'multiple_choice',
        front_image: questionImage,
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

    setQuestion('');
    setChoices([
      { text: '', is_correct: false },
      { text: '', is_correct: false }
    ]);
    setQuestionImage(null);
    setQuestionThumbnail(null);
    setIsSubmitting(false);

    onCreateSuccess();
  };

  const filledChoices = choices.filter((c) => c.text.trim() !== '');
  const correctChoices = filledChoices.filter((c) => c.is_correct);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Question Section */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div 
          className="px-6 py-4 text-white relative"
          style={{ backgroundColor: deckColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center gap-2">
            <HelpCircle size={20} />
            <h3 className="text-lg font-bold">Question</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              What's your question?
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg resize-none"
              placeholder="Enter your multiple choice question..."
              rows={4}
            />
          </div>

          {/* Show image preview OR upload button, not both */}
          {questionThumbnail ? (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Image
              </label>
              <div className="relative inline-block">
                <img 
                  src={questionThumbnail} 
                  alt="Question preview" 
                  className="h-32 w-auto rounded-xl border border-gray-200 shadow-sm"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowUploadModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-700"
            >
              <Image size={20} />
              Add Image to Question
            </button>
          )}
        </div>
      </div>

      {/* Answer Choices Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div 
          className="px-6 py-4 text-white relative"
          style={{ backgroundColor: deckColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} />
              <h3 className="text-lg font-bold">Answers</h3>
            </div>
            <span className="text-sm opacity-80">{choices.length}/10</span>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {choices.map((choice, idx) => (
              <div key={idx} className="group">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleChoiceCorrectToggle(idx)}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      choice.is_correct
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {choice.is_correct && <CheckCircle2 size={12} />}
                  </button>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) => handleChoiceTextChange(idx, e.target.value)}
                      placeholder={`Answer choice ${idx + 1}`}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  {choices.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeChoice(idx)}
                      className="mt-1 p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addChoice}
            disabled={choices.length >= 10}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-gray-600 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Add Choice
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Click the circle next to correct answers. You need at least 2 choices and 1 correct answer.
            </p>
            <div className="mt-2 flex gap-4 text-xs text-blue-600">
              <span>Choices: {filledChoices.length}/10</span>
              <span>Correct: {correctChoices.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Full Width */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex gap-4">
            <button
              onClick={handleCreateMC}
              disabled={
                (!question.trim() && !questionImage) ||
                filledChoices.length < 2 ||
                !correctChoices.length ||
                isSubmitting
              }
              className="flex-1 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:scale-100 relative overflow-hidden group"
              style={{ backgroundColor: deckColor }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">
                {isSubmitting ? 'Creating Card...' : 'Create Multiple Choice Card'}
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
          cardType="mc"
          onCancel={() => setShowUploadModal(false)}
          onUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

export default CreateMultipleChoiceCard;