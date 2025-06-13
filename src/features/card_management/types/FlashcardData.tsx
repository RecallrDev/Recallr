import type { Card } from './Card';

/**
 * Data needed by the StudySession flashcard component.
 * That component only cares about front/back, not id.
 */
export type FlashcardData = Omit<Card, 'id'>;