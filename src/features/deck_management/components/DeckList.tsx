import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import DeckCard from './DeckCard';
import UploadAnkiDeck from '../../upload_management/UploadAnkiDeck';
import type { Deck } from '../types/Deck';

export type DeckListProps = {
  decks: Deck[];
  onCreateDeck: () => void;
  onStudyDeck: (deck: Deck) => void;
  onEditDeck: (deck: Deck) => void;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
};

const DeckList: React.FC<DeckListProps> = ({
  decks,
  onCreateDeck,
  onStudyDeck,
  onEditDeck,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Decks</h1>
            <p className="text-gray-600">
              {decks.length === 0 
                ? "Create your first deck to get started" 
                : `${decks.length} ${decks.length === 1 ? 'deck' : 'decks'} ready for study`
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            <UploadAnkiDeck onUploadSuccess={onCreateDeck} />
            <button
              onClick={onCreateDeck}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Create Deck
            </button>
          </div>
        </div>

        {/* Deck Cards Grid */}
        {decks.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {decks.map((deck) => (
              <motion.div
                key={deck.id}
                variants={itemVariants}
              >
                <DeckCard
                  deck={deck}
                  onStudy={onStudyDeck}
                  onEdit={onEditDeck}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto border border-gray-100">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={40} className="text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Create your first flashcard deck or import an existing Anki deck to begin your study journey.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onCreateDeck}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Create Your First Deck
                </button>
                <UploadAnkiDeck onUploadSuccess={onCreateDeck} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeckList;