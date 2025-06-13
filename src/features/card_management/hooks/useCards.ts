import { useState, useEffect, useCallback } from 'react';
import type { Card } from '../types/Card';
import { authTokenManager } from '../../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

type UseCardsResult = {
  studyCards: Card[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useCards(deckId: string | null, shuffle: boolean = true): UseCardsResult {
  const [studyCards, setStudyCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCards = useCallback(async (shuffleParam?: boolean) => {
    if (!deckId) {
      setStudyCards([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!(await authTokenManager.isAuthenticated())) {
        setError(new Error("No authenticated user"));
        return;
      }

      const headers = await authTokenManager.getAuthHeaders();
      const shouldShuffle = shuffleParam !== undefined ? shuffleParam : shuffle;
      const response = await fetch(
        `${API_URL}/cards?deck_id=${deckId}&shuffle=${shouldShuffle}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to fetch cards");
      }

      const cards: Card[] = await response.json();
      setStudyCards(cards);
    } catch (e: any) {
      console.error("useCards error:", e);
      setError(e instanceof Error ? e : new Error(String(e)));
      setStudyCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [deckId, shuffle]);
  const refetch = useCallback(async () => {
    await fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (deckId) {
      fetchCards();
    } else {
      setStudyCards([]);
    }
  }, [deckId, fetchCards]);

  return { studyCards, isLoading, error, refetch };
}