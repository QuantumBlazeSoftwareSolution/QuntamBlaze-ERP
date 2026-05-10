"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CommandMenu } from "./CommandMenu";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-[#0F172A]/80 backdrop-blur-md"
          onClick={onClose}
        >
          <CommandMenu onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
