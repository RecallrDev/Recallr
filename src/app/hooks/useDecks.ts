import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase_client';
import type { Deck } from '../../types/Deck';

type UseDecksResult = {
  decks: DeckWithCount[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export type DeckWithCount = Deck & {
  cardCount: number;
  last_studied?: string;
};

export function useDecks(): UseDecksResult {
  const [decks, setDecks] = useState<DeckWithCount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDecks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // 1) Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setDecks([]);
      setIsLoading(false);
      setError(userError ?? new Error('No authenticated user'));
      return;
    }

    try {
      // 2) Fetch raw decks
      const { data: rawDecks, error: fetchError } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError || !rawDecks) {
        throw fetchError ?? new Error('Failed to fetch decks');
      }

      // 3) For each deck, fetch counts (Basic + MC)
      const withCounts: DeckWithCount[] = await Promise.all(
        rawDecks.map(async (deck) => {
          // Basic cards count
          const basicPromise = supabase
            .from('basic_cards')
            .select('id', { head: true, count: 'exact' })
            .eq('deck_id', deck.id);
          // MC cards count
          const mcPromise = supabase
            .from('mc_cards')
            .select('id', { head: true, count: 'exact' })
            .eq('deck_id', deck.id);

          const [
            { count: basicCount = 0, error: basicErr },
            { count: mcCount = 0, error: mcErr },
          ] = await Promise.all([basicPromise, mcPromise]);

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
    } catch (e: any) {
      console.error('useDecks error:', e);
      setDecks([]);
      setError(e);
      setIsLoading(false);
    }
  }, []);

  // Fetch initially + re‐fetch when auth state changes
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
  }, [fetchDecks]);

  return { decks, isLoading, error, refetch: fetchDecks };
}
