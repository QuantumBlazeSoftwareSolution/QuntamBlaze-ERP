export const INDUSTRY_COLORS: Record<string, string> = {
  Technology: "#00E5FF",
  Finance: "#FFB800",
  Healthcare: "#00C896",
  Aerospace: "#FF4444",
  Logistics: "#8A8A8A",
  Manufacturing: "#FF8A00",
  Energy: "#00FFC2",
  Education: "#B800FF",
};

export function getIndustryColor(industry: string): string {
  return INDUSTRY_COLORS[industry] || "#8A8A8A";
}
