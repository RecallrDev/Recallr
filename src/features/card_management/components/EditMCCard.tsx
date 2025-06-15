import React, { useState } from 'react';
import MCCardForm from './MCCardForm';
import { authTokenManager } from '../../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

export type EditMCCardProps = {
  cardId: string;
  deckColor: string;
  initialData: {
    question: string;
    front_image: string | null;
    choices: { answer_text: string; is_correct: boolean, id: string }[];
  };
  onSaveSuccess: () => void;
  onDeleteSuccess: () => void;
  onCancel: () => void;
};

const EditMCCard: React.FC<EditMCCardProps> = ({
  cardId,
  deckColor,
  initialData,
  onSaveSuccess,
  onDeleteSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async ({ question, questionImage, choices }: { question: string; questionImage: string | null; choices: { text: string; is_correct: boolean; id?: string }[] }) => {
    setIsSubmitting(true);
    if (!(await authTokenManager.isAuthenticated())) {
      setIsSubmitting(false);
      return;
    }

    const headers = await authTokenManager.getAuthHeaders();
    const response = await fetch(`${API_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        type: 'multiple_choice',
        question,
        front_image: questionImage,
        choices: choices.map((c) => ({ answer_text: c.text, is_correct: c.is_correct, choice_id: c.id })),
      }),
    });

    if (response.ok) {
      onSaveSuccess();
    } else {
      console.error('Error saving MC card', await response.json().catch(() => ({})));
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
      setIsSubmitting(true);
      const headers = await authTokenManager.getAuthHeaders();
      try {
        const res = await fetch(
          `${API_URL}/cards/${cardId}`,
          {
            method: 'DELETE',
            headers,
            body: JSON.stringify({
              id: cardId,
              type: 'multiple_choice',
            }),
          }
        );
        if (!res.ok) throw new Error(await res.text() || 'Failed to delete card');
        onDeleteSuccess();
      } catch (error) {
        console.error('Delete failed:', error);
      }
      setIsSubmitting(false);
    };

  return (
    <MCCardForm
      deckColor={deckColor}
      initialQuestion={initialData.question}
      initialQuestionImage={initialData.front_image}
      initialChoices={initialData.choices.map((c) => ({ text: c.answer_text, is_correct: c.is_correct }))}
      isSubmitting={isSubmitting}
      submitLabel="Save MC Card"
      onSubmit={handleSave}
      onDelete={handleDelete}
      onCancel={onCancel}
    />
  );
};

export default EditMCCard;
