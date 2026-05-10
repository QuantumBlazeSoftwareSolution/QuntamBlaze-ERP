"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface HRStatTileProps {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: "up" | "down";
  icon: string;
  colorFamily: string;
  index: number;
}

const colorMap: Record<string, string> = {
  teal: "text-teal-600 bg-teal-50",
  blue: "text-blue-600 bg-blue-50",
  violet: "text-violet-600 bg-violet-50",
  green: "text-green-600 bg-green-50",
  amber: "text-amber-600 bg-amber-50",
  red: "text-red-600 bg-red-50",
};

export function HRStatTile({ label, value, trend, trendType, icon, colorFamily, index }: HRStatTileProps) {
  const Icon = (LucideIcons as any)[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:shadow-md transition-shadow"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorMap[colorFamily] || "text-gray-600 bg-gray-50")}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      
      <div className="mt-3">
        <h3 className="text-[#0F172A] text-2xl font-bold">{value}</h3>
        <p className="text-[#475569] text-sm mt-1">{label}</p>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trendType === "up" ? (
            <LucideIcons.TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
          ) : (
            <LucideIcons.TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />
          )}
          <span className={cn(
            "text-xs font-medium",
            trendType === "up" ? "text-[#10B981]" : "text-[#EF4444]"
          )}>
            {trend}
          </span>
        </div>
      )}
    </motion.div>
  );
}
