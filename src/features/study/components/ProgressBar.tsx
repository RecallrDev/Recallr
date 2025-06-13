import React from 'react';
import { RotateCcw } from 'lucide-react';

type ProgressBarProps = {
  deck: {
    name: string;
    color: string;
  };
  currentCardIndex: number;
  cards: Array<{ id: string }>;
  onReset: () => void;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  deck,
  currentCardIndex,
  cards,
  onReset,
}) => {
  const progressPercent = Math.round(((currentCardIndex + 1) / cards.length) * 100);

  return (
    <div className="w-full">
      {/* Top row: Progress label, fraction, reset button */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <span className="text-xs sm:text-sm font-medium text-gray-600">Progress</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            {currentCardIndex + 1} of {cards.length}
          </span>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          title="Reset Study Session"
          className="flex items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{ 
            width: `${progressPercent}%`,
            backgroundColor: deck.color
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Percentage text */}
      {progressPercent > 0 && (
        <div className="text-right mt-1">
          <span className="text-xs text-gray-500 hidden sm:inline">
            {progressPercent}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
