import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../features/homepage';
import { Navbar, Footer } from './shared';
import { DeckListPage, CreateDeckPage, EditDeckPage } from '../features/deck_management';
import { CreateCardPage } from '../features/card_management';
import { ProfilePage } from '../features/profile';
import { StudyPage } from '../features/study';
import { ResetPasswordPage, AuthModal, AuthProvider, AuthCallback, ProtectedRoute } from '../features/authentification';
import PublicDeckPage from '../features/deck_management/pages/PublicDeckPage';
import AppContent from './AppContent';
import { AuthProvider } from '../features/authentification/AuthContext';

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
            <Route path="/public/:deckId" element={<PublicDeckPage />} />

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
        <AppContent
          openLoginModal={openLoginModal}
          openRegisterModal={openRegisterModal}
          isAuthModalOpen={isAuthModalOpen}
          authModalView={authModalView}
          closeAuthModal={closeAuthModal}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
