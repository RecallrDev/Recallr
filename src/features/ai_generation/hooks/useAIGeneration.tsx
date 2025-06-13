import { useState } from 'react';
import { authTokenManager } from '../../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

interface GenerationRequest {
  sourceDeckId: string;
  style: string;
  targetCardCount?: number;
  customDeckName?: string;
}

interface PreviewRequest {
  sourceDeckId: string;
  style: string;
}

interface GeneratedDeck {
  deck_id: string;
  deck_name: string;
  category: string;
  card_count: number;
  cards: any[];
}

interface GenerationResponse {
  success: boolean;
  message: string;
  generated_deck?: GeneratedDeck;
  error_details?: string;
}

interface PreviewResponse {
  preview_deck_name: string;
  preview_category: string;
  estimated_card_count: number;
  preview_cards: any[];
  style: string;
  source_deck_name: string;
}

export const useAIGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePreview = async (request: PreviewRequest): Promise<PreviewResponse | null> => {
    setIsPreviewLoading(true);
    setError(null);

    try {
      if (!(await authTokenManager.isAuthenticated())) {
        throw new Error('Not authenticated');
      }

      const headers = await authTokenManager.getAuthHeaders();
      
      const response = await fetch(`${API_URL}/ai-generation/preview`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_deck_id: request.sourceDeckId,
          generation_style: request.style,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate preview');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate preview';
      setError(errorMessage);
      return null;
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const generateDeck = async (request: GenerationRequest): Promise<GeneratedDeck | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      if (!(await authTokenManager.isAuthenticated())) {
        throw new Error('Not authenticated');
      }

      const headers = await authTokenManager.getAuthHeaders();
      
      const response = await fetch(`${API_URL}/ai-generation/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_deck_id: request.sourceDeckId,
          generation_style: request.style,
          target_card_count: request.targetCardCount,
          new_deck_name: request.customDeckName,
        }),
      });

      const data: GenerationResponse = await response.json();
      
      if (data.success && data.generated_deck) {
        return data.generated_deck;
      } else {
        throw new Error(data.error_details || data.message || 'Failed to generate deck');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate deck';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const getGenerationStyles = async () => {
    try {
      const headers = await authTokenManager.getAuthHeaders();
      
      const response = await fetch(`${API_URL}/ai-generation/styles`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch generation styles');
      }

      const data = await response.json();
      return data.styles;
    } catch (err) {
      console.error('Failed to get generation styles:', err);
      return [];
    }
  };

  const clearError = () => setError(null);

  return {
    generatePreview,
    generateDeck,
    getGenerationStyles,
    isGenerating,
    isPreviewLoading,
    error,
    clearError,
  };
};