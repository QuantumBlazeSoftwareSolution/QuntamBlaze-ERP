"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  MapPin,
  Calendar,
  CheckSquare,
  ChevronDown,
} from "lucide-react";
import { updateEmployeeAction } from "@/app/actions/hrActions";
import { getEmployeeRolesAction } from "@/app/actions/employeeRoleActions";
import { cn } from "@/lib/utils";
import { Employee } from "@/types/hr";

interface EditEmployeeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  departments?: any[];
}

export function EditEmployeeDrawer({ isOpen, onClose, employee, departments = [] }: EditEmployeeDrawerProps) {
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
    employeeRole: "SE",
    department: "",
    customDepartment: "",
    status: "Active",
    address: "",
    birthDate: "",
    joinDate: "",
  });

  useEffect(() => {
    if (isOpen && employee) {
      const deptUpper = employee.department?.toUpperCase() || "";
      const isStandardDept = departments.length > 0
        ? departments.some((d) => d.code.toUpperCase() === deptUpper)
        : [
            "ENGINEERING",
            "DESIGN",
            "PRODUCT",
            "MARKETING",
            "SALES",
            "HR",
            "FINANCE",
          ].includes(deptUpper);

      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        nic: employee.nic || "",
        role: employee.role || "",
        employeeRole: employee.employeeRole || "SE",
        department: isStandardDept ? deptUpper : employee.department ? "OTHER" : "",
        customDepartment: isStandardDept ? "" : employee.department || "",
        status: employee.status || "Active",
        address: employee.address || "",
        birthDate: employee.birthDate
          ? new Date(employee.birthDate).toISOString().split("T")[0]
          : "",
        joinDate: employee.joinDate ? new Date(employee.joinDate).toISOString().split("T")[0] : "",
      });
      setError("");
      setSuccess(false);
    }
  }, [isOpen, employee]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
      const payload = {
        ...formData,
        department:
          formData.department === "OTHER" ? formData.customDepartment : formData.department,
        birthDate: formData.birthDate || null,
        joinDate: formData.joinDate || null,
      };

      const res = await updateEmployeeAction(employee.id, payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      } else {
        setError(res.error || "Failed to update employee.");
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
                <h2 className="text-lg font-bold text-slate-800">Edit Profile</h2>
                <p className="text-xs text-slate-500 mt-1">Update team member details</p>
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
                  <h3 className="text-xl font-bold text-slate-800">Profile Updated</h3>
                  <p className="text-sm text-slate-500">
                    The employee profile has been successfully saved and updated.
                  </p>
                </motion.div>
              ) : (
                <form id="edit-employee-form" onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Section 1: Personal Details */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      Personal Identity
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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

                    <div className="space-y-1.5 mb-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+94 77 123 4567"
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Status <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select
                            name="status"
                            required
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors appearance-none cursor-pointer"
                          >
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Physical Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <textarea
                          name="address"
                          rows={2}
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter residential address"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Organizational Details */}
                  <div className="border-t border-slate-100 pt-6 mt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      Organizational Role
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                            {departments.length > 0 ? (
                              departments.map((dept) => (
                                <option key={dept.id} value={dept.code}>
                                  {dept.name}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="ENGINEERING">Engineering</option>
                                <option value="DESIGN">Design</option>
                                <option value="PRODUCT">Product</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="SALES">Sales</option>
                                <option value="HR">HR</option>
                                <option value="FINANCE">Finance</option>
                                <option value="OTHER">Other</option>
                              </>
                            )}
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
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Join Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          name="joinDate"
                          value={formData.joinDate}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 outline-none transition-colors"
                        />
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
                  form="edit-employee-form"
                  disabled={loading}
                  className={cn(
                    "flex-1 py-3 bg-[#0F172A] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-slate-800 hover:scale-[1.02] shadow-lg shadow-slate-800/25"
                  )}
                >
                  {loading ? (
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
  );
}
