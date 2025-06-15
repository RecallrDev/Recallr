import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { MultipleChoiceCard } from '../../card_management';
import ImageModal from './ImageDisplayModal';

const MCCardStudyView: React.FC<{ 
  card: MultipleChoiceCard; 
  showAnswer: boolean; 
  deckColor: string; 
}> = ({ card, showAnswer, deckColor }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const isFirstRender = useRef(true);
  const [expandedImageUrl, setExpandedImageUrl] = useState<string | null>(null);

  // Shuffle choices each time the component is called
  const shuffledChoices = useMemo(() => {
    return card.choices
      .map((choice, originalIndex) => ({ choice, originalIndex }))
      .sort(() => Math.random() - 0.5);
  }, [card.id, card.choices]);

  useEffect(() => {
    setSelectedIndices([]);
    isFirstRender.current = false;
  }, [card.id]);

  const toggleIndex = (shuffledIdx: number) => {
    setSelectedIndices(prev =>
      prev.includes(shuffledIdx) ? prev.filter(i => i !== shuffledIdx) : [...prev, shuffledIdx]
    );
  };

  return (
    <>
      <motion.div
        initial={isFirstRender.current ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, scale: showAnswer ? 1 : 1.02 }}
        transition={{ duration: 0.25 }}
        className="w-full rounded-xl shadow-lg overflow-hidden box-border"
      >
        <div className="h-3 w-full" style={{ backgroundColor: deckColor }} />
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-md p-6 space-y-6 min-h-[16rem] flex flex-col box-border">
          <div className="text-lg font-semibold text-gray-800 break-words">
            {card.question}
          </div>

          {card.front_image && (
            <div className="flex justify-center items-center">
              <motion.div 
                className="relative cursor-pointer group"
                onClick={() => setExpandedImageUrl(card.front_image!)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.img
                  src={card.front_image}
                  alt="Front side image"
                  loading="lazy"
                  className="rounded-lg shadow-md object-cover"
                  style={{ 
                    border: `2px solid ${deckColor}`,
                    width: 'auto',
                    maxWidth: '400px',
                    maxHeight: '200px',
                  }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                
                {/* Subtle hover indicator */}
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <motion.div 
                    className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                  >
                    <svg 
                      className="w-5 h-5 text-gray-700" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}

          <div className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden">
            {shuffledChoices.map(({ choice, originalIndex }, shuffledIdx) => {
              let bgClass = '';
              if (showAnswer) {
                if (choice.is_correct && selectedIndices.includes(shuffledIdx)) bgClass = 'bg-green-50';
                else if (choice.is_correct && !selectedIndices.includes(shuffledIdx)) bgClass = 'bg-yellow-50';
                else if (!choice.is_correct && selectedIndices.includes(shuffledIdx)) bgClass = 'bg-red-50';
              }

              return (
                <motion.div
                  key={`${card.id}-choice-${originalIndex}`}
                  whileHover={!showAnswer ? { scale: 1.02 } : {}}
                  transition={{ duration: 0.15 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${bgClass} hover:bg-gray-50 cursor-pointer transition-all duration-150 break-words`}
                  onClick={() => !showAnswer && toggleIndex(shuffledIdx)}
                >
                  {!showAnswer ? (
                    <input
                      type="checkbox"
                      checked={selectedIndices.includes(shuffledIdx)}
                      readOnly
                      className="h-5 w-5 flex-shrink-0 border-gray-300 rounded focus:ring-blue-500"
                      style={{ accentColor: deckColor }}
                    />
                  ) : <div className="w-5 h-5 flex-shrink-0" />}

                  <span className="flex-1 text-gray-800">{choice.answer_text}</span>
                  {showAnswer && choice.is_correct && <span className="text-green-600 font-semibold">✓</span>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <ImageModal
        isOpen={!!expandedImageUrl}
        imageUrl={expandedImageUrl ?? ''}
        onClose={() => setExpandedImageUrl(null)}
      />
    </>
  );
};

export default MCCardStudyView;