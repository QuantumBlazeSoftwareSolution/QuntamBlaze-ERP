"use client";

import { useState } from "react";
import { Table, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "table" | "card";

interface ViewToggleProps {
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ onChange }: ViewToggleProps) {
  const [view, setView] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("projects-view") as ViewMode | null;
      if (saved === "card" || saved === "table") return saved;
    }
    return "table";
  });

  const handleChange = (v: ViewMode) => {
    setView(v);
    localStorage.setItem("projects-view", v);
    onChange(v);
  };

  return (
    <div className="flex items-center gap-1 bg-bg-surface border border-border rounded-lg p-1">
      <button
        onClick={() => handleChange("table")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold tracking-[0.1em] uppercase transition-all",
          view === "table"
            ? "bg-bg-card text-text-primary shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        )}
      >
        <Table className="w-3.5 h-3.5" />
        Table
      </button>
      <button
        onClick={() => handleChange("card")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold tracking-[0.1em] uppercase transition-all",
          view === "card"
            ? "bg-bg-card text-text-primary shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        )}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        Card
      </button>
    </div>
  );
}
