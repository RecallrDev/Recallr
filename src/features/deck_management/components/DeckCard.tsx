import React from 'react';
import { Play, Edit, Plus, Download, Calendar, Hash } from 'lucide-react';
import type { Deck } from '../types/Deck';
import { useNavigate } from 'react-router-dom';
import { AIGenerationButton } from '../../ai_generation';

export type DeckCardProps = {
  deck: Deck;
  onStudy: (deck: Deck) => void;
  onEdit: (deck: Deck) => void;
  onAIGenerationClick: (deckId: string, deckName: string) => void; // ← Neues Event
  onAIGenerationSuccess?: (deckId: string) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ 
  deck, 
  onStudy, 
  onEdit, 
  onAIGenerationClick,
  onAIGenerationSuccess 
}) => {
  const navigate = useNavigate();

  const handleStudyOrAddCards = () => {
    if (deck.cardCount === 0) {
      navigate(`/decks/${deck.id}/cards/new`);
    } else {
      onStudy(deck);
    }
  };

  const handleAISuccess = (deckId: string) => {
    if (onAIGenerationSuccess) {
      onAIGenerationSuccess(deckId);
    }
  }

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

        {/* Main action buttons */}
        <div className="flex gap-2 mb-3">
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

        {/* AI Generation Section - Only show if deck has cards */}
        {deck.cardCount > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                AI Magic
              </span>
            </div>
            <AIGenerationButton
              sourceDeckId={deck.id}
              sourceDeckName={deck.name}
              onOpenModal={onAIGenerationClick} // ← Verwendet neues Event
              variant="minimal"
              size="sm"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Generate similar content with AI
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckCard;