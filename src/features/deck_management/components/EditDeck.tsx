import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { authTokenManager } from '../../../util/AuthTokenManager';
import ConfirmDeckDeletionModal from './ConfirmDeckDeletionModal';
import  DeleteCardModal  from '../../card_management/components/DeleteCardModal';
import DeckForm from './DeckForm';
import { useCards } from '../../card_management/hooks/useCards';
import CardsView from '../../card_management/components/CardsView';
import type { Deck } from '../types/Deck';
import type { Card } from '../../card_management';

const API_URL = import.meta.env.VITE_API_URL;

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

  const [cardToDelete, setCardToDelete] = useState<Card | null>(null)

    const handlePromptDeleteCard = (card: Card) => {
    setCardToDelete(card)
  }

  const handleConfirmDeleteCard = async () => {
    if (!cardToDelete) return

    setLoading(true);
    const token = await authTokenManager.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const headers = await authTokenManager.getAuthHeaders()
    try {
      const res = await fetch(
        `${API_URL}/cards/${cardToDelete.id}`,
        {
          method: 'DELETE',
          headers,
          body: JSON.stringify({ 
            id: cardToDelete.id,
            type: cardToDelete.type,
          }),
        }
      )
      if (!res.ok) throw new Error(await res.text() || 'Failed to delete card')
      await refetch()
    } catch (err) {
      console.error('Error deleting card:', err)
    } finally {
      setCardToDelete(null)
    }
  }

  const handleCancelDeleteCard = () => {
    setCardToDelete(null)
  }

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
    } catch (err: any) {
      console.error('Error updating deck:', err);
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
            <h1 className="text-4xl font-bold text-gray-900">Edit Deck</h1>
            <p className="text-gray-600 mt-1">Modify your deck's details below.</p>
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
                {deckName.trim() || 'Deck Title'}
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
              onClick={handleUpdateDeck}
              disabled={!deckName.trim() || loading}
              className="flex-1 text-white px-8 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:scale-100 relative overflow-hidden group"
              style={{ backgroundColor: color }}
            >
              <span className="relative z-10">
                {loading ? 'Updating...' : 'Save Changes'}
              </span>
            </button>
            <button
              onClick={onCancel}
              className="px-8 py-4 bg-white border-2 hover:bg-gray-50 transition-all duration-200 font-semibold rounded-xl hover:scale-105"
              style={{ borderColor: color, color: color }}
            >
              Cancel
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 hover:bg-red-700 transition-all duration-200"
            >
              Delete Deck
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-8 mb-8">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:scale-105 transition-all duration-200"
          >
            Back to Decks
          </button>
          <button
            onClick={onAddCard}
            className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group"
            style={{ backgroundColor: color }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Plus size={18} className="relative z-10" />
            <span className="relative z-10">Add Card</span>
          </button>
        </div>

        {/* Cards List */}
        <CardsView
          deck={deck}
          cards={studyCards}
          isLoading={isLoading}
          onEditCard={(card) => console.log('Edit card:', card)}
          onDeleteCard={handlePromptDeleteCard}
          onAddCard={onAddCard}
        />

        {/* Deck Deletion Modal */}
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

        {/* Card‑delete modal */}
        {cardToDelete && (
          <DeleteCardModal
            cardLabel={
              cardToDelete.type === 'basic'
                ? cardToDelete.front
                : cardToDelete.question
            }
            onCancel={handleCancelDeleteCard}
            onConfirm={handleConfirmDeleteCard}
          />
        )}


      </div>
    </div>
  );
};

export default EditDeck;
