import React, { useState } from 'react';
import DeckList from './DeckList';
import CreateDeck from './CreateDeck';
import StudySession from './StudySession';
import type { Card } from '../types/Card';
import type { Deck } from '../types/Deck';

const mockDecks: Deck[] = [
  { id: "1", name: 'Spanish Vocabulary', cardCount: 3, lastStudied: 'Today', category: 'Languages', color: '#10B981' },
  { id: "2", name: 'Chemistry Formulas', cardCount: 0, lastStudied: 'Yesterday', category: 'Science', color: '#9810FA' },
  { id: "3", name: 'History Dates', cardCount: 30, lastStudied: undefined, category: 'History', color: '#F59E0B' },
];

const mockCards: Record<string, Card[]> = {
  "1": [
    { id: 1, front: 'Hello', back: 'Hola' },
    { id: 2, front: 'Thank you', back: 'Gracias' },
    { id: 3, front: 'Goodbye', back: 'Adiós' },
  ]
};

type View = 'decks' | 'create-deck' | 'study' | 'deck-detail';

const StudyPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('decks');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [decks, setDecks] = useState<Deck[]>(mockDecks);

  // Create deck state
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckCategory, setNewDeckCategory] = useState('Other');
  const [newDeckColor, setNewDeckColor] = useState('#3B82F6');

  // Study session state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyCards, setStudyCards] = useState<Card[]>([]);

  // Deck operations
  const handleCreateDeck = () => setCurrentView('create-deck');

  const handleEditDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentView('deck-detail');
  };

  const handleStudyDeck = (deck: Deck) => {
    const cards = mockCards[deck.id] || [];
    setStudyCards(cards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSelectedDeck(deck);
    setCurrentView('study');
  };

  const createDeck = () => {
    if (newDeckName.trim()) {
      const newDeck: Deck = {
        id: Date.now().toString(),
        name: newDeckName,
        category: newDeckCategory,
        color: newDeckColor,
        cardCount: 0,
        lastStudied: undefined
      };
      setDecks([...decks, newDeck]);
      resetCreateDeckForm();
      setCurrentView('decks');
    }
  };

  const cancelCreateDeck = () => {
    resetCreateDeckForm();
    setCurrentView('decks');
  };

  const resetCreateDeckForm = () => {
    setNewDeckName('');
    setNewDeckCategory('Other');
    setNewDeckColor('#3B82F6');
  };

  // Study session operations
  const handleFlipCard = () => setShowAnswer(!showAnswer);

  const handleNextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setCurrentView('decks'); // End of session
    }
  };

  const handleResetStudySession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const handleExitStudySession = () => setCurrentView('decks');

  // Render different views
  switch (currentView) {
    case 'decks':
      return (
        <DeckList
          decks={decks}
          onCreateDeck={handleCreateDeck}
          onStudyDeck={handleStudyDeck}
          onEditDeck={handleEditDeck}
        />
      );

    case 'create-deck':
      return (
        <CreateDeck
          deckName={newDeckName}
          setDeckName={setNewDeckName}
          category={newDeckCategory}
          setCategory={setNewDeckCategory}
          color={newDeckColor}
          setColor={setNewDeckColor}
          onCreateDeck={createDeck}
          onCancel={cancelCreateDeck}
        />
      );

    case 'study':
      return selectedDeck ? (
        <StudySession
          deck={selectedDeck}
          cards={studyCards}
          currentCardIndex={currentCardIndex}
          showAnswer={showAnswer}
          onFlipCard={handleFlipCard}
          onNextCard={handleNextCard}
          onReset={handleResetStudySession}
          onExit={handleExitStudySession}
        />
      ) : null;

    case 'deck-detail':
      return (
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Deck Detail View</h1>
          <button 
            onClick={() => setCurrentView('decks')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Decks
          </button>
        </div>
      );

    default:
      return null;
  }
};

export default StudyPage;
