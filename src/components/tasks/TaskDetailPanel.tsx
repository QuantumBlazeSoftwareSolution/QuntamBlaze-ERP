"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Pencil,
  Trash2,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  Paperclip,
  Share2,
  MoreVertical,
  ChevronRight,
  Plus,
  AlertTriangle,
  FileText,
  Calendar,
  Send,
  Link,
  ChevronDown,
} from "lucide-react";
import { useTaskPanel } from "@/hooks/useTaskPanel";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";

export function TaskDetailPanel() {
  const { selectedTaskId, closeTask } = useTaskPanel();
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details");
  const [newSubtask, setNewSubtask] = useState("");

  if (!selectedTaskId) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeTask}
        className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-[110]"
      />

      {/* Slide-over Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-[520px] bg-[#0F172A] border-l border-white/5 shadow-2xl z-[120] flex flex-col text-white"
      >
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-[#0F172A]/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <IDChip
                id={selectedTaskId}
                className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black"
              />
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                PRJ-26-005 <ChevronRight className="w-3 h-3 text-slate-600" /> CLI-GOOG-01
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-6 bg-white/5 mx-1" />
            <button
              onClick={closeTask}
              className="p-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Title Area */}
          <div className="px-8 pt-8 pb-4">
            <h2
              className="text-2xl font-black text-white leading-tight outline-none focus:text-emerald-400 transition-colors cursor-text selection:bg-emerald-500/30"
              contentEditable
              spellCheck={false}
              suppressContentEditableWarning
            >
              Cloud Infrastructure Audit & Scalability Review
            </h2>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8 mt-6 flex items-center gap-8 border-b border-white/5">
            {[
              { id: "details", label: "Task Parameters" },
              { id: "activity", label: "Activity Feed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                  activeTab === tab.id ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "details" ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 space-y-12"
              >
                {/* Parameter Grid */}
                <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                  <ParamItem label="Operational Status" icon={<CheckCircle2 />}>
                    <div className="group relative">
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black cursor-pointer hover:bg-emerald-500/20 transition-all w-full justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          IN PROGRESS
                        </div>
                        <ChevronDown className="w-3 h-3 text-emerald-500/50" />
                      </div>
                    </div>
                  </ParamItem>

                  <ParamItem label="Strategic Priority" icon={<AlertTriangle />}>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black cursor-pointer hover:bg-red-500/20 transition-all w-full justify-between">
                      CRITICAL
                      <ChevronDown className="w-3 h-3 text-red-500/50" />
                    </div>
                  </ParamItem>

                  <ParamItem label="Assigned Squad" icon={<User />}>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {["JD", "AL", "MK"].map((initials, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-7 h-7 rounded-lg border-2 border-[#0F172A] flex items-center justify-center text-[9px] font-black shadow-lg",
                              i === 0 ? "bg-emerald-500" : i === 1 ? "bg-blue-500" : "bg-violet-500"
                            )}
                          >
                            {initials}
                          </div>
                        ))}
                      </div>
                      <button className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </ParamItem>

                  <ParamItem label="Target Deadline" icon={<Calendar />}>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-xs font-bold hover:bg-white/10 transition-all cursor-pointer">
                      May 24, 2026
                    </div>
                  </ParamItem>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      Scope & Deliverables
                    </h4>
                    <Link className="w-3.5 h-3.5 text-slate-600 hover:text-emerald-400 cursor-pointer" />
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-slate-400 leading-relaxed font-medium">
                    Comprehensive audit of the existing multi-region cluster configuration. Focus on
                    identifying latency bottlenecks in the API Gateway and potential security gaps
                    in the VPC peering layer. Deliverable: PDF Audit Report.
                  </div>
                </div>

                {/* Subtasks Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      Operational Checkpoints
                    </h4>
                    <span className="text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10">
                      2 / 4 COMPLETED
                    </span>
                  </div>
                  <div className="space-y-3">
                    <SubtaskItem id="STSK-01" label="VPC Peering Review" completed />
                    <SubtaskItem id="STSK-02" label="IAM Role Audit" completed />
                    <SubtaskItem id="STSK-03" label="Latency Profiling" />
                    <SubtaskItem id="STSK-04" label="Report Generation" />

                    <div className="mt-4 flex items-center gap-3 pl-1">
                      <div className="w-5 h-5 rounded-md border-2 border-dashed border-white/10 flex items-center justify-center">
                        <Plus className="w-3 h-3 text-slate-600" />
                      </div>
                      <input
                        type="text"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        placeholder="Add new checkpoint..."
                        className="bg-transparent border-none outline-none text-xs font-bold text-slate-500 placeholder:text-slate-700 w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    File Repository
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <AttachmentItem name="Audit_Preliminary_v2.pdf" size="2.4 MB" type="pdf" />
                    <AttachmentItem name="Infrastructure_Map.fig" size="18.1 MB" type="design" />
                    <button className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all group">
                      <Plus className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-400">
                        Drop Files or Browse
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="activity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full bg-[#0F172A]"
              >
                <div className="flex-1 p-8 space-y-8">
                  <ActivityLogEntry
                    user="John Doe"
                    initials="JD"
                    color="bg-emerald-500"
                    action="pushed state to"
                    target="CRITICAL"
                    time="14:20 PM"
                  />
                  <CommentEntry
                    user="Alice Lee"
                    initials="AL"
                    color="bg-blue-500"
                    message="The ingress rules in US-EAST-1 seem to be dropping packets at peak load. We might need a security group audit."
                    time="10:45 AM"
                  />
                  <ActivityLogEntry
                    user="System"
                    initials="QB"
                    color="bg-slate-700"
                    action="automatically generated"
                    target="STSK-04"
                    time="Yesterday"
                  />
                </div>

                {/* Comment Input Sticky */}
                <div className="p-6 bg-[#0F172A] border-t border-white/5 sticky bottom-0">
                  <div className="relative">
                    <textarea
                      placeholder="Discuss this task or @mention team..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 pr-16 text-sm font-medium text-slate-200 placeholder:text-slate-600 outline-none focus:border-emerald-500/30 transition-all resize-none h-24"
                    />
                    <button className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-white/5 bg-[#0F172A]/80 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all">
              <Paperclip className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={closeTask}
            className="px-8 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Finalize Updates
          </button>
        </div>
      </motion.div>
    </>
  );
}

function ParamItem({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactElement;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
        {React.cloneElement(icon, { className: "w-3 h-3 text-slate-600" } as any)}
        {label}
      </div>
      {children}
    </div>
  );
}

function SubtaskItem({ id, label, completed }: { id: string; label: string; completed?: boolean }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer p-1 rounded-xl transition-all">
      <div
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
          completed
            ? "bg-emerald-500 border-emerald-500"
            : "bg-transparent border-white/10 group-hover:border-emerald-500/50"
        )}
      >
        {completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-xs font-bold transition-all",
            completed ? "text-slate-500 line-through" : "text-slate-300 group-hover:text-white"
          )}
        >
          {label}
        </span>
        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-tighter">{id}</span>
      </div>
    </div>
  );
}

