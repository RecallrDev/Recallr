import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase_client';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Anfängliche Session laden
    const getInitialSession = async () => {
      try {
        setLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Fehler beim Laden der Session:', error);
          // Bei Fehlern Session auf null setzen
          if (mounted) {
            setSession(null);
            setUser(null);
          }
          return;
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Unerwarteter Fehler beim Laden der Session:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Auth-Änderungen abonnieren
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Bei explizitem Logout localStorage räumen
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('rememberedEmail');
        }
      }
    );

    // Cleanup-Funktion
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Session aktualisieren
  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Fehler beim Aktualisieren der Session:', error);
        // Bei Refresh-Fehlern Session zurücksetzen
        setSession(null);
        setUser(null);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Unerwarteter Fehler beim Aktualisieren der Session:', error);
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Abmelden - WICHTIG: State immer zurücksetzen, auch bei Fehlern
  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Fehler beim Abmelden:', error);
        // Trotz Fehler lokale Session zurücksetzen
      }
      
    } catch (error) {
      console.error('Unerwarteter Fehler beim Abmelden:', error);
    } finally {
      // State IMMER zurücksetzen, auch bei Fehlern
      setSession(null);
      setUser(null);
      setLoading(false);
      
      // Auch localStorage räumen
      localStorage.removeItem('rememberedEmail');
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook zum Verwenden des Auth-Kontexts
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  
  return context;
};