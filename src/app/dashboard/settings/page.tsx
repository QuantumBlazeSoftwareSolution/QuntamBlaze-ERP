"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GeneralSettingsForm } from "@/components/dashboard/settings/GeneralSettingsForm";
import { IDConfigTable } from "@/components/dashboard/settings/IDConfigTable";
import { IntegrationsTab } from "@/components/dashboard/settings/IntegrationsTab";
import { AuditComplianceTab } from "@/components/dashboard/settings/AuditComplianceTab";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "general", label: "General" },
  { id: "id-config", label: "ID Configuration" },
  { id: "integrations", label: "Integrations" },
  { id: "audit", label: "Audit & Compliance" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">System Settings</h1>
        <p className="text-text-secondary text-lg">Configure global enterprise parameters, integration points, and audit protocols.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-4 text-[13px] font-bold uppercase tracking-[0.15em] relative transition-colors",
              activeTab === tab.id ? "text-accent" : "text-text-muted hover:text-text-primary"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "general" && <GeneralSettingsForm />}
        {activeTab === "id-config" && <IDConfigTable />}
        {activeTab === "integrations" && <IntegrationsTab />}
        {activeTab === "audit" && <AuditComplianceTab />}
      </motion.div>
    </div>
  );
}
