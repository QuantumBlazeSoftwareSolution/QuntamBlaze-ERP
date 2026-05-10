"use client";

import React, { useState } from "react";
import { Search, Filter, FileText, Download, MoreHorizontal, Plus, Eye } from "lucide-react";
import { IDChip } from "@/components/ui/IDChip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "Draft" | "Review" | "Approved" | "Signed";
  updatedAt: string;
}

const MOCK_DOCS: Document[] = [
  {
    id: "PRO-GOOG-26-001",
    name: "Nexus Core Migration Proposal",
    type: "PDF Document",
    size: "2.4 MB",
    status: "Approved",
    updatedAt: "2026-01-05",
  },
  {
    id: "AGR-GOOG-26-001",
    name: "Strategic Partnership Agreement",
    type: "Digital Sign",
    size: "1.1 MB",
    status: "Signed",
    updatedAt: "2026-01-10",
  },
  {
    id: "SRS-GOOG-26-001",
    name: "Core System Requirements Specification",
    type: "Markdown",
    size: "840 KB",
    status: "Review",
    updatedAt: "2026-01-15",
  },
  {
    id: "QTE-GOOG-26-042",
    name: "Infrastructure Scaling Quotation",
    type: "PDF Document",
    size: "1.8 MB",
    status: "Draft",
    updatedAt: "2026-05-02",
  },
];

export function ProjectDocumentsTab() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search orchestration artifacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-black text-[#475569] uppercase tracking-widest hover:bg-[#F8FAFC] transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] transition-all">
            <Plus className="w-4 h-4" />
            Upload Artifact
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DocStatCard label="Total Documents" value="12" subValue="3.4 GB total storage" />
        <DocStatCard label="Pending Review" value="03" subValue="Requires PM approval" />
        <DocStatCard label="Finalized" value="09" subValue="Legally binding artifacts" />
      </div>

      {/* Documents List */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.15em]">
              <th className="px-8 py-4">Artifact ID</th>
              <th className="px-8 py-4">Document Name</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Last Sync</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {MOCK_DOCS.map((doc, idx) => (
              <motion.tr
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-8 py-5">
                  <IDChip id={doc.id} size="xs" variant="accent" />
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] group-hover:bg-[#10B981]/10 group-hover:text-[#10B981] transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A] group-hover:text-[#10B981] transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                        {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      doc.status === "Approved" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                      doc.status === "Signed" && "bg-blue-50 text-blue-600 border-blue-100",
                      doc.status === "Review" && "bg-amber-50 text-amber-600 border-amber-100",
                      doc.status === "Draft" && "bg-slate-50 text-slate-400 border-slate-200"
                    )}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-[11px] font-mono font-bold text-[#64748B]">
                    {doc.updatedAt}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E2E8F0] text-[#94A3B8] hover:text-[#10B981] transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E2E8F0] text-[#94A3B8] hover:text-[#475569] transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E2E8F0] text-[#94A3B8] hover:text-[#475569] transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocStatCard({ label, value, subValue }: { label: string; value: string; subValue: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
      <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-[#0F172A]">{value}</span>
        <span className="text-[11px] font-bold text-[#64748B]">{subValue}</span>
      </div>
    </div>
  );
}
