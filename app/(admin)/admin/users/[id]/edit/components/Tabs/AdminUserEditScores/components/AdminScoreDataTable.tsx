"use client";

import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useEffect, useState } from "react";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminScoreResponse } from "@/lib/types/api";

interface AdminScoreDataTableProps {
  columns: Array<ColumnDef<AdminScoreResponse, unknown>>;
  data: AdminScoreResponse[];
  totalCount: number;
  isLoading: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: OnChangeFn<PaginationState>;
  onSelectionIdsChange: (ids: number[]) => void;
}

export function AdminScoreDataTable({
  columns,
  data,
  totalCount,
  isLoading,
  pagination,
  setPagination,
  onSelectionIdsChange,
}: AdminScoreDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const pageCount = Math.max(1, Math.ceil(totalCount / pagination.pageSize));

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount,
    getRowId: row => row.score.id.toString(),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const selected = table.getSelectedRowModel().rows.map(row => row.original.score.id);
    onSelectionIdsChange(selected);
  }, [onSelectionIdsChange, rowSelection, table]);

  useEffect(() => {
    setRowSelection({});
  }, [data]);

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border">
        {isLoading && data.length === 0
          ? (
              <Card className="border-0 p-6">
                <CardContent className="flex items-center justify-center p-0">
                  <Spinner />
                </CardContent>
              </Card>
            )
          : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="h-8 px-2 text-[11px] font-medium uppercase text-muted-foreground">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length
                    ? (
                        table.getRowModel().rows.map(row => (
                          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                            {row.getVisibleCells().map(cell => (
                              <TableCell key={cell.id} className="p-2 align-top">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )
                    : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                            No scores found.
                          </TableCell>
                        </TableRow>
                      )}
                </TableBody>
              </Table>
            )}
      </div>

      <AdminScorePagination
        table={table}
        totalCount={totalCount}
        pagination={pagination}
        setPagination={setPagination}
        selectedCount={selectedRows.length}
      />
    </div>
  );
}

function AdminScorePagination({
  table,
  totalCount,
  pagination,
  setPagination,
  selectedCount,
}: {
  table: ReturnType<typeof useReactTable<AdminScoreResponse>>;
  totalCount: number;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: OnChangeFn<PaginationState>;
  selectedCount: number;
}) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pagination.pageSize));

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Select
          value={pagination.pageSize.toString()}
          onValueChange={value => setPagination({ pageIndex: 0, pageSize: Number(value) })}
        >
          <SelectTrigger className="h-8 w-[92px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">per page</span>
      </div>

      <div className="text-xs text-muted-foreground">
        {totalCount}
        {" "}
        total
        {selectedCount > 0 && ` • ${selectedCount} selected`}
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-1 text-xs text-muted-foreground">
          {`Page ${pagination.pageIndex + 1} of ${pageCount}`}
        </span>
        <Button variant="outline" size="icon" className="size-7" onClick={() => table.setPageIndex(0)} disabled={pagination.pageIndex === 0}>
          <ChevronsLeft className="size-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="size-7" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <ChevronLeft className="size-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="size-7" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <ChevronRight className="size-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="size-7" onClick={() => table.setPageIndex(pageCount - 1)} disabled={pagination.pageIndex === pageCount - 1}>
          <ChevronsRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
