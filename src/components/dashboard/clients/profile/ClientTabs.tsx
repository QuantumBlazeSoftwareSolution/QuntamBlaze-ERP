"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Briefcase, Receipt, FileText } from "lucide-react";
import { ClientDetail } from "@/types/client";
import { OverviewTab } from "./tabs/OverviewTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { FinanceTab } from "./tabs/FinanceTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { cn } from "@/lib/utils";

interface ClientTabsProps {
  client: ClientDetail;
}

const TABS = [
  { id: "overview", label: "OVERVIEW", icon: LayoutDashboard },
  { id: "projects", label: "PROJECTS", icon: Briefcase },
  { id: "finance", label: "FINANCE", icon: Receipt },
  { id: "documents", label: "DOCUMENTS", icon: FileText },
];

export function ClientTabs({ client }: ClientTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-8">
      {/* Tab Headers */}
      <div className="flex items-center gap-12 border-b border-border mb-8 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-3 pb-4 text-[11px] font-bold tracking-[0.2em] transition-all",
                isActive ? "text-accent" : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabClient"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <OverviewTab client={client} />}
          {activeTab === "projects" && <ProjectsTab client={client} />}
          {activeTab === "finance" && <FinanceTab client={client} />}
          {activeTab === "documents" && <DocumentsTab client={client} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
