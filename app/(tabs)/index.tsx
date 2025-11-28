import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { SoloLevelingPalette } from "@/constants/theme";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

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

      {/* Glow effect behind title */}
      <View style={styles.glowContainer}>
        <View style={styles.glow} />
      </View>

      {/* Centered content */}
      <View style={styles.content}>
        <ThemedText style={styles.title}>HOME</ThemedText>

        {/* Decorative underline */}
        <View style={styles.underline}>
          <View style={styles.underlineLeft} />
          <View style={styles.underlineDiamond} />
          <View style={styles.underlineRight} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoloLevelingPalette.backgroundDark,
  },
  glowContainer: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  glow: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.1,
    shadowColor: SoloLevelingPalette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: SoloLevelingPalette.textPrimary,
    letterSpacing: 16,
    textShadowColor: SoloLevelingPalette.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  underline: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    width: 180,
  },
  underlineLeft: {
    flex: 1,
    height: 2,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.6,
  },
  underlineDiamond: {
    width: 10,
    height: 10,
    backgroundColor: SoloLevelingPalette.primary,
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 8,
  },
  underlineRight: {
    flex: 1,
    height: 2,
    backgroundColor: SoloLevelingPalette.primary,
    opacity: 0.6,
  },
});
