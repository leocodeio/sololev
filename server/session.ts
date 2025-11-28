import type { User } from "./auth";
import { clearToken, storeToken, verifyToken } from "./auth";

/**
 * Session manager for handling user authentication state
 */
class SessionManager {
  private static instance: SessionManager;
  private user: User | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Initialize session - check for existing valid token
   */
  async initialize(): Promise<User | null> {
    if (this.isInitialized) {
      return this.user;
    }

    try {
      const user = await verifyToken();
      this.user = user;
      this.isInitialized = true;
      return user;
    } catch (error) {
      console.error("Session initialization error:", error);
      this.isInitialized = true;
      return null;
    }
  }

  /**
   * Set user and store token
   */
  async setSession(token: string, user: User): Promise<void> {
    await storeToken(token);
    this.user = user;
    this.isInitialized = true;
  }

  /**
   * Clear session
   */
  async clearSession(): Promise<void> {
    await clearToken();
    this.user = null;
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.user !== null;
  }

  /**
   * Refresh user data from server
   */
  async refreshUser(): Promise<User | null> {
    try {
      const user = await verifyToken();
      this.user = user;
      return user;
    } catch (error) {
      console.error("Error refreshing user:", error);
      return null;
    }
  }
}

export const sessionManager = SessionManager.getInstance();
