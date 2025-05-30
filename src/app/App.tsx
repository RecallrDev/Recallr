import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ProfilePage from './routes/ProfilePage';
import AuthCallback from '../features/authentification/AuthCallback';
import ResetPasswordPage from '../features/profile_management/ResetPasswordPage';
import StudyPage from './routes/StudyPage';
import AuthModal from '../features/authentification/AuthModal';
import { AuthProvider } from '../features/authentification/AuthContext';
import ProtectedRoute from '../features/authentification/ProtectedRoute';
import HomePage from './routes/HomePage';
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
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/study" element={
              <ProtectedRoute>
                <StudyPage />
              </ProtectedRoute>
            } />
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