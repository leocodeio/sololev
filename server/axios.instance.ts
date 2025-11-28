import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Get the API URL from environment
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://sololev.vercel.app";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds auth token to all requests
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from secure storage
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles 401 errors (invalid/expired tokens)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired - clear it
      try {
        await SecureStore.deleteItemAsync("auth_token");
      } catch (e) {
        console.error("Error clearing token:", e);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
