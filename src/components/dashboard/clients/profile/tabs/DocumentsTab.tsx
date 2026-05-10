"use client";

import { FileText, Shield, PenTool, Globe, Download, Clock, ExternalLink } from "lucide-react";
import { ClientDetail } from "@/types/client";
import { IDChip } from "@/components/ui/IDChip";
import { format } from "date-fns";

const DOC_TYPE_ICONS = {
  agreement: <Shield className="w-4 h-4 text-accent" />,
  proposal: <PenTool className="w-4 h-4 text-warning" />,
  invoice: <FileText className="w-4 h-4 text-success" />,
  srs: <Globe className="w-4 h-4 text-info" />,
};

export function DocumentsTab({ client }: { client: ClientDetail }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-5 h-5 text-accent" />
        <h2 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">
          Compliance & Documents
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {client.documents.map((doc) => (
          <div
            key={doc.id}
            className="group bg-bg-card/50 border border-border rounded-2xl p-6 flex items-center justify-between hover:bg-bg-card hover:border-accent/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-border group-hover:bg-accent/10 transition-all">
                {DOC_TYPE_ICONS[doc.type] || <FileText className="w-5 h-5 text-text-muted" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-[16px] font-bold text-text-primary group-hover:text-accent transition-colors">
                    {doc.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-accent/5 border border-accent/20 text-[10px] font-bold text-accent uppercase">
                    {doc.version}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <IDChip
                    id={doc.id}
                    className="bg-transparent border-none p-0 text-text-muted hover:text-text-secondary"
                  />
                  <div className="flex items-center gap-1.5 text-text-muted text-[12px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {format(new Date(doc.lastModified), "MMM dd, yyyy")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-white/5 border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-all">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-3 rounded-xl bg-white/5 border border-border text-text-muted hover:text-accent hover:border-accent/50 transition-all">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
