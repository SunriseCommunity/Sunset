"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createContext, useEffect, useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaderboardSortType, UserResponse } from "@/lib/types/api";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
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
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: pageCount,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { pagination, sorting, columnVisibility },
  });

  useEffect(() => {
    if (leaderboardType == LeaderboardSortType.PP) {
      table.getColumn("ranked_score")?.toggleVisibility(false);
      table.getColumn("pp")?.toggleVisibility(true);
    } else if (leaderboardType == LeaderboardSortType.SCORE) {
      table.getColumn("ranked_score")?.toggleVisibility(true);
      table.getColumn("pp")?.toggleVisibility(false);
    }
  }, [leaderboardType]);

  return (
    <div>
      <div className="rounded-md border">
        <UserTableContext.Provider value={table}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="relative overflow-hidden isolate group smooth-transition hover:translate-x-2"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}

                    <>
                      <div className="absolute inset-0 -z-10 overflow-hidden">
                        <ImageWithFallback
                          src={
                            (row.original as { user: UserResponse }).user
                              .banner_url + "&default=false"
                          }
                          alt="user bg"
                          fill={true}
                          objectFit="cover"
                          className="relative -z-20 -translate-x-2/4"
                          fallBackSrc="/images/placeholder.png"
                          fallBackClassName="opacity-0 group-hover:opacity-30"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-l from-accent to-accent/75 via-accent group-hover:to-accent/50 -z-10 -mx-1 smooth-transition" />
                    </>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </UserTableContext.Provider>
      </div>
      <div className="grid md:place-content-between py-4 md:space-y-0 space-y-4 md:flex">
        <div className="flex items-center space-x-2">
          <Select
            onValueChange={(v) =>
              setPagination({ pageIndex: 0, pageSize: Number(v) })
            }
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
          <p>users per page</p>
        </div>

        <div className="flex items-center ">
          <p>
            Showing{" "}
            {Math.min(
              pagination.pageIndex * pagination.pageSize + 1,
              totalCount
            )}{" "}
            -{" "}
            {Math.min(
              (pagination.pageIndex + 1) * pagination.pageSize,
              totalCount
            )}{" "}
            of {totalCount}
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
