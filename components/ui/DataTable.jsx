"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import Input from "./Input";
import EmptyState from "./EmptyState";
import { TableSkeleton } from "./Skeleton";
import { cn } from "@/utils/cn";

// Generic, reusable table: search + sort + pagination + row actions.
// Every module (Employees, Departments, Payroll, Recruitment, ...) renders
// through this instead of hand-rolling its own <table>.
export default function DataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  pageSize = 8,
  loading = false,
  emptyTitle = "No records found",
  emptyDescription,
  rowKey = "id",
  extraFilters,
  onRowClick,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const filtered = useMemo(() => {
    let rows = [...data];

    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter((row) =>
        searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
      );
    }

    if (sort.key) {
      rows.sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (av === bv) return 0;
        const result = av > bv ? 1 : -1;
        return sort.dir === "asc" ? result : -result;
      });
    }

    return rows;
  }, [data, search, searchKeys, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }

  return (
    <div>
      {(searchable || extraFilters) && (
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
          )}
          {extraFilters}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[rgb(var(--border-subtle))]">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[rgb(var(--border-subtle))] bg-surface-2">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-secondary whitespace-nowrap",
                    col.sortable && "cursor-pointer select-none hover:text-primary"
                  )}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <TableSkeleton cols={columns.length} />
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={row[rowKey]}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-[rgb(var(--border-subtle))] last:border-0 bg-surface hover:bg-surface-2/60 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2 align-middle text-xs text-primary">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > pageSize && (
        <div className="mt-3 flex items-center justify-between text-xs text-secondary">
          <span>
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-[rgb(var(--border-subtle))] p-1 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border border-[rgb(var(--border-subtle))] p-1 disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}