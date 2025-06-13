import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface AIGenerationButtonProps {
  sourceDeckId: string;
  sourceDeckName: string;
  onOpenModal: (deckId: string, deckName: string) => void; // ← Nur Event, kein Modal!
  variant?: 'button' | 'icon' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AIGenerationButton: React.FC<AIGenerationButtonProps> = ({
  sourceDeckId,
  sourceDeckName,
  onOpenModal,
  variant = 'button',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = () => {
    onOpenModal(sourceDeckId, sourceDeckName);
  };

  const renderButton = () => {
    const baseClasses = `
      inline-flex items-center justify-center gap-2 
      rounded-lg font-medium transition-all duration-200
      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
      ${sizeClasses[size]} ${className}
    `;

    switch (variant) {
      case 'icon':
        return (
          <button
            onClick={handleClick}
            className={`${baseClasses} bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg`}
            title="Generate AI Deck"
          >
            <Brain className={iconSizes[size]} />
          </button>
        );
      
      case 'minimal':
        return (
          <button
            onClick={handleClick}
            className={`${baseClasses} text-purple-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-300 hover:border-purple-400`}
          >
            <Sparkles className={iconSizes[size]} />
            AI Generate
          </button>
        );

      default:
        return (
          <button
            onClick={handleClick}
            className={`${baseClasses} bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg`}
          >
            <Brain className={iconSizes[size]} />
            <span>AI Generate</span>
          </button>
        );
    }
  };

  return renderButton();
};

export default AIGenerationButton;