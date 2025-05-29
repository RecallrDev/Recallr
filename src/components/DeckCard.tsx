import React from 'react';
import { Play, Edit } from 'lucide-react';
import type { Deck } from '../types/Deck';

export type DeckCardProps = {
  deck: Deck;
  onStudy: (deck: Deck) => void;
  onEdit: (deck: Deck) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onStudy, onEdit }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 relative overflow-hidden shadow-lg ring-1 ring-black/5 hover:shadow-xl hover:scale-105 transition-all duration-200">
      
      {/* Color header bar */}
      <div
        className="px-6 py-4 text-white"
        style={{ backgroundColor: deck.color }}
      >
        <h3 className="text-xl font-bold">{deck.name}</h3>
      </div>

      {/* Card content */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-3">{deck.category}</p>
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
            onClick={() => onStudy(deck)}
            className="flex-1 text-white px-3 py-2 rounded flex items-center justify-center gap-2 hover:scale-105 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
            style={{ backgroundColor: deck.color }}
            disabled={deck.cardCount === 0}
          >
            <Play size={16} className="stroke-white group-hover:fill-white transition-colors" />
            Study
          </button>
          <button
            onClick={() => onEdit(deck)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 hover:scale-105 transition-colors"
          >
            <Edit size={16} style={{ color: deck.color }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckCard;
