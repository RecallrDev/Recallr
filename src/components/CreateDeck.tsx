import React from 'react';
import { ArrowLeft } from 'lucide-react';

const categories = [
  'Languages', 'Science', 'History', 'Mathematics', 'Literature',
  'Geography', 'Medicine', 'Technology', 'Art', 'Music', 'Other'
];

const colorOptions = [
  { name: 'Purple', value: '#9810FA' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Lime', value: '#84CC16' },
  { name: 'Pink', value: '#FF007F' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Black', value: '#000000' },
];

interface CreateDeckProps {
  deckName: string;
  setDeckName: (name: string) => void;
  category: string;
  setCategory: (category: string) => void;
  color: string;
  setColor: (color: string) => void;
  onCreateDeck: () => void;
  onCancel: () => void;
}

const CreateDeck: React.FC<CreateDeckProps> = ({
  deckName,
  setDeckName,
  category,
  setCategory,
  color,
  setColor,
  onCreateDeck,
  onCancel,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Deck</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
        {/* Deck Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deck Name
          </label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter deck name..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deck Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => setColor(colorOption.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === colorOption.value
                    ? 'border-gray-900 ring-2 ring-gray-300'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: colorOption.value }}
                title={colorOption.name}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-600">Selected:</span>
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-sm text-gray-700">
              {colorOptions.find((c) => c.value === color)?.name || 'Custom'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCreateDeck}
            disabled={!deckName.trim()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Deck
          </button>
          <button
            onClick={onCancel}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeck;
