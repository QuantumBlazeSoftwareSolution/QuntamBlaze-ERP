"use client";

import { motion } from "framer-motion";

export function LogoMark() {
  return (
    <div className="flex flex-col items-center mb-6">
      <motion.div
        animate={{
          boxShadow: [
            "0 0 10px rgba(0, 229, 255, 0.1)",
            "0 0 24px rgba(0, 229, 255, 0.3)",
            "0 0 10px rgba(0, 229, 255, 0.1)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#121414] flex items-center justify-center border-t border-l border-[#3c494e]/30 shadow-[0_0_24px_rgba(0,229,255,0.15)] mb-4 relative overflow-hidden"
      >
        {/* Subtle inner highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        {/* QB Typographic Logo */}
        <div className="flex items-center justify-center">
          <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent/60 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] tracking-tighter">
            QB
          </span>
        </div>
      </motion.div>
      <h1 className="text-2xl md:text-[28px] font-medium text-text-primary tracking-tight">
        QUANTUM BLAZE
      </h1>
      <p className="text-[11px] font-bold tracking-[0.1em] text-text-secondary mt-2 opacity-80 uppercase">
        System Access
      </p>
    </div>
  );
}
