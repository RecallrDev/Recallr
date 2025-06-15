import { useState, useEffect, useCallback } from 'react';
import type { Card } from '../types/Card';
import { authTokenManager } from '../../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

type UseCardResult = {
  card: Card | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

/**
 * Fetches a single card by its ID.
 * @param cardId The ID of the card to fetch.
 */
export function useCard(cardId: string | null): UseCardResult {
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCard = useCallback(async () => {
    if (!cardId) {
      setCard(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const headers = await authTokenManager.getAuthHeaders();

      const response = await fetch(`${API_URL}/cards/${cardId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch card');
      }

      const data: Card = await response.json();
      setCard(data);
    } catch (e: any) {
      console.error('useCard error:', e);
      setError(e instanceof Error ? e : new Error(String(e)));
      setCard(null);
    } finally {
      setIsLoading(false);
    }
  }, [cardId]);

  const refetch = useCallback(async () => {
    await fetchCard();
  }, [fetchCard]);

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  return { card, isLoading, error, refetch };
}
