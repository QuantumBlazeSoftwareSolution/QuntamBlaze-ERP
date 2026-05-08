"use client";

import { useState, useMemo, Suspense } from "react";
import { LeadListPanel } from "@/components/dashboard/leads/LeadListPanel";
import { LeadDetailPanel } from "@/components/dashboard/leads/LeadDetailPanel";
import { ConvertToClientModal } from "@/components/dashboard/leads/ConvertToClientModal";
import { MOCK_LEADS } from "@/lib/mockData/leads";
import { useLeadSelection } from "@/hooks/useLeadSelection";
import { useNotificationsStore } from "@/store/notificationsStore";
import { Lead } from "@/types/lead";

function LeadsPageContent() {
  const { selectedLeadId, setSelectedLeadId } = useLeadSelection();
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const addNotification = useNotificationsStore((state) => state.addNotification);

  const selectedLead = useMemo(() => 
    MOCK_LEADS.find((l) => l.id === selectedLeadId) || null,
    [selectedLeadId]
  );

  const handleConvertConfirm = (data: any) => {
    setIsConvertModalOpen(false);
    
    // Add success notification
    addNotification({
      id: `notif-${Date.now()}`,
      type: "lead",
      entityId: selectedLead?.id || "",
      message: `${selectedLead?.id} was successfully converted to ${data.id}`,
      timestamp: new Date().toISOString(),
      read: false,
      group: "today"
    });
  };

  return (
    <div className="fixed inset-0 pt-16 md:pl-64 grid grid-cols-1 md:grid-cols-[40%_60%] overflow-hidden bg-bg-primary">
      {/* 40% Left Panel */}
      <div className="h-full border-r border-border overflow-hidden">
        <LeadListPanel
          leads={MOCK_LEADS}
          selectedLeadId={selectedLeadId}
          onSelectLead={setSelectedLeadId}
        />
      </div>

      {/* 60% Right Panel */}
      <div className="h-full bg-bg-primary overflow-hidden">
        <LeadDetailPanel
          lead={selectedLead}
          onConvert={() => setIsConvertModalOpen(true)}
        />
      </div>

      {/* Conversion Modal */}
      {selectedLead && (
        <ConvertToClientModal
          isOpen={isConvertModalOpen}
          onClose={() => setIsConvertModalOpen(false)}
          lead={selectedLead}
          onConfirm={handleConvertConfirm}
        />
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 pt-16 md:pl-64 flex items-center justify-center bg-bg-primary text-text-muted">Loading leads...</div>}>
      <LeadsPageContent />
    </Suspense>
  );
}
