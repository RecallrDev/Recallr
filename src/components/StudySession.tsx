import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Flashcard from './Flashcard';
import type { FlashcardData } from '../types/FlashcardData';
import type { Deck } from '../types/Deck';

interface StudySessionProps {
  deck: Deck;
  cards: FlashcardData[];
  currentCardIndex: number;
  showAnswer: boolean;
  onFlipCard: () => void;
  onNextCard: () => void;
  onReset: () => void;
  onExit: () => void;
}

const StudySession: React.FC<StudySessionProps> = ({
  deck,
  cards,
  currentCardIndex,
  showAnswer,
  onFlipCard,
  onNextCard,
  onReset,
  onExit,
}) => {
  const currentCard = cards[currentCardIndex];
  const progress =
    cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;

  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-4">
          No cards available in this deck.
        </h2>
        <button
          onClick={onExit}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Decks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="text-gray-600 hover:text-purple-600"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{deck.name}</h1>
        </div>
        <button
          onClick={onReset}
          title="Reset Study Session"
          className="text-gray-600 hover:text-purple-600 hover:-rotate-360 transition-transform duration-300"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Card {currentCardIndex + 1} of {cards.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: deck.color || '#3B82F6',
            }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <Flashcard
        card={currentCard}
        showAnswer={showAnswer}
        onFlip={onFlipCard}
        deckColor={deck.color}
      />

      {/* Next Card Button */}
      {showAnswer && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onNextCard}
            className="text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all"
            style={{
              backgroundColor: deck.color || '#3B82F6',
            }}
          >
            {currentCardIndex < cards.length - 1 ? 'Next Card' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StudySession;
