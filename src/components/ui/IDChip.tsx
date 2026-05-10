"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IDChipProps {
  id: string;
  size?: "xs" | "sm" | "md";
  variant?: "default" | "accent" | "muted";
  className?: string;
}

export const IDChip = ({ id, size = "sm", variant = "default", className = "" }: IDChipProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  const variantClasses = {
    default:
      "bg-page-bg border-border text-text-secondary hover:border-accent hover:text-accent-text",
    accent:
      "bg-accent-light border-accent-border text-accent-text hover:bg-accent hover:text-white",
    muted: "bg-divider border-border text-text-muted hover:text-text-secondary",
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-1.5 font-mono font-medium border rounded-md transition-all duration-200 group relative
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <span>{id}</span>
      <div className="relative w-3 h-3">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="w-3 h-3 text-success" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
};
