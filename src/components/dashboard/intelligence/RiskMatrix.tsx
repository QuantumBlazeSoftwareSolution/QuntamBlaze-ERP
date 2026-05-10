"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from "lucide-react";
import { MOCK_RISK_FACTORS } from "@/lib/mockData/intelligence";
import { cn } from "@/lib/utils";

export function RiskMatrix() {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-divider bg-page-bg flex items-center justify-between shrink-0">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-warning" />
          Algorithmic Risk Assessment
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        {MOCK_RISK_FACTORS.map((risk, index) => {
          // Calculate overall risk score (Probability * Impact)
          const riskScore = (risk.probability * risk.impact) / 100;

          let severityColor = "text-info";
          let severityBg = "bg-info/10";
          let severityBorder = "border-info/20";

          if (riskScore > 60) {
            severityColor = "text-danger";
            severityBg = "bg-danger/10";
            severityBorder = "border-danger/20";
          } else if (riskScore > 30) {
            severityColor = "text-warning";
            severityBg = "bg-warning/10";
            severityBorder = "border-warning/20";
          }

          return (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border border-divider hover:border-accent/30 transition-all bg-white hover:bg-page-bg group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                    {risk.id} • {risk.category}
                  </span>
                  <h4 className="text-sm font-bold text-text-primary mt-1 group-hover:text-accent transition-colors">
                    {risk.name}
                  </h4>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-widest",
                    severityBg,
                    severityColor,
                    severityBorder
                  )}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {Math.round(riskScore)}/100
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    <span>Probability</span>
                    <span>{risk.probability}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-divider rounded-full overflow-hidden">
                    <div
                      className="h-full bg-text-muted transition-all"
                      style={{ width: `${risk.probability}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                    <span>Impact</span>
                    <span>{risk.impact}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-divider rounded-full overflow-hidden">
                    <div
                      className="h-full bg-text-secondary transition-all"
                      style={{ width: `${risk.impact}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
