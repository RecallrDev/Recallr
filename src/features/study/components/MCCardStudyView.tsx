import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { MultipleChoiceCard } from '../../card_management';

const MCCardStudyView: React.FC<{
  card: MultipleChoiceCard;
  showAnswer: boolean;
  deckColor: string;
}> = ({ card, showAnswer, deckColor }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const isFirstRender = useRef(true);

  // Reset selections on switch to a new card
  useEffect(() => {
    setSelectedIndices([]);
    isFirstRender.current = false;
  }, [card.id]);

  const toggleIndex = (idx: number) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const toggleImageSize = () => {
    setIsImageExpanded((prev) => !prev);
  };

  return (
    <motion.div
      initial={isFirstRender.current ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, scale: showAnswer ? 1 : 1.02 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl shadow-lg overflow-hidden"
    >
      {/* Top stripe for color accent */}
      <div className="h-3 w-full" style={{ backgroundColor: deckColor }} />

      <div className="bg-white border border-gray-200 rounded-b-xl shadow-md p-6 space-y-6 min-h-[16rem] flex flex-col">
        {/* Question */}
        <div className="text-lg font-semibold text-gray-800">
          {card.question}
        </div>

        {card.front_image && (
        <div className="flex justify-center">
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
        </div>
      )}

        {/* Choices */}
        <div className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden">
          {card.choices.map((choice, idx) => {
            // Determine background once answers are revealed
            let bgClass = '';
            if (showAnswer) {
              if (choice.is_correct && selectedIndices.includes(idx)) {
                bgClass = 'bg-green-50';
              } else if (choice.is_correct && !selectedIndices.includes(idx)) {
                bgClass = 'bg-yellow-50';
              } else if (!choice.is_correct && selectedIndices.includes(idx)) {
                bgClass = 'bg-red-50';
              }
            }

            return (
              <motion.div
                key={`${card.id}-choice-${idx}`}
                whileHover={!showAnswer ? { scale: 1.02 } : {}}
                transition={{ duration: 0.15 }}
                style={{ transformOrigin: 'center' }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  ${bgClass}
                  hover:bg-gray-50
                  cursor-pointer
                  transition-all duration-150
                `}
                onClick={() => {
                  if (!showAnswer) toggleIndex(idx);
                }}
              >
                {/* Show checkbox only if answers aren't revealed */}
                {!showAnswer ? (
                  <input
                    type="checkbox"
                    checked={selectedIndices.includes(idx)}
                    readOnly
                    className="h-5 w-5 border-gray-300 rounded focus:ring-blue-500"
                    style={{ accentColor: deckColor }}
                  />
                ) : (
                  <div className="w-5 h-5" />
                )}

                <span className="flex-1 text-gray-800">{choice.answer_text}</span>

                {showAnswer && choice.is_correct && (
                  <span className="text-green-600 font-semibold">✓</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MCCardStudyView;