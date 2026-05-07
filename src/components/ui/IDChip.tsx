"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface IDChipProps {
  id: string;
  className?: string;
}

export function IDChip({ id, className }: IDChipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "group inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono tracking-wide transition-all",
        "bg-accent/5 border border-accent/20 text-accent hover:bg-accent/10 hover:border-accent/40",
        className
      )}
      title="Click to copy"
    >
      {id}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? (
          <Check className="w-3 h-3 text-success" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </span>
    </button>
  );
}
