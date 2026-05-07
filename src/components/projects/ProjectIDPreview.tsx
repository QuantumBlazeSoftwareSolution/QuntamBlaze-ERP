"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";

interface ProjectIDPreviewProps {
  projectId: string | null;
}

export function ProjectIDPreview({ projectId }: ProjectIDPreviewProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#00E5FF08] border border-[#00E5FF33] rounded-lg h-12">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.1em] text-[#00E5FF] uppercase">
        <Wand2 className="w-3.5 h-3.5" />
        Auto-generated ID
      </div>
      <AnimatePresence mode="wait">
        {projectId ? (
          <motion.div
            key={projectId}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <IDChip 
              id={projectId} 
              className="bg-[#00E5FF15] border-[#00E5FF44] text-[#00E5FF] font-mono text-xs py-1 px-3"
            />
          </motion.div>
        ) : (
          <span className="text-[10px] font-mono text-[#3A3A3A] italic">
            -- PENDING CLIENT SELECTION --
          </span>
        )}
      </AnimatePresence>
    </div>
  );
}
