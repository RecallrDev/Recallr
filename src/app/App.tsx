import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ProfilePage from './routes/ProfilePage';
import AuthCallback from '../features/authentification/AuthCallback';
import ResetPasswordPage from '../features/profile_management/ResetPasswordPage';
import HomePage from './routes/HomePage';
import ResetPasswordPage from '../features/authentification/ResetPasswordPage';
import StudyPage from './routes/StudyPage';
import AuthModal from '../features/authentification/AuthModal';
import { AuthProvider } from '../features/authentification/AuthContext';
import ProtectedRoute from '../features/authentification/ProtectedRoute';

import DeckListPage from './routes/DeckListPage';
import CreateDeckPage from './routes/CreateDeckPage';
import EditDeckPage from './routes/EditDeckPage';
import CreateCardPage from './routes/CreateCardPage';
import StudyPage from './routes/StudyPage';

import '../index.css';

const App: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');

  const openLoginModal = () => {
    setAuthModalView('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalView('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/decks"
              element={
                <ProtectedRoute>
                  <DeckListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/decks/new"
              element={
                <ProtectedRoute>
                  <CreateDeckPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/decks/:deckId/edit"
              element={
                <ProtectedRoute>
                  <EditDeckPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/decks/:deckId/cards/new"
              element={
                <ProtectedRoute>
                  <CreateCardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/study/:deckId"
              element={
                <ProtectedRoute>
                  <StudyPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/decks" replace />} />
          </Routes>

          <AuthModal
            isOpen={isAuthModalOpen}
            initialView={authModalView}
            onClose={closeAuthModal}
          />
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
