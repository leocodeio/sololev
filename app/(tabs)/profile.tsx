import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { SoloLevelingPalette } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut, isLoading } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={[
          SoloLevelingPalette.backgroundDark,
          SoloLevelingPalette.backgroundMid,
          SoloLevelingPalette.backgroundDark,
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>PROFILE</ThemedText>
        <View style={styles.headerUnderline} />
      </View>

      {/* Profile content */}
      <View style={styles.content}>
        {/* Avatar placeholder */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGlow} />
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={48}
              color={SoloLevelingPalette.primary}
            />
          </View>
        </View>

        {/* User info */}
        <ThemedText style={styles.userName}>
          {user?.name || "Hunter"}
        </ThemedText>
        <ThemedText style={styles.userEmail}>
          {user?.email || "hunter@sololev.app"}
        </ThemedText>

        {/* Stats placeholder */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>1</ThemedText>
            <ThemedText style={styles.statLabel}>Level</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Streak</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Tasks</ThemedText>
          </View>
        </View>
      </View>

      {/* Logout button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={signOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={SoloLevelingPalette.danger} />
          ) : (
            <>
              <Ionicons
                name="log-out-outline"
                size={24}
                color={SoloLevelingPalette.danger}
              />
              <ThemedText style={styles.logoutButtonText}>Sign Out</ThemedText>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoloLevelingPalette.backgroundDark,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: SoloLevelingPalette.textPrimary,
    letterSpacing: 8,
  },
  headerUnderline: {
    width: 60,
    height: 3,
    backgroundColor: SoloLevelingPalette.primary,
    marginTop: 8,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatarGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.2,
    top: -10,
    left: -10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SoloLevelingPalette.backgroundLight,
    borderWidth: 3,
    borderColor: SoloLevelingPalette.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: SoloLevelingPalette.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: SoloLevelingPalette.textMuted,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: SoloLevelingPalette.backgroundMid,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: SoloLevelingPalette.backgroundLight,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "900",
    color: SoloLevelingPalette.primary,
  },
  statLabel: {
    fontSize: 12,
    color: SoloLevelingPalette.textSecondary,
    marginTop: 4,
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: SoloLevelingPalette.backgroundLight,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: SoloLevelingPalette.danger,
  },
  logoutButtonPressed: {
    opacity: 0.7,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: SoloLevelingPalette.danger,
  },
});
