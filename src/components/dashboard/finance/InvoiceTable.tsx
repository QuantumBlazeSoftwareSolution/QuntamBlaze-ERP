"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Download,
  Send,
  CheckCircle,
} from "lucide-react";
import { Invoice } from "@/types/invoice";
import { IDChip } from "@/components/ui/IDChip";
import { InvoiceStatusChip } from "@/components/ui/InvoiceStatusChip";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { InvoiceDetailSheet } from "./InvoiceDetailSheet";

const columnHelper = createColumnHelper<Invoice>();

export function InvoiceTable({ data }: { data: Invoice[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-accent transition-colors"
            onClick={() => column.toggleSorting()}
          >
            ID <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => <IDChip id={info.getValue()} />,
      }),
      columnHelper.accessor("projectId", {
        header: "PRJ-ID",
        cell: (info) => (
          <IDChip id={info.getValue()} className="bg-page-bg border-border text-text-muted" />
        ),
      }),
      columnHelper.accessor("clientId", {
        header: "CLIENT",
        cell: (info) => (
          <IDChip id={info.getValue()} className="bg-accent/5 border-accent/20 text-accent" />
        ),
      }),
      columnHelper.accessor("issueDate", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-accent transition-colors"
            onClick={() => column.toggleSorting()}
          >
            ISSUE DATE <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => <span className="text-[13px] text-text-secondary">{info.getValue()}</span>,
      }),
      columnHelper.accessor("dueDate", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-accent transition-colors"
            onClick={() => column.toggleSorting()}
          >
            DUE DATE <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => (
          <span
            className={cn(
              "text-[13px] font-medium",
              info.row.original.status === "Overdue" ? "text-danger" : "text-text-secondary"
            )}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("amount", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-2 hover:text-accent transition-colors"
            onClick={() => column.toggleSorting()}
          >
            AMOUNT <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell: (info) => (
          <span className="text-[14px] font-mono font-bold text-text-primary">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("tax", {
        header: "TAX",
        cell: (info) => (
          <span className="text-[13px] font-mono text-text-muted">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "STATUS",
        cell: (info) => <InvoiceStatusChip status={info.getValue()} />,
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
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="w-full bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-divider flex items-center justify-between bg-page-bg">
          <h2 className="text-[14px] font-bold text-text-primary tracking-tight">Invoice Ledger</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:text-accent transition-colors">
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button className="p-2 text-text-muted hover:text-accent transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-divider bg-page-bg">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="relative">
              <AnimatePresence mode="popLayout">
                {table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "group border-b border-divider hover:bg-page-bg transition-all cursor-pointer",
                      row.original.status === "Overdue" && "bg-red-50/40"
                    )}
                    onClick={() => setSelectedInvoice(row.original)}
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
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-divider bg-page-bg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-text-muted">Showing 1 to 10 of {data.length}</span>
            <select className="bg-white border border-border rounded px-2 py-1 text-[11px] text-text-secondary focus:outline-none">
              <option>10 / page</option>
              <option>25 / page</option>
              <option>50 / page</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded border border-border text-[11px] font-bold text-text-muted hover:text-text-primary disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 rounded border border-border text-[11px] font-bold text-text-primary hover:bg-page-bg">
              Next
            </button>
          </div>
        </div>
      </div>

      <InvoiceDetailSheet invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </>
  );
}
