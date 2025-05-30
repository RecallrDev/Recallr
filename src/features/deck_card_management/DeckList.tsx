import React from 'react';
import { Plus } from 'lucide-react';
import DeckCard from './DeckCard';
import type { Deck } from '../../types/Deck';

export type DeckListProps = {
  decks: Deck[];
  onCreateDeck: () => void;
  onStudyDeck: (deck: Deck) => void;
  onEditDeck: (deck: Deck) => void;
}

const DeckList: React.FC<DeckListProps> = ({
  decks,
  onCreateDeck,
  onStudyDeck,
  onEditDeck,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Decks</h1>
        <button
          onClick={onCreateDeck}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus size={20} />
          Create Deck
        </button>
      </div>

      {/* Deck Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            onStudy={onStudyDeck}
            onEdit={onEditDeck}
          />
        ))}
      </div>
    </div>
  );
};

export default DeckList;
