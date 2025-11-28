import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { SoloLevelingPalette } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Custom dark theme with Solo Leveling colors
const SoloLevelingDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: SoloLevelingPalette.primary,
    background: SoloLevelingPalette.backgroundDark,
    card: SoloLevelingPalette.backgroundMid,
    text: SoloLevelingPalette.textPrimary,
    border: SoloLevelingPalette.backgroundLight,
  },
};

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login";
    const inAuthCallback = segments[0] === "auth"; // Don't redirect during auth callback

    // Skip redirect logic if we're in the auth callback flow
    if (inAuthCallback) return;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and on login page
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? SoloLevelingDarkTheme : DefaultTheme}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
