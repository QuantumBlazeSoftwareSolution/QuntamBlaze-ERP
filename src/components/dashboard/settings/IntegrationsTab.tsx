"use client";

import { motion } from "framer-motion";
import { MessageSquare, HardDrive, Mail, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
  {
    id: "slack",
    name: "Slack",
    description: "Receive real-time system alerts and activity updates in your channels.",
    icon: MessageSquare,
    status: "Connected",
    color: "text-purple-500",
  },
  {
    id: "gdrive",
    name: "Google Drive",
    description: "Auto-sync all generated agreements and proposals to your cloud storage.",
    icon: HardDrive,
    status: "Not Connected",
    color: "text-blue-500",
  },
  {
    id: "gmail",
    name: "Gmail SMTP",
    description: "Send outbound invoices and reports using your corporate SMTP server.",
    icon: Mail,
    status: "Connected",
    color: "text-amber-500",
  },
];

export function IntegrationsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {INTEGRATIONS.map((integration) => (
        <motion.div
          key={integration.id}
          whileHover={{ y: -4 }}
          className="bg-white border border-border rounded-2xl p-6 flex flex-col justify-between group hover:border-accent/30 transition-all shadow-sm hover:shadow-md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div
                className={cn("p-3 rounded-xl bg-page-bg border border-border", integration.color)}
              >
                <integration.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    integration.status === "Connected" ? "bg-success" : "bg-text-muted"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    integration.status === "Connected" ? "text-success" : "text-text-muted"
                  )}
                >
                  {integration.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-text-primary mb-1">{integration.name}</h4>
              <p className="text-[12px] text-text-muted leading-relaxed">
                {integration.description}
              </p>
            </div>
          </div>

          <button className="mt-8 flex items-center justify-between w-full p-4 rounded-xl bg-page-bg border border-divider group-hover:border-accent/50 transition-all">
            <span className="text-[12px] font-bold text-text-secondary group-hover:text-text-primary">
              CONFIGURE HUB
            </span>
            <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent" />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
