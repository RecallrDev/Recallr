import React, { useState } from 'react';
import { ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';
import CreateBasicCard from './CreateBasicCard';
import CreateMCCard from './CreateMCCard';

export type CreateCardProps = {
  deckId: string;
  deckColor: string;
  onCreateSuccess: () => void;
  onCancel: () => void;
};

const CreateCard: React.FC<CreateCardProps> = ({
  deckId,
  deckColor,
  onCreateSuccess,
  onCancel,
}) => {
  const [selectedTab, setSelectedTab] = useState<0 | 1>(0);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onCancel} 
            className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:scale-110 transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Create New Card</h1>
            <p className="text-gray-600 mt-1">Choose a card type and add your content</p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          <div className="flex border-b border-gray-100">
            {/* Basic Tab */}
            <button
              onClick={() => setSelectedTab(0)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all duration-200 relative ${
                selectedTab === 0
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: selectedTab === 0 ? deckColor : 'transparent',
              }}
            >
              {selectedTab === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
              )}
              <CreditCard size={20} className="relative z-10" />
              <div className="relative z-10 text-left">
                <div className="font-bold">Basic Card</div>
                <div className="text-xs opacity-80">Front & Back</div>
              </div>
            </button>

            {/* Multiple Choice Tab */}
            <button
              onClick={() => setSelectedTab(1)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all duration-200 relative ${
                selectedTab === 1
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: selectedTab === 1 ? deckColor : 'transparent',
              }}
            >
              {selectedTab === 1 && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
              )}
              <HelpCircle size={20} className="relative z-10" />
              <div className="relative z-10 text-left">
                <div className="font-bold">Multiple Choice</div>
                <div className="text-xs opacity-80">Question & Answers</div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="transition-all duration-300">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default CreateCard;