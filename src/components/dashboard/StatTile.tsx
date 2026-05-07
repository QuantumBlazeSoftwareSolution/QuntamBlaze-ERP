"use client";

import { Building2, Receipt, Wallet, AlertTriangle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { StatData } from "@/lib/mockData/dashboard";

const ICON_MAP: Record<string, React.ReactNode> = {
  domain: <Building2 className="w-[18px] h-[18px]" />,
  receipt_long: <Receipt className="w-[18px] h-[18px]" />,
  account_balance: <Wallet className="w-[18px] h-[18px]" />,
  warning: <AlertTriangle className="w-[18px] h-[18px]" />,
};

export function StatTile({ stat }: { stat: StatData }) {
  const isUp = stat.trendDirection === "up";
  const isDown = stat.trendDirection === "down";

  // Determine colors based on trend or specific requirements
  let trendColor = "text-text-secondary";
  let sparklineColor = "#8A8A8A";
  
  if (isUp) {
    trendColor = "text-success";
    sparklineColor = "#00C896";
  } else if (isDown) {
    trendColor = "text-danger";
    sparklineColor = "#FF4444";
  } else if (stat.trendText.includes("Action required")) {
    trendColor = "text-warning";
    sparklineColor = "#FFB800";
  }

  // Override specific card colors as per mock
  if (stat.label === "Total Active Projects" || stat.label === "Monthly Revenue") {
    trendColor = "text-accent";
    sparklineColor = "#00E5FF";
  }

  return (
    <div className="bg-bg-card border-t border-l border-border rounded-xl p-6 relative overflow-hidden group shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
          {stat.label}
        </span>
        <span className="text-text-secondary/70">
          {ICON_MAP[stat.icon]}
        </span>
      </div>
      
      <div className="text-[28px] font-semibold text-text-primary mb-2 relative z-10">
        {stat.value}
      </div>
      
      <div className="flex items-center gap-2 relative z-10">
        <div className={`w-2 h-2 rounded-full ${isUp || stat.label === "Total Active Projects" || stat.label === "Monthly Revenue" ? "bg-accent shadow-[0_0_12px_rgba(0,229,255,0.5)]" : isDown ? "bg-danger" : "bg-warning"}`} />
        <span className={`text-[13px] font-medium tracking-tight ${trendColor}`}>
          {stat.trendText}
        </span>
      </div>

      {/* Sparkline */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 group-hover:opacity-40 transition-opacity z-0 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stat.sparkline}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={sparklineColor} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
        {/* Fade gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
      </div>
    </div>
  );
}
