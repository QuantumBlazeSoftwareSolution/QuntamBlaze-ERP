"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, ChevronDown, ChevronRight, Share2, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Employee } from "@/types/hr";

const MOCK_STRUCTURE = {
  id: "EMP-EXEC-001",
  name: "Jonathan Blaze",
  role: "CEO & Founder",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
  children: [
    {
      id: "EMP-HR-26-004",
      name: "Sarah Jenkins",
      role: "HR Manager",
      children: [{ id: "EMP-HR-26-012", name: "Elena Vance", role: "HR Specialist" }],
    },
    {
      id: "EMP-ENG-26-001",
      name: "Alex Mercer",
      role: "Senior Software Engineer",
      children: [
        { id: "EMP-ENG-26-088", name: "Marcus Thorne", role: "Junior Dev" },
        { id: "EMP-ENG-26-092", name: "Samantha Reed", role: "UI Engineer" },
      ],
    },
  ],
};

export function OrgChart() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 h-[calc(100vh-280px)] min-h-[600px] flex flex-col relative overflow-hidden">
      {/* Controls */}
      <div className="absolute top-8 right-8 z-10 flex flex-col gap-2">
        <ControlButton icon={ZoomIn} />
        <ControlButton icon={ZoomOut} />
        <div className="h-px bg-[#E2E8F0] my-1" />
        <ControlButton icon={Share2} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-12 overflow-auto scrollbar-hide">
        <OrgNode node={MOCK_STRUCTURE} isRoot />
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <LegendItem label="Leadership" color="bg-[#0F172A]" />
        <LegendItem label="Management" color="bg-blue-500" />
        <LegendItem label="Team Member" color="bg-[#10B981]" />
      </div>
    </div>
  );
}

function OrgNode({ node, isRoot }: { node: any; isRoot?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "w-56 p-4 rounded-2xl border-2 shadow-sm transition-all relative z-10",
          isRoot
            ? "bg-[#0F172A] border-[#0F172A] text-white"
            : "bg-white border-[#F1F5F9] hover:border-blue-400"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20">
            <img
              src={
                node.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
              }
              alt={node.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p
              className={cn(
                "text-xs font-black truncate max-w-[120px]",
                isRoot ? "text-white" : "text-[#0F172A]"
              )}
            >
              {node.name}
            </p>
            <p
              className={cn(
                "text-[9px] font-bold uppercase tracking-widest",
                isRoot ? "text-blue-300" : "text-[#94A3B8]"
              )}
            >
              {node.role}
            </p>
          </div>
        </div>
      </motion.div>

      {node.children && node.children.length > 0 && (
        <>
          <div className="w-0.5 h-8 bg-[#E2E8F0] relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#E2E8F0]" />
          </div>
          <div className="flex gap-8 relative">
            {/* Horizontal line */}
            {node.children.length > 1 && (
              <div className="absolute top-0 left-[28px] right-[28px] h-0.5 bg-[#E2E8F0]" />
            )}
            {node.children.map((child: any) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-[#E2E8F0]" />
                <OrgNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ControlButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="p-2 rounded-xl border border-[#E2E8F0] bg-white text-[#94A3B8] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all shadow-sm">
      <Icon className="w-4 h-4" />
    </button>
  );
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
