"use client";

import { motion } from "framer-motion";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[420px] bg-bg-surface border border-border rounded-xl p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm"
    >
      {/* Subtle top inner glow matching the design */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      {children}
    </motion.div>
  );
}
