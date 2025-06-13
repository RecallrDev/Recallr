
import React from 'react';
import { useState, useEffect } from 'react';
import type { MultipleChoiceCard } from '../../card_management/types/Card';

const MCCardStudyView: React.FC<{
  card: MultipleChoiceCard;
  showAnswer: boolean;
  deckColor: string;
}> = ({ card, showAnswer, deckColor }) => {
  // Track which choice indices are currently selected
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const toggleImageSize = () => {
    setIsImageExpanded((prev) => !prev);
  };

  // Reset selection whenever card changes
  useEffect(() => {
    setSelectedIndices([]);
  }, [card.id]);

  const toggleIndex = (idx: number) => {
    if (selectedIndices.includes(idx)) {
      setSelectedIndices((prev) => prev.filter((i) => i !== idx));
    } else {
      setSelectedIndices((prev) => [...prev, idx]);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-6 min-h-[16rem] flex flex-col">
      {/* Question */}
      <div className="text-lg font-medium text-gray-800">{card.question}</div>

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
      <div className="space-y-2 flex-1 overflow-y-auto">
        {card.choices.map((choice, idx) => {
          // Highlight correct/incorrect/correct but forgotten
          let bgClass = '';
          if (showAnswer) {
            if (choice.is_correct && selectedIndices.includes(idx)) {
              // user selected a correct answer: green
              bgClass = 'bg-green-100';
            } else if (choice.is_correct && !selectedIndices.includes(idx)) {
              // user missed checking a correct answer: yellow
              bgClass = 'bg-yellow-100';
            } else if (!choice.is_correct && selectedIndices.includes(idx)) {
              // user selected an incorrect answer: red
              bgClass = 'bg-red-100';
            }
          }

          return (
            <div
              key={choice.id}
              className={`flex items-center gap-3 p-2 rounded-md ${bgClass}`}
            >
              {!showAnswer ? (
                <input
                  type="checkbox"
                  checked={selectedIndices.includes(idx)}
                  onChange={() => toggleIndex(idx)}
                  style={{ accentColor: deckColor }}
                  className="h-5 w-5 border-gray-300 rounded focus:ring-blue-500"
                />
              ) : (
                <div className="w-5 h-5" />
              )}

              <span className="flex-1 text-gray-800">{choice.answer_text}</span>

              {showAnswer && choice.is_correct && (
                <span className="text-green-600 font-semibold">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MCCardStudyView;