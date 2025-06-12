// src/components/CardsView.tsx
import React, { useState, useMemo } from 'react';
import { Table, Grid, Edit, Trash2, Plus, Search, X } from 'lucide-react';
import type { Card } from '../../types/Card';
import type { Deck } from '../../types/Deck';

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
  const [viewMode, setViewMode] = useState<ViewMode>('table');
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
    return <div className="mt-6 text-gray-600">Loading cards…</div>;
  }

  if (cards === null) {
    return (
      <div className="mt-6 text-red-600">
        Error loading cards. Please try again later.
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="mt-6 text-gray-600">
        No cards found in "{deck.name}."
        <div className="mt-4">
          <button
            onClick={onAddCard}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white hover:scale-105 rounded-md transition-all font-medium"
          >
            <Plus size={16} />
            Add Card
          </button>
        </div>
      </div>
    );
  }

  const renderTableView = () => (
    <div className="overflow-x-auto border border-gray-200 rounded-md">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              #
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Question
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Answer
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredCards.map((card, idx) => (
            <tr
              key={card.id}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-2 text-sm text-gray-800">{idx + 1}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {card.type === 'basic' ? card.front : card.question}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {card.type === 'basic' ? (
                  card.back
                ) : (
                  <div>
                    {card.choices.map((choice) => (
                      <div key={choice.id} className="flex items-center mb-1">
                        <span className="mr-2">{choice.answer_text}</span>
                        {choice.is_correct && (
                          <span className="text-green-600 font-semibold">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800 space-x-2">
                <button
                  onClick={() => onEditCard(card)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all font-medium"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  onClick={() => onDeleteCard(card)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-all font-medium"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        {/* "+ Add Card" row - only show when not searching or no results */}
        {(!searchQuery.trim() || filteredCards.length === 0) && (
          <tfoot>
            <tr className="bg-white">
              <td colSpan={4} className="px-4 py-4 text-center">
                <button
                  onClick={onAddCard}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:border-green-300 transition-all font-medium"
                >
                  <Plus size={16} />
                  Add Card
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );

  const renderCardsView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredCards.map((card, idx) => (
        <div
          key={card.id}
          className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:scale-105"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-medium text-white px-2 py-1 rounded"
                style={{ backgroundColor: deck.color }}
              >
                Card #{idx + 1}
              </span>
              <span
                className="text-xs font-medium text-white px-2 py-1 rounded"
                style={{
                  backgroundColor:
                    card.type === 'basic' ? '#7C3AED' : '#10B981',
                }}
              >
                {card.type === 'basic' ? 'Basic' : 'MC'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Question:
                </h4>
                <p className="text-sm text-gray-800">
                  {card.type === 'basic' ? card.front : card.question}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Answer:
                </h4>
                {card.type === 'basic' ? (
                  <p className="text-sm text-gray-800">{card.back}</p>
                ) : (
                  <div className="space-y-1">
                    {card.choices.map((choice) => (
                      <div
                        key={choice.id}
                        className={`text-sm p-2 rounded ${
                          choice.is_correct
                            ? 'bg-green-50 text-green-800 font-medium'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {choice.answer_text}{' '}
                        {choice.is_correct && <span>✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onEditCard(card)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 hover:scale-105 transition-all font-medium"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onDeleteCard(card)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 hover:scale-105 transition-all font-medium"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {/* "+ Add Card" tile at end of grid */}
      {!searchQuery.trim() && (
        <div
          onClick={onAddCard}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <Plus size={32} className="text-gray-400" />
          <span className="mt-2 text-sm text-gray-600">Add Card</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6">
      {/* Header with title and toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{`Cards in "${deck.name}"`}</h2>

        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Table size={16} />
            Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid size={16} />
            Cards
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search cards by question, answer, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* No results message */}
      {searchQuery.trim() && filteredCards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-1">No cards found</p>
          <p className="text-sm">
            Try adjusting your search term or{' '}
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              clear the search
            </button>
          </p>
        </div>
      )}

      {/* Render whichever view is selected */}
      {filteredCards.length > 0 && (
        <>
          {viewMode === 'table' ? renderTableView() : renderCardsView()}
        </>
      )}

      {/* Cards count */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        {searchQuery.trim() ? (
          <>
            Showing {filteredCards.length} of {cards.length} card{cards.length === 1 ? '' : 's'}
            {filteredCards.length !== cards.length && (
              <button
                onClick={clearSearch}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                (show all)
              </button>
            )}
          </>
        ) : (
          <>
            {cards.length} card{cards.length === 1 ? '' : 's'} total
          </>
        )}
      </div>

      {/* Add Card button when searching and results exist */}
      {searchQuery.trim() && filteredCards.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={onAddCard}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white hover:scale-105 rounded-md transition-all font-medium"
          >
            <Plus size={16} />
            Add New Card
          </button>
        </div>
      )}
    </div>
  );
};

export default CardsView;