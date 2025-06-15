// src/features/ai_generation/types/index.ts

export interface GenerationStyle {
  key: string;
  name: string;
  description: string;
}

export interface GeneratedChoice {
  answer_text: string;
  is_correct: boolean;
}

export interface GeneratedCard {
  type: 'basic' | 'multiple_choice';
  front?: string;
  back?: string;
  question?: string;
  choices?: GeneratedChoice[];
}

export interface GeneratedDeck {
  deck_id: string;
  deck_name: string;
  category: string;
  card_count: number;
  cards: GeneratedCard[];
  created_at?: string;
}

export interface DeckGenerationRequest {
  source_deck_id: string;
  generation_style: string;
  target_card_count?: number;
  new_deck_name?: string;
}

export interface DeckPreviewRequest {
  source_deck_id: string;
  generation_style: string;
  target_card_count?: number;
}

export interface PreviewResponse {
  preview_deck_name: string;
  preview_category: string;
  estimated_card_count: number;
  preview_cards: GeneratedCard[];
  style: string;
  source_deck_name: string;
}

export interface GenerationResponse {
  success: boolean;
  message: string;
  generated_deck?: GeneratedDeck;
  error_details?: string;
}

export interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceDeckId: string;
  sourceDeckName: string;
  onSuccess: (deckId: string) => void;
}

export interface AIGenerationButtonProps {
  sourceDeckId: string;
  sourceDeckName: string;
  onSuccess?: (deckId: string) => void;
  variant?: 'button' | 'icon' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}