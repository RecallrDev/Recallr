import React from 'react';

type ProgressBarProps = {
  deck: {
    name: string;
    color: string;
  };
  currentCardIndex: number;
  cards: Array<{ id: string }>;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  deck,
  currentCardIndex,
  cards,
}) => {
  const progressPercent = Math.round(((currentCardIndex + 1) / cards.length) * 100);

  return (
    <>
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
      <div className="text-right text-sm text-gray-600 mb-6">{progressPercent} %</div>
    </>
  );
};

export default ProgressBar;