function AttachmentItem({ name, size, type }: { name: string; size: string; type: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
          <FileText className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-200">{name}</span>
          <span className="text-[9px] font-black text-slate-600 uppercase">
            {size} • {type}
          </span>
        </div>
      </div>
      <MoreVertical className="w-4 h-4 text-slate-700 hover:text-white" />
    </div>
  );
}

function ActivityLogEntry({ user, initials, color, action, target, time }: any) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-lg",
          color
        )}
      >
        {initials}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-slate-400">
          <span className="font-black text-slate-200 mr-1.5 uppercase tracking-tight">{user}</span>
          {action}
          <span className="ml-1.5 px-2 py-0.5 rounded bg-white/5 text-emerald-400 font-black text-[9px]">
            {target}
          </span>
        </p>
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
          {time}
        </span>
      </div>
    </div>
  );
}

function CommentEntry({ user, initials, color, message, time }: any) {
  return (
    <div className="flex gap-4">
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-lg",
          color
        )}
      >
        {initials}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">
            {user}
          </span>
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-auto">
            {time}
          </span>
        </div>
        <div className="p-4 rounded-2xl rounded-tl-none bg-white/[0.03] border border-white/5 text-sm text-slate-400 leading-relaxed font-medium">
          {message}
        </div>
      </div>
    </div>
  );
}
