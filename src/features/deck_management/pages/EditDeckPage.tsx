import React from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import EditDeck from '../components/EditDeck';
import { useDecks } from '../hooks/useDecks';
import LogoLoadingIndicator from '../../../shared/components/LogoLoadingIndicator';

const EditDeckPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { decks, isLoading, error, refetch: refetchDecks } = useDecks();

  // Early return if no deckId in URL
  if (!deckId) {
    return <Navigate to="/decks" replace />;
  }

  // Show loading state while decks are being fetched
  if (isLoading) {
    return <LogoLoadingIndicator loadingText="Loading deck..." />;
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
    console.warn(`Deck with ID ${deckId} not found`);
    return <Navigate to="/decks" replace />;
  }

  const handleUpdateSuccess = async () => {
    await refetchDecks();
  };

  return (
    <>
      <EditDeck
        deck={deck}
        onCancel={() => navigate('/decks')}
        onUpdateSuccess={handleUpdateSuccess}
        onAddCard={() => navigate(`/decks/${deck.id}/cards/new`)}
        onDeleteSuccess={() => {
          handleUpdateSuccess();
        }}
      />
    </>
  );
};

export default EditDeckPage;