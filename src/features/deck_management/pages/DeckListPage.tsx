import React from 'react';
import { useNavigate } from 'react-router-dom';
import UploadAnkiDeck from '../../upload_management/UploadAnkiDeck';
import DeckList from '../components/DeckList';
import { useDecks } from '../hooks/useDecks';
import type { Deck } from '../types/Deck';
import LogoLoadingIndicator from '../../../shared/components/LogoLoadingIndicator';
import { Plus } from 'lucide-react';

const DeckListPage: React.FC = () => {
  const navigate = useNavigate();
  const { decks, isLoading, error, refetch } = useDecks();

  // “Create Deck” button → /decks/new
  const handleCreateDeck = () => navigate('/decks/new');

  // “Study” button → /study/:deckId
  const handleStudyDeck = (deck: Deck) => {
    navigate(`/study/${deck.id}`);
  };

  // “Edit” button → /decks/:deckId/edit
  const handleEditDeck = (deck: Deck) => {
    console.log(deck.color);
    navigate(`/decks/${deck.id}/edit`);
  };

  const handleDeckRefresh = async () => {
    console.log('🔄 DeckListPage: Starting refresh...');
    console.log('📊 Current deck count:', decks.length);
    
    await refetch();
    
    console.log('✅ DeckListPage: Refresh completed!');
  };

  if (isLoading) {
    return <LogoLoadingIndicator loadingText="Loading decks..." />;
  }
  if (error) {
    return (
      <div className="p-6 text-red-600">
        <p>Error loading decks: {error.message}</p>
      </div>
    );
  }
  if (decks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">No Decks Found</h1>
        <p className="text-gray-600 mb-6">
          You don’t have any decks yet. Create your first deck to get started!
        </p>
        <div className="flex gap-3 justify-center">
          <UploadAnkiDeck onUploadSuccess={handleCreateDeck} />
            <button
              onClick={handleCreateDeck}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Create Deck
            </button>
        </div>
      </div>
    );
  }

  return (
    <DeckList
      decks={decks}
      onCreateDeck={handleCreateDeck}
      onStudyDeck={handleStudyDeck}
      onEditDeck={handleEditDeck}
      onDeckRefresh={handleDeckRefresh}
    />
  );
};

export default DeckListPage;
