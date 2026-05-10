"use client";

import { flexRender } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { useProjectsTable } from "@/hooks/useProjectsTable";

interface ProjectsTableProps {
  statusFilter?: string;
  clientFilter?: string;
}

export function ProjectsTable({ statusFilter, clientFilter }: ProjectsTableProps) {
  const { table } = useProjectsTable(statusFilter, clientFilter);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-divider bg-white shadow-sm">
      <table className="w-full min-w-[900px]">
        {/* Header */}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-divider bg-page-bg">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3.5 text-left text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] whitespace-nowrap"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Body */}
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2, ease: "easeOut" }}
              className="border-b border-divider hover:bg-page-bg transition-colors group"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3.5 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {table.getRowModel().rows.length === 0 && (
        <div className="p-12 text-center text-text-secondary text-sm">
          No projects match the current filters.
        </div>
      )}
    </div>
  );
}
