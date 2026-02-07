export const colors = {
  light: {
    background: "#FAFAF9",
    surface: "#FFFFFF",
    textPrimary: "#1A1918",
    textSecondary: "#94918A",
    border: "#e5e3deff",
    destructive: "#E63946",
  },
  dark: {
    background: "#121211",
    surface: "#1E1E1C",
    textPrimary: "#FAFAF9",
    textSecondary: "#8A8983",
    border: "#2E2E2B",
    destructive: "#E63946",
  },
} as const;

export type ThemeColor = typeof colors.light | typeof colors.dark;

export const fonts = {
  mono: "SpaceMono_700Bold",
  sans: "DMSans_400Regular",
  sansMedium: "DMSans_500Medium",
  sansSemiBold: "DMSans_600SemiBold",
} as const;

export type ThemeFont = typeof fonts;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export type ThemeSpacing = typeof spacing;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export type ThemeRadii = typeof radii;

export const statusColors = {
  running: "#2A9D8F",
  paused: "#F4A261",
} as const;

export type StatusColors = typeof statusColors;
