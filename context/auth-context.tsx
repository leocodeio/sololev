import * as WebBrowser from "expo-web-browser";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Ensure WebBrowser sessions complete properly
WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // TODO: Check stored token and validate with API
      // For now, just set loading to false
      setIsLoading(false);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

      // TODO: Replace with your actual API URL
      const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

      // Open Google OAuth in browser
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/api/auth/google`,
        "sololev://auth/callback"
      );

      if (result.type === "success" && result.url) {
        // Extract token from callback URL
        const url = new URL(result.url);
        const token = url.searchParams.get("token");

        if (token) {
          // TODO: Store token and fetch user data
          // For now, simulate a successful login
          setUser({
            id: "1",
            name: "Hunter",
            email: "hunter@sololev.app",
          });
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      // TODO: Call logout API and clear stored token
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
