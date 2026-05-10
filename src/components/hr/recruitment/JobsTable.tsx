"use client";

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Job } from '@/types/hr';
import { IDChip } from '@/components/ui/IDChip';
import { MoreHorizontal, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobsTableProps {
  data: Job[];
}

const columnHelper = createColumnHelper<Job>();

const deptColorMap: Record<string, string> = {
  Engineering: "bg-blue-50 text-blue-600 border-blue-100",
  Finance: "bg-amber-50 text-amber-600 border-amber-100",
  Design: "bg-violet-50 text-violet-600 border-violet-100",
  Marketing: "bg-pink-50 text-pink-600 border-pink-100",
  Operations: "bg-teal-50 text-teal-600 border-teal-100",
  HR: "bg-cyan-50 text-cyan-600 border-cyan-100",
  Sales: "bg-red-50 text-red-600 border-red-100",
};

const statusColorMap: Record<string, string> = {
  Active: "bg-green-50 text-green-600 border-green-200",
  Paused: "bg-amber-50 text-amber-600 border-amber-200",
  Closed: "bg-gray-100 text-gray-500 border-gray-200",
  Draft: "bg-slate-50 text-slate-400 border-slate-200",
};

export function JobsTable({ data }: JobsTableProps) {
  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'JOB-ID',
      cell: info => <IDChip id={info.getValue()} size="xs" />,
    }),
    columnHelper.accessor('title', {
      header: 'Job Title',
      cell: info => (
        <div className="flex flex-col">
          <span className="text-[#0F172A] font-medium">{info.getValue()}</span>
          <span className="text-[#94A3B8] text-[11px] mt-0.5">{info.row.original.seniorityLevel} • {info.row.original.employmentType}</span>
        </div>
      ),
    }),
    columnHelper.accessor('department', {
      header: 'Department',
      cell: info => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
          deptColorMap[info.getValue()] || "bg-gray-50 text-gray-600 border-gray-100"
        )}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('locationType', {
      header: 'Location',
      cell: info => (
        <div className="flex items-center gap-1.5 text-[#64748B] text-xs">
          <MapPin className="w-3 h-3" />
          <span>{info.getValue()}{info.row.original.city ? ` (${info.row.original.city})` : ''}</span>
        </div>
      ),
    }),
    columnHelper.accessor('pipelineCount', {
      header: 'In Pipeline',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="bg-[#F1F5F9] rounded-full px-2 py-0.5 flex items-center gap-1.5 border border-[#E2E8F0]">
            <Users className="w-3 h-3 text-[#64748B]" />
            <span className="text-xs font-semibold text-[#475569]">{info.getValue()}</span>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={cn(
          "px-2 py-0.5 rounded-md text-[10px] font-bold border",
          statusColorMap[info.getValue()] || "bg-gray-50 text-gray-600 border-gray-100"
        )}>
          {info.getValue().toUpperCase()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => (
        <button className="p-1 hover:bg-[#F1F5F9] rounded-md transition-colors text-[#94A3B8] hover:text-[#475569]">
          <MoreHorizontal className="w-4 h-4" />
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
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-6 py-4 text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-[#F1F5F9]">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-[#F8FAFC] transition-colors group">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
