import type { Deck } from './Deck';

/**
 * Prop type for StudySession when only the deck name/color are needed.
 * We derive a subset of Deck here.
 */
export type DeckHeader = Pick<Deck, 'name' | 'color'>;