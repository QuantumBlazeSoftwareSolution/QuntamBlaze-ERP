"use client";

import { motion, AnimatePresence } from "framer-motion";

interface UserIdPreviewProps {
  userId: string;
  isVisible: boolean;
}

export function UserIdPreview({ userId, isVisible }: UserIdPreviewProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-accent/20 bg-accent/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Generated ID
            </span>
            <span className="text-sm font-mono font-medium text-accent">
              {userId}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
