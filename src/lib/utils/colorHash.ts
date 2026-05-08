const ACCENT_COLORS = [
  "#00E5FF", // Cyan
  "#00C896", // Green
  "#FFB800", // Gold
  "#FF4444", // Red
  "#B800FF", // Purple
  "#FF8A00", // Orange
  "#00FFC2", // Teal
  "#0085FF", // Blue
];

/**
 * Generates a consistent color from a string.
 * Used for avatars and branding.
 */
export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % ACCENT_COLORS.length;
  return ACCENT_COLORS[index];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
