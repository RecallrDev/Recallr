import React, { useState } from 'react';
import type { BasicCard } from '../../card_management/types/Card';

const BasicCardStudyView: React.FC<{
  card: BasicCard;
  showAnswer: boolean;
  deckColor: string;
  frontImage?: string;
  backImage?: string;
}> = ({ card, showAnswer, deckColor }) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const toggleImageSize = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md min-h-[16rem] flex flex-col">
      {/* Label */}
      <div
        className="px-4 py-2 text-sm font-medium text-white flex justify-center"
        style={{ backgroundColor: deckColor }}
      >
        {showAnswer ? 'Back' : 'Front'}
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="text-2xl text-gray-800 text-center">
          {showAnswer ? card.back : card.front}
        </div>
        
        {/* Show image or placeholder only if image exists */}
        {showAnswer && card.back_image && (
          <div className={`transition-all duration-300 cursor-pointer ${isImageExpanded ? 'w-full max-w-4xl' : 'w-full max-w-md'}`}>
            <img
              src={card.back_image}
              alt="Back side image"
              loading="lazy"
              onClick={toggleImageSize}
              className={`w-full h-auto rounded-lg shadow-sm transition-transform duration-300 ${
                isImageExpanded ? 'scale-110' : 'scale-100'
              }`}
              style={{ border: `2px solid ${deckColor}` }}
            />
          </div>
        )}

        {!showAnswer && card.front_image && (
          <div className={`transition-all duration-300 cursor-pointer ${isImageExpanded ? 'w-full max-w-4xl' : 'w-full max-w-md'}`}>
            <img
              src={card.front_image}
              alt="Front side image"
              loading="lazy"
              onClick={toggleImageSize}
              className={`w-full h-auto rounded-lg shadow-sm transition-transform duration-300 ${
                isImageExpanded ? 'scale-110' : 'scale-100'
              }`}
              style={{ border: `2px solid ${deckColor}` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicCardStudyView;