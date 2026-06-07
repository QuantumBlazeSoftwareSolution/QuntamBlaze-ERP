"use client";

import { MOCK_HR_ACTIVITIES } from "@/lib/mockData/hr";
import { UserCheck, UserPlus, FileText, Calendar, Wallet, LogOut } from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";

const iconMap: any = {
  "New Hire": { icon: UserPlus, color: "text-green-600 bg-green-50" },
  Promotion: { icon: UserCheck, color: "text-blue-600 bg-blue-50" },
  "Leave Approved": { icon: Calendar, color: "text-violet-600 bg-violet-50" },
  "Interview Scheduled": { icon: UserCheck, color: "text-amber-600 bg-amber-50" },
  "Payslip Generated": { icon: Wallet, color: "text-teal-600 bg-teal-50" },
  "Resignation Submitted": { icon: LogOut, color: "text-red-600 bg-red-50" },
};

interface HRActivityFeedProps {
  activities?: any[];
}

export function HRActivityFeed({ activities = [] }: HRActivityFeedProps) {
  const displayActivities = activities.length > 0 ? activities : MOCK_HR_ACTIVITIES;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
      <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
        <h3 className="text-[#0F172A] font-bold">Workforce Activity</h3>
        <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-widest">
          Real-time
        </span>
      </div>

      <div className="divide-y divide-[#F1F5F9]">
        {displayActivities.map((activity) => {
          const config = iconMap[activity.type] || {
            icon: FileText,
            color: "text-gray-600 bg-gray-50",
          };
          const Icon = config.icon;

          return (
            <div key={activity.id} className="p-5 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex gap-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#0F172A] font-medium leading-relaxed">
                      {activity.description
                        .split(" ")
                        .map((word: string, i: number) =>
                          activity.entities.includes(word) ? (
                            <IDChip key={i} id={word} size="xs" className="mx-1" />
                          ) : (
                            word + " "
                          )
                        )}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1.5 font-medium">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full py-4 text-[11px] font-bold text-[#475569] uppercase tracking-widest bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors border-t border-[#F1F5F9]">
        View All History
      </button>
    </div>
  );
}
