import { useState } from 'react';
import DeckList from './DeckList';
import CreateDeck from './CreateDeck';
import StudySession from './StudySession';

// Mock data
const mockDecks = [
  { id: 1, name: 'Spanish Vocabulary', cardCount: 3, lastStudied: 'Today', category: 'Languages', color: '#10B981' },
  { id: 2, name: 'Chemistry Formulas', cardCount: 0, lastStudied: 'Yesterday', category: 'Science', color: '#9810FA' },
  { id: 3, name: 'History Dates', cardCount: 30, lastStudied: null, category: 'History', color: '#F59E0B' },
];

const mockCards = {
  1: [
    { id: 1, front: 'Hello', back: 'Hola' },
    { id: 2, front: 'Thank you', back: 'Gracias' },
    { id: 3, front: 'Goodbye', back: 'Adiós' },
  ]
};

export default function StudyPage() {
  const [currentView, setCurrentView] = useState('decks'); // 'decks', 'deck-detail', 'study', 'create-deck'
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [decks, setDecks] = useState(mockDecks);
  
  // Create deck state
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckCategory, setNewDeckCategory] = useState('Other');
  const [newDeckColor, setNewDeckColor] = useState('#3B82F6');
  
  // Study session state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyCards, setStudyCards] = useState([]);

  // Deck operations
  const handleCreateDeck = () => {
    setCurrentView('create-deck');
  };

  const handleEditDeck = (deck) => {
    setSelectedDeck(deck);
    setCurrentView('deck-detail');
  };

  const handleStudyDeck = (deck) => {
    const cards = mockCards[deck.id] || [];
    setStudyCards(cards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setSelectedDeck(deck);
    setCurrentView('study');
  };

  const createDeck = () => {
    if (newDeckName.trim()) {
      const newDeck = {
        id: Date.now(),
        name: newDeckName,
        category: newDeckCategory,
        color: newDeckColor,
        cardCount: 0,
        lastStudied: null
      };
      setDecks([...decks, newDeck]);
      setNewDeckName('');
      setNewDeckCategory('Other');
      setNewDeckColor('#3B82F6');
      setCurrentView('decks');
    }
  };

  const cancelCreateDeck = () => {
    setNewDeckName('');
    setNewDeckCategory('Other');
    setNewDeckColor('#3B82F6');
    setCurrentView('decks');
  };

  // Study session operations
  const handleFlipCard = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // Study session complete
      setCurrentView('decks');
    }
  };

  const handleResetStudySession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const handleExitStudySession = () => {
    setCurrentView('decks');
  };

  // Render different views
  if (currentView === 'decks') {
    return (
      <DeckList
        decks={decks}
        onCreateDeck={handleCreateDeck}
        onStudyDeck={handleStudyDeck}
        onEditDeck={handleEditDeck}
      />
    );
  }

  if (currentView === 'create-deck') {
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
  }

  if (currentView === 'study') {
    return (
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
    );
  }

  // Deck detail view
  if (currentView === 'deck-detail') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1>Deck Detail View</h1>
        <button 
          onClick={() => setCurrentView('decks')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Decks
        </button>
      </div>
    );
  }

  return null;
}