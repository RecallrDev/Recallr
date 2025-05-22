/**
 * Core representation of a deck across the app.
 */
export interface Deck {
  /** Unique identifier */
  id: string;
  /** Human-readable deck name */
  name: string;
  /** Hex color code for deck styling */
  color: string;
  /** Category name for grouping */
  category: string;
  /** Number of cards in the deck */
  cardCount: number;
  /** ISO date or human-friendly string of last study session */
  lastStudied?: string;
}
