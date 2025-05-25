// src/components/StudyPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import DeckList from './DeckList';
import CreateDeck from './CreateDeck';
import StudySession from './StudySession';

import type { Card } from '../types/Card';
import type { Deck } from '../types/Deck';

type View = 'decks' | 'create-deck' | 'study' | 'deck-detail';

const StudyPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('decks');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // for creating a deck
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckCategory, setNewDeckCategory] = useState('Other');
  const [newDeckColor, setNewDeckColor] = useState('#3B82F6');

  // for studying
  const [studyCards, setStudyCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // 1) Fetch all decks for this user, then augment each with a cardCount
  const fetchDecks = async () => {
    setIsLoading(true);

    // 1a) Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('No authenticated user', userError);
      setDecks([]);
      setIsLoading(false);
      return;
    }

    // 1b) Select all decks for that user
    const { data: rawDecks, error: fetchError } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError || !rawDecks) {
      console.error('Error fetching decks:', fetchError);
      setDecks([]);
      setIsLoading(false);
      return;
    }

    // 1c) For each deck, run a head‐only count on cards
    const withCounts: Deck[] = await Promise.all(
      rawDecks.map(async (deck) => {
        const { count, error: countError } = await supabase
          .from('cards')
          // head: true means “don’t return rows—just give me the count”
          .select('id', { head: true, count: 'exact' })
          .eq('deck_id', deck.id);

        if (countError) {
          console.error(`Error counting cards for deck ${deck.id}`, countError);
        }
        return {
          ...deck,
          cardCount: count ?? 0,
          lastStudied: deck.lastStudied ?? undefined,
        };
      })
    );

    setDecks(withCounts);
    setIsLoading(false);
  };

  // 2) On mount, and on auth changes, fetch decks
  useEffect(() => {
    fetchDecks();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchDecks();
      } else {
        setDecks([]);
        setIsLoading(false);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 3) Handlers to switch views
  const handleShowCreateDeck = () => {
    setCurrentView('create-deck');
  };

  const handleCancelCreateDeck = () => {
    setNewDeckName('');
    setNewDeckCategory('Other');
    setNewDeckColor('#3B82F6');
    setCurrentView('decks');
  };

  // Called by CreateDeck on successful insert
  const handleCreateDeckSuccess = async () => {
    setNewDeckName('');
    setNewDeckCategory('Other');
    setNewDeckColor('#3B82F6');
    setCurrentView('decks');

    await fetchDecks();
  };

  const handleEditDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentView('deck-detail');
  };

  const handleStudyDeck = async (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentView('study');

    const { data: cards, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deck.id) as { data: Card[] | null, error: any };

    if (cardError) {
      console.error('Error fetching cards for deck:', cardError);
      setStudyCards([]);
    } else {
      setStudyCards(cards || []);
    }

    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  // Study session controls
  const handleFlipCard = () => {
    setShowAnswer((prev) => !prev);
  };
  const handleNextCard = () => {
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
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
  switch (currentView) {
    case 'decks':
      // 1) Show a loading state while fetching
      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-full p-6">
            <p className="text-gray-600 text-lg">Loading decks…</p>
          </div>
        );
      }

      // 2) If not loading and no decks exist, show “No Decks Found”
      if (decks.length === 0) {
        return (
          <div className="max-w-2xl mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">No Decks Found</h1>
            <p className="text-gray-600 mb-6">
              You don’t have any decks yet. Create your first deck to get started!
            </p>
            <button
              onClick={handleShowCreateDeck}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              + Create New Deck
            </button>
          </div>
        );
      }

      // 3) Otherwise, render the normal DeckList (each deck now has a cardCount)
      return (
        <DeckList
          decks={decks}
          onCreateDeck={handleShowCreateDeck}
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
          onCreateSuccess={handleCreateDeckSuccess}
          onCancel={handleCancelCreateDeck}
        />
      );

    case 'study':
      if (!selectedDeck) return null;
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

    case 'deck-detail':
      if (!selectedDeck) return null;
      return (
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">
            Deck Detail: {selectedDeck.name}
          </h1>
          <p>
            <strong>Category:</strong> {selectedDeck.category}
          </p>
          <p>
            <strong>Color:</strong>{' '}
            <span
              className="inline-block w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: selectedDeck.color }}
            />
          </p>
          <button
            onClick={() => setCurrentView('decks')}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg"
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
