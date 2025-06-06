import type { BasicCard } from '../../../types/Card';
import testImage from '../test_images/testImage.png';

const BasicCardStudyView: React.FC<{
  card: BasicCard;
  showAnswer: boolean;
  deckColor: string;
  frontImage?: string;
  backImage?: string;
}> = ({ card, showAnswer, deckColor, frontImage=testImage, backImage=testImage }) => {
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
        {showAnswer && backImage && (
          <div className="w-full max-w-md">
            <img
              src={backImage}
              alt="Back side image"
              className="w-full h-auto rounded-lg shadow-sm border border-gray-100"
            />
          </div>
        )}
        
        {!showAnswer && frontImage && (
          <div className="w-full max-w-md">
            <img
              src={frontImage}
              alt="Front side image"
              className="w-full h-auto rounded-lg shadow-sm border border-gray-100"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicCardStudyView;
