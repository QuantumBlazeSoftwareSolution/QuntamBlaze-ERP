"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-page-bg border-t border-divider text-sm text-text-secondary">
      <div className="flex-1">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="p-1 border border-border rounded hover:bg-white hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          className="p-1 border border-border rounded hover:bg-white hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          className="p-1 border border-border rounded hover:bg-white hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          className="p-1 border border-border rounded hover:bg-white hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
