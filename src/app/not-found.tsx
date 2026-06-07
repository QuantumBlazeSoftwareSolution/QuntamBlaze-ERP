"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Home, MessageSquare, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0F172A] overflow-hidden font-sans select-none px-4">
      {/* Dynamic Background Glowing Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse duration-[8000ms]" />
        
        {/* Fine background grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
      </div>

      {/* Main Glassmorphic Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 shadow-[0_24px_64px_rgba(0,0,0,0.4)] p-8 md:p-12 rounded-3xl z-10 text-center relative overflow-hidden"
      >
        {/* Top visual warning shield */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 5, duration: 1.5 }}
            className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400"
          >
            <ShieldAlert className="w-8 h-8 stroke-[1.5]" />
          </motion.div>
        </div>

        {/* 404 Title */}
        <h1 className="text-8xl font-black font-outfit text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 tracking-tighter">
          404
        </h1>

        {/* Lost message */}
        <h2 className="text-xl font-bold text-slate-100 mt-4 tracking-tight">
          System Node Off-Grid
        </h2>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-md mx-auto">
          The requested coordinate endpoint is inactive or has been deprecated. Please return to the secure core grid.
        </p>

        {/* Action Panel */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-sm font-extrabold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 group"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </motion.button>
          </Link>

          <Link href="/dashboard/chat" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Workspace Chat</span>
            </motion.button>
          </Link>
        </div>

        {/* Sub-footer system identity */}
        <div className="mt-12 pt-6 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          <span>SECURE ERP COMPONENT</span>
          <span>SYS-REF: QB-404-ERR</span>
        </div>
      </motion.div>
    </div>
  );
}
