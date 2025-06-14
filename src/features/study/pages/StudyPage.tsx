import React from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import StudySession from '../components/StudySession';
import { useDecks } from '../../deck_management';
import { useCards } from '../../card_management';
import { authTokenManager } from '../../../util/AuthTokenManager';
import LogoLoadingIndicator from '../../../shared/components/LogoLoadingIndicator';

const API_URL = import.meta.env.VITE_API_URL;

const StudyPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const location = useLocation();
  const { decks, isLoading: decksLoading, error: decksError, refetch: refetchDecks } = useDecks();
  const { studyCards, isLoading, error } = useCards(deckId || '');
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);

  // Early return if no deckId in URL
  if (!deckId) {
    return <Navigate to="/decks" replace />;
  }

  // Prüfe, ob wir ein öffentliches Deck haben
  const isPublicDeck = location.state?.isPublic;
  const publicDeck = location.state?.deck;

  // Wenn es ein öffentliches Deck ist, verwende die Daten aus dem State
  if (isPublicDeck && publicDeck) {
    const handleFlipCard = () => setShowAnswer((prev) => !prev);

    const handleNextCard = () => {
      if (currentCardIndex < studyCards.length - 1) {
        setCurrentCardIndex((i) => i + 1);
        setShowAnswer(false);
      } else {
        // Bei öffentlichen Decks nur zur Deck-Liste zurückkehren
        window.location.href = '/decks';
      }
    };

    const handlePrevCard = () => {
      if (currentCardIndex > 0) {
        setCurrentCardIndex((i) => i - 1);
        setShowAnswer(false);
      }
    };

    const handleResetSession = () => {
      setCurrentCardIndex(0);
      setShowAnswer(false);
    };

    const handleExit = () => {
      window.location.href = '/decks';
    };

    if (isLoading) {
      return <LogoLoadingIndicator loadingText="Loading study cards..." />;
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-600">Error loading cards: {error.message}</div>
        </div>
      );
    }

    return (
      <StudySession
        deck={publicDeck}
        cards={studyCards}
        currentCardIndex={currentCardIndex}
        showAnswer={showAnswer}
        onFlipCard={handleFlipCard}
        onNextCard={handleNextCard}
        onPrevCard={handlePrevCard}
        onReset={handleResetSession}
        onExit={handleExit}
      />
    );
  }

  // Für nicht-öffentliche Decks: Normale Logik
  if (decksLoading) {
    return <LogoLoadingIndicator loadingText="Loading deck..." />;
  }

  if (decksError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error loading decks: {decksError.message}</div>
      </div>
    );
  }

  const deck = decks.find((d) => String(d.id) === String(deckId));

  if (!deck) {
    console.warn(`Deck with ID ${deckId} not found`);
    return <Navigate to="/decks" replace />;
  }

  const handleFlipCard = () => setShowAnswer((prev) => !prev);

  const handleNextCard = async () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex((i) => i + 1);
      setShowAnswer(false);
      return;
    }
    // At last card: update `last_studied`
    const nowIso = new Date().toISOString();
    
    if (!(await authTokenManager.isAuthenticated())) {
      console.warn('User not authenticated, cannot update last studied time');
      return;
    }

    const headers = await authTokenManager.getAuthHeaders();

    const response = await fetch(`${API_URL}/decks/finish/${deckId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        name: deck.name.trim(),
        category: deck.category,
        color: deck.color,
        last_studied: nowIso,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to update last studied time: ${errorText}`);
      return;
    }

    // Go back to /decks when finished
    window.location.href = '/decks';
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((i) => i - 1);
      setShowAnswer(false);
    }
  };

  const handleResetSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const handleExit = () => {
    window.location.href = '/decks';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading study cards…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error loading cards: {error.message}</div>
      </div>
    );
  }

  return (
    <StudySession
      deck={deck}
      cards={studyCards}
      currentCardIndex={currentCardIndex}
      showAnswer={showAnswer}
      onFlipCard={handleFlipCard}
      onNextCard={handleNextCard}
      onPrevCard={handlePrevCard}
      onReset={handleResetSession}
      onExit={handleExit}
    />
  );
};

export default StudyPage;