/**
 * Global Constants for Quantum Blaze ERP
 * Defined as requested in the task prompt.
 */
export const theme = {
  colors: {
    sidebar: {
      bg: "#0F0F0F",
      border: "#1C1C1C",
      text: "#6B7280",
      textActive: "#FFFFFF",
      itemActive: "#1C1C1C",
      accent: "#10B981",
    },
    page: {
      bg: "#F8FAFC",
      surface: "#FFFFFF",
      border: "#E2E8F0",
      borderHover: "#CBD5E1",
      textPrimary: "#0F172A",
      textSecondary: "#475569",
      textMuted: "#94A3B8",
      divider: "#F1F5F9",
    },
    accent: {
      DEFAULT: "#10B981",
      hover: "#059669",
      light: "#ECFDF5",
      border: "#A7F3D0",
      text: "#065F46",
    },
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      danger: "#EF4444",
      info: "#3B82F6",
      successBg: "#ECFDF5",
      warningBg: "#FFFBEB",
      dangerBg: "#FEF2F2",
      infoBg: "#EFF6FF",
    },
  },
  typography: {
    font: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
} as const;

export type Theme = typeof theme;
