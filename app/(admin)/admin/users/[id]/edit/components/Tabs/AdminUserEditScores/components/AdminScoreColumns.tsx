"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminScoreResponse } from "@/lib/types/api";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import numberWith from "@/lib/utils/numberWith";

import BeatmapCellContent from "./BeatmapCellContent";

export function useAdminScoreColumns(): Array<ColumnDef<AdminScoreResponse>> {
  return useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "score.id",
        header: "Score ID",
        cell: ({ row }) => <span className="text-xs">#{row.original.score.id}</span>,
      },
      {
        accessorKey: "score.grade",
        header: "Grade",
        cell: ({ row }) => (
          <span className={`text-${getGradeColor(row.original.score.grade)} text-sm font-bold`}>
            {row.original.score.grade}
          </span>
        ),
      },
      {
        accessorKey: "score.is_passed",
        header: "Pass",
        cell: ({ row }) => row.original.score.is_passed
          ? <Check className="size-4 text-green-500" />
          : <X className="size-4 text-red-500" />,
      },
      {
        id: "preview",
        header: "",
        cell: ({ row }) => (
          <Suspense fallback={<span className="text-xs text-muted-foreground">Loading...</span>}>
            <BeatmapCellContent
              beatmapId={row.original.score.beatmap_id}
              whenSubmitted={row.original.score.when_played}
            />
          </Suspense>
        ),
      },
      {
        accessorKey: "score.total_score",
        header: "Score",
        cell: ({ row }) => <span className="text-xs">{numberWith(row.original.score.total_score, ",")}</span>,
      },
      {
        accessorKey: "score.performance_points",
        header: "PP",
        cell: ({ row }) => <span className="text-xs">{row.original.score.performance_points.toFixed(2)}</span>,
      },
      {
        accessorKey: "score.accuracy",
        header: "Acc",
        cell: ({ row }) => <span className="text-xs">{row.original.score.accuracy.toFixed(2)}%</span>,
      },
      {
        accessorKey: "score.mods",
        header: "Mods",
        cell: ({ row }) => (
          <span className="max-w-20 truncate text-xs" title={row.original.score.mods || "-"}>
            {row.original.score.mods || "-"}
          </span>
        ),
      },
      {
        accessorKey: "submission_status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant="outline" className="text-[11px]">
            {row.original.submission_status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const scoreId = row.original.score.id;
          return (
            <Button asChild variant="secondary" size="sm" className="h-7 px-2 text-xs">
              <Link href={`/admin/scores/${scoreId}`}>Open</Link>
            </Button>
          );
        },
      },
    ],
    [],
  );
}
