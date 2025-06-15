import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { authTokenManager } from '../../../util/AuthTokenManager';
import DeckForm from './DeckForm';

const API_URL = import.meta.env.VITE_API_URL;

export type CreateDeckProps = {
  deckName: string;
  setDeckName: (name: string) => void;
  category: string;
  setCategory: (category: string) => void;
  color: string;
  setColor: (color: string) => void;
  onCreateSuccess: () => void;
  onCancel: () => void;
};

const CreateDeck: React.FC<CreateDeckProps> = ({
  deckName,
  setDeckName,
  category,
  setCategory,
  color,
  setColor,
  onCreateSuccess,
  onCancel,
}) => {
  const handleCreateDeck = async () => {
    if (!(await authTokenManager.isAuthenticated())) {
      return;
    }

    const headers = await authTokenManager.getAuthHeaders();

    const response = await fetch(`${API_URL}/decks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: deckName.trim(),
        category,
        color,
      }),
    });

    if (response.ok) {
      onCreateSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onCancel}
            className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:scale-110 transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Create New Deck</h1>
            <p className="text-gray-600 mt-1">
              Set up your flashcard deck with a name, category, and color
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Preview Header */}
          <div
            className="px-8 py-6 text-white relative overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative">
              <h2 className="text-2xl font-bold">
                {deckName.trim() || 'Your Deck Name'}
              </h2>
              <p className="text-white/80 mt-1">{category}</p>
            </div>
          </div>

          {/* Shared Deck Form */}
          <DeckForm
            deckName={deckName}
            setDeckName={setDeckName}
            category={category}
            setCategory={setCategory}
            color={color}
            setColor={setColor}
          />

          {/* Actions */}
          <div className="flex gap-4 px-8 pb-8 pt-4">
            <button
              onClick={handleCreateDeck}
              disabled={!deckName.trim()}
              className="flex-1 text-white px-8 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:scale-100 relative overflow-hidden group"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Create Deck</span>
            </button>
            <button
              onClick={onCancel}
              className="px-8 py-4 bg-white border-2 hover:bg-gray-50 transition-all duration-200 font-semibold rounded-xl hover:scale-105"
              style={{ borderColor: color, color: color }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDeck;
