"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskDescriptionProps {
  description: string;
  onUpdate: (value: string) => void;
}

export function TaskDescription({ description, onUpdate }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(description);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== description) {
      onUpdate(tempValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">Description</label>
      <div 
        className="group relative min-h-[100px]"
        onDoubleClick={() => setIsEditing(true)}
      >
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.textarea
              key="edit"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              autoFocus
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-[#0F0F0F] border border-accent/30 rounded-lg p-4 text-sm text-text-primary focus:outline-none focus:border-accent min-h-[120px] resize-none leading-relaxed"
            />
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-lg bg-[#0F0F0F]/50 border border-transparent hover:border-[#1A1A1A] transition-all cursor-text leading-relaxed text-sm text-text-secondary"
            >
              {description || <span className="italic text-text-secondary/40">No description provided. Double-click to edit.</span>}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-text-secondary uppercase tracking-widest font-bold">
                Double-click to edit
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
