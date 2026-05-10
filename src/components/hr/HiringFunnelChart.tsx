"use client";

import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { HIRING_FUNNEL_DATA } from "@/lib/mockData/hr";

const COLORS = ["#94A3B8", "#3B82F6", "#8B5CF6", "#F59E0B", "#10B981"];

export function HiringFunnelChart() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#0F172A] font-bold">Hiring Funnel</h3>
        <span className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-widest">
          ATS Conversion
        </span>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
            <Funnel dataKey="value" data={HIRING_FUNNEL_DATA} isAnimationActive>
              <LabelList position="right" fill="#64748B" stroke="none" dataKey="stage" />
              {HIRING_FUNNEL_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
