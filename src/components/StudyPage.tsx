import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import DeckList from './DeckList';
import CreateDeck from './CreateDeck';
import StudySession from './StudySession';
import CreateCard from './CreateCard';
import EditDeck from './EditDeck';

import type { Card, BasicCard, MultipleChoiceCard } from '../types/Card';
import type { Deck } from '../types/Deck';

type View = 
  | 'decks' 
  | 'create-deck' 
  | 'create-card'
  | 'select-card-type' 
  | 'study' 
  | 'deck-detail';

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

  // 1) Fetch all decks for this user
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
        const basicCountPromise = supabase
          .from('basic_cards')
          .select('id', { head: true, count: 'exact' })
          .eq('deck_id', deck.id);

        const mcCountPromise = supabase
          .from('mc_cards')
          .select('id', { head: true, count: 'exact' })
          .eq('deck_id', deck.id);

        const [
          { count: basicCount = 0, error: basicErr },
          { count: mcCount = 0, error: mcErr },
        ] = await Promise.all([basicCountPromise, mcCountPromise]);

        if (basicErr) console.error('Error counting basic:', basicErr);
        if (mcErr) console.error('Error counting MC:', mcErr);

        return {
          ...deck,
          cardCount: (basicCount ?? 0) + (mcCount ?? 0),
          last_studied: deck.last_studied ?? undefined,
        };
      })
    );

    setDecks(withCounts);
    setIsLoading(false);
  };

  // 2) Fetch decks and listen for auth changes
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

    // 1) Fetch Basic Cards
    const { data: basicData, error: basicError } = await supabase
      .from('basic_cards')
      .select('*')
      .eq('deck_id', deck.id);

    if (basicError) {
      console.error('Error fetching basic cards:', basicError);
    }

    // 2) Fetch MC Cards
    const { data: mcRows, error: mcError } = await supabase
      .from('mc_cards')
      .select(`
        id,
        question,
        created_at,
        mc_choices (
          id,
          answer_text,
          is_correct
        )
      `)
      .eq('deck_id', deck.id);

    if (mcError) {
      console.error('Error fetching MC cards:', mcError);
    }

    // 3) Transform both into a Card[] array

    const basics: BasicCard[] = (basicData || []).map((bc) => ({
      id: bc.id,
      deck_id: bc.deck_id,
      front: bc.front,
      back: bc.back,
      created_at: bc.created_at,
      type: 'basic',
    }));

    const mcs: MultipleChoiceCard[] = (mcRows || []).map((mc) => ({
      id: mc.id,
      deck_id: deck.id,
      question: mc.question,
      created_at: mc.created_at,
      choices: (mc.mc_choices || []).map((c) => ({
        id: c.id,
        answer_text: c.answer_text,
        is_correct: c.is_correct,
      })),
      type: 'multiple_choice',
    }));

    // 4) Combine
    const combined: Card[] = [...basics, ...mcs];

    setStudyCards(combined);
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
  
  // If user is at the last card, update the last studied timestamp
  // 1) Update lastStudied for this deck in Supabase
  if (selectedDeck) {
    console.log('Updating last studied timestamp for deck:', selectedDeck.id);
    const nowIso = new Date().toISOString();
    console.log('New timestamp:', nowIso);

    const { data, error: updateError } = await supabase
      .from('decks')
      .update({ last_studied: nowIso })
      .eq('id', selectedDeck.id)
      .select();

    console.log('Supabase update result:', { data, error: updateError });

    if (updateError) {
      console.error('Failed to update last_studied:', updateError);
    } else {
      console.log('Successfully updated database');
      // 2) Update selectedDeck with the new timestamp
      setSelectedDeck({
        ...selectedDeck,
        last_studied: nowIso
      });

      // 3) Re-fetch decks so that the deck list shows updated info
      await fetchDecks();
    }
  }

  // 4) Return to the deck list
  setCurrentView('decks');
  console.log('Study session completed, returning to deck list');
};

  const handlePrevCard = async () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setShowAnswer(false);
      return;
    }
  }

  const handleResetStudySession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };
  const handleExitStudySession = () => {
    setCurrentView('decks');
  };

  // 5) When a card is created successfully, re-fetch deck counts
  const handleCreateCardSuccess = async () => {
    // Re-fetch all decks so that cardCount is up to date
    await fetchDecks();

    // Update selectedDeck so that its cardCount reflects the new value
    if (selectedDeck) {
      const updated = decks.find((d) => d.id === selectedDeck.id) ?? selectedDeck;
      setSelectedDeck(updated);
    }
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
        onCancel={() => setCurrentView('deck-detail')}
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
          onPrevCard={handlePrevCard}
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
