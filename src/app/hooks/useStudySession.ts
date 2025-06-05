import { useState, useEffect, useCallback } from 'react';
import type { Card, BasicCard, MCCard } from '../../types/Card';
import { authTokenManager } from '../../util/AuthTokenManager';

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

  const shuffle = (array: Card[]): Card[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchCards = useCallback(async () => {
    if (!deckId) {
      setStudyCards([]);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Authenticate current user
      if (!(await authTokenManager.isAuthenticated())) {
        setError(new Error("No authenticated user"));
        return;
      }

      // Get auth headers
      const headers = await authTokenManager.getAuthHeaders();

      const response = await fetch(`http://localhost:8000/cards?deck_id=${deckId}`, {
        method: "GET",
        headers
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to fetch cards");
      }

      const data = await response.json();
      const basicData: BasicCard[] = (data.basic_cards || []).map((card: any) => ({
        ...card,
        type: 'basic' as const
      }));
      
      const mcData: MCCard[] = (data.mc_cards || []).map((card: any) => ({
        ...card,
        type: 'multiple_choice' as const
      }));

      // Merge and shuffle the cards before setting state
      const allCards: Card[] = [...basicData, ...mcData];
      const shuffledCards = await shuffle(allCards);
      
      setStudyCards(shuffledCards);

    } catch (e: any) {
      console.error('useStudySession error:', e);
      setError(e instanceof Error ? e : new Error(String(e)));
      setStudyCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [deckId]);

  // Re‐fetch whenever deckId changes
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return { studyCards, isLoading, error, refetch: fetchCards };
}