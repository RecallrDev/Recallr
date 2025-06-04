import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase_client';
import type { Card, BasicCard, MultipleChoiceCard } from '../../types/Card';

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
      // TODO: Migrate fetching of cards to backend
      // 1) Fetch Basic Cards
      const { data: basicData, error: basicError } = await supabase
        .from('basic_cards')
        .select('*')
        .eq('deck_id', deckId);

      if (basicError) throw basicError;

      // 2) Fetch MC Cards + their choices
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
        .eq('deck_id', deckId);

      if (mcError) throw mcError;

      // 3) Transform into typed arrays
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
        deck_id: deckId,
        question: mc.question,
        created_at: mc.created_at,
        choices: (mc.mc_choices || []).map((c) => ({
          id: c.id,
          answer_text: c.answer_text,
          is_correct: c.is_correct,
        })),
        type: 'multiple_choice',
      }));

      // 4) Merge
      setStudyCards([...basics, ...mcs]);
      setIsLoading(false);
    } catch (e: any) {
      console.error('useStudySession error:', e);
      setError(e);
      setIsLoading(false);
      setStudyCards([]);
    }
  }, [deckId]);

  // Re‐fetch whenever deckId changes
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  return { studyCards, isLoading, error, refetch: fetchCards };
}
