import React from 'react';
import BasicCardStudyView from './BasicCardStudyView';
import MCCardStudyView from './MCCardStudyView';
import ProgressBar from './ProgressBar';
import ActionButtons from './ActionButtons';
import type { Card, BasicCard, MultipleChoiceCard } from '../../card_management/types/Card';
import type { Deck } from '../../deck_management/types/Deck';

export type StudySessionProps = {
  deck: Deck;
  cards: Card[];
  currentCardIndex: number;
  showAnswer: boolean;
  onFlipCard: () => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  onReset: () => void;
  onExit: () => void;
};

const StudySession: React.FC<StudySessionProps> = ({
  deck,
  cards,
  currentCardIndex,
  showAnswer,
  onFlipCard,
  onNextCard,
  onPrevCard,
  onReset,
  onExit,
}) => {
  const currentCard = cards[currentCardIndex];

  if (!currentCard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">No cards found in this deck.</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
          >
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  const isLastCard = currentCardIndex === cards.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header with Progress and Reset */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <ProgressBar
                deck={deck}
                currentCardIndex={currentCardIndex}
                cards={cards}
                onReset={onReset}
              />
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="mb-8">
          {currentCard.type === 'basic' ? (
            <BasicCardStudyView
              card={currentCard as BasicCard}
              showAnswer={showAnswer}
              deckColor={deck.color}
            />
          ) : (
            <MCCardStudyView
              card={currentCard as MultipleChoiceCard}
              showAnswer={showAnswer}
              deckColor={deck.color}
            />
          )}
        </div>

        {/* Action Buttons */}
        <ActionButtons
          deck={deck}
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          showAnswer={showAnswer}
          isLastCard={isLastCard}
          onFlipCard={onFlipCard}
          onNextCard={onNextCard}
          onPrevCard={onPrevCard}
          onExit={onExit}
        />
      </div>
    </div>
  );
};

export default StudySession;