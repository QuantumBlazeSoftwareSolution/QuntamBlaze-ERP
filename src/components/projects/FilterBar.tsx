"use client";

import { ChevronDown } from "lucide-react";
import { ProjectStatus } from "@/types/project";

const STATUS_OPTIONS: ProjectStatus[] = ["Active", "On-Hold", "Completed", "Planning", "Cancelled"];
const CLIENT_OPTIONS = [
  { id: "CLI-GOOG-01", label: "Google" },
  { id: "CLI-AMZN-04", label: "Amazon" },
  { id: "CLI-MSFT-09", label: "Microsoft" },
  { id: "CLI-AAPL-02", label: "Meta" },
];

interface FilterBarProps {
  onStatusChange: (status: string) => void;
  onClientChange: (clientId: string) => void;
  activeStatus: string;
  activeClient: string;
}

export function FilterBar({
  onStatusChange,
  onClientChange,
  activeStatus,
  activeClient,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status Filter */}
      <div className="relative">
        <select
          value={activeStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none bg-white border border-border rounded-lg px-4 py-2 pr-8 text-[13px] text-text-secondary hover:border-border-hover focus:outline-none focus:border-accent cursor-pointer transition-colors"
        >
          <option value="">Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
      </div>

      {/* Client Filter */}
      <div className="relative">
        <select
          value={activeClient}
          onChange={(e) => onClientChange(e.target.value)}
          className="appearance-none bg-white border border-border rounded-lg px-4 py-2 pr-8 text-[13px] text-text-secondary hover:border-border-hover focus:outline-none focus:border-accent cursor-pointer transition-colors"
        >
          <option value="">Client</option>
          {CLIENT_OPTIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none" />
      </div>
    </div>
  );
}
