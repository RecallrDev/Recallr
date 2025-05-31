import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase_client";
import type { Deck } from "../../types/Deck";

type UseDecksResult = {
  decks: Deck[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useDecks(): UseDecksResult {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDecks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setDecks([]);
        setIsLoading(false);
        setError(sessionError ?? new Error("No authenticated user"));
        return;
      }

      const response = await fetch("http://localhost:8000/decks", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to fetch decks");
      }

      const data: Deck[] = await response.json();
      setDecks(data);
    } catch (err: any) {
      console.error("useDecks error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchDecks();
      } else {
        setDecks([]);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchDecks]);

  return { decks, isLoading, error, refetch: fetchDecks };
}