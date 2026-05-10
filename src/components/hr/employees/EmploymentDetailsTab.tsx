"use client";

import React from "react";
import {
  Briefcase,
  Clock,
  MapPin,
  Calendar,
  ArrowUpRight,
  Target,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Employee } from "@/types/hr";
import { cn } from "@/lib/utils";

interface EmploymentDetailsTabProps {
  employee: Employee;
}

export function EmploymentDetailsTab({ employee }: EmploymentDetailsTabProps) {
  return (
    <div className="space-y-8">
      {/* Top Row: Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Tenure"
          value="1y 4m"
          subtext={`Joined ${employee.joinDate}`}
          icon={Clock}
          color="text-blue-500"
          bg="bg-blue-50"
        />
        <MetricCard
          label="Reports To"
          value={employee.reportingTo?.name || "Direct Board"}
          subtext="Line Manager"
          icon={Users}
          color="text-violet-500"
          bg="bg-violet-50"
        />
        <MetricCard
          label="Designation"
          value={employee.role}
          subtext={employee.department}
          icon={Target}
          color="text-[#10B981]"
          bg="bg-emerald-50"
        />
        <MetricCard
          label="Work Mode"
          value="Remote"
          subtext="Global Ops"
          icon={MapPin}
          color="text-amber-500"
          bg="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Career Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-[#0F172A] font-bold">Career Progression</h3>
              </div>
              <button className="text-[10px] font-bold text-[#3B82F6] hover:underline">
                Add Milestone
              </button>
            </div>

            <div className="bg-white border border-[#F1F5F9] rounded-2xl p-8 space-y-8 relative">
              <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-[#F1F5F9]" />

              <TimelineItem
                title="Promotion: Senior Software Engineer"
                date="Jan 2024"
                description="Promoted due to exceptional performance in the Q3 Cloud Migration project."
                isNew
              />
              <TimelineItem
                title="Joined as Software Engineer"
                date="Jan 2023"
                description="Initial hire for the Core ERP Engineering team."
              />
            </div>
          </section>
        </div>

        {/* Right: Work Eligibility & Documents */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10B981]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-[#0F172A] font-bold">Work Eligibility</h3>
            </div>

            <div className="bg-white border border-[#F1F5F9] rounded-2xl p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                  Contract Type
                </p>
                <p className="text-sm font-bold text-[#475569]">Permanent / Full-Time</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">
                  Work Authorization
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-sm font-bold text-[#475569]">Citizen (Unrestricted)</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-black text-violet-700 uppercase tracking-widest">
                    Probation Status
                  </p>
                  <span className="text-[9px] font-black text-white bg-violet-500 px-1.5 py-0.5 rounded uppercase">
                    Passed
                  </span>
                </div>
                <p className="text-xs font-medium text-violet-900 leading-relaxed">
                  Successfully cleared probation on April 15, 2023. Recommended for permanent
                  retention.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subtext, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 shadow-sm">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", bg, color)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">{label}</p>
      <h4 className="text-lg font-black text-[#0F172A] mt-1 truncate tracking-tight">{value}</h4>
      <p className="text-[10px] text-[#64748B] font-medium mt-0.5">{subtext}</p>
    </div>
  );
}

function TimelineItem({ title, date, description, isNew }: any) {
  return (
    <div className="relative pl-12">
      <div
        className={cn(
          "absolute left-[0.45rem] top-1 w-3 h-3 rounded-full border-2 border-white ring-4 transition-all",
          isNew ? "bg-[#10B981] ring-[#ECFDF5]" : "bg-[#CBD5E1] ring-[#F8FAFC]"
        )}
      />
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-sm font-bold text-[#0F172A]">{title}</h4>
          <span className="text-[10px] font-bold text-[#94A3B8] bg-[#F1F5F9] px-2 py-0.5 rounded">
            {date}
          </span>
        </div>
        <p className="text-xs text-[#64748B] leading-relaxed max-w-lg">{description}</p>
        {isNew && (
          <button className="flex items-center gap-1.5 text-[10px] font-black text-[#10B981] mt-3 uppercase tracking-widest hover:underline">
            View Performance Context
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
