import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserIDPreviewProps {
  userId: string | null;
}

export const UserIDPreview = ({ userId }: UserIDPreviewProps) => {
  return (
    <AnimatePresence>
      {userId && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-xs">Your assigned User ID:</span>
            <div className="bg-accent-light border border-accent-border text-accent-text font-mono text-sm px-3 py-1 rounded-md">
              {userId}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
