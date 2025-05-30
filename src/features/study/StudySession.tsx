import React from 'react';
import BasicCardStudyView from './components/BasicCardStudyView';
import MCCardStudyView from './components/MCCardStudyView';
import ProgressBar from './components/ProgressBar';
import ActionButtons from './components/ActionButtons';
import ResetButton from './components/ResetButton';
import type { Card, BasicCard, MultipleChoiceCard } from '../../types/Card';
import type { Deck } from '../../types/Deck';


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

  // If there are no cards in this deck, just show a message and an Exit button.
  if (!currentCard) {
    return (
      <div className="text-center p-6">
        <p>No cards in this deck.</p>
        <button
          onClick={onExit}
          className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 hover:scale-105 transform transition"
        >
          Back to Decks
        </button>
      </div>
    );
  }

  // Determine if this is the last card
  const isLastCard = currentCardIndex === cards.length - 1;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <ProgressBar
        deck={deck}
        currentCardIndex={currentCardIndex}
        cards={cards}
      />

      {/* Reset Button (top‐right) */}
      <div className="flex justify-end mb-2">
        <ResetButton onReset={onReset} color={deck.color} />
      </div>

      {/* Card Display */}
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

      {/* Action Buttons */}
      <ActionButtons
        deck = {deck}
        showAnswer={showAnswer}
        currentCardIndex={currentCardIndex}
        isLastCard={isLastCard}
        onFlipCard={onFlipCard}
        onNextCard={onNextCard}
        onPrevCard={onPrevCard}
        onExit={onExit}
      />
    </div>
  );
};

export default StudySession;