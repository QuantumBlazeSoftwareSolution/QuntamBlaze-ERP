"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Briefcase, Building, CreditCard, Loader2, CheckCircle2, AlertCircle, ShieldAlert, ChevronDown } from "lucide-react";
import { createEmployeeAction } from "@/app/actions/hrActions";
import { getEmployeeRolesAction } from "@/app/actions/employeeRoleActions";
import { cn } from "@/lib/utils";

interface AddEmployeeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEmployeeDrawer({ isOpen, onClose }: AddEmployeeDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    role: "",
    employeeRole: "SE", // default to Software Engineer
    department: "",
    customDepartment: "",
  });

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await getEmployeeRolesAction();
        if (res.success && res.roles) {
          setRoles(res.roles);
        }
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    }
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      // Use custom department if "OTHER" is selected
      const payload = {
        ...formData,
        department: formData.department === "OTHER" ? formData.customDepartment : formData.department,
      };

      const res = await createEmployeeAction(payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            nic: "",
            role: "",
            employeeRole: "SE",
            department: "",
            customDepartment: "",
          });
          setSuccess(false);
        }, 1500);
      } else {
        setError(res.error || "Failed to create employee.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Add New Employee</h2>
                <p className="text-xs text-slate-500 mt-1">Register a new team member</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Employee Created</h3>
                  <p className="text-sm text-slate-500">
                    The new employee profile has been successfully added to the directory.
                  </p>
                </motion.div>
              ) : (
                <form id="add-employee-form" onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@quantumblaze.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 890"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        NIC / Passport
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="nic"
                          value={formData.nic}
                          onChange={handleChange}
                          placeholder="ID Number"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6 mt-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-4">Organizational Role</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Department <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select
                            name="department"
                            required
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors appearance-none cursor-pointer"
                          >
                            <option value="">Select Department</option>
                            <option value="ENGINEERING">Engineering</option>
                            <option value="DESIGN">Design</option>
                            <option value="PRODUCT">Product</option>
                            <option value="MARKETING">Marketing</option>
                            <option value="SALES">Sales</option>
                            <option value="HR">HR</option>
                            <option value="FINANCE">Finance</option>
                            <option value="OTHER">Other</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        {formData.department === "OTHER" && (
                          <div className="mt-2 relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              name="customDepartment"
                              required
                              value={formData.customDepartment}
                              onChange={handleChange}
                              placeholder="Enter custom department"
                              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Job Title <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="e.g. Frontend Engineer"
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Functional Employee Role <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select
                            name="employeeRole"
                            required
                            value={formData.employeeRole}
                            onChange={handleChange}
                            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors appearance-none cursor-pointer"
                          >
                            <option value="">Select Functional Role</option>
                            {roles.map((r) => (
                              <option key={r.id} value={r.code}>
                                {r.name} ({r.code})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Governs resource planning and smart filtering in project team slots.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Actions */}
            {!success && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="add-employee-form"
                  disabled={loading}
                  className={cn(
                    "flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    loading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-600 hover:scale-[1.02] shadow-lg shadow-emerald-500/25"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Create Employee"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
