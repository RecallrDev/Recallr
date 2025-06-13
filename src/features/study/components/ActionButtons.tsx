import React from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LogOut } from 'lucide-react';
import ProgressBar from './ProgressBar'; // <- Add this

type ActionButtonsProps = {
  deck: {
    name: string;
    color: string;
  };
  currentCardIndex: number;
  totalCards: number;
  showAnswer: boolean;
  isLastCard: boolean;
  onFlipCard: () => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  onExit: () => void;
  onReset: () => void; // <- Add this to handle reset
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  deck,
  currentCardIndex,
  totalCards,
  showAnswer,
  isLastCard,
  onFlipCard,
  onNextCard,
  onPrevCard,
  onExit,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
      {/* Deck Name */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-700">{deck.name}</h2>
      </div>

      {/* ProgressBar */}
      <ProgressBar
        deck={deck}
        currentCardIndex={currentCardIndex}
        cards={Array.from({ length: totalCards }, (_, i) => ({ id: i.toString() }))}
        onReset={onReset}
      />

      {/* Main Action Button */}
      <div className="flex justify-center">
        <button
          onClick={onFlipCard}
          className="flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl active:scale-95 relative overflow-hidden group"
          style={{ backgroundColor: deck.color }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {showAnswer ? <EyeOff size={22} /> : <Eye size={22} />}
          <span className="relative z-10">
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </span>
        </button>
      </div>

      {/* Navigation Section */}
      <div className="flex items-center justify-center gap-8">
        {/* Previous Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onPrevCard}
            disabled={currentCardIndex === 0}
            className={`flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 ${
              currentCardIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:scale-110 hover:shadow-lg border border-gray-200 active:scale-95 hover:from-gray-100 hover:to-gray-200'
            }`}
          >
            <ArrowLeft size={24} />
          </button>
          {currentCardIndex > 0 && (
            <span className="text-xs text-gray-500 font-medium">Previous</span>
          )}
        </div>

        {/* Next/Finish Button */}
        <div className="flex flex-col items-center gap-2">
          {!isLastCard ? (
            <>
              <button
                onClick={onNextCard}
                className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:scale-110 hover:shadow-lg border border-gray-200 transition-all duration-200 active:scale-95 hover:from-gray-100 hover:to-gray-200"
              >
                <ArrowRight size={24} />
              </button>
              <span className="text-xs text-gray-500 font-medium">Next</span>
            </>
          ) : (
            <>
              <button
                onClick={onNextCard}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95 relative overflow-hidden group"
                style={{ backgroundColor: deck.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Finish</span>
                <ArrowRight size={18} className="relative z-10" />
              </button>
              <span className="text-xs text-gray-500 font-medium">Complete</span>
            </>
          )}
        </div>
      </div>

      {/* Exit Button */}
      <div className="flex justify-center pt-2 border-t border-gray-100">
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-medium"
        >
          <LogOut size={16} />
          Exit Study Session
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
