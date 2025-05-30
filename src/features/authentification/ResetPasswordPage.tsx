import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase_client';
import { config } from '../../lib/config';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Überprüfen, ob der Benutzer von einer Passwort-Reset-E-Mail kommt
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          setError('Invalid or expired link. Please request a new password reset link.');
          setValidSession(false);
        } else {
          // Zusätzlich prüfen, ob es eine aktive Recovery-Session ist
          if (data.session.user && data.session.user.recovery_sent_at) {
            setValidSession(true);
          } else {
            setValidSession(true); // Für den Fall, dass recovery_sent_at nicht verfügbar ist
          }
        }
      } catch (error: any) {
        console.error('Error checking session:', error);
        setError('Invalid or expired link. Please request a new password reset link.');
        setValidSession(false);
      }
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      
      // Nach erfolgreicher Passwortänderung zur Profilseite weiterleiten
      setTimeout(() => {
        navigate(config.redirectUrls.profile);
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      // Bessere Fehlerbehandlung
      let errorMsg = 'An error occurred. Please try again later.';
      if (error.message.includes('session_not_found')) {
        errorMsg = 'Your session has expired. Please request a new password reset link.';
      } else if (error.message.includes('weak_password')) {
        errorMsg = 'Password is too weak. Please choose a stronger password.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Loading state während Session-Prüfung
  if (validSession === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <h2 className="mt-6 text-xl font-bold text-gray-800">Verifying...</h2>
            <p className="mt-2 text-gray-600">Please wait while we verify your request.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        {success ? (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h2 className="mt-2 text-xl font-bold text-gray-800">Password successfully reset</h2>
            <p className="mt-2 text-gray-600">You will be redirected in a few seconds...</p>
          </div>
        ) : !validSession ? (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h2 className="mt-2 text-xl font-bold text-gray-800">Invalid Link</h2>
            <p className="mt-2 text-red-600">{error}</p>
            <button
              onClick={() => navigate(config.redirectUrls.home)}
              className="mt-4 py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center">Reset Password</h2>
            
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
            
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
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
                    minLength={6}
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
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || (confirmPassword.length > 0 && password !== confirmPassword)}
              >
                {loading ? 'Saving...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;