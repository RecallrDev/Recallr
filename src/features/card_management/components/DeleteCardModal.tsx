import React from 'react'
import { XCircle } from 'lucide-react'

export type DeleteCardModalProps = {
  cardLabel: string
  onCancel: () => void
  onConfirm: () => void
}

const DeleteCardModal: React.FC<DeleteCardModalProps> = ({
  cardLabel,
  onCancel,
  onConfirm,
}) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-red-600">Confirm Delete</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
      </div>
      <p className="mb-6 text-gray-700">
        Are you sure you want to delete <strong>{cardLabel}</strong>?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)

export default DeleteCardModal