import { storeToken, verifyToken } from "@/server/auth";
import { sessionManager } from "@/server/session";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { SoloLevelingPalette } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";

// Dismiss the browser when this screen loads (handles deep link from OAuth)
WebBrowser.maybeCompleteAuthSession();

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const params = useLocalSearchParams<{ token?: string; error?: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      console.log("🔐 Auth callback received");
      console.log("📝 Params:", params);

      // Check for error from OAuth
      if (params.error) {
        console.error("❌ OAuth error:", params.error);
        setStatus("error");
        setMessage(`Authentication failed: ${params.error}`);

        // Redirect to login after showing error
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
        return;
      }

      // Check for token
      const token = params.token;
      if (!token) {
        console.error("❌ No token in callback");
        setStatus("error");
        setMessage("No authentication token received");

        setTimeout(() => {
          router.replace("/login");
        }, 2000);
        return;
      }

      console.log("🔑 Token received, storing...");
      setMessage("Verifying your account...");

      // Store the token
      await storeToken(token);

      // Verify and get user data
      const userData = await verifyToken();

      if (userData) {
        console.log("✅ User verified:", userData.email);

        // Store session
        await sessionManager.setSession(token, userData);

        // Refresh auth context to update user state
        await refreshUser();

        setStatus("success");
        setMessage(`Welcome, ${userData.name}!`);

        // Redirect to main app
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 1500);
      } else {
        console.error("❌ Failed to verify user");
        setStatus("error");
        setMessage("Failed to verify your account");

        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Auth callback error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === "loading" && (
          <>
            <ActivityIndicator
              size="large"
              color={SoloLevelingPalette.primary}
            />
            <ThemedText style={styles.loadingText}>{message}</ThemedText>
          </>
        )}

        {status === "success" && (
          <>
            <ThemedText style={styles.successIcon}>✅</ThemedText>
            <ThemedText style={styles.successText}>{message}</ThemedText>
            <ThemedText style={styles.subText}>
              Redirecting to dashboard...
            </ThemedText>
          </>
        )}

        {status === "error" && (
          <>
            <ThemedText style={styles.errorIcon}>❌</ThemedText>
            <ThemedText style={styles.errorText}>{message}</ThemedText>
            <ThemedText style={styles.subText}>
              Redirecting to login...
            </ThemedText>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoloLevelingPalette.backgroundDark,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: SoloLevelingPalette.textSecondary,
    textAlign: "center",
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: SoloLevelingPalette.success,
    textAlign: "center",
    marginBottom: 10,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: SoloLevelingPalette.danger,
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: SoloLevelingPalette.textSecondary,
    textAlign: "center",
  },
});
