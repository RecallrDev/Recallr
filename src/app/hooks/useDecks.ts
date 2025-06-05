import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase_client";
import type { Deck } from "../../types/Deck";
import { authTokenManager } from '../../util/AuthTokenManager';

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
      // Check authentication first
      if (!(await authTokenManager.isAuthenticated())) {
        setDecks([]);
        setError(new Error("No authenticated user"));
        return;
      }

      // Get auth headers
      const headers = await authTokenManager.getAuthHeaders();

      console.log("HERE!!!")

      const response = await fetch("http://localhost:8000/decks", {
        method: "GET",
        headers
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
      // TODO: Check if this works
      if (!session?.user) {
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