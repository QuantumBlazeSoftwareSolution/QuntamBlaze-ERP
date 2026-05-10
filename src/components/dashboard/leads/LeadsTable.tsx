"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Lead, LeadStatus, MOCK_LEADS } from "@/lib/mockData/leads";
import { IDChip } from "@/components/ui/IDChip";
import { LeadDetailsSheet } from "./LeadDetailsSheet";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const STATUS_CHIP: Record<LeadStatus, string> = {
  New: "bg-blue-50 text-blue-600 border-blue-200",
  Contacted: "bg-purple-50 text-purple-600 border-purple-200",
  Qualified: "bg-accent/10 text-accent border-accent/20",
  Proposal: "bg-amber-50 text-amber-600 border-amber-200",
  Won: "bg-success/10 text-success border-success/20",
  Lost: "bg-red-50 text-red-500 border-red-200",
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? "bg-success" : score >= 40 ? "bg-warning" : "bg-red-400";
  const textColor = score >= 70 ? "text-success" : score >= 40 ? "text-warning" : "text-red-500";
  return (
    <div className="flex items-center gap-2 w-28">
      <div className="flex-1 h-1 bg-page-bg rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[11px] font-bold tabular-nums ${textColor}`}>{score}</span>
    </div>
  );
}

const columnHelper = createColumnHelper<Lead>();

export function LeadsTable({ statusFilter }: { statusFilter: LeadStatus | "all" }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = useMemo(
    () =>
      statusFilter === "all" ? MOCK_LEADS : MOCK_LEADS.filter((l) => l.status === statusFilter),
    [statusFilter]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
            onClick={() => column.toggleSorting()}
          >
            LED-ID <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => <IDChip id={info.getValue()} />,
      }),
      columnHelper.accessor("company", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
            onClick={() => column.toggleSorting()}
          >
            Company <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => (
          <span className="text-[13px] font-bold text-text-primary">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("contactName", {
        header: "Contact",
        cell: (info) => <span className="text-[13px] text-text-secondary">{info.getValue()}</span>,
      }),
      columnHelper.accessor("source", {
        header: "Source",
        cell: (info) => (
          <span className="text-[11px] font-bold text-text-muted px-2 py-1 bg-page-bg rounded-lg border border-divider">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span
            className={cn(
              "text-[11px] font-bold px-2.5 py-1 rounded-full border",
              STATUS_CHIP[info.getValue()]
            )}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("score", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
            onClick={() => column.toggleSorting()}
          >
            Score <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => <ScoreBar score={info.getValue()} />,
      }),
      columnHelper.accessor("estimatedValue", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
            onClick={() => column.toggleSorting()}
          >
            Est. Value <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => (
          <span className="text-[13px] font-mono font-bold text-text-primary">
            {formatCurrency(info.getValue())}
          </span>
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
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="w-full bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-divider bg-page-bg">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3.5 text-left text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.025, duration: 0.2 }}
                    className={cn(
                      "border-b border-divider hover:bg-page-bg transition-colors cursor-pointer",
                      row.original.status === "Lost" && "opacity-60"
                    )}
                    onClick={() => setSelectedLead(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-divider bg-page-bg flex items-center justify-between">
          <span className="text-[12px] text-text-muted">
            {filtered.length} lead{filtered.length !== 1 ? "s" : ""}
          </span>
          <span className="text-[12px] font-mono font-bold text-text-secondary">
            Pipeline: {formatCurrency(filtered.reduce((s, l) => s + l.estimatedValue, 0))}
          </span>
        </div>
      </div>

      <LeadDetailsSheet lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </>
  );
}
