export interface ForecastPoint {
  month: string;
  actual: number | null;
  predicted: number;
}

export interface RiskFactor {
  id: string;
  category: "Operational" | "Financial" | "Security";
  name: string;
  probability: number; // 0-100
  impact: number; // 0-100
  trend: "increasing" | "decreasing" | "stable";
}

export const MOCK_FORECAST_DATA: ForecastPoint[] = [
  { month: "Jan", actual: 120, predicted: 115 },
  { month: "Feb", actual: 132, predicted: 128 },
  { month: "Mar", actual: 141, predicted: 135 },
  { month: "Apr", actual: 158, predicted: 150 },
  { month: "May", actual: 162, predicted: 165 },
  { month: "Jun", actual: 180, predicted: 175 },
  { month: "Jul", actual: null, predicted: 190 },
  { month: "Aug", actual: null, predicted: 210 },
  { month: "Sep", actual: null, predicted: 225 },
];

export const MOCK_RISK_FACTORS: RiskFactor[] = [
  { id: "RSK-01", category: "Security", name: "Third-party API Vulnerability", probability: 15, impact: 85, trend: "decreasing" },
  { id: "RSK-02", category: "Financial", name: "Currency Exchange Volatility", probability: 65, impact: 40, trend: "increasing" },
  { id: "RSK-03", category: "Operational", name: "Supply Chain Disruption", probability: 30, impact: 70, trend: "stable" },
  { id: "RSK-04", category: "Security", name: "Data Center Failover Failure", probability: 5, impact: 95, trend: "stable" },
];
