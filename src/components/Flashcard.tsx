import React from 'react';
import type { FlashcardData } from '../types/FlashcardData';

interface FlashcardProps {
  card: FlashcardData;
  showAnswer: boolean;
  onFlip: () => void;
  deckColor?: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, showAnswer, onFlip, deckColor }) => {
  const displayText = showAnswer ? card.back : card.front;
  const label = showAnswer ? 'Answer' : 'Question';
  const primaryColor = deckColor || '#3B82F6';

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-6 min-h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-4">
            {displayText}
          </div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>

      {/* Study Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onFlip}
          className={`px-8 py-3 rounded-lg text-lg font-medium transition-all ${
            showAnswer
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'text-white hover:opacity-90'
          }`}
          style={!showAnswer ? { backgroundColor: primaryColor } : undefined}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>
    </>
  );
};

export default Flashcard;
