import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase_client';
import { config } from '../../lib/config';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Passwort-Stärke prüfen
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-600' };
      case 2: return { text: 'Weak', color: 'text-orange-600' };
      case 3: return { text: 'Fair', color: 'text-yellow-600' };
      case 4: return { text: 'Good', color: 'text-blue-600' };
      case 5: return { text: 'Strong', color: 'text-green-600' };
      default: return { text: '', color: '' };
    }
  };

  // Überprüfen, ob der Benutzer von einer Passwort-Reset-E-Mail kommt
  useEffect(() => {
    const checkSession = async () => {
      try {
        // URL-Parameter aus Fragment (#) und Search (?) prüfen
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        
        // Tokens können in URL-Fragment (#) oder Search (?) sein
        const accessToken = hashParams.get('access_token') || urlParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || urlParams.get('refresh_token');
        const type = hashParams.get('type') || urlParams.get('type');
        
        console.log('Reset password params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        // WICHTIG: Nur erlauben wenn es ein Recovery-Link ist
        if (type === 'recovery' && accessToken && refreshToken) {
          // Session mit den Tokens aus der URL setzen
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          setValidSession(true);
        } else if (type === 'recovery' && !accessToken) {
          // Recovery-Type aber keine Tokens = abgelaufener/ungültiger Link
          setError('This password reset link has expired or is invalid. Please request a new one.');
          setValidSession(false);
        } else {
          // Wenn keine Recovery-Parameter vorhanden sind, ablehnen
          // Auch wenn der User normal eingeloggt ist!
          setError('This page can only be accessed through a password reset email link.');
          setValidSession(false);
        }
      } catch (error: any) {
        console.error('Error checking session:', error);
        setError('Invalid or expired password reset link. Please request a new one.');
        setValidSession(false);
      }
    };
    
    checkSession();
  }, [searchParams]);

  // Countdown für Redirect nach erfolgreichem Reset
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (success && redirectCountdown > 0) {
      interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            navigate(config.redirectUrls.profile);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [success, redirectCountdown, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const passwordStrength = getPasswordStrength(password);
    if (passwordStrength < 2) {
      setError('Password is too weak. Please use a stronger password.');
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
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      let errorMsg = 'An error occurred. Please try again later.';
      if (error.message.includes('session_not_found')) {
        errorMsg = 'Your session has expired. Please request a new password reset link.';
      } else if (error.message.includes('weak_password')) {
        errorMsg = 'Password is too weak. Please choose a stronger password.';
      } else if (error.message.includes('same_password')) {
        errorMsg = 'New password must be different from your current password.';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-md">
        {success ? (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Password Reset Successful!</h2>
            <p className="mt-2 text-gray-600">
              Your password has been updated successfully.
            </p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Redirecting to your profile in {redirectCountdown} seconds...
              </p>
            </div>
            <button
              onClick={() => navigate(config.redirectUrls.profile)}
              className="mt-4 py-2 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
            >
              Go to Profile Now
            </button>
          </div>
        ) : !validSession ? (
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Invalid or Expired Link</h2>
            <p className="mt-2 text-red-600 text-sm">{error}</p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate(config.redirectUrls.home)}
                className="w-full py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
              >
                Go to Home
              </button>
              <button
                onClick={() => window.location.href = config.redirectUrls.home + '?forgot-password=true'}
                className="w-full py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <Lock className="h-12 w-12 text-purple-600 mx-auto" />
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Reset Your Password</h2>
              <p className="mt-2 text-gray-600">Choose a new, secure password for your account.</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-sm flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={getPasswordStrengthText(getPasswordStrength(password)).color}>
                        {getPasswordStrengthText(getPasswordStrength(password)).text}
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          getPasswordStrength(password) <= 1 ? 'bg-red-500' :
                          getPasswordStrength(password) === 2 ? 'bg-orange-500' :
                          getPasswordStrength(password) === 3 ? 'bg-yellow-500' :
                          getPasswordStrength(password) === 4 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(getPasswordStrength(password) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password"
                    className={`pl-10 pr-10 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && password === confirmPassword && confirmPassword.length >= 6 && (
                  <p className="mt-2 text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  loading || 
                  !password || 
                  !confirmPassword || 
                  password !== confirmPassword ||
                  getPasswordStrength(password) < 2
                }
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </div>
                ) : 'Update Password'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(config.redirectUrls.home)}
                className="text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;