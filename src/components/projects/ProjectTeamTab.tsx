"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Plus, 
  Search, 
  X, 
  Lock, 
  Shield, 
  Code, 
  Laptop, 
  Sparkles, 
  UserCheck, 
  Trash2, 
  Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { 
  getEmployeesAction, 
  assignProjectMemberAction, 
  removeProjectMemberAction 
} from "@/app/actions/projectTeamActions";

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  color: string;
  avatar: string | null;
  email: string;
  role: "PM" | "TL" | "Dev" | "QA" | "UI/UX";
  employeeRole: string;
}

interface ProjectTeamTabProps {
  project: {
    id: string;
    name: string;
    team: TeamMember[];
  };
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string | null;
  avatar: string | null;
  status: string;
}

export function ProjectTeamTab({ project }: ProjectTeamTabProps) {
  const router = useRouter();

  // Dialog State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRoleForAssign, setActiveRoleForAssign] = useState<"PM" | "TL" | "Dev" | "QA" | "UI/UX" | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Load all active employees on click
  const openAssignModal = async (role: "PM" | "TL" | "Dev" | "QA" | "UI/UX") => {
    setActiveRoleForAssign(role);
    setIsModalOpen(true);
    setIsLoadingEmployees(true);
    setSearchQuery("");

    const res = await getEmployeesAction();
    if (res.success && res.employees) {
      setAllEmployees(res.employees);
    }
    setIsLoadingEmployees(false);
  };

  // Handle Assign Action
  const handleAssign = async (employeeId: string) => {
    if (!activeRoleForAssign) return;
    setIsAssigning(true);

    const res = await assignProjectMemberAction(project.id, employeeId, activeRoleForAssign);
    if (res.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      alert(res.error || "Failed to assign member.");
    }
    setIsAssigning(false);
  };

  // Handle Remove Action
  const handleRemove = async (employeeId: string, role: "PM" | "TL" | "Dev" | "QA" | "UI/UX") => {
    const confirmRemove = confirm(`Are you sure you want to remove this member from the project as ${role}?`);
    if (!confirmRemove) return;

    const res = await removeProjectMemberAction(project.id, employeeId, role);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Failed to remove member.");
    }
  };

  // Filter out employees who are already assigned to the project to prevent duplicate team members
  const assignedEmployeeIds = project.team.map((member) => member.id);
  const assignableEmployees = allEmployees.filter((employee) => {
    // Exclude employees already assigned to the current slot type
    const alreadyInCurrentRole = project.team.some(
      (m) => m.id === employee.id && m.role === activeRoleForAssign
    );
    if (alreadyInCurrentRole) return false;

    // Filter by search query
    const matchQuery = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (employee.role || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchQuery;
  });

  // Group team members by role
  const projectManager = project.team.find((m) => m.role === "PM");
  const techLead = project.team.find((m) => m.role === "TL");
  const developers = project.team.filter((m) => m.role === "Dev");
  const qas = project.team.filter((m) => m.role === "QA");
  const designers = project.team.filter((m) => m.role === "UI/UX");

  return (
    <div className="space-y-12">
      {/* ─── SECTION 1: Leadership Slots ─────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-purple-600" />
          <h3 className="text-[#0F172A] font-bold text-lg">Project Leadership</h3>
          <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Executive Slots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project Manager Card */}
          <div className="relative">
            <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-3">
              Project Manager (PM)
            </h4>
            {projectManager ? (
              <motion.div 
                layoutId={`member-${projectManager.id}-PM`}
                className="bg-white border-2 border-purple-100 hover:border-purple-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 group transition-all"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md",
                  projectManager.color
                )}>
                  {projectManager.avatar ? (
                    <img src={projectManager.avatar} alt={projectManager.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    projectManager.initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0F172A] truncate">{projectManager.name}</p>
                  <p className="text-[11px] font-medium text-[#10B981]">{projectManager.employeeRole}</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">{projectManager.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openAssignModal("PM")}
                    className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
                    title="Change Project Manager"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleRemove(projectManager.id, "PM")}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove PM"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => openAssignModal("PM")}
                className="w-full h-24 border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/20 hover:bg-purple-50/40 rounded-2xl flex flex-col items-center justify-center gap-2 text-purple-600 font-bold text-xs transition-all shadow-sm group active:scale-98"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                + Assign Project Manager
              </button>
            )}
          </div>

          {/* Tech Lead Card */}
          <div className="relative">
            <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-3">
              Tech Lead (TL)
            </h4>
            {techLead ? (
              <motion.div 
                layoutId={`member-${techLead.id}-TL`}
                className="bg-white border-2 border-blue-100 hover:border-blue-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 group transition-all"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md",
                  techLead.color
                )}>
                  {techLead.avatar ? (
                    <img src={techLead.avatar} alt={techLead.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    techLead.initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0F172A] truncate">{techLead.name}</p>
                  <p className="text-[11px] font-medium text-[#10B981]">{techLead.employeeRole}</p>
                  <p className="text-[10px] text-[#94A3B8] truncate">{techLead.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openAssignModal("TL")}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                    title="Change Tech Lead"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleRemove(techLead.id, "TL")}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove TL"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => openAssignModal("TL")}
                className="w-full h-24 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/20 hover:bg-blue-50/40 rounded-2xl flex flex-col items-center justify-center gap-2 text-blue-600 font-bold text-xs transition-all shadow-sm group active:scale-98"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                + Assign Tech Lead
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: Engineering & Quality Assurance ──────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Code className="w-5 h-5 text-emerald-600" />
          <h3 className="text-[#0F172A] font-bold text-lg">Engineering & Quality Assurance</h3>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Delivery slots
          </span>
        </div>

        <div className="space-y-8">
          {/* Developers Slot */}
          <div>
            <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-3">
              Developers ({developers.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {developers.map((member) => (
                  <motion.div
                    key={member.id}
                    layoutId={`member-${member.id}-Dev`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border border-[#E2E8F0] hover:border-[#10B981]/30 rounded-2xl p-5 shadow-sm flex items-center gap-3.5 group relative transition-all"
                  >
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm",
                      member.color
                    )}>
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        member.initials
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">{member.name}</p>
                      <p className="text-[10px] font-semibold text-[#10B981] truncate">{member.employeeRole}</p>
                      <p className="text-[9px] text-[#94A3B8] truncate">{member.email}</p>
                    </div>
                    <button 
                      onClick={() => handleRemove(member.id, "Dev")}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove Dev"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Dev Button */}
              <button
                onClick={() => openAssignModal("Dev")}
                className="h-20 border-2 border-dashed border-[#E2E8F0] hover:border-[#10B981] bg-[#F8FAFC]/50 hover:bg-[#10B981]/5 rounded-2xl flex items-center justify-center gap-2 text-[#475569] hover:text-[#10B981] font-bold text-xs transition-all shadow-xs group active:scale-98"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#10B981]/10 flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                + Assign Developer
              </button>
            </div>
          </div>

          {/* QA Slots */}
          <div>
            <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-3">
              Quality Assurance (QA) ({qas.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {qas.map((member) => (
                  <motion.div
                    key={member.id}
                    layoutId={`member-${member.id}-QA`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white border border-[#E2E8F0] hover:border-amber-500/30 rounded-2xl p-5 shadow-sm flex items-center gap-3.5 group relative transition-all"
                  >
                    <div className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm",
                      member.color
                    )}>
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        member.initials
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">{member.name}</p>
                      <p className="text-[10px] font-semibold text-amber-600 truncate">{member.employeeRole}</p>
                      <p className="text-[9px] text-[#94A3B8] truncate">{member.email}</p>
                    </div>
                    <button 
                      onClick={() => handleRemove(member.id, "QA")}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove QA"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add QA Button */}
              <button
                onClick={() => openAssignModal("QA")}
                className="h-20 border-2 border-dashed border-[#E2E8F0] hover:border-amber-500 bg-[#F8FAFC]/50 hover:bg-amber-50/40 rounded-2xl flex items-center justify-center gap-2 text-[#475569] hover:text-amber-600 font-bold text-xs transition-all shadow-xs group active:scale-98"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-amber-100/50 flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                + Assign QA Specialist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: Product & UI/UX Design ──────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Laptop className="w-5 h-5 text-pink-600" />
          <h3 className="text-[#0F172A] font-bold text-lg">Product & UI/UX Design</h3>
          <span className="text-[10px] font-bold bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Design slots
          </span>
        </div>

        <div>
          <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-3">
            UI/UX Designers ({designers.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {designers.map((member) => (
                <motion.div
                  key={member.id}
                  layoutId={`member-${member.id}-UI/UX`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white border border-[#E2E8F0] hover:border-pink-500/30 rounded-2xl p-5 shadow-sm flex items-center gap-3.5 group relative transition-all"
                >
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm",
                    member.color
                  )}>
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      member.initials
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate">{member.name}</p>
                    <p className="text-[10px] font-semibold text-pink-600 truncate">{member.employeeRole}</p>
                    <p className="text-[9px] text-[#94A3B8] truncate">{member.email}</p>
                  </div>
                  <button 
                    onClick={() => handleRemove(member.id, "UI/UX")}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove Designer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add UI/UX Button */}
            <button
              onClick={() => openAssignModal("UI/UX")}
              className="h-20 border-2 border-dashed border-[#E2E8F0] hover:border-pink-500 bg-[#F8FAFC]/50 hover:bg-pink-50/40 rounded-2xl flex items-center justify-center gap-2 text-[#475569] hover:text-pink-600 font-bold text-xs transition-all shadow-xs group active:scale-98"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-pink-100/50 flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </div>
              + Assign UI/UX Designer
            </button>
          </div>
        </div>
      </div>

      {/* ─── FUTURE TEASER: Tasks Trajectory ─────────────────────────────── */}
      <div className="mt-16 pt-10 border-t border-[#E2E8F0]">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 relative overflow-hidden shadow-xs">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-50 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-widest">
            <Lock className="w-3 h-3 text-emerald-600" />
            Phase 2 Preview
          </div>

          <div className="max-w-xl space-y-3 mb-8">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Productivity Metrics
            </p>
            <h4 className="text-base font-bold text-[#0F172A]">Tasks Trajectory Per Member</h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              In the upcoming phase, you will be able to toggle each team member's slot to view their active task lists, burn-down ratios, and milestone contributions directly inside this workspace.
            </p>
          </div>

          {/* Locked Mockup Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 select-none pointer-events-none">
            <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 rounded-full w-24" />
                  <div className="h-2 bg-slate-100 rounded-full w-12" />
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-1/3" />
              </div>
              <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                <span>3 Tasks Active</span>
                <span>33% Done</span>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 rounded-full w-24" />
                  <div className="h-2 bg-slate-100 rounded-full w-12" />
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-4/5" />
              </div>
              <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                <span>5 Tasks Active</span>
                <span>80% Done</span>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-slate-200 rounded-full w-24" />
                  <div className="h-2 bg-slate-100 rounded-full w-12" />
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-0" />
              </div>
              <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                <span>0 Tasks Active</span>
                <span>0% Done</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DIALOG MODAL: Search & Assign ───────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && activeRoleForAssign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl p-8 z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#10B981]" />
                    Assign {activeRoleForAssign} Member
                  </h4>
                  <p className="text-[11px] text-[#94A3B8] font-medium mt-1">
                    Select an active employee to fill this slot on the project team.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Interactive Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, role, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-[#10B981] focus:border-[#10B981] focus:bg-white focus:ring-1 focus:ring-[#10B981] outline-none rounded-2xl pl-11 pr-4 py-3 text-xs text-[#0F172A] transition-all"
                />
              </div>

              {/* Employee List */}
              <div className="max-h-60 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
                {isLoadingEmployees ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-[#10B981]" />
                    <p className="text-xs font-semibold">Loading system employees...</p>
                  </div>
                ) : assignableEmployees.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                    <User className="w-8 h-8 opacity-30" />
                    <p className="text-xs font-bold">No assignable employees found.</p>
                  </div>
                ) : (
                  assignableEmployees.map((employee) => {
                    const initials = employee.name.substring(0, 2).toUpperCase();
                    const isAlreadyAssignedElsewhere = assignedEmployeeIds.includes(employee.id);

                    return (
                      <div
                        key={employee.id}
                        className={cn(
                          "p-3 rounded-2xl border border-slate-100 hover:border-slate-200 flex items-center justify-between transition-all bg-white",
                          isAlreadyAssignedElsewhere && "bg-slate-50/50"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 shadow-xs">
                            {employee.avatar ? (
                              <img src={employee.avatar} alt={employee.name} className="w-full h-full rounded-xl object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#0F172A] truncate flex items-center gap-1.5">
                              {employee.name}
                              {isAlreadyAssignedElsewhere && (
                                <span className="text-[8px] font-extrabold bg-amber-50 text-amber-600 border border-amber-200/50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Assigned
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-[#10B981] font-semibold truncate">
                              {employee.role || "Team Member"}
                            </p>
                          </div>
                        </div>

                        <button
                          disabled={isAssigning}
                          onClick={() => handleAssign(employee.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                            isAssigning 
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                              : "bg-[#F8FAFC] hover:bg-[#10B981] hover:text-white text-[#475569] shadow-xs active:scale-95"
                          )}
                        >
                          Select
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
