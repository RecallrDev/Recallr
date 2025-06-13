import React, { useState, useEffect } from 'react';
import BasicCardStudyView from './BasicCardStudyView';
import MCCardStudyView from './MCCardStudyView';
import ActionButtons from './ActionButtons';
import type { Card, BasicCard, MultipleChoiceCard } from '../../card_management/types/Card';
import type { Deck } from '../../deck_management/types/Deck';

export type StudySessionProps = {
  deck: Deck;
  cards: Card[];
  currentCardIndex: number;
  showAnswer: boolean;
  onFlipCard: () => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  onReset: () => void;
  onExit: () => void;
};

const StudySession: React.FC<StudySessionProps> = ({
  deck,
  cards,
  currentCardIndex,
  showAnswer,
  onFlipCard,
  onNextCard,
  onPrevCard,
  onReset,
  onExit,
}) => {
  const currentCard = cards[currentCardIndex];

  const [studyStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const studyDuration = currentTime - studyStartTime;

  if (!currentCard) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${deck.color}33, ${deck.color}66)` }}
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">No cards found in this deck.</p>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
          >
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  const isLastCard = currentCardIndex === cards.length - 1;

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, ${deck.color}33, ${deck.color}99)` }}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Timer Bar - At the top */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-medium">Study Time: {formatTime(studyDuration)}</span>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="mb-8">
          {currentCard.type === 'basic' ? (
            <BasicCardStudyView
              card={currentCard as BasicCard}
              showAnswer={showAnswer}
              deckColor={deck.color}
            />
          ) : (
            <MCCardStudyView
              card={currentCard as MultipleChoiceCard}
              showAnswer={showAnswer}
              deckColor={deck.color}
            />
          )}
        </div>

        {/* Action Buttons */}
        <ActionButtons
          deck={deck}
          currentCardIndex={currentCardIndex}
          totalCards={cards.length}
          showAnswer={showAnswer}
          isLastCard={isLastCard}
          onFlipCard={onFlipCard}
          onNextCard={onNextCard}
          onPrevCard={onPrevCard}
          onExit={onExit}
          onReset={onReset}
        />
      </div>
      <div className="flex items-center justify-center space-x-3 mt-6">
        <div className="h-12 flex items-center justify-center text-sm font-bold">
          <img src="../../../favicon/favicon.svg" alt="Recallr Logo" className="w-10 h-10" />
        </div>
        <span className="text-purple-600 font-semibold text-2xl">Recallr</span>
      </div>
    </div>
  );
};

export default StudySession;
