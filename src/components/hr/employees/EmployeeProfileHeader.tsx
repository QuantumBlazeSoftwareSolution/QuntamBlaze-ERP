"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Edit,
  MoreVertical,
  Share2,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IDChip } from "@/components/ui/IDChip";
import { Employee } from "@/types/hr";

interface EmployeeProfileHeaderProps {
  employee: Employee;
  onEditClick: () => void;
}

export function EmployeeProfileHeader({ employee, onEditClick }: EmployeeProfileHeaderProps) {
  const healthColor =
    employee.profileHealth && employee.profileHealth >= 90
      ? "text-[#10B981] bg-[#ECFDF5] border-[#A7F3D0]"
      : "text-amber-500 bg-amber-50 border-amber-200";

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Avatar & Primary Info */}
        <div className="flex gap-6 flex-1">
          <div className="relative shrink-0">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8] text-3xl font-black">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#10B981] shadow-sm">
              <UserCheck className="w-4 h-4 fill-current" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-[#0F172A] text-2xl lg:text-3xl font-black tracking-tight">
                {employee.name}
              </h1>
              <div className="flex items-center gap-2">
                <IDChip id={employee.id} size="sm" />
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  {employee.status}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[#64748B] text-sm font-medium mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#10B981]" />
                <span>{employee.role}</span>
                {employee.employeeRole && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-wider border border-slate-200">
                    {employee.employeeRole}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-500" />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <Calendar className="w-4 h-4" />
                <span>Joined {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <ContactInfo icon={Mail} value={employee.email || "N/A"} />
              <ContactInfo icon={Phone} value={employee.phone || "N/A"} />
              <ContactInfo icon={MapPin} value={employee.address || "N/A"} />
            </div>
          </div>
        </div>

        {/* Right: Health Score & Actions */}
        <div className="flex flex-col justify-between items-end gap-6">
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC] transition-all">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC] transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onEditClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-bold shadow-lg shadow-[#0F172A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          <div className="w-full lg:w-48 p-4 rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                Profile Health
              </span>
              <span
                className={cn("text-[10px] font-black px-1.5 py-0.5 rounded border", healthColor)}
              >
                {employee.profileHealth}%
              </span>
            </div>
            <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${employee.profileHealth}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  employee.profileHealth && employee.profileHealth >= 90
                    ? "bg-[#10B981]"
                    : "bg-amber-500"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, value }: { icon: any; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] group cursor-pointer hover:border-[#E2E8F0] transition-all">
      <Icon className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#10B981] transition-colors" />
      <span className="text-xs font-bold text-[#475569]">{value}</span>
    </div>
  );
}
