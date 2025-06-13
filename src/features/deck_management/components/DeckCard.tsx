import React from 'react';
import { Play, Edit, Plus, Download, Calendar, Hash } from 'lucide-react';
import type { Deck } from '../types/Deck';
import { useNavigate } from 'react-router-dom';

export type DeckCardProps = {
  deck: Deck;
  onStudy: (deck: Deck) => void;
  onEdit: (deck: Deck) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onStudy, onEdit }) => {
  const navigate = useNavigate();

  const handleStudyOrAddCards = () => {
    if (deck.cardCount === 0) {
      navigate(`/decks/${deck.id}/cards/new`);
    } else {
      onStudy(deck);
    }
  };

  const formatLastStudied = (dateString?: string) => {
    if (!dateString) return 'Never studied';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group h-80 flex flex-col">
      {/* Header with deck color and improved design */}
      <div
        className="relative px-6 py-5 text-white flex-shrink-0"
        style={{ backgroundColor: deck.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative flex items-start justify-between">
          <h3 
            className="text-xl font-bold leading-tight break-words line-clamp-2 flex-1 pr-2 truncate"
            title={deck.name}
          >
            {deck.name}
          </h3>
          {deck.isImported && (
            <div className="flex-shrink-0 ml-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group/import relative">
                <Download size={16} className="text-white" />
                <div className="absolute -bottom-10 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover/import:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Imported Deck
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content area with flex-1 to take remaining space */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        {/* Deck info */}
        <div className="space-y-4">
          {/* Category badge */}
          <div className="flex items-center justify-between">
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: `${deck.color}20`, color: deck.color }}
            >
              {deck.category}
            </span>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Hash size={16} className="text-gray-400" />
              <span className="text-sm font-medium">
                {deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm">
                {formatLastStudied(deck.last_studied)}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons - always at bottom */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleStudyOrAddCards}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg relative overflow-hidden group/btn"
            style={{ backgroundColor: deck.color }}
            title={deck.cardCount === 0 ? "Add cards to start studying" : "Start studying this deck"}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            {deck.cardCount === 0 ? (
              <Plus size={18} className="relative z-10" />
            ) : (
              <Play size={18} className="relative z-10" />
            )}
            <span className="relative z-10">
              {deck.cardCount === 0 ? 'Add Cards' : 'Study'}
            </span>
          </button>
          
          <button
            onClick={() => onEdit(deck)}
            className="flex items-center justify-center w-12 h-12 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 border border-gray-200"
            title="Edit deck"
          >
            <Edit size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckCard;