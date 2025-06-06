import { supabase } from '../lib/supabase_client';

export class AuthTokenManager {
  private static instance: AuthTokenManager;
  private currentToken: string | null = null;
  private tokenExpiry: number | null = null;

  private constructor() {}

  // Singleton pattern to ensure only one instance
  public static getInstance(): AuthTokenManager {
    if (!AuthTokenManager.instance) {
      AuthTokenManager.instance = new AuthTokenManager();
    }
    return AuthTokenManager.instance;
  }

  /**
   * Get the current access token
   * @returns Promise<string | null> - The access token or null if not authenticated
   */
  public async getToken(): Promise<string | null> {
    try {
      // Check if we have a cached token that's still valid
      if (this.currentToken && this.isTokenValid()) {
        return this.currentToken;
      }

      // Fetch fresh token from Supabase
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error:', sessionError);
        this.clearToken();
        return null;
      }

      if (!session) {
        console.warn('No active session found');
        this.clearToken();
        return null;
      }

      // Cache the token and its expiry
      this.currentToken = session.access_token;
      this.tokenExpiry = session.expires_at ? session.expires_at * 1000 : null;

      return this.currentToken;
    } catch (error) {
      console.error('Error getting token:', error);
      this.clearToken();
      return null;
    }
  }

  /**
   * Get token with Bearer prefix for Authorization headers
   * @returns Promise<string | null> - "Bearer <token>" or null
   */
  public async getBearerToken(): Promise<string | null> {
    const token = await this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  /**
   * Check if the current user is authenticated
   * @returns Promise<boolean>
   */
  public async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  /**
   * Refresh the token by forcing a new fetch
   * @returns Promise<string | null>
   */
  public async refreshToken(): Promise<string | null> {
    this.clearToken();
    return this.getToken();
  }

  /**
   * Get user information from the current session
   * @returns Promise<User | null>
   */
  public async getCurrentUser() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        return null;
      }

      return session.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Create headers with authentication for API requests
   * @returns Promise<Record<string, string>>
   */
  public async getAuthHeaders(): Promise<Record<string, string>> {
    const bearerToken = await this.getBearerToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (bearerToken) {
      headers['Authorization'] = bearerToken;
    }

    return headers;
  }

  /**
   * Sign out and clear cached token
   */
  public async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.clearToken();
    } catch (error) {
      console.error('Error signing out:', error);
      this.clearToken();
    }
  }

  /**
   * Clear cached token data
   */
  private clearToken(): void {
    this.currentToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Check if the cached token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.tokenExpiry) {
      return false;
    }
    
    // Add 30 second buffer before expiry
    const bufferTime = 30 * 1000;
    return Date.now() < (this.tokenExpiry - bufferTime);
  }
}

// Export a singleton instance for easy use
export const authTokenManager = AuthTokenManager.getInstance();