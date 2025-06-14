import React, { useState, useMemo } from 'react';
import { Table, Grid, Edit, Trash2, Plus, Search, X, CreditCard, HelpCircle, CheckCircle2 } from 'lucide-react';
import type { Card } from '../../../types/Card';
import type { Deck } from '../../deck_management/types/Deck';

export type CardsViewProps = {
  deck: Deck;
  cards: Card[];
  isLoading: boolean;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
  onAddCard: () => void;
};

type ViewMode = 'table' | 'cards';

const CardsView: React.FC<CardsViewProps> = ({
  deck,
  cards,
  isLoading,
  onEditCard,
  onDeleteCard,
  onAddCard,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) {
      return cards;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return cards.filter((card) => {
      // Search in question/front text
      const questionText = card.type === 'basic' ? card.front : card.question;
      if (questionText.toLowerCase().includes(query)) {
        return true;
      }

      // Search in answer/back text
      if (card.type === 'basic') {
        if (card.back.toLowerCase().includes(query)) {
          return true;
        }
      } else {
        // Search in multiple choice answers
        if (card.choices.some(choice => 
          choice.answer_text.toLowerCase().includes(query)
        )) {
          return true;
        }
      }

      // Search in card type with multiple aliases
      const cardTypeAliases = card.type === 'basic' 
        ? ['basic', 'flashcard', 'flash card', 'simple'] 
        : ['multiple_choice', 'multiple choice', 'mc', 'multichoice', 'quiz'];
      
      if (cardTypeAliases.some(alias => alias.toLowerCase().includes(query))) {
        return true;
      }

      return false;
    });
  }, [cards, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading cards...</span>
      </div>
    );
  }

  if (cards === null) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-medium mb-2">Error loading cards</div>
        <p className="text-red-500 text-sm">Please try again later.</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <CreditCard size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No cards yet</h3>
        <p className="text-gray-600 mb-6">Get started by creating your first card for "{deck.name}"</p>
        <button
          onClick={onAddCard}
          className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: deck.color }}
        >
          <Plus size={20} />
          Create First Card
        </button>
      </div>
    );
  }

  const renderTableView = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead style={{ backgroundColor: `${deck.color}15` }}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Question
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Answer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredCards.map((card, idx) => (
              <tr
                key={card.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {idx + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {card.type === 'basic' ? (
                      <CreditCard size={16} className="text-purple-600" />
                    ) : (
                      <HelpCircle size={16} className="text-green-600" />
                    )}
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                      backgroundColor: card.type === 'basic' ? '#7C3AED20' : '#10B98120',
                      color: card.type === 'basic' ? '#7C3AED' : '#10B981'
                    }}>
                      {card.type === 'basic' ? 'Basic' : 'Multiple Choice'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                    {card.type === 'basic' ? card.front : card.question}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {card.type === 'basic' ? (
                    <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                      {card.back}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {card.choices.slice(0, 2).map((choice) => (
                        <div key={choice.id} className="flex items-center text-xs">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            choice.is_correct ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className={`line-clamp-1 max-w-[200px] ${
                            choice.is_correct ? 'text-green-700 font-medium' : 'text-gray-600'
                          }`}>
                            {choice.answer_text}
                          </span>
                        </div>
                      ))}
                      {card.choices.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{card.choices.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditCard(card)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:scale-105 transition-all duration-200"
                    >
                      <Edit size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteCard(card)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:scale-105 transition-all duration-200"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Card Button in Table Footer */}
      {!searchQuery.trim() && (
        <div className="border-t border-gray-100 p-6 text-center bg-gray-50">
          <button
            onClick={onAddCard}
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: deck.color }}
          >
            <Plus size={18} />
            Add New Card
          </button>
        </div>
      )}
    </div>
  );

  const renderCardsView = () => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filteredCards.map((card, idx) => (
        <div
          key={card.id}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col h-80"
        >
          {/* Card Header */}
          <div
            className="px-6 py-4 text-white relative"
            style={{ backgroundColor: deck.color }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                {card.type === 'basic' ? (
                  <CreditCard size={18} />
                ) : (
                  <HelpCircle size={18} />
                )}
                <span className="font-semibold">Card #{idx + 1}</span>
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {card.type === 'basic' ? 'Basic' : 'MC'}
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Question */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: deck.color }} />
                  Question
                </h4>
                <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">
                  {card.type === 'basic' ? card.front : card.question}
                </p>
              </div>

              {/* Answer */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-600" />
                  Answer
                </h4>
                {card.type === 'basic' ? (
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {card.back}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {card.choices.slice(0, 3).map((choice) => (
                      <div
                        key={choice.id}
                        className={`text-xs p-2 rounded-lg border ${
                          choice.is_correct
                            ? 'bg-green-50 border-green-200 text-green-800 font-medium'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            choice.is_correct ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                          <span className="line-clamp-1">{choice.answer_text}</span>
                        </div>
                      </div>
                    ))}
                    {card.choices.length > 3 && (
                      <div className="text-xs text-gray-400 text-center">
                        +{card.choices.length - 3} more options
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => onEditCard(card)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:scale-105 transition-all duration-200"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={() => onDeleteCard(card)}
                className="flex items-center justify-center w-10 h-10 text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:scale-105 transition-all duration-200"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Card Tile */}
      {!searchQuery.trim() && (
        <div
          onClick={onAddCard}
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] flex flex-col items-center justify-center h-80 group"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-200"
            style={{ backgroundColor: `${deck.color}20` }}
          >
            <Plus size={32} style={{ color: deck.color }} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            Add New Card
          </h3>
          <p className="text-sm text-gray-500 mt-1">Create another flashcard</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Enhanced Styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Cards in "{deck.name}"
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {filteredCards.length} of {cards.length} cards
            {searchQuery && " (filtered)"}
          </p>
        </div>

        {/* Enhanced View Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table size={16} />
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                viewMode === 'cards'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid size={16} />
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search cards by question, answer, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-sm bg-white shadow-sm"
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced No Results Message */}
      {searchQuery.trim() && filteredCards.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any cards matching "{searchQuery}"
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={clearSearch}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:scale-105 transition-all duration-200"
            >
              Clear Search
            </button>
            <button
              onClick={onAddCard}
              className="px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: deck.color }}
            >
              Create New Card
            </button>
          </div>
        </div>
      )}

      {/* Render Content */}
      {filteredCards.length > 0 && (
        <>
          {viewMode === 'table' ? renderTableView() : renderCardsView()}
        </>
      )}

      {/* Enhanced Footer with Search Results */}
      {searchQuery.trim() && filteredCards.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredCards.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{cards.length}</span> cards
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearSearch}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Show all cards
              </button>
              <button
                onClick={onAddCard}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: deck.color }}
              >
                <Plus size={16} />
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsView;