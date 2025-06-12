export type BasicCard = {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  created_at: string;
  type: 'basic';
  front_image?: string; // Optional field, can be null
  back_image?: string; // Optional field, can be null
};

export type MCChoice = {
  id: string;
  answer_text: string;
  is_correct: boolean;
};

export type MultipleChoiceCard = {
  id: string;
  deck_id: string;
  question: string;
  created_at: string;
  choices: MCChoice[];
  type: 'multiple_choice';
  front_image?: string; // Optional field, can be null
};

export type Card = BasicCard | MultipleChoiceCard;