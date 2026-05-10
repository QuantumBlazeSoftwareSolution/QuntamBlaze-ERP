"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronUp, ChevronDown, User } from "lucide-react";
import { Receipt } from "@/types/receipt";
import { IDChip } from "@/components/ui/IDChip";
import { PaymentMethodChip } from "@/components/ui/PaymentMethodChip";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<Receipt>();

const columns = [
  columnHelper.accessor("id", {
    header: "RCT-ID",
    cell: (info) => <IDChip id={info.getValue()} />,
  }),
  columnHelper.accessor("invoiceId", {
    header: "INV-ID / Client",
    cell: (info) => (
      <div className="flex flex-col gap-0.5">
        <IDChip
          id={info.getValue()}
          className="bg-transparent border-none p-0 text-accent hover:underline cursor-pointer"
        />
        <span className="text-[10px] text-text-muted font-bold uppercase tracking-tight">
          {info.row.original.clientId} • {info.row.original.clientName}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("paymentDate", {
    header: "Date",
    cell: (info) => <span className="text-text-secondary font-mono">{info.getValue()}</span>,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => (
      <span className="text-text-primary font-bold">{formatCurrency(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("paymentMethod", {
    header: "Method / Ref",
    cell: (info) => (
      <div className="flex items-center gap-3">
        <PaymentMethodChip method={info.getValue()} />
        <span className="text-[11px] text-text-muted font-mono">
          {info.row.original.referenceNumber}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("loggedBy", {
    header: "Logged By",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-white/5 border border-border flex items-center justify-center overflow-hidden">
          {info.getValue().avatar ? (
            <img src={info.getValue().avatar} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent text-[8px] font-bold">
              {info
                .getValue()
                .name.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
        </div>
        <span className="text-[12px] text-text-secondary">{info.getValue().name}</span>
      </div>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "Action",
    cell: () => (
      <button className="p-2 text-text-muted hover:text-accent transition-colors">
        <Download className="w-4 h-4" />
      </button>
    ),
  }),
];

export function ReceiptsTable({ data }: { data: Receipt[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-bg-surface/50 border-b border-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-all"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUp className="w-3 h-3 text-accent" />,
                        desc: <ChevronDown className="w-3 h-3 text-accent" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
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
      </div>
    </div>
  );
}
