"use client";

import { Document } from "@/types/documents";
import { IDChip } from "@/components/ui/IDChip";
import { DocumentStatusChip } from "./DocumentStatusChip";
import { FileText, ChevronRight, User } from "lucide-react";
import { useDocumentStore } from "@/store/useDocumentStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DocumentList({ documents }: { documents: Document[] }) {
  const { selectedDocumentId, setSelectedDocument } = useDocumentStore();

  return (
    <div className="flex-1 bg-page-bg overflow-y-auto custom-scrollbar">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">
            SRS Documents List
          </h2>
          <div className="flex gap-4">
            <button className="p-2 text-text-muted hover:text-accent">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>
            <button className="p-2 text-text-muted hover:text-accent">
              <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border/30">
            <div className="col-span-5">Document Name</div>
            <div className="col-span-2">Doc-ID</div>
            <div className="col-span-2">Author</div>
            <div className="col-span-2">Last Modified</div>
            <div className="col-span-1">Status</div>
          </div>

          <div className="mt-4 space-y-2">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                layoutId={doc.id}
                onClick={() => setSelectedDocument(doc.id)}
                className={cn(
                  "grid grid-cols-12 gap-4 px-6 py-5 items-center rounded-xl border transition-all cursor-pointer group",
                  selectedDocumentId === doc.id
                    ? "bg-white border-accent shadow-sm"
                    : "bg-white border-divider hover:border-accent/30 shadow-sm"
                )}
              >
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-page-bg border border-divider flex items-center justify-center">
                    <FileText className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <span className="text-[14px] font-bold text-text-primary">{doc.name}</span>
                </div>
                <div className="col-span-2">
                  <IDChip
                    id={doc.id.split("-").slice(0, 2).join("-")}
                    className="bg-transparent border-none p-0 text-text-muted font-mono"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[8px] font-bold text-accent">
                    {doc.authorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="text-[12px] text-text-secondary">{doc.authorName}</span>
                </div>
                <div className="col-span-2 text-[12px] text-text-muted font-mono">
                  {doc.lastModified}
                </div>
                <div className="col-span-1">
                  <DocumentStatusChip status={doc.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
