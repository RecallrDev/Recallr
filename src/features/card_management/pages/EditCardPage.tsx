import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EditBasicCard } from '../components/EditBasicCard';
import EditMCCard from '../components/EditMCCard';
import { useDecks } from '../../deck_management';
import { useCard } from '../hooks/useCard';

const EditCardPage: React.FC = () => {
  const { deckId, cardId } = useParams<{ deckId: string; cardId: string }>();
  const navigate = useNavigate();

  // Fetch decks
  const { decks, isLoading: decksLoading, error: decksError } = useDecks();
  // Fetch card
  const { card, isLoading: cardLoading, error: cardError } = useCard(cardId || '');

  // Validate params
  if (!deckId || !cardId) {
    return <Navigate to="/decks" replace />;
  }

  if (decksLoading || cardLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (decksError || cardError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">
          Error: {(decksError || cardError)?.message}
        </div>
      </div>
    );
  }

  const deck = decks.find((d) => String(d.id) === deckId);
  if (!deck || !card) {
    return <Navigate to="/decks" replace />;
  }

  const handleCancel = () => navigate(`/decks/${deck.id}/edit`);
  const handleSuccess = () => navigate(`/decks/${deck.id}/edit`);

  const renderEditForm = () => {
    if (card.type === 'basic') {
      return (
        <EditBasicCard
          cardId={cardId}
          deckColor={deck.color}
          initialData={card as { front: string; back: string; front_image?: string; back_image?: string }}
          onSaveSuccess={handleSuccess}
          onDeleteSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      );
    } else {
      return (
        <EditMCCard
          cardId={cardId}
          deckColor={deck.color}
          initialData={{
            ...card,
            front_image: card.front_image ?? null
          }}
          onSaveSuccess={handleSuccess}
          onDeleteSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleCancel} 
            className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:scale-110 transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Card</h1>
            <p className="text-gray-600 mt-1">Update your card content</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="transition-all duration-300">
          {renderEditForm()}
        </div>
      </div>
    </div>
  );
};

export default EditCardPage;