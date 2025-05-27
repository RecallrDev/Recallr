// src/components/StudyPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import DeckList from './DeckList';
import CreateDeck from './CreateDeck';
import StudySession from './StudySession';
import CreateCard from './CreateCard';
import EditDeck from './EditDeck';

import type { Card } from '../types/Card';
import type { Deck } from '../types/Deck';

type View = 'decks' | 'create-deck' | 'create-card' | 'study' | 'deck-detail';

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

  // 1) Fetch all decks for this user, augment each with cardCount
  const fetchDecks = async () => {
    setIsLoading(true);

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

    const withCounts: Deck[] = await Promise.all(
      rawDecks.map(async (deck) => {
        const { count, error: countError } = await supabase
          .from('basic_cards')
          .select('id', { head: true, count: 'exact' })
          .eq('deck_id', deck.id);

        if (countError) {
          console.error(`Error counting basic_cards for deck ${deck.id}`, countError);
        }
        return {
          ...deck,
          cardCount: count ?? 0,
          lastStudied: deck.last_studied ?? undefined,
        };
      })
    );

    setDecks(withCounts);
    setIsLoading(false);
  };

  // 2) On mount, fetch decks and listen for auth changes
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

    const { data: basic_cards, error: cardError } = await supabase
      .from('basic_cards')
      .select('*')
      .eq('deck_id', deck.id);

    if (cardError) {
      console.error('Error fetching basic_cards for deck:', cardError);
      setStudyCards([]);
    } else {
      setStudyCards(basic_cards || []);
    }

    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  // 4) Study session controls
  const handleFlipCard = () => {
    setShowAnswer((prev) => !prev);
  };
  const handleNextCard = async () => {
  // If there are more cards, just move to the next one
  if (currentCardIndex < studyCards.length - 1) {
    setCurrentCardIndex((prev) => prev + 1);
    setShowAnswer(false);
    return;
  }

  // OTHERWISE, we're at the last card → end of session:
  // 1) Update lastStudied for this deck in Supabase
  if (selectedDeck) {
    console.log('Updating last studied timestamp for deck:', selectedDeck.id);
    const nowIso = new Date().toISOString();
    console.log('New timestamp:', nowIso);

    const { data, error: updateError } = await supabase
      .from('decks')
      .update({ last_studied: nowIso })
      .eq('id', selectedDeck.id)
      .select(); // Add .select() to return the updated row

    console.log('Supabase update result:', { data, error: updateError });

    if (updateError) {
      console.error('Failed to update last_studied:', updateError);
    } else {
      console.log('Successfully updated database');
      // 2) Update selectedDeck immediately with the new timestamp
      setSelectedDeck({
        ...selectedDeck,
        lastStudied: nowIso
      });

      // 3) Re-fetch decks so that the deck list shows updated info
      await fetchDecks();
    }
  }

  // 4) Finally, return to the deck list
  setCurrentView('decks');
  console.log('Study session completed, returning to deck list');
};



  const handleResetStudySession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };
  const handleExitStudySession = () => {
    setCurrentView('decks');
  };

  // 5) When a card is created successfully, re-fetch deck counts but stay on CreateCard
  const handleCreateCardSuccess = async () => {
    // Re-fetch all decks so that cardCount is up-to-date
    await fetchDecks();

    // Update `selectedDeck` so that its cardCount reflects the new value
    if (selectedDeck) {
      const updated = decks.find((d) => d.id === selectedDeck.id) ?? selectedDeck;
      setSelectedDeck(updated);
    }

    // IMPORTANT: Do NOT change `currentView`.  
    // We stay on 'create-card' so the user can make another card.
  };

  // Render different views
  switch (currentView) {
    case 'decks':
      // 1) Loading state
      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-full p-6">
            <p className="text-gray-600 text-lg">Loading decks…</p>
          </div>
        );
      }

      // 2) No decks found
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

      // 3) Show the deck list
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

    case 'deck-detail':
    if (!selectedDeck) return null;
    return (
      <EditDeck
        deck={selectedDeck}
        onCancel={() => setCurrentView('decks')}
        onDeleteSuccess={async () => {
          await fetchDecks();
          setCurrentView('decks');
        }}
        onUpdateSuccess={() => {
          // refetch decks or update local state
          fetchDecks();
          setCurrentView('decks');
        }}
        onAddCard={() => {
          setCurrentView('create-card');
        }}
      />
    );


    case 'create-card':
      if (!selectedDeck) return null;
      return (
        <CreateCard
          deckId={selectedDeck.id}
          deckColor={selectedDeck.color}
          onCreateSuccess={handleCreateCardSuccess}
          onCancel={() => setCurrentView('deck-detail')
          }
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

    default:
      return null;
  }
};

export default StudyPage;
