import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authTokenManager } from '../../../util/AuthTokenManager';
import type { Deck } from '../types/Deck';
import AuthModal from '../../authentification/components/AuthModal';
import logo from '../../../assets/logo.svg';
import { BookOpen, ArrowRight, Share2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const PublicDeckPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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
    navigate(`/public/${deckId}`, { 
      state: { 
        deck,
        isPublic: true 
      }
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Recallr Logo" 
              className="w-16 h-16 animate-[spin_1s_linear_infinite]"
            />
          </div>
          <p className="text-gray-600">Loading deck...</p>
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
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            {/* Deck Header */}
            <div
              className="px-8 py-16 text-white relative overflow-hidden"
              style={{ backgroundColor: deck.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative">
                <h1 className="text-5xl font-bold mb-3">{deck.name}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1">
                    <BookOpen size={18} />
                    {deck.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-12">
              <div className="text-center">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                  {isAuthenticated
                    ? 'Ready to start learning?'
                    : 'Start Your Learning Journey!'}
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  {isAuthenticated
                    ? 'You can start learning this deck right away! Track your progress and improve your knowledge.'
                    : 'Join our community of learners and master this deck. Sign up now to track your progress and unlock your full learning potential!'}
                </p>
                <button
                  onClick={handleStartLearning}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="group px-8 py-4 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
                  style={{ 
                    backgroundColor: deck.color,
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isHovered ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  {isAuthenticated ? 'Start Learning' : 'Join Now & Start Learning'}
                  <ArrowRight 
                    size={20} 
                    className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
                  />
                </button>

                {/* Share Section */}
                <div className="mt-8">
                  <button
                    onClick={handleCopyLink}
                    className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2 mx-auto text-sm"
                  >
                    <Share2 size={16} />
                    {copySuccess ? 'Link copied!' : 'Share this deck'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        initialView="login"
        redirectUrl={`/public/${deckId}`}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default PublicDeckPage; 