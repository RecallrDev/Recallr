import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import IntroSection from './components/IntroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import CallToActionSection from './components/CallToActionSection';
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import ProfilePage from './components/ProfilePage';
import AuthCallback from './components/AuthCallback';
import ResetPasswordPage from './components/ResetPasswordPage';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const HomePage: React.FC = () => {
  return (
    <>
      <IntroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <TeamSection />
      <ContactSection />
      <CallToActionSection />
    </>
  );
};

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