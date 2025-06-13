import type { BasicCard } from '../../card_management';
import React, { useState } from 'react';

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
    <div className="w-full h-[400px]" style={{ perspective: '1000px' }}>
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          showAnswer ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 backface-hidden bg-white border border-gray-200 rounded-lg shadow-md flex flex-col overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Label - Front */}
          <div 
            className="px-4 py-2 text-sm font-medium text-white flex justify-center rounded-t-lg flex-shrink-0"
            style={{ backgroundColor: deckColor }}
          >
            Front
          </div>
          {/* Card Content - Front */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 overflow-auto">
            <div className="text-2xl text-gray-800 text-center">
              {card.front}
            </div>
            
            {card.front_image && (
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
        

        {/* Back of card */}
        <div 
          className="absolute inset-0 backface-hidden bg-white border border-gray-200 rounded-lg shadow-md flex flex-col overflow-hidden rotate-y-180"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Label - Back */}
          <div 
            className="px-4 py-2 text-sm font-medium text-white flex justify-center rounded-t-lg flex-shrink-0"
            style={{ backgroundColor: deckColor }}
          >
            Back
          </div>
          {/* Card Content - Back */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 overflow-auto">
            <div className="text-2xl text-gray-800 text-center">
              {card.back}
            </div>
            
            {card.back_image && (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicCardStudyView;