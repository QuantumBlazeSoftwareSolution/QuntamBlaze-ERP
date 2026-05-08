"use client";

import { useIDConfigStore } from "@/store/idConfigStore";
import { IDSequenceRow } from "./IDSequenceRow";
import { Settings2 } from "lucide-react";

export function IDConfigTable() {
  const { configs } = useIDConfigStore();
  const configList = Object.values(configs);

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-border bg-white/[0.02]">
         <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-text-primary">Identity Configuration</h3>
         </div>
         <p className="text-[13px] text-text-muted mt-2">Manage the sequence counters and patterns for all system entities.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A0A0A] border-b border-border">
              <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest">Entity Type</th>
              <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest">ID Pattern</th>
              <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest">Next ID Preview</th>
              <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">Counter</th>
              <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {configList.map((config) => (
              <IDSequenceRow key={config.type} config={config} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
