import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import CreateCard from '../../features/deck_card_management/CreateCard';
import { useDecks } from '../hooks/useDecks';

const CreateCardPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { decks, isLoading, error, refetch: refetchDecks } = useDecks();

  // Early return if no deckId in URL
  if (!deckId) {
    return <Navigate to="/decks" replace />;
  }

  // Show loading state while decks are being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading deck...</div>
      </div>
    );
  }

  // Show error state if there was an error fetching decks
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error loading decks: {error.message}</div>
      </div>
    );
  }

  // Find the deck object by ID
  const deck = decks.find((d) => String(d.id) === String(deckId));

  // If deck not found after loading is complete, redirect
  if (!deck) {
    console.warn(`Deck with ID ${deckId} not found in CreateCardPage`);
    return <Navigate to="/decks" replace />;
  }

  const handleCreateSuccess = async () => {
    await refetchDecks();
    navigate(`/decks/${deck.id}/cards/new`);
  };

  return (
    <CreateCard
      deckId={deck.id}
      deckColor={deck.color}
      onCreateSuccess={handleCreateSuccess}
      onCancel={() => navigate(`/decks/${deck.id}/edit`)}
    />
  );
};

export default CreateCardPage;