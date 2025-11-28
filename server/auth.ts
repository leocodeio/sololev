import * as SecureStore from "expo-secure-store";
import axiosInstance from "./axios.instance";

export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  level: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  valid: boolean;
  user?: User;
  error?: string;
}

/**
 * Verify if the stored token is valid
 * @returns User data if valid, null otherwise
 */
export async function verifyToken(): Promise<User | null> {
  try {
    const token = await SecureStore.getItemAsync("auth_token");
    if (!token) {
      return null;
    }

    const response = await axiosInstance.get<AuthResponse>("/api/auth/verify");

    if (response.data.valid && response.data.user) {
      return response.data.user;
    }

    // Token is invalid, clear it
    await SecureStore.deleteItemAsync("auth_token");
    return null;
  } catch (error) {
    console.error("Token verification error:", error);
    // Clear invalid token
    await SecureStore.deleteItemAsync("auth_token");
    return null;
  }
}

/**
 * Store authentication token securely
 * @param token - JWT token from backend
 */
export async function storeToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync("auth_token", token);
  } catch (error) {
    console.error("Error storing token:", error);
    throw error;
  }
}

/**
 * Get stored authentication token
 * @returns Token string or null
 */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("auth_token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

/**
 * Clear stored authentication token
 */
export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync("auth_token");
  } catch (error) {
    console.error("Error clearing token:", error);
  }
}

/**
 * Logout - clear local token and invalidate on server
 */
export async function logout(): Promise<void> {
  try {
    // Call logout endpoint to invalidate session on server
    await axiosInstance.post("/api/auth/logout");
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    // Always clear local token
    await clearToken();
  }
}
