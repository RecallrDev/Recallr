export type Deck = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  category: string;
  last_studied?: string;
  created_at: string;
  cardCount: number;
  isImported?: boolean;
  is_public?: boolean;
  isAIGenerated?: boolean;
};