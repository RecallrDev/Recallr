interface FlashcardProps {
  card: {
    front: string;
    back: string;
  };
  showAnswer: boolean;
  onFlip: () => void;
  deckColor?: string;
}

const Flashcard = ({ card, showAnswer, onFlip, deckColor }: FlashcardProps) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-6 min-h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-4">
            {showAnswer ? card?.back : card?.front}
          </div>
          <div className="text-sm text-gray-500">
            {showAnswer ? 'Answer' : 'Question'}
          </div>
        </div>
      </div>

      {/* Study Controls */}
      <div className="flex gap-4 justify-center">
        {!showAnswer ? (
          <button
            onClick={onFlip}
            className="text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all text-lg font-medium"
            style={{ backgroundColor: deckColor || '#3B82F6' }}
          >
            Show Answer
          </button>
        ) : (
          <button
            onClick={onFlip}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Hide Answer
          </button>
        )}
      </div>
    </>
  );
};

export default Flashcard;