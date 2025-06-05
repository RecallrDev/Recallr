import type { BasicCard } from '../../../types/Card';

const BasicCardStudyView: React.FC<{
  card: BasicCard;
  showAnswer: boolean;
  deckColor: string;
}> = ({ card, showAnswer, deckColor }) => {
  return (
    <div className="min-h-[16rem]" style={{ perspective: '1000px' }}>
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d min-h-[16rem] ${
          showAnswer ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 backface-hidden bg-white border border-gray-200 rounded-lg shadow-md flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Label - Front */}
          <div 
            className="px-4 py-2 text-sm font-medium text-white flex justify-center rounded-t-lg"
            style={{ backgroundColor: deckColor }}
          >
            Front
          </div>
          {/* Card Content - Front */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-2xl text-gray-800 text-center">
              {card.front}
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 backface-hidden bg-white border border-gray-200 rounded-lg shadow-md flex flex-col rotate-y-180"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Label - Back */}
          <div 
            className="px-4 py-2 text-sm font-medium text-white flex justify-center rounded-t-lg"
            style={{ backgroundColor: deckColor }}
          >
            Back
          </div>
          {/* Card Content - Back */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-2xl text-gray-800 text-center">
              {card.back}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicCardStudyView;