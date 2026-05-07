"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { MOCK_PROJECTS } from "@/lib/mockData/projects";
import { projectColumns } from "@/lib/tableColumns/projectColumns";

export function useProjectsTable(statusFilter?: string, clientFilter?: string) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  // Sync external filter props into TanStack column filters
  useEffect(() => {
    const filters: ColumnFiltersState = [];
    if (statusFilter) filters.push({ id: "status", value: statusFilter });
    if (clientFilter) filters.push({ id: "clientId", value: [clientFilter] });
    setColumnFilters(filters);
  }, [statusFilter, clientFilter]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_PROJECTS,
    columns: projectColumns,
    state: { sorting, columnFilters, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table, sorting, columnFilters, setColumnFilters };
}
