import React, { useState } from 'react';
import BasicCardForm from './BasicCardForm';
import { authTokenManager } from '../../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

interface EditBasicCardProps {
  cardId: string;
  deckColor: string;
  initialData: {
    front: string;
    back: string;
    front_image?: string;
    back_image?: string;
  };
  onSaveSuccess: () => void;
  onDeleteSuccess: () => void;
  onCancel: () => void;
}

export const EditBasicCard: React.FC<EditBasicCardProps> = ({
  cardId, deckColor, initialData, onSaveSuccess, onDeleteSuccess, onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async ({ frontText, backText, frontImage, backImage }: {
    frontText: string;
    backText: string;
    frontImage: string | null;
    backImage: string | null;
  }) => {
    setIsSubmitting(true);
    if (!(await authTokenManager.isAuthenticated())) return setIsSubmitting(false);

    const headers = await authTokenManager.getAuthHeaders();
    const response = await fetch(`${API_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ front: frontText, back: backText, front_image: frontImage, back_image: backImage })
    });

    if (response.ok) {
      onSaveSuccess();
    } else {
      console.error(await response.json().catch(() => ({ error: 'Unknown' })));
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
            type: 'basic',
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
    <BasicCardForm
      deckColor={deckColor}
      initialFrontText={initialData.front}
      initialBackText={initialData.back}
      initialFrontImage={initialData.front_image}
      initialBackImage={initialData.back_image}
      isSubmitting={isSubmitting}
      submitLabel="Save Changes"
      onSubmit={handleSave}
      onDelete={handleDelete}
      onCancel={onCancel}
    />
  );
};
