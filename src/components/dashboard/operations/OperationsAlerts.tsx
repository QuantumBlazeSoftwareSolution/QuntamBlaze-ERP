"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { MOCK_OPERATION_ALERTS } from "@/lib/mockData/operations";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const alertConfig = {
  info: { icon: Info, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  warning: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  critical: { icon: ShieldAlert, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" }
};

export function OperationsAlerts() {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-divider bg-page-bg flex items-center justify-between shrink-0">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warning" />
          Active Incidents
        </h3>
        <span className="px-2 py-0.5 rounded-full bg-danger/10 border border-danger/20 text-danger text-[9px] font-bold tracking-widest">
          {MOCK_OPERATION_ALERTS.filter(a => !a.resolved).length} OPEN
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">
        {MOCK_OPERATION_ALERTS.map((alert, index) => {
          const config = alertConfig[alert.type];
          const Icon = alert.resolved ? CheckCircle : config.icon;
          const isResolved = alert.resolved;

          return (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-lg border transition-all relative overflow-hidden",
                isResolved 
                  ? "bg-page-bg/50 border-divider opacity-75" 
                  : cn("bg-white shadow-sm hover:shadow-md", config.border)
              )}
            >
              {/* Left accent bar for unresolved alerts */}
              {!isResolved && (
                <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.bg.replace('/10', ''))} />
              )}
              
              <div className="flex gap-3 relative z-10">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                  isResolved ? "bg-success/10 text-success border-success/20" : cn(config.bg, config.color, config.border)
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      {alert.id}
                    </span>
                    <span className="text-[10px] font-semibold text-text-secondary">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm", 
                    isResolved ? "text-text-secondary line-through decoration-text-muted/50" : "text-text-primary font-medium"
                  )}>
                    {alert.message}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-divider bg-page-bg shrink-0">
        <button className="w-full py-2 border border-border bg-white rounded-lg text-xs font-bold text-text-primary hover:bg-page-bg hover:text-accent transition-all uppercase tracking-widest">
          Acknowledge All
        </button>
      </div>
    </div>
  );
}
