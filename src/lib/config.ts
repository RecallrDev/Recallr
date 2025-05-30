// src/lib/config.ts
export const getAppUrl = (): string => {
  // Erst aus Umgebungsvariable versuchen
  const envUrl = import.meta.env.VITE_APP_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback: automatisch aus window.location generieren
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Final fallback für Server-Side Rendering
  return 'http://localhost:5173';
};

export const getRedirectUrl = (path: string): string => {
  return `${getAppUrl()}${path}`;
};

// Konfiguration für verschiedene Umgebungen
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    url: getAppUrl(),
  },
  redirectUrls: {
    authCallback: getRedirectUrl('/auth/callback'),
    resetPassword: getRedirectUrl('/reset-password'),
    profile: '/profile',
    home: '/',
  }
};

export default config;