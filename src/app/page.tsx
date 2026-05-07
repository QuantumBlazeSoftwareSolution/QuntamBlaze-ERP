"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-luxury-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-full bg-luxury-dark border border-luxury-silver/20">
            <Shield className="w-12 h-12 text-luxury-silver" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-outfit text-luxury-silver">
          QUANTUM <span className="text-luxury-gold">BLAZE</span> ERP
        </h1>
        
        <p className="max-w-[600px] text-lg md:text-xl text-luxury-muted font-sans font-light">
          High-end, micro-level ERP system. 
          <br />
          Luxury Minimalist Aesthetic • Production Ready
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {[
            { icon: <Zap className="w-4 h-4" />, label: "Next.js App Router" },
            { icon: <Layers className="w-4 h-4" />, label: "Tailwind CSS" },
            { icon: <Shield className="w-4 h-4" />, label: "Framer Motion" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-dark border border-luxury-silver/10 text-sm text-luxury-silver/80"
            >
              {item.icon}
              {item.label}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 p-6 glass-morphism rounded-xl border border-luxury-silver/20 max-w-md mx-auto"
        >
          <p className="text-luxury-gold font-mono text-sm tracking-widest uppercase mb-2">
            Status: Initialized
          </p>
          <p className="text-luxury-silver font-sans">
            I am ready for Task 1 of 26. 
            <br />
            Please upload the first image and prompt.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
