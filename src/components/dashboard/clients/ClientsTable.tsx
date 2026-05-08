"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, ExternalLink, Edit2, UserMinus } from "lucide-react";
import { Client } from "@/types/client";
import { IDChip } from "@/components/ui/IDChip";
import { getColorFromString, getInitials } from "@/lib/utils/colorHash";
import { getIndustryColor } from "@/lib/industryColors";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<Client>();

export function ClientsTable({ data }: { data: Client[] }) {
  const columns = useMemo(() => [
    columnHelper.accessor("id", {
      header: "CLI-ID",
      cell: (info) => (
        <IDChip id={info.getValue()} href={`/dashboard/clients/${info.getValue()}`} />
      ),
    }),
    columnHelper.accessor("name", {
      header: "Company Name",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-[#050505]"
            style={{ backgroundColor: getColorFromString(info.getValue()) }}
          >
            {getInitials(info.getValue())}
          </div>
          <span className="text-[14px] font-bold text-text-primary">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("contactPerson", {
      header: "Primary Contact",
      cell: (info) => (
        <span className="text-[13px] text-text-secondary">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("industry", {
      header: "Industry",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ backgroundColor: getIndustryColor(info.getValue()) }} 
          />
          <span className="text-[12px] text-text-secondary">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("activeProjects", {
      header: "Active Projects",
      cell: (info) => {
        const projects = info.getValue();
        return (
          <div className="flex items-center gap-2">
            {projects.slice(0, 2).map((pid) => (
              <IDChip key={pid} id={pid} className="bg-accent/5 border-accent/20 text-accent" />
            ))}
            {projects.length > 2 && (
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-border text-[9px] font-bold text-text-muted">
                +{projects.length - 2}
              </span>
            )}
            {projects.length === 0 && (
              <span className="text-[11px] text-text-muted">0</span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("totalBilled", {
      header: "Total Billed",
      cell: (info) => (
        <span className="text-[14px] font-mono font-medium text-text-primary">
          ${(info.getValue() / 1000000).toFixed(1)}M
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-current/20 text-[9px] font-bold uppercase tracking-wider",
          info.getValue() === "Active" ? "text-success bg-success/10" : "text-text-muted bg-white/5"
        )}>
          <div className={cn("w-1 h-1 rounded-full", info.getValue() === "Active" ? "bg-success" : "bg-text-muted")} />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: () => (
        <button className="p-1.5 text-text-muted hover:text-text-primary transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      ),
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-bg-card/30">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border bg-bg-surface/50">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 text-left text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em]">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <AnimatePresence>
            {table.getRowModel().rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group border-b border-border/50 hover:bg-white/[0.02] transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      
      {/* Summary Row */}
      <div className="sticky bottom-0 w-full px-6 py-5 bg-bg-surface border-t border-border flex items-center justify-between z-10">
        <div className="flex items-center gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Clients</p>
            <p className="text-xl font-bold text-text-primary">{data.length}</p>
          </div>
          <div className="w-[1px] h-8 bg-border" />
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Projects</p>
            <p className="text-xl font-bold text-text-primary">
              {data.reduce((acc, c) => acc + c.activeProjects.length, 0)}
            </p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Aggregate Billing</p>
          <p className="text-3xl font-bold text-accent tracking-tighter">
            ${(data.reduce((acc, c) => acc + c.totalBilled, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    </div>
  );
}
