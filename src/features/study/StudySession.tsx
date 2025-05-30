import React from 'react';
import BasicCardStudyView from './BasicCardStudyView';
import MCCardStudyView from './MCCardStudyView';
import type { Card, BasicCard, MultipleChoiceCard } from '../../types/Card';
import type { Deck } from '../../types/Deck';
import { RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';

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

  // Calculate progress percentage
  const progressPercent = Math.round(((currentCardIndex + 1) / cards.length) * 100);

  // Determine if this is the last card
  const isLastCard = currentCardIndex === cards.length - 1;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/*  Header */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{deck.name}</h2>
        <p className="text-sm text-gray-600">
          Card {currentCardIndex + 1} / {cards.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: deck.color,
          }}
        />
      </div>
      <div className="text-right text-sm text-gray-600 mb-6">{progressPercent}%</div>

      {/* Reset Button (top‐right) */}
      <div className="flex justify-end mb-2">
        <button
          onClick={onReset}
          title="Reset Study Session"
          className="text-gray-600 hover:text-purple-600 hover:-rotate-360 transition-transform duration-300 hover:scale-105 transform"
        >
          <RotateCcw size={20} />
        </button>
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

      {/* 1) Show / Hide Answer */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onFlipCard}
          style={{ backgroundColor: deck.color }}
          className="text-white px-4 py-2 rounded hover:opacity-90 hover:scale-105 transform transition"
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>

      {/* 2) Prev Card / Next Card or Finish */}
      <div className="mt-4 flex justify-center gap-4">
        {/* Prev Card - disabled if at first card */}
        <button
          onClick={onPrevCard}
          disabled={currentCardIndex === 0}
          style={{
            color: currentCardIndex === 0 ? undefined : deck.color,
            borderColor: currentCardIndex === 0 ? undefined : deck.color,
          }}
          className={`flex items-center gap-1 px-4 py-2 rounded transition ${
            currentCardIndex === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white border hover:scale-105 transform transition'
          }`}
        >
          <ArrowLeft size={16} />
        </button>

        {/* If not last card, show Next arrow - otherwise, show Finish button */}
        {!isLastCard ? (
          <button
            onClick={onNextCard}
            style={{
              color: deck.color,
              borderColor: deck.color,
            }}
            className="flex items-center gap-1 px-4 py-2 rounded bg-white border hover:scale-105 transform transition"
          >
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={onNextCard} // acts as Finish
            style={{ backgroundColor: deck.color }}
            className="text-white px-4 py-2 rounded hover:opacity-90 hover:scale-105 transform transition"
          >
            Finish
          </button>
        )}
      </div>

      {/* 3) Exit (only show if not last card) */}
      {!isLastCard && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onExit}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 hover:scale-105 transform transition"
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default StudySession;






