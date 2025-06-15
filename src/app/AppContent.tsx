import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { HomePage } from '../features/homepage';
import { Navbar, Footer } from './shared';
import { DeckListPage, CreateDeckPage, EditDeckPage } from '../features/deck_management';
import { CreateCardPage } from '../features/card_management';
import { ProfilePage } from '../features/profile';
import { StudyPage } from '../features/study';
import { ResetPasswordPage, AuthModal, AuthCallback, ProtectedRoute } from '../features/authentification';
import  EditCardPage  from '../features/card_management/pages/EditCardPage';
import PublicDeckPage from '../features/deck_management/pages/PublicDeckPage';

const AppContent: React.FC<{
  openLoginModal: () => void;
  openRegisterModal: () => void;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'register';
  closeAuthModal: () => void;
}> = ({ openLoginModal, openRegisterModal, isAuthModalOpen, authModalView, closeAuthModal }) => {
  const location = useLocation();
  const isStudyRoute = location.pathname.startsWith('/study');

  return (
    <div className="App">
      {!isStudyRoute && (
        <Navbar onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />
      )}

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

        <Route
          path="/decks/:deckId/cards/:cardId/edit"
          element={
            <ProtectedRoute>
              <EditCardPage />
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

      {!isStudyRoute && <Footer />}
    </div>
  );
};

export default AppContent;