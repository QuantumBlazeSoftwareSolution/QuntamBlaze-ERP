"use client";

import { Search } from "lucide-react";
import { useSearchOverlay } from "@/hooks/useSearchOverlay";

export function GlobalSearchBar() {
  const { open } = useSearchOverlay();

  return (
    <div className="relative w-full max-w-lg hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
      <input
        type="text"
        placeholder="Search any ID — PRJ, CLI, INV, TSK..."
        className="w-full bg-transparent border-0 border-b border-border focus:border-accent focus:ring-0 focus:outline-none pl-10 py-2 font-mono text-[13px] transition-colors focus:shadow-[0_1px_0_0_#10B981] placeholder:text-text-muted text-text-primary"
        onFocus={(e) => {
          e.target.blur(); // Prevent actual focus, trigger overlay
          open();
        }}
        onClick={open}
        readOnly // Makes it act more like a button until we build the full combobox
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50 pointer-events-none">
        <kbd className="px-1.5 py-0.5 bg-divider rounded text-[10px] font-mono border border-border">
          Ctrl
        </kbd>
        <span className="text-xs">+</span>
        <kbd className="px-1.5 py-0.5 bg-divider rounded text-[10px] font-mono border border-border">
          K
        </kbd>
      </div>
    </div>
  );
}
