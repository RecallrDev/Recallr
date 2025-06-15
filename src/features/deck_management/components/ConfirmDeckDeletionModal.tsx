import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

export type DeleteDeckModalProps = {
  deckName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteDeckModal: React.FC<DeleteDeckModalProps> = ({ deckName, onCancel, onConfirm }) => {
  const [confirmName, setConfirmName] = useState('');

  const matches = confirmName.trim() === deckName;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-600">Confirm Deletion</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>

        {/* Body */}
        <p className="mb-4 text-gray-700">
          Are you sure you want to delete the deck <strong>“{deckName}”</strong>?<br />
          <span className="text-red-600 font-medium">This will also delete all cards</span> within the deck.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please type the deck name to confirm:
          </label>
          <input
            type="text"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder={deckName}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!matches}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
              matches
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-100 text-red-400 cursor-not-allowed'
            }`}
          >
            Delete Deck
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDeckModal;