import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, UserPlus, LogIn, User } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useNavigate } from 'react-router-dom';

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
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  
  // Reset state when modal is closed or initialView changes
  useEffect(() => {
    if (isOpen) {
      setIsFlipped(initialView === 'register');
      setEmail('');
      setPassword('');
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
  };

  // Handle sign in with Supabase
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Bitte gib deine E-Mail und dein Passwort ein');
      return;
    }
    
    try {
      setLoading(true);
      setErrorMessage('');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Erfolgreich eingeloggt
        setSuccessMessage('Erfolgreich eingeloggt!');
        // Weiterleitung zur Profilseite nach kurzer Verzögerung
        setTimeout(() => {
          onClose();
          navigate('/profile');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Fehler beim Einloggen:', error.message);
      setErrorMessage(error.message || 'Fehler beim Einloggen');
    } finally {
      setLoading(false);
    }
  };

// Minimale Version zum Testen
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email || !password) {
    setErrorMessage('Bitte gib deine E-Mail und dein Passwort ein');
    return;
  }
  
  try {
    setLoading(true);
    setErrorMessage('');
    
    // Einfachste Form der Registrierung ohne zusätzliche Optionen
    console.log("Beginne einfache Registrierung mit:", email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password
      // Keine zusätzlichen Optionen, um Komplexität zu reduzieren
    });
    
    console.log("Registrierungsergebnis:", { data, error });

    if (error) {
      throw error;
    }

    if (data?.user) {
      setSuccessMessage(`Registrierung erfolgreich! Eine Bestätigungs-E-Mail wurde an ${email} gesendet.`);
    }
  } catch (error: any) {
    console.error('Fehler bei der Registrierung:', error);
    setErrorMessage(error.message || 'Fehler bei der Registrierung');
  } finally {
    setLoading(false);
  }
};

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div 
      className="auth-modal-overlay"
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
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                  disabled={loading}
                >
                  {loading ? 'Wird eingeloggt...' : 'Sign in'}
                </button>
              </form>
              
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
                    />
                  </div>
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
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                  disabled={loading}
                >
                  {loading ? 'Erstelle Konto...' : 'Create account'}
                </button>
              </form>
              
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