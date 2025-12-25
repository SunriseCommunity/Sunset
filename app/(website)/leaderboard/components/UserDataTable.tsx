"use client";

import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
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
import * as React from "react";
import { createContext, useEffect, useState } from "react";

import ImageWithFallback from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
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
import { useT } from "@/lib/i18n/utils";
import type { UserResponse } from "@/lib/types/api";
import { LeaderboardSortType } from "@/lib/types/api";

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: TData[];
  totalCount: number;
  leaderboardType: LeaderboardSortType;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: OnChangeFn<PaginationState>;
}

export const UserTableContext = createContext<any>(null);

export function UserDataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pagination,
  leaderboardType,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const t = useT("pages.leaderboard.table");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility]
    = React.useState<VisibilityState>({});

  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { pagination, sorting, columnVisibility },
  });

  useEffect(() => {
    if (leaderboardType === LeaderboardSortType.PP) {
      table.getColumn("ranked_score")?.toggleVisibility(false);
      table.getColumn("pp")?.toggleVisibility(true);
    }
    else if (leaderboardType === LeaderboardSortType.SCORE) {
      table.getColumn("ranked_score")?.toggleVisibility(true);
      table.getColumn("pp")?.toggleVisibility(false);
    }
  }, [leaderboardType, table]);

  return (
    <div>
      <div className="rounded-md border">
        <UserTableContext value={table}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="smooth-transition group relative isolate overflow-hidden hover:translate-x-2"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}

                    <>
                      <div className="absolute inset-0 -z-10 overflow-hidden">
                        <ImageWithFallback
                          src={`${(row.original as { user: UserResponse }).user.banner_url}&default=false`}
                          alt="user bg"
                          fill={true}
                          objectFit="cover"
                          className="relative -z-20 -translate-x-2/4"
                          fallBackSrc="/images/placeholder.png"
                          fallBackClassName="opacity-0 group-hover:opacity-30"
                        />
                      </div>
                      <div className="smooth-transition absolute inset-0 -z-10 -mx-1 bg-gradient-to-l from-accent via-accent to-accent/75 group-hover:to-accent/50" />
                    </>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("emptyState")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </UserTableContext>
      </div>
      <div className="grid space-y-4 py-4 md:flex md:place-content-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Select
            onValueChange={v =>
              setPagination({ pageIndex: 0, pageSize: Number(v) })}
            defaultValue={pagination.pageSize.toString()}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <p>{t("pagination.usersPerPage")}</p>
        </div>

        <div className="flex items-center ">
          <p>
            {t("pagination.showing", {
              start: Math.min(
                pagination.pageIndex * pagination.pageSize + 1,
                totalCount,
              ),
              end: Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                totalCount,
              ),
              total: totalCount,
            })}
          </p>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
