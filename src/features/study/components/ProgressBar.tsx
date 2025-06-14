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
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative">
      {/* Reset Button - positioned in top right corner */}
      <button
        onClick={onReset}
        title="Reset Study Session"
        className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <RotateCcw size={14} />
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 pr-10">
        <h1 className="text-2xl font-bold text-gray-800 truncate">{deck.name}</h1>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: deck.color }}
          />
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
            {currentCardIndex + 1} of {cards.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: deck.color,
            }}
          />
        </div>
        
        {/* Progress text */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">Start</span>
          <span 
            className="text-sm font-semibold px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: deck.color }}
          >
            {progressPercent}%
          </span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;