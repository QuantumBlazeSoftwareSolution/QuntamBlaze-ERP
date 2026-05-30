"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { ProjectStatus } from "@/types/project";
import { IDChip } from "@/components/ui/IDChip";

interface Project {
  id: string;
  name: string;
  clientId: string;
  startDate: string | Date;
  deadline: string | Date;
  progress: number;
  budget: number;
  status: ProjectStatus;
}
import { ProjectStatusChip } from "@/components/projects/ProjectStatusChip";
import { ProjectProgressBar } from "@/components/projects/ProjectProgressBar";
import { ProjectRowActions } from "@/components/projects/ProjectRowActions";

import { useSystemConfig } from "@/hooks/useSystemConfig";

function BudgetCell({ amount }: { amount: number }) {
  const { formatCurrency } = useSystemConfig();
  return (
    <span className="text-[13px] font-mono text-text-primary">{formatCurrency(amount, true)}</span>
  );
}

function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (isSorted === "asc") return <ChevronUp className="w-3.5 h-3.5 text-accent" />;
  if (isSorted === "desc") return <ChevronDown className="w-3.5 h-3.5 text-accent" />;
  return <ChevronsUpDown className="w-3.5 h-3.5 text-[#3A3A3A]" />;
}

export const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1.5 font-bold tracking-[0.1em] uppercase text-[10px] text-text-secondary hover:text-text-primary transition-colors"
      >
        PRJ-ID <SortIcon isSorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => <IDChip id={row.original.id} />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1.5 font-bold tracking-[0.1em] uppercase text-[10px] text-text-secondary hover:text-text-primary transition-colors"
      >
        Project Name <SortIcon isSorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <Link
        href={`/dashboard/projects/${row.original.id}`}
        className="text-sm font-bold text-text-primary hover:text-accent transition-colors"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "clientId",
    header: () => (
      <span className="font-bold tracking-[0.1em] uppercase text-[10px] text-text-secondary">
        Client
      </span>
    ),
    cell: ({ row }) => (
      <IDChip
        id={row.original.clientId}
        className="text-text-secondary border-border/40 bg-transparent hover:border-border"
      />
    ),
    filterFn: (row, _, filterValues: string[]) => {
      if (!filterValues || filterValues.length === 0) return true;
      return filterValues.includes(row.original.clientId);
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1.5 font-bold tracking-[0.1em] uppercase text-[10px] text-text-secondary hover:text-text-primary transition-colors"
      >
        Start Date <SortIcon isSorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-[13px] font-mono text-text-secondary">
        {format(new Date(row.original.startDate), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1.5 font-bold tracking-[0.1em] uppercase text-[10px] text-text-secondary hover:text-text-primary transition-colors"
      >
        Deadline <SortIcon isSorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-[13px] font-mono text-text-secondary">
        {format(new Date(row.original.deadline), "MMM dd, yyyy")}
      </span>
    ),
  },
  {
    accessorKey: "progress",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1.5 font-bold tracking-[0.1em] uppercase text-[10px] text-text-secondary hover:text-text-primary transition-colors"
      >
        Progress <SortIcon isSorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => <ProjectProgressBar progress={row.original.progress} />,
  },
  {
    accessorKey: "budget",
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-1.5 font-bold tracking-[0.1em] uppercase text-[10px] text-text-secondary hover:text-text-primary transition-colors"
      >
        Budget <SortIcon isSorted={column.getIsSorted()} />
      </button>
    ),
    cell: ({ row }) => <BudgetCell amount={row.original.budget} />,
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="font-bold tracking-[0.1em] uppercase text-[10px] text-text-secondary">
        Status
      </span>
    ),
    cell: ({ row }) => <ProjectStatusChip status={row.original.status} />,
    filterFn: (row, _, filterValue: string) => {
      if (!filterValue) return true;
      return row.original.status === filterValue;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ProjectRowActions projectId={row.original.id} />,
  },
];
