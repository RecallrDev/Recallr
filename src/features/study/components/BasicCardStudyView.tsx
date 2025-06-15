import type { BasicCard } from '../../card_management';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageModal from './ImageDisplayModal';

const BasicCardStudyView: React.FC<{ 
  card: BasicCard; 
  showAnswer: boolean; 
  deckColor: string; 
}> = ({ card, showAnswer, deckColor }) => {
  const [expandedImageUrl, setExpandedImageUrl] = useState<string | null>(null);

  const renderImage = (src: string) => (
    <div className="flex justify-center items-center">
      <motion.div 
        className="relative cursor-pointer group"
        onClick={() => setExpandedImageUrl(src)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <motion.img
          src={src}
          alt="Card image"
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

        {/* Hover indicator */}
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
  );

  return (
    <>
      <div className="w-full h-[400px]" style={{ perspective: '1000px' }}>
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div
              className="px-4 py-2 text-sm font-medium text-white flex justify-center rounded-t-lg"
              style={{ backgroundColor: deckColor }}
            >
              Front
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 overflow-hidden">
              <div className="text-2xl text-gray-800 text-center">{card.front}</div>
              {card.front_image && renderImage(card.front_image)}
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col"
            style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)' 
            }}
          >
            <div
              className="px-4 py-2 text-sm font-medium text-white flex justify-center rounded-t-lg"
              style={{ backgroundColor: deckColor }}
            >
              Back
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 overflow-hidden">
              <div className="text-2xl text-gray-800 text-center">{card.back}</div>
              {card.back_image && renderImage(card.back_image)}
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={!!expandedImageUrl}
        imageUrl={expandedImageUrl ?? ''}
        onClose={() => setExpandedImageUrl(null)}
      />
    </>
  );
};

export default BasicCardStudyView;