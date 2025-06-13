import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authTokenManager } from '../../../util/AuthTokenManager';
import type { Deck } from '../types/Deck';
import AuthModal from '../../authentification/components/AuthModal';

const API_URL = import.meta.env.VITE_API_URL;

const PublicDeckPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authTokenManager.getToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const token = await authTokenManager.getToken();
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/decks/${deckId}`, {
          headers,
        });
        if (!response.ok) {
          throw new Error('Deck not found or not public');
        }
        const data = await response.json();
        setDeck(data);
      } catch (error: unknown) {
        console.error('Error fetching deck:', error);
        setError('This deck is not available or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    if (deckId) {
      fetchDeck();
    }
  }, [deckId]);

  const handleStartLearning = () => {
    if (isAuthenticated) {
      // Wenn eingeloggt, direkt zur StudyPage mit Deck-Daten
      navigate(`/study/${deckId}`, { 
        state: { 
          deck,
          isPublic: true 
        }
      });
    } else {
      // Wenn nicht eingeloggt, öffne das AuthModal
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // Nach erfolgreicher Anmeldung zur StudyPage weiterleiten
    navigate(`/study/${deckId}`, { 
      state: { 
        deck,
        isPublic: true 
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deck...</p>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600">{error || 'Something went wrong'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Deck Header */}
            <div
              className="px-8 py-12 text-white relative overflow-hidden"
              style={{ backgroundColor: deck.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative">
                <h1 className="text-4xl font-bold mb-2">{deck.name}</h1>
                <p className="text-white/80">{deck.category}</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {isAuthenticated
                    ? 'Ready to start learning?'
                    : 'Want to study this deck?'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {isAuthenticated
                    ? 'You can start learning this deck right away!'
                    : 'Sign in to start learning this deck and track your progress.'}
                </p>
                <button
                  onClick={handleStartLearning}
                  className="px-8 py-4 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: deck.color }}
                >
                  {isAuthenticated ? 'Start Learning' : 'Sign In to Study'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        initialView="login"
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default PublicDeckPage; 