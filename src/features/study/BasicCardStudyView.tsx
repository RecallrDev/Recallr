import type { BasicCard } from '../../types/Card';

const BasicCardStudyView: React.FC<{
  card: BasicCard;
  showAnswer: boolean;
  deckColor: string;
}> = ({ card, showAnswer, deckColor }) => {
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
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-2xl text-gray-800 text-center">
          {showAnswer ? card.back : card.front}
        </div>
      </div>
    </div>
  );
};

export default BasicCardStudyView;
