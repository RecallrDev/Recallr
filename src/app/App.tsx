import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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
