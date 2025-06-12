import React from 'react';
import { Play, Edit, Plus, Download } from 'lucide-react';
import type { Deck } from '../../types/Deck';

export type DeckCardProps = {
  deck: Deck;
  onStudy: (deck: Deck) => void;
  onEdit: (deck: Deck) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onStudy, onEdit }) => {
  const handleStudyOrAddCards = () => {
    if (deck.cardCount === 0) {
      // Navigate to add cards page
      window.location.href = `/decks/${deck.id}/cards/new`;
    } else {
      // Start studying
      onStudy(deck);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 relative overflow-hidden shadow-lg ring-1 ring-black/5 hover:shadow-xl hover:scale-105 transition-all duration-200">
      
      {/* Color header bar */}
      <div
        className="px-6 py-4 text-white"
        style={{ backgroundColor: deck.color }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{deck.name}</h3>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">{deck.category}</p>

          {deck.isImported && (
            <div className="group relative">
              <Download className="w-3 h-3" color={deck.color} />
              <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Imported Deck
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-6">
          <p className="text-gray-600">{deck.cardCount} cards</p>
          <p className="text-sm text-gray-500">
            {deck.last_studied
              ? `Last studied: ${new Date(deck.last_studied).toLocaleString('de-DE', {
                  day:   '2-digit',
                  month: '2-digit',
                  year:  'numeric',
                  hour:  '2-digit',
                  minute:'2-digit',
                })}`
              : 'Never studied'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleStudyOrAddCards}
            className="flex-1 text-white px-3 py-2 rounded flex items-center justify-center gap-2 hover:scale-105 transition-all font-medium group hover:cursor-pointer"
            style={{ backgroundColor: deck.color }}
            title={deck.cardCount === 0 ? "Add cards to start studying" : "Start studying this deck"}
          >
            {deck.cardCount === 0 ? (
              <Plus size={16} className="stroke-white" />
            ) : (
              <Play 
                size={16} 
                className="stroke-white transition-colors group-hover:fill-white" 
              />
            )}
            {deck.cardCount === 0 ? 'Add Cards' : 'Study'}
          </button>
          <button
            onClick={() => onEdit(deck)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 hover:scale-105 transition-colors hover:cursor-pointer"
          >
            <Edit size={16} style={{ color: deck.color }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckCard;
