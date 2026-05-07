"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export const TAB_LIST = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "timeline", label: "Timeline" },
  { id: "documents", label: "Documents" },
  { id: "financials", label: "Financials" },
  { id: "activity", label: "Activity" },
] as const;

export type TabId = (typeof TAB_LIST)[number]["id"];

interface ProjectTabsProps {
  activeTab: TabId;
  prjId: string;
  children: React.ReactNode;
}

export function ProjectTabs({ activeTab, prjId, children }: ProjectTabsProps) {
  const router = useRouter();

  const handleTabClick = (tabId: TabId) => {
    router.push(`/dashboard/projects/${prjId}?tab=${tabId}`, { scroll: false });
  };

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex border-b border-[#1A1A1A] mb-6 overflow-x-auto hide-scrollbar">
        {TAB_LIST.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
