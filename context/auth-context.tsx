import { logout, storeToken, verifyToken, type User } from "@/server/auth";
import { sessionManager } from "@/server/session";
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
      // Initialize session manager and check for valid token
      const user = await sessionManager.initialize();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Get API URL from environment
      const API_URL =
        process.env.EXPO_PUBLIC_API_URL || "https://sololev.vercel.app";
      console.log("🔗 Starting OAuth flow with API:", API_URL);

      // Open Google OAuth in browser
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/api/auth/google`,
        "sololev://auth/callback"
      );

      console.log("📱 Browser result:", result.type);

      if (result.type === "success" && result.url) {
        console.log("✅ OAuth success, callback URL:", result.url);

        // Extract token from callback URL
        const url = new URL(result.url);
        const token = url.searchParams.get("token");
        const error = url.searchParams.get("error");

        if (error) {
          console.error("❌ OAuth error:", error);
          throw new Error(`OAuth failed: ${error}`);
        }

        if (token) {
          console.log("🔑 Token received, storing and verifying...");

          // Store token and verify to get user data
          await storeToken(token);
          const userData = await verifyToken();

          if (userData) {
            console.log("✅ User verified:", userData.email);
            await sessionManager.setSession(token, userData);
            setUser(userData);
          } else {
            console.error("❌ Failed to verify user data");
            throw new Error("Failed to verify user");
          }
        } else {
          console.error("❌ No token in callback URL");
          throw new Error("No token received");
        }
      } else if (result.type === "cancel") {
        console.log("⚠️ User cancelled OAuth flow");
      } else {
        console.log("⚠️ OAuth result:", result.type);
      }
    } catch (error) {
      console.error("❌ Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      // Call logout API and clear session
      await logout();
      await sessionManager.clearSession();
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
