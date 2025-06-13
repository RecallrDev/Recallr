import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { authTokenManager } from '../../../util/AuthTokenManager';
import ConfirmDeckDeletionModal from './ConfirmDeckDeletionModal';
import { useCards } from '../../card_management/hooks/useCards';
import CardsView from '../../card_management/components/CardsView';
import type { Deck } from '../types/Deck';

const API_URL = import.meta.env.VITE_API_URL;

const categories = [
  'Languages', 'Science', 'History', 'Mathematics', 'Literature',
  'Geography', 'Medicine', 'Technology', 'Art', 'Music', 'Other'
];

const colorOptions = [
  { name: 'Purple', value: '#9810FA' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Lime', value: '#84CC16' },
  { name: 'Pink', value: '#FF007F' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Black', value: '#000000' },
];

export type EditDeckProps = {
  deck: Deck;
  onCancel: () => void;
  onUpdateSuccess: () => void;
  onAddCard: () => void;
  onDeleteSuccess: () => void;
};

const EditDeck: React.FC<EditDeckProps> = ({
  deck,
  onCancel,
  onUpdateSuccess,
  onAddCard,
  onDeleteSuccess,
}) => {
  const [deckName, setDeckName] = useState(deck.name);
  const [category, setCategory] = useState(deck.category);
  const [color, setColor] = useState(deck.color);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // FETCH CARDS (no shuffle)
const { studyCards, isLoading, error, refetch } = useCards(deck.id, false);

  const handleUpdateDeck = async () => {
    setLoading(true);
    const token = await authTokenManager.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const headers = await authTokenManager.getAuthHeaders();

    try {
      const response = await fetch(`${API_URL}/decks/${deck.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: deckName.trim(),
          category,
          color,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to update deck');
      }

      onUpdateSuccess();
      // Optionally: after a successful update, re-fetch the cards if necessary
      // await refetch();
    } catch (err: any) {
      console.error('Error updating deck via Python backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = await authTokenManager.getToken();
    if (!token) return;
    const headers = await authTokenManager.getAuthHeaders();

    try {
      const response = await fetch(`${API_URL}/decks/${deck.id}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to delete deck');
      }
      onDeleteSuccess();
    } catch (err: any) {
      console.error('Error deleting deck:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Deck</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
        {/* Deck Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deck Name
          </label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter deck name..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deck Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => setColor(colorOption.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === colorOption.value
                    ? 'border-gray-900 ring-2 ring-gray-300'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: colorOption.value }}
                title={colorOption.name}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-600">Selected:</span>
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-sm text-gray-700">
              {colorOptions.find((c) => c.value === color)?.name || 'Custom'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleUpdateDeck}
            disabled={!deckName.trim() || loading}
            className="text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
            style={{ backgroundColor: color }}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            className="bg-white px-6 py-2 rounded-lg border hover:scale-105 transition-all font-medium"
            style={{ color: color, borderColor: color }}
          >
            Cancel
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white ml-auto px-6 py-2 rounded-lg border hover:scale-105 hover:bg-red-700 transition-all font-medium"
          >
            Delete
          </button>
        </div>

        {showDeleteModal && (
          <ConfirmDeckDeletionModal
            deckName={deck.name}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={async () => {
              await handleDelete();
              setShowDeleteModal(false);
            }}
          />
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-all hover:scale-105 font-medium"
        >
          Back to Decks
        </button>
        <button
          onClick={onAddCard}
          className="text-white px-4 py-2 rounded hover:scale-105 transition-all font-medium"
          style={{ backgroundColor: color }}
        >
          + Add Card
        </button>
      </div>

      <CardsView
        deck={deck}
        cards={studyCards}
        isLoading={isLoading}
        onEditCard={(card) => {
          console.log('Edit card:', card);
        }}
        onDeleteCard={(cardId) => {
          console.log('Delete card:', cardId);
        }}
        onAddCard={onAddCard}
      />
    </div>
  );
};

export default EditDeck;