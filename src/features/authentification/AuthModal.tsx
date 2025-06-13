import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, UserPlus, LogIn, User } from 'lucide-react';
import { supabase } from '../../lib/supabase_client';
import { useNavigate } from 'react-router-dom';
import SocialLoginButtons from './SocialLoginButtons';
import ForgotPasswordModal from './ForgotPasswordModal';
import { config } from '../../lib/config';

interface AuthModalProps {
  isOpen: boolean;
  initialView?: 'login' | 'register';
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  initialView = 'login',
  onClose 
}) => {
  const [isFlipped, setIsFlipped] = useState(initialView === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  // Reset state when modal is closed or initialView changes
  useEffect(() => {
    if (isOpen) {
      setIsFlipped(initialView === 'register');
      // Lade gespeicherte E-Mail wenn vorhanden
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      } else {
        setEmail('');
        setRememberMe(false);
      }
      setPassword('');
      setConfirmPassword('');
      setName('');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, initialView]);

  // Toggle flip state
  const toggleView = () => {
    setIsFlipped(!isFlipped);
    setErrorMessage('');
    setSuccessMessage('');
    // Reset password fields when switching views
    setPassword('');
    setConfirmPassword('');
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle sign in with Supabase
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Please enter your email and password');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      setErrorMessage('');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // E-Mail speichern oder entfernen basierend auf "Remember me"
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email.trim().toLowerCase());
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Erfolgreich eingeloggt
        setSuccessMessage('Successfully logged in!');
        // Weiterleitung zur Profilseite nach kurzer Verzögerung
        setTimeout(() => {
          onClose();
          navigate(config.redirectUrls.profile);
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Bessere Fehlerbehandlung
      let errorMsg = 'Login failed. Please try again.';
      if (error.message.includes('Invalid login credentials')) {
        errorMsg = 'Invalid email or password';
      } else if (error.message.includes('Email not confirmed')) {
        errorMsg = 'Please confirm your email address first';
      } else if (error.message.includes('Too many requests')) {
        errorMsg = 'Too many login attempts. Please wait a moment.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up with Supabase
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !name) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setErrorMessage('');
      
      // 1. Benutzer registrieren
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
          emailRedirectTo: config.redirectUrls.authCallback,
        },
      });

      if (authError) {
        throw authError;
      }

      if (authData?.user) {
        // Prüfen ob der Benutzer bereits existiert
        if (authData.user.identities && authData.user.identities.length === 0) {
          setErrorMessage('An account with this email address already exists. Please log in.');
          return;
        }

        // Zusätzliche Prüfung: Wenn der Benutzer bereits bestätigt ist
        if (authData.user.email_confirmed_at) {
          setErrorMessage('An account with this email address already exists. Please log in.');
          return;
        }

        // Erfolgreich registriert
        setSuccessMessage('Registration successful! Please check your email to confirm your account.');
        
        // Felder zurücksetzen nach erfolgreicher Registrierung
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
      }
    } catch (error: any) {
      console.error('Registration error:', error.message);
      
      // Bessere Fehlerbehandlung
      let errorMsg = 'Registration failed. Please try again.';
      if (error.message.includes('User already registered')) {
        errorMsg = 'An account with this email already exists. Please log in.';
      } else if (error.message.includes('Password should be at least 6 characters')) {
        errorMsg = 'Password must be at least 6 characters long';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // "Passwort vergessen" Modal anzeigen
  const openForgotPassword = () => {
    setShowForgotPassword(true);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Wenn das "Passwort vergessen" Modal geöffnet ist, zeige das
  if (showForgotPassword) {
    return (
      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={onClose} 
        onBack={() => setShowForgotPassword(false)} 
      />
    );
  }

  return (
    <div 
      className="auth-modal-overlay"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        zIndex: 50
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="auth-flip-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`auth-flipper ${isFlipped ? 'is-flipped' : ''}`}>
          {/* Login */}
          <div className="auth-card-face auth-card-front">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <LogIn className="w-6 h-6 mr-2 text-purple-600" />
                  Login
                </h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <button 
                      type="button"
                      onClick={openForgotPassword}
                      className="font-medium text-purple-600 hover:text-purple-500"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
              
              {/* Social Login Buttons */}
              <SocialLoginButtons view="login" />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="font-medium text-purple-600 hover:text-purple-500 transition"
                    onClick={toggleView}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Register */}
          <div className="auth-card-face auth-card-back">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <UserPlus className="w-6 h-6 mr-2 text-purple-600" />
                  Register
                </h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              
              <form className="space-y-4" onSubmit={handleSignUp}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="register-email"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="register-password"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirm-password"
                      className={`pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                        confirmPassword && password !== confirmPassword 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || (confirmPassword.length > 0 && password !== confirmPassword)}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
              
              {/* Social Login Buttons */}
              <SocialLoginButtons view="register" />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="font-medium text-purple-600 hover:text-purple-500 transition"
                    onClick={toggleView}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;