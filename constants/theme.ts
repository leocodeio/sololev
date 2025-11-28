/**
 * Solo Leveling Theme
 * Inspired by the Solo Leveling anime aesthetic
 * Dark, mysterious purple/blue tones with glowing accents
 */

import { Platform } from "react-native";

// Solo Leveling Color Palette
export const SoloLevelingPalette = {
  // Primary - Deep purple/violet (main accent)
  primary: "#A480F2",
  primaryDark: "#8B5CF6",
  primaryLight: "#C4A7FF",

  // Secondary - Electric blue (system UI, skills)
  secondary: "#445EF2",
  secondaryDark: "#3449DB",
  secondaryLight: "#6B7FFF",

  // Neutral/Background - Dark mysterious tones
  backgroundDark: "#221426", // Darkest - main background
  backgroundMid: "#1D1340", // Mid - cards, modals
  backgroundLight: "#2D1F4A", // Lighter - elevated surfaces

  // Text & UI
  textPrimary: "#F2F2F2", // Main text
  textSecondary: "#B8B8B8", // Muted text
  textMuted: "#6B6B6B", // Disabled/hint text

  // Status colors (game-like)
  success: "#22C55E", // Quest complete, level up
  warning: "#F59E0B", // Caution, streak warning
  danger: "#EF4444", // Streak lost, error
  info: "#445EF2", // Info, notifications

  // Special effects
  glow: "#A480F2", // Purple glow effect
  shadow: "rgba(164, 128, 242, 0.3)", // Purple shadow
};

export const Colors = {
  light: {
    text: SoloLevelingPalette.backgroundDark,
    background: SoloLevelingPalette.textPrimary,
    tint: SoloLevelingPalette.primary,
    icon: SoloLevelingPalette.backgroundMid,
    tabIconDefault: SoloLevelingPalette.textMuted,
    tabIconSelected: SoloLevelingPalette.primary,
    card: "#FFFFFF",
    border: "#E5E5E5",
  },
  dark: {
    text: SoloLevelingPalette.textPrimary,
    background: SoloLevelingPalette.backgroundDark,
    tint: SoloLevelingPalette.primary,
    icon: SoloLevelingPalette.textSecondary,
    tabIconDefault: SoloLevelingPalette.textMuted,
    tabIconSelected: SoloLevelingPalette.primary,
    card: SoloLevelingPalette.backgroundMid,
    border: SoloLevelingPalette.backgroundLight,
  },
};

/**
 * Solo Leveling Font Recommendations
 *
 * For the authentic Solo Leveling anime aesthetic, use these Google Fonts:
 *
 * TITLES (Level displays, headers, "ARISE"):
 * - Orbitron: Futuristic, geometric, perfect for level numbers & system text
 * - Rajdhani: Sharp, angular, great for quest titles & bold headers
 *
 * BODY TEXT (Tasks, descriptions):
 * - Inter: Clean, readable, modern sans-serif
 * - Exo 2: Slightly techy feel while staying readable
 *
 * SPECIAL (Ranks, achievements):
 * - Bebas Neue: Bold condensed, great for "S-RANK", "HUNTER"
 *
 * Install with expo:
 * npx expo install expo-font @expo-google-fonts/orbitron @expo-google-fonts/rajdhani @expo-google-fonts/inter @expo-google-fonts/bebas-neue
 */

// Font family names for use with expo-google-fonts
export const SoloLevelingFonts = {
  // Titles - futuristic, system-like (level displays, "ARISE", main headers)
  title: "Orbitron",
  titleBold: "Orbitron_700Bold",
  titleBlack: "Orbitron_900Black",

  // Headers - sharp, angular (quest names, section headers)
  header: "Rajdhani",
  headerMedium: "Rajdhani_500Medium",
  headerBold: "Rajdhani_700Bold",

  // Body - clean, readable (task descriptions, general text)
  body: "Inter",
  bodyRegular: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",

  // Special - condensed bold (ranks like "S-RANK", "HUNTER", achievements)
  special: "BebasNeue",
  specialRegular: "BebasNeue_400Regular",
};

// Typography scale for consistent sizing
export const Typography = {
  // Display - for level numbers, big announcements
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontFamily: SoloLevelingFonts.titleBlack,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontFamily: SoloLevelingFonts.titleBold,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontFamily: SoloLevelingFonts.title,
  },

  // Headlines - for section titles
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: SoloLevelingFonts.headerBold,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: SoloLevelingFonts.headerMedium,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: SoloLevelingFonts.header,
  },

  // Title - for card titles, list items
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: SoloLevelingFonts.bodySemiBold,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: SoloLevelingFonts.bodyMedium,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: SoloLevelingFonts.bodyMedium,
  },

  // Body - for regular text
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: SoloLevelingFonts.bodyRegular,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: SoloLevelingFonts.bodyRegular,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: SoloLevelingFonts.bodyRegular,
  },

  // Label - for buttons, badges
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: SoloLevelingFonts.bodyMedium,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: SoloLevelingFonts.bodyMedium,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: SoloLevelingFonts.bodyMedium,
  },

  // Special - for ranks and achievements
  rank: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: SoloLevelingFonts.specialRegular,
    letterSpacing: 2,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
