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

import { createContext, useEffect, useState } from "react";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { BeatmapResponse, GameMode } from "@/lib/types/api";
import { useT } from "@/lib/i18n/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  beatmap: BeatmapResponse;
  gameMode: GameMode;
  totalCount: number;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: OnChangeFn<PaginationState>;
}

export const ScoreTableContext = createContext<{
  beatmap: BeatmapResponse;
  gamemode: GameMode;
} | null>(null);

export function ScoreDataTable<TData, TValue>({
  columns,
  data,
  beatmap,
  gameMode,
  totalCount,
  pagination,
  setPagination,
}: DataTableProps<TData, TValue>) {
  const t = useT("pages.beatmapsets.components.leaderboard.table");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [preferedNumberOfScores, setPreferedNumberOfScores] = useState(() => {
    return localStorage.getItem("preferedNumberOfScoresPerLeaderboard") || "50";
  });

  useEffect(() => {
    localStorage.setItem(
      "preferedNumberOfScoresPerLeaderboard",
      preferedNumberOfScores
    );
  }, [preferedNumberOfScores]);

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
    state: { pagination, columnVisibility, sorting },
  });

  useEffect(() => {
    const vanillaGamemode = gameModeToVanilla(gameMode);

    const visibility = [
      {
        id: "count_geki",
        shouldShow: [GameMode.MANIA].includes(vanillaGamemode),
      },
      {
        id: "count_katu",
        shouldShow: [GameMode.MANIA].includes(vanillaGamemode),
      },
      {
        id: "count_50",
        shouldShow: [
          GameMode.STANDARD,
          GameMode.MANIA,
          GameMode.CATCH_THE_BEAT,
        ].includes(vanillaGamemode),
      },
      { id: "performance_points", shouldShow: !!beatmap.ranked },
    ];

    visibility.forEach((element) => {
      table.getColumn(element.id)?.toggleVisibility(element.shouldShow);
    });
  }, [beatmap, gameMode]);

  return (
    <div>
      <div className="rounded-md border">
        <ScoreTableContext.Provider value={{ beatmap, gamemode: gameMode }}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="px-0.5" key={header.id}>
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="px-1" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
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
        </ScoreTableContext.Provider>
      </div>
      <div className="grid md:place-content-between py-4 md:space-y-0 space-y-4 md:flex">
        <div className="flex items-center space-x-2">
          <Select
            onValueChange={(v) => {
              setPagination({ pageIndex: 0, pageSize: Number(v) });
              setPreferedNumberOfScores(v);
            }}
            defaultValue={pagination.pageSize.toString()}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <p>{t("pagination.scoresPerPage")}</p>
        </div>

        <div className="flex items-center ">
          <p>
            {t("pagination.showing", {
              start: Math.min(
                pagination.pageIndex * pagination.pageSize + 1,
                totalCount
              ),
              end: Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                totalCount
              ),
              total: totalCount,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
