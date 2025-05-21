import React, { useState } from 'react';
import { X, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabase/client';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void; // Zurück zum Login-Modal
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
  isOpen, 
  onClose,
  onBack
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Bitte gib deine E-Mail-Adresse ein');
      return;
    }
    
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setSuccessMessage(`Eine E-Mail mit Anweisungen zum Zurücksetzen deines Passworts wurde an ${email} gesendet.`);
      setEmail('');
    } catch (error: any) {
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
      setErrorMessage(error.message || 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              Passwort zurücksetzen
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

          {successMessage ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                {successMessage}
              </div>
              <p className="text-gray-600 text-sm">
                Wenn du keine E-Mail erhältst, überprüfe bitte deinen Spam-Ordner oder versuche es erneut.
              </p>
              <button
                onClick={onBack}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zum Login
              </button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-gray-600">
                Gib deine E-Mail-Adresse ein und wir senden dir eine Anleitung zum Zurücksetzen deines Passworts.
              </p>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="reset-email"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                    disabled={loading}
                  >
                    {loading ? 'Wird gesendet...' : 'E-Mail senden'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zurück
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;