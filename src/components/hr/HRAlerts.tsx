"use client";

import { MOCK_HR_ALERTS } from "@/lib/mockData/hr";
import { AlertCircle } from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";

const colorClasses: any = {
  amber: "border-amber-400 bg-amber-50/30 text-amber-900",
  blue: "border-blue-400 bg-blue-50/30 text-blue-900",
  red: "border-red-400 bg-red-50/30 text-red-900",
  orange: "border-orange-400 bg-orange-50/30 text-orange-900",
};

export function HRAlerts() {
  return (
    <div className="space-y-3 mb-6">
      {MOCK_HR_ALERTS.map((alert) => (
        <div
          key={alert.id}
          className={cn(
            "border-l-4 rounded-r-xl p-4 flex items-start gap-3 shadow-sm",
            colorClasses[alert.color]
          )}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">
              {alert.message
                .split(" ")
                .map((word, i) =>
                  word === alert.entityId ? (
                    <IDChip key={i} id={word} size="xs" variant="accent" className="mx-1" />
                  ) : (
                    word + " "
                  )
                )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
