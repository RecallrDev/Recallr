import React, { useState, useEffect } from 'react';
import { X, Brain, Wand2, Loader2, Eye, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { authTokenManager } from '../../../util/AuthTokenManager';

const API_URL = import.meta.env.VITE_API_URL;

type GenerationStyle = {
  key: string;
  name: string;
  description: string;
};

type PreviewCard = {
  type: string;
  front?: string;
  back?: string;
  question?: string;
  choices?: Array<{ answer_text: string; is_correct: boolean }>;
};

type PreviewResponse = {
  preview_deck_name: string;
  preview_category: string;
  estimated_card_count: number;
  preview_cards: PreviewCard[];
  style: string;
  source_deck_name: string;
};

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceDeckId: string;
  sourceDeckName: string;
  onSuccess: (deckId: string) => void;
}

const AIGenerationModal: React.FC<AIGenerationModalProps> = ({
  isOpen,
  onClose,
  sourceDeckId,
  sourceDeckName,
  onSuccess,
}) => {
  const [step, setStep] = useState<'configure' | 'preview' | 'generating' | 'success'>('configure');
  const [selectedStyle, setSelectedStyle] = useState('similar');
  const [customDeckName, setCustomDeckName] = useState('');
  const [targetCardCount, setTargetCardCount] = useState<number | null>(null);
  const [availableStyles, setAvailableStyles] = useState<GenerationStyle[]>([]);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDeckId, setGeneratedDeckId] = useState<string | null>(null);

  // Load available styles on mount
  useEffect(() => {
    if (isOpen) {
      loadAvailableStyles();
      resetModal();
    }
  }, [isOpen]);

  const resetModal = () => {
    setStep('configure');
    setSelectedStyle('similar');
    setCustomDeckName('');
    setTargetCardCount(null);
    setPreview(null);
    setError(null);
    setGeneratedDeckId(null);
  };

  const loadAvailableStyles = async () => {
    try {
      const headers = await authTokenManager.getAuthHeaders();
      const response = await fetch(`${API_URL}/ai-generation/styles`, {
        headers,
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailableStyles(data.styles);
      }
    } catch (error) {
      console.error('Failed to load generation styles:', error);
    }
  };

  const generatePreview = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const headers = await authTokenManager.getAuthHeaders();
      const response = await fetch(`${API_URL}/ai-generation/preview`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_deck_id: sourceDeckId,
          generation_style: selectedStyle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate preview');
      }

      const previewData = await response.json();
      setPreview(previewData);
      setStep('preview');
      
      // Set suggested deck name if user hasn't entered one
      if (!customDeckName) {
        setCustomDeckName(previewData.preview_deck_name);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate preview');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDeck = async () => {
    setIsLoading(true);
    setError(null);
    setStep('generating');
    
    try {
      const headers = await authTokenManager.getAuthHeaders();
      const response = await fetch(`${API_URL}/ai-generation/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          source_deck_id: sourceDeckId,
          generation_style: selectedStyle,
          target_card_count: targetCardCount,
          new_deck_name: customDeckName,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedDeckId(data.generated_deck.deck_id);
        setStep('success');
      } else {
        throw new Error(data.error_details || 'Failed to generate deck');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate deck');
      setStep('configure');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'configure':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Source Deck</h3>
              <div className="p-3 bg-purple-50 rounded-lg border">
                <p className="font-medium text-purple-900">{sourceDeckName}</p>
                <p className="text-sm text-purple-600">This deck will be used as inspiration for the new content</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Generation Style</h3>
              <div className="space-y-3">
                {availableStyles.map((style) => (
                  <label key={style.key} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="style"
                      value={style.key}
                      checked={selectedStyle === style.key}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="mt-1 h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{style.name}</div>
                      <div className="text-sm text-gray-600">{style.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Customization (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="deckName" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Deck Name
                  </label>
                  <input
                    type="text"
                    id="deckName"
                    value={customDeckName}
                    onChange={(e) => setCustomDeckName(e.target.value)}
                    placeholder="Leave empty for AI-generated name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="cardCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Card Count
                  </label>
                  <input
                    type="number"
                    id="cardCount"
                    value={targetCardCount || ''}
                    onChange={(e) => setTargetCardCount(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Leave empty to match source deck size"
                    min="1"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={generatePreview}
                disabled={isLoading}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Preview...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Preview Generation
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Preview Results</h3>
              {preview && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                    <h4 className="font-semibold text-purple-900 mb-2">{preview.preview_deck_name}</h4>
                    <p className="text-sm text-purple-700">Category: {preview.preview_category}</p>
                    <p className="text-sm text-purple-700">Estimated Cards: {preview.estimated_card_count}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Sample Cards:</h4>
                    <div className="space-y-3">
                      {preview.preview_cards.map((card, index) => (
                        <div key={index} className="p-3 bg-white border rounded-lg">
                          {card.type === 'basic' ? (
                            <div>
                              <div className="font-medium text-gray-900 mb-1">Q: {card.front}</div>
                              <div className="text-gray-600">A: {card.back}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium text-gray-900 mb-2">{card.question}</div>
                              <div className="space-y-1">
                                {card.choices?.map((choice, choiceIndex) => (
                                  <div key={choiceIndex} className={`text-sm px-2 py-1 rounded ${choice.is_correct ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                    {choice.is_correct ? '✓' : '○'} {choice.answer_text}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={generateDeck}
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Generate Full Deck
              </button>
              <button
                onClick={() => setStep('configure')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        );

      case 'generating':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Generating Your Deck...</h3>
            <p className="text-gray-600">This may take a minute while our AI creates your new cards.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Deck Generated Successfully!</h3>
            <p className="text-gray-600 mb-6">Your new AI-generated deck is ready to use.</p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => generatedDeckId && onSuccess(generatedDeckId)}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View New Deck
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="auth-modal-overlay"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6" />
            <h2 className="text-xl font-bold">AI Deck Generation</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default AIGenerationModal;