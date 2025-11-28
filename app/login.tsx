import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { SoloLevelingPalette } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, isLoading } = useAuth();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Multi-layer background gradient for depth */}
      <LinearGradient
        colors={["#0a0a12", "#1a1030", "#0d0d18", "#0a0a12"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.3, 0.7, 1]}
      />

      {/* Animated glow orbs */}
      <View style={styles.glowOrb1} />
      <View style={styles.glowOrb2} />

      {/* Top decorative lines - system UI feel */}
      <View style={styles.topDecoration}>
        <View style={styles.cornerLine} />
        <View style={styles.cornerLineVertical} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* System notification style badge */}
        <View style={styles.systemBadge}>
          <View style={styles.systemBadgeDot} />
          <ThemedText style={styles.systemBadgeText}>
            SYSTEM NOTIFICATION
          </ThemedText>
        </View>

        {/* Main Title with glow */}
        <View style={styles.titleWrapper}>
          <View style={styles.titleGlow} />
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>SOLOLEV</ThemedText>
          </View>
        </View>

        {/* Tagline */}
        <ThemedText style={styles.tagline}>"I alone level up."</ThemedText>

        {/* Decorative separator */}
        <View style={styles.separator}>
          <View style={styles.separatorWing} />
          <View style={styles.separatorCenter}>
            <View style={styles.separatorDiamond} />
          </View>
          <View style={styles.separatorWing} />
        </View>

        {/* Quest text */}
        <View style={styles.questContainer}>
          <ThemedText style={styles.questLabel}>[ DAILY QUEST ]</ThemedText>
          <ThemedText style={styles.questText}>Complete your tasks.</ThemedText>
          <ThemedText style={styles.questText}>
            Maintain your streak.
          </ThemedText>
          <ThemedText style={styles.questText}>
            <ThemedText style={styles.questHighlight}>ARISE</ThemedText> through
            the ranks.
          </ThemedText>
        </View>

        {/* Level indicator */}
        <View style={styles.levelIndicator}>
          <View style={styles.levelBorder}>
            <ThemedText style={styles.levelLabel}>LV</ThemedText>
            <ThemedText style={styles.levelNumber}>1</ThemedText>
          </View>
          <View style={styles.xpBar}>
            <View style={styles.xpFill} />
          </View>
          <ThemedText style={styles.xpText}>0 / 7 DAYS</ThemedText>
        </View>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Sign in button - styled like a system prompt */}
        <View style={styles.promptContainer}>
          <ThemedText style={styles.promptText}>
            [ HUNTER AUTHENTICATION REQUIRED ]
          </ThemedText>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.googleButtonPressed,
          ]}
          onPress={signInWithGoogle}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[
              SoloLevelingPalette.primary,
              SoloLevelingPalette.primaryDark,
            ]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <View style={styles.googleIconContainer}>
                  <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                </View>
                <ThemedText style={styles.googleButtonText}>
                  ENTER WITH GOOGLE
                </ThemedText>
              </>
            )}
          </LinearGradient>
        </Pressable>

        <ThemedText style={styles.terms}>
          By entering, you accept the Hunter's Code
        </ThemedText>

        {/* Bottom corner decoration */}
        <View style={styles.bottomDecoration}>
          <View style={styles.cornerLineBottom} />
          <View style={styles.cornerLineVerticalBottom} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a12",
  },
  // Glow orbs for atmosphere
  glowOrb1: {
    position: "absolute",
    top: "20%",
    left: "50%",
    marginLeft: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.08,
    shadowColor: SoloLevelingPalette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 100,
  },
  glowOrb2: {
    position: "absolute",
    top: "60%",
    left: "50%",
    marginLeft: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: SoloLevelingPalette.secondary,
    opacity: 0.05,
    shadowColor: SoloLevelingPalette.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 80,
  },
  // Top corner decoration
  topDecoration: {
    position: "absolute",
    top: 60,
    left: 24,
  },
  cornerLine: {
    width: 40,
    height: 2,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.6,
  },
  cornerLineVertical: {
    width: 2,
    height: 40,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.6,
  },
  // Main content
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  // System badge
  systemBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(164, 128, 242, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(164, 128, 242, 0.3)",
    marginBottom: 32,
  },
  systemBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SoloLevelingPalette.primary,
    marginRight: 10,
  },
  systemBadgeText: {
    fontSize: 11,
    color: SoloLevelingPalette.primary,
    letterSpacing: 3,
    fontWeight: "600",
  },
  // Title
  titleWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingVertical: 12,
  },
  titleGlow: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.8,
    height: 110,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.12,
    borderRadius: 60,
    shadowColor: SoloLevelingPalette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    paddingVertical: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: SoloLevelingPalette.textPrimary,
    letterSpacing: 12,
    marginVertical: 20,
  },
  tagline: {
    fontSize: 16,
    fontStyle: "italic",
    color: SoloLevelingPalette.textSecondary,
    marginTop: 16,
    letterSpacing: 4,
  },
  // Separator
  separator: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    marginVertical: 32,
  },
  separatorWing: {
    flex: 1,
    height: 1,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.4,
  },
  separatorCenter: {
    paddingHorizontal: 16,
  },
  separatorDiamond: {
    width: 10,
    height: 10,
    backgroundColor: SoloLevelingPalette.primary,
    transform: [{ rotate: "45deg" }],
    shadowColor: SoloLevelingPalette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  // Quest container
  questContainer: {
    alignItems: "center",
  },
  questLabel: {
    fontSize: 12,
    color: SoloLevelingPalette.secondary,
    letterSpacing: 4,
    marginBottom: 12,
    fontWeight: "600",
  },
  questText: {
    fontSize: 15,
    color: SoloLevelingPalette.textSecondary,
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: 1,
  },
  questHighlight: {
    color: SoloLevelingPalette.primary,
    fontWeight: "700",
  },
  // Level indicator
  levelIndicator: {
    alignItems: "center",
    marginTop: 40,
  },
  levelBorder: {
    flexDirection: "row",
    alignItems: "baseline",
    borderWidth: 2,
    borderColor: SoloLevelingPalette.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "rgba(164, 128, 242, 0.1)",
  },
  levelLabel: {
    fontSize: 14,
    color: SoloLevelingPalette.textSecondary,
    marginRight: 4,
    fontWeight: "600",
  },
  levelNumber: {
    fontSize: 28,
    fontWeight: "900",
    color: SoloLevelingPalette.primary,
  },
  xpBar: {
    width: 120,
    height: 4,
    backgroundColor: "rgba(164, 128, 242, 0.2)",
    marginTop: 12,
    borderRadius: 2,
    overflow: "hidden",
  },
  xpFill: {
    width: "0%",
    height: "100%",
    backgroundColor: SoloLevelingPalette.primary,
  },
  xpText: {
    fontSize: 10,
    color: SoloLevelingPalette.textMuted,
    marginTop: 6,
    letterSpacing: 2,
  },
  // Bottom section
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  promptContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  promptText: {
    fontSize: 11,
    color: SoloLevelingPalette.textMuted,
    letterSpacing: 2,
  },
  googleButton: {
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: SoloLevelingPalette.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  googleButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  googleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 3,
  },
  terms: {
    fontSize: 11,
    color: SoloLevelingPalette.textMuted,
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 1,
  },
  // Bottom corner decoration
  bottomDecoration: {
    position: "absolute",
    bottom: 32,
    right: 32,
    alignItems: "flex-end",
  },
  cornerLineBottom: {
    width: 40,
    height: 2,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.6,
  },
  cornerLineVerticalBottom: {
    width: 2,
    height: 40,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.6,
    marginTop: -2,
    alignSelf: "flex-end",
  },
});
