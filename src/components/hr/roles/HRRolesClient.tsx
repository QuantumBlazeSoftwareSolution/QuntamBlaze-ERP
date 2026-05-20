"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Plus,
  Search,
  Briefcase,
  Users,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BookmarkCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HRNavbar } from "@/components/hr/HRNavbar";
import {
  createEmployeeRoleAction,
  updateEmployeeRoleAction,
  deleteEmployeeRoleAction,
} from "@/app/actions/employeeRoleActions";

interface EmployeeRole {
  id: string;
  code: string;
  name: string;
  description: string | null;
  baseRole: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Employee {
  id: string;
  name: string;
  avatar: string | null;
  employeeRole: string;
  role: string | null;
}

interface HRRolesClientProps {
  roles: EmployeeRole[];
  employees: Employee[];
}

export function HRRolesClient({ roles, employees }: HRRolesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<EmployeeRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<EmployeeRole | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    baseRole: "None",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Map employees to roles
  const getEmployeesInRole = (roleCode: string) => {
    return employees.filter(
      (e) => (e.employeeRole || "").toUpperCase() === roleCode.toUpperCase()
    );
  };

  // Stats calculation
  const totalRoles = roles.length;
  
  const employeesWithInvalidRoles = employees.filter((e) => {
    const code = (e.employeeRole || "").toUpperCase();
    return !roles.some((r) => r.code.toUpperCase() === code);
  });
  const unassignedCount = employeesWithInvalidRoles.length;

  const roleDistribution = roles.map((r) => ({
    role: r,
    count: getEmployeesInRole(r.code).length,
  }));
  const topRole = [...roleDistribution].sort((a, b) => b.count - a.count)[0]?.role;

  // Filtered roles
  const filteredRoles = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddDrawer = () => {
    setEditingRole(null);
    setFormData({ code: "", name: "", description: "", baseRole: "None" });
    setFormError("");
    setFormSuccess(false);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (role: EmployeeRole) => {
    setEditingRole(role);
    setFormData({
      code: role.code,
      name: role.name,
      description: role.description || "",
      baseRole: role.baseRole || "None",
    });
    setFormError("");
    setFormSuccess(false);
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name || !formData.code) {
      setFormError("Name and Code are required.");
      return;
    }

    startTransition(async () => {
      try {
        if (editingRole) {
          // Edit Mode
          const res = await updateEmployeeRoleAction(editingRole.id, {
            name: formData.name,
            description: formData.description,
            baseRole: formData.baseRole,
          });
          if (res.success) {
            setFormSuccess(true);
            setTimeout(() => {
              setIsDrawerOpen(false);
              router.refresh();
            }, 1000);
          } else {
            setFormError(res.error || "Failed to update role.");
          }
        } else {
          // Create Mode
          const res = await createEmployeeRoleAction({
            name: formData.name,
            code: formData.code,
            description: formData.description,
            baseRole: formData.baseRole,
          });
          if (res.success) {
            setFormSuccess(true);
            setTimeout(() => {
              setIsDrawerOpen(false);
              router.refresh();
            }, 1000);
          } else {
            setFormError(res.error || "Failed to create role.");
          }
        }
      } catch (err: any) {
        setFormError(err.message || "An unexpected error occurred.");
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRole) return;

    startTransition(async () => {
      try {
        const res = await deleteEmployeeRoleAction(deletingRole.id);
        if (res.success) {
          setDeletingRole(null);
          router.refresh();
        } else {
          alert(res.error || "Failed to delete role.");
        }
      } catch (err: any) {
        alert(err.message || "An unexpected error occurred.");
      }
    });
  };

  // Predefined gorgeous gradient patterns for card badges based on index or code
  const getBadgeGradient = (code: string) => {
    const c = code.toUpperCase();
    if (c === "PM") return "from-violet-500 to-indigo-600 shadow-indigo-100";
    if (c === "SE") return "from-emerald-400 to-teal-600 shadow-teal-100";
    if (c === "QA") return "from-pink-500 to-rose-600 shadow-rose-100";
    if (c === "DESIGNER" || c === "DESIGN") return "from-cyan-400 to-blue-600 shadow-blue-100";
    if (c === "DEVOPS") return "from-amber-400 to-orange-600 shadow-orange-100";
    if (c === "HR") return "from-fuchsia-500 to-purple-700 shadow-fuchsia-100";
    return "from-slate-500 to-slate-700 shadow-slate-100";
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen flex flex-col">
      <HRNavbar />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[#0F172A] text-2xl font-bold">Roles Management</h1>
              <div className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#10B981]/20 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <BookmarkCheck className="w-3.5 h-3.5" />
                {totalRoles} Active Functional Roles
              </div>
            </div>
            <p className="text-[#475569] text-sm">
              Define standard roles & permissions inside the HR structure to govern project assignments.
            </p>
          </div>

          <button
            onClick={openAddDrawer}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-sm font-bold shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Define New Role</span>
          </button>
        </div>

        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Functional Roles</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{totalRoles}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Most Active Role</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">
                {topRole ? `${topRole.name} (${topRole.code})` : "None"}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", unassignedCount > 0 ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400")}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unassigned Employees</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {unassignedCount} <span className="text-xs font-medium text-slate-400">members</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search roles by name, code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm outline-none placeholder-slate-400 text-slate-700 bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
            >
              Clear
            </button>
          )}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => {
            const roleEmployees = getEmployeesInRole(role.code);
            const displayEmployees = roleEmployees.slice(0, 4);
            const extraCount = roleEmployees.length - displayEmployees.length;

            return (
              <motion.div
                key={role.id}
                layoutId={`role-card-${role.id}`}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all overflow-hidden flex flex-col group h-full"
              >
                {/* Accent line */}
                <div className="h-1 bg-gradient-to-r from-slate-100 to-slate-200 group-hover:from-[#10B981] group-hover:to-emerald-400 transition-all duration-300" />

                <div className="p-6 flex-1 flex flex-col justify-between">
                  {/* Top: Badges and Title */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-xl text-white text-xs font-extrabold tracking-wider bg-gradient-to-br shadow-md shrink-0 uppercase",
                          getBadgeGradient(role.code)
                        )}>
                          {role.code}
                        </span>
                        {role.baseRole && role.baseRole !== "None" && (
                          <span className="text-[10px] font-bold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                            ⚡ {role.baseRole}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditDrawer(role)}
                          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-blue-500 rounded-lg transition-colors cursor-pointer"
                          title="Edit Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingRole(role)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                          title="Delete Role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-[#10B981] transition-colors">
                      {role.name}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed min-h-[40px] mb-4">
                      {role.description || "No description provided for this functional role."}
                    </p>
                  </div>

                  {/* Bottom: Team Members Count & Avatars */}
                  <div className="border-t border-slate-50 pt-4 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Assigned Team
                      </p>
                      <p className="text-sm font-bold text-slate-700 mt-0.5">
                        {roleEmployees.length} {roleEmployees.length === 1 ? "Employee" : "Employees"}
                      </p>
                    </div>

                    {/* Avatar Stack */}
                    <div className="flex items-center">
                      {displayEmployees.map((emp, idx) => (
                        <div
                          key={emp.id}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs bg-slate-100 text-slate-600 overflow-hidden shadow-sm shrink-0",
                            idx > 0 && "-ml-2.5"
                          )}
                          title={emp.name}
                        >
                          {emp.avatar ? (
                            <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            emp.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                          )}
                        </div>
                      ))}
                      {extraCount > 0 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 text-white flex items-center justify-center font-extrabold text-[10px] -ml-2.5 shadow-sm shrink-0">
                          +{extraCount}
                        </div>
                      )}
                      {roleEmployees.length === 0 && (
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Empty</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredRoles.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <FileText className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">No roles found</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Try refining your search keyword or create a new functional role if it doesn't exist yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Drawer for Add/Edit Role */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Dark glassmorphic backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />

            {/* Sidebar drawer content container */}
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col border-l border-slate-200"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {editingRole ? "Edit Employee Role" : "Define Employee Role"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {editingRole ? "Modify functional metadata values" : "Register a brand new corporate code"}
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {formSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {editingRole ? "Role Metadata Updated" : "Role Code Registered"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Your database record has been verified and fully persisted.
                    </p>
                  </motion.div>
                ) : (
                  <form id="role-drawer-form" onSubmit={handleFormSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Role Code Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex justify-between">
                        <span>Role Code Code <span className="text-rose-500">*</span></span>
                        {editingRole && <span className="text-[10px] text-amber-500 font-normal">Immutable Field</span>}
                      </label>
                      <input
                        type="text"
                        required
                        disabled={!!editingRole}
                        placeholder="e.g. Designer, PM, QA, SE"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className={cn(
                          "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all",
                          editingRole
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                            : "focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                        )}
                      />
                      {!editingRole && (
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Unique abbreviation uppercase tag. e.g. **Designer** becomes **DESIGNER** internally.
                        </p>
                      )}
                    </div>

                    {/* Role Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Role Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. UI/UX Designer"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>

                    {/* Project Roster Mapping Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex justify-between">
                        <span>Project Roster Mapping</span>
                        <span className="text-[10px] font-semibold text-emerald-500 lowercase">Optional</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.baseRole}
                          onChange={(e) => setFormData({ ...formData, baseRole: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 appearance-none cursor-pointer"
                        >
                          <option value="None">None (Internal HR Only)</option>
                          <option value="PM">Project Manager (PM)</option>
                          <option value="Dev">Developer (Dev / TL)</option>
                          <option value="QA">Quality Assurance (QA)</option>
                          <option value="UI/UX">UI/UX Designer</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Select which core delivery slot in project team rosters this dynamic role can be assigned to.
                      </p>
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Description / Objective
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Detail functional duties, target key objectives, and assignable scope inside team rosters..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 resize-none"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Drawer Footer Actions */}
              {!formSuccess && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="role-drawer-form"
                    disabled={isPending}
                    className={cn(
                      "flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer",
                      isPending ? "opacity-75 cursor-not-allowed" : "hover:bg-emerald-600 hover:scale-[1.02] shadow-lg shadow-emerald-500/20"
                    )}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog Modal for Deletion */}
      <AnimatePresence>
        {deletingRole && (
          <>
            {/* Modal backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingRole(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]"
            />

            {/* Modal box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-[111]"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Delete Employee Role?</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    This operation will soft-delete the role: **{deletingRole.name} ({deletingRole.code})** from active indexes.
                  </p>
                </div>
              </div>

              {/* Warning if there are active employees currently assigned */}
              {getEmployeesInRole(deletingRole.code).length > 0 ? (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Caution: </span>
                    There are **{getEmployeesInRole(deletingRole.code).length} employees** currently assigned to this role code.
                    Deleting it will revert their database roles to Software Engineer (**SE**) automatically.
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-slate-50 text-slate-600 rounded-xl text-xs">
                  This role is currently unused. No employees will be affected.
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeletingRole(null)}
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Keep Role
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isPending}
                  className={cn(
                    "px-5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-rose-500/20 cursor-pointer",
                    isPending && "opacity-75 cursor-not-allowed"
                  )}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Code"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
