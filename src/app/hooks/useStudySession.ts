import { useState, useEffect, useCallback } from 'react';
import type { Card, BasicCard, MCCard } from '../../types/Card';
import { authTokenManager } from '../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

type UseStudySessionResult = {
  studyCards: Card[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useStudySession(deckId: string | null): UseStudySessionResult {
  const [studyCards, setStudyCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCards = useCallback(async () => {
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
      const response = await fetch(
        `${API_URL}/cards?deck_id=${deckId}&shuffle=true`,
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
      console.error("useStudySession error:", e);
      setError(e instanceof Error ? e : new Error(String(e)));
      setStudyCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  // Only call fetchCards when deckId actually becomes a real value:
  useEffect(() => {
    if (deckId) {
      fetchCards();
    } else {
      setStudyCards([]);
    }
  }, [deckId, fetchCards]);

  return { studyCards, isLoading, error, refetch: fetchCards };
}
