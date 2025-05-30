import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type ActionButtonsProps = {
  deck: {
    name: string;
    color: string;
  };
  currentCardIndex: number;
  showAnswer: boolean;
  isLastCard: boolean;
  onFlipCard: () => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  onExit: () => void;
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  deck,
  currentCardIndex,
  showAnswer,
  isLastCard,
  onFlipCard,
  onNextCard,
  onPrevCard,
  onExit
}) => {
  return (
    <>
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
    </>
  );
};

export default ActionButtons;