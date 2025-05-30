// src/components/CreateCard.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import CreateBasicCard from './CreateBasicCard';
import CreateMCCard from './CreateMCCard';

export type CreateCardProps = {
  deckId: string;
  deckColor: string;
  onCreateSuccess: () => void;
  onCancel: () => void;
};

/**
 * CreateCard page with two tabs:
 * - Basic (renders CreateBasicCard)
 * - Multiple Choice (renders CreateMultipleChoiceCard)
 *
 * Switching tabs instantly swaps the form below.
 */
const CreateCard: React.FC<CreateCardProps> = ({
  deckId,
  deckColor,
  onCreateSuccess,
  onCancel,
}) => {
  // 0 = Basic, 1 = Multiple Choice
  const [selectedTab, setSelectedTab] = useState<0 | 1>(0);

  // Helper to render the appropriate form
  const renderForm = () => {
    if (selectedTab === 0) {
      return (
        <CreateBasicCard
          deckId={deckId}
          deckColor={deckColor}
          onCreateSuccess={onCreateSuccess}
          onCancel={onCancel}
        />
      );
    } else {
      return (
        <CreateMCCard
          deckId={deckId}
          deckColor={deckColor}
          onCreateSuccess={onCreateSuccess}
          onCancel={onCancel}
        />
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header & Back Button  */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Card</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {/* Basic Tab */}
        <button
          onClick={() => setSelectedTab(0)}
          style={{
            color: selectedTab === 0 ? deckColor : 'inherit',
            borderColor: selectedTab === 0 ? deckColor : 'transparent',
          }}
          className={`flex-1 text-center py-2 font-medium transition ${
            selectedTab === 0
              ? 'border-b-2'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Basic
        </button>

        {/* Multiple Choice Tab */}
        <button
          onClick={() => setSelectedTab(1)}
          style={{
            color: selectedTab === 1 ? deckColor : 'inherit',
            borderColor: selectedTab === 1 ? deckColor : 'transparent',
          }}
          className={`flex-1 text-center py-2 font-medium transition ${
            selectedTab === 1
              ? 'border-b-2'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Multiple Choice
        </button>
      </div>

      {/* Form (Basic or MC) */}
      <div>{renderForm()}</div>
    </div>
  );
};

export default CreateCard;
