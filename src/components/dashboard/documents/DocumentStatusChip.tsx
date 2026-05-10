"use client";

import { DocStatus } from "@/types/documents";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<DocStatus, { color: string; bg: string }> = {
  Draft: { color: "text-text-muted", bg: "bg-white/5" },
  "Under Review": { color: "text-amber-400", bg: "bg-amber-400/10" },
  Approved: { color: "text-blue-400", bg: "bg-blue-400/10" },
  Signed: { color: "text-success", bg: "bg-success/10" },
};

export function DocumentStatusChip({ status }: { status: DocStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-current/20",
        config.color,
        config.bg
      )}
    >
      {status}
    </div>
  );
}
