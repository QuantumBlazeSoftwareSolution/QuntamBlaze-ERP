"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";
import { LinkedDocument } from "@/types/project";
import { IDChip } from "@/components/ui/IDChip";

interface LinkedDocumentsPanelProps {
  documents: LinkedDocument[];
}

const TYPE_ICON_COLOR: Record<LinkedDocument["type"], string> = {
  proposal: "text-accent",
  agreement: "text-warning",
  srs: "text-success",
};

export function LinkedDocumentsPanel({ documents }: LinkedDocumentsPanelProps) {
  const [isOpen, setIsOpen] = useState(true);


  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-border hover:bg-bg-surface transition-colors"
      >
        <span className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase flex items-center gap-2">
          Primary References
        </span>
        <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        </motion.div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-bg-surface border border-border rounded-lg hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer group"
                  onClick={() =>
                    console.log(`Navigate to document ${doc.id}`)
                  }
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`w-4 h-4 flex-shrink-0 ${TYPE_ICON_COLOR[doc.type]}`} />
                    <div>
                      <IDChip
                        id={doc.id}
                        className="mb-0.5 px-1 py-0 text-[10px] bg-transparent border-none shadow-none"
                      />
                      <div className="text-sm text-text-primary">{doc.label}</div>
                    </div>
                  </div>
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
