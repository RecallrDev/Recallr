/**
 * A single flashcard with question/answer sides. 
 */
export interface Card {
  /** Unique identifier within a deck */
  id: number;
  /** Front side content (question) */
  front: string;
  /** Back side content (answer) */
  back: string;
}