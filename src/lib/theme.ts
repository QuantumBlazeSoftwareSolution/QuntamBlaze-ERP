/**
 * Global Constants for Quantum Blaze ERP
 * Defined as requested in the task prompt.
 */
export const theme = {
  colors: {
    bgPrimary: '#050505',
    bgSurface: '#0A0A0A',
    bgCard: '#0F0F0F',
    bgElevated: '#141414',
    border: '#1A1A1A',
    borderHover: '#252525',
    accent: '#00E5FF',
    accentDim: '#00E5FF1A', // ~10% opacity
    textPrimary: '#F0F0F0',
    textSecondary: '#8A8A8A',
    textMuted: '#3A3A3A',
    success: '#00C896',
    warning: '#FFB800',
    danger: '#FF4444',
  },
  glows: {
    accent: '0 0 20px #00E5FF33', // ~20% opacity
  },
  fonts: {
    primary: "'Inter', sans-serif",
  },
} as const;

export type Theme = typeof theme;
