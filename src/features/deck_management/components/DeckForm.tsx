import React from 'react';
import { Type, Tag, Palette } from 'lucide-react';

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

type DeckFormProps = {
  deckName: string;
  setDeckName: (name: string) => void;
  category: string;
  setCategory: (category: string) => void;
  color: string;
  setColor: (color: string) => void;
};

const DeckForm: React.FC<DeckFormProps> = ({
  deckName,
  setDeckName,
  category,
  setCategory,
  color,
  setColor,
}) => {
  return (
    <div className="p-8 space-y-8">
      {/* Deck Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Type size={16} />
          Deck Name
        </label>
        <input
          type="text"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
          placeholder="Enter a memorable name for your deck..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Tag size={16} />
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg bg-white"
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
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
          <Palette size={16} />
          Deck Color
        </label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-4">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption.value}
              type="button"
              onClick={() => setColor(colorOption.value)}
              className={`w-12 h-12 rounded-2xl border-2 transition-all duration-200 hover:scale-110 ${
                color === colorOption.value
                  ? 'border-gray-900 ring-4 ring-gray-200 scale-110'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: colorOption.value }}
              title={colorOption.name}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <span className="text-sm text-gray-600">Selected color:</span>
          <div
            className="w-6 h-6 rounded-lg border border-gray-300"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-semibold text-gray-700">
            {colorOptions.find((c) => c.value === color)?.name || 'Custom'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeckForm;
