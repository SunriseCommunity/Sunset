"use client";

import { ScoreTableContext } from "@/app/beatmapsets/components/leaderboard/ScoreDataTable";
import { Tooltip } from "@/components/Tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserHoverCard from "@/components/UserHoverCard";
import { Score } from "@/lib/hooks/api/score/types";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import { GameMode } from "@/lib/hooks/api/types";
import useSelf from "@/lib/hooks/useSelf";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import numberWith from "@/lib/utils/numberWith";
import { timeSince } from "@/lib/utils/timeSince";
import toPrettyDate from "@/lib/utils/toPrettyDate";
import { Column, ColumnDef, HeaderContext } from "@tanstack/react-table";
import { MoreHorizontal, SortAsc, SortDesc } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useContext } from "react";

export const scoreColumns: ColumnDef<Score>[] = [
  {
    accessorKey: "rank",
    sortingFn: (a, b) => {
      return a.index - b.index;
    },
    header: ({ column }) => sortableHeader({ column, title: "Rank" }),
    cell: ({ row }) => {
      const value = row.index + 1;

      return <div className="text-center whitespace-nowrap"># {value}</div>;
    },
  },
  {
    accessorKey: "grade",
    header: "",
    cell: ({ row }) => {
      const { grade } = row.original;
      return (
        <p className={`text-${getGradeColor(grade)} text-lg text-shadow`}>
          {grade}
        </p>
      );
    },
  },
  {
    accessorKey: "total_score",
    header: ({ column }) => sortableHeader({ column, title: "Score" }),
    cell: ({ row }) => {
      const formatted = numberWith(row.original.total_score, ",");
      return <p className={row.index === 0 ? "font-bold" : ""}>{formatted}</p>;
    },
  },
  {
    accessorKey: "accuracy",
    header: ({ column }) => sortableHeader({ column, title: "Accuracy" }),
    cell: ({ row }) => {
      const { accuracy } = row.original;
      const formatted = accuracy.toFixed(2);

      return (
        <div className={accuracy === 100 ? "text-primary" : ""}>
          {formatted}%
        </div>
      );
    },
  },
  {
    accessorKey: "flag",
    header: "",
    cell: ({ row }) => {
      const countryCode = row.original.user.country_code;
      return (
        <Image
          src={`/images/flags/${countryCode}.png`}
          alt="User Flag"
          className="mr-2 min-w-3"
          width={18}
          height={18}
        />
      );
    },
  },
  {
    accessorKey: "user.username",
    header: ({ column }) => sortableHeader({ column, title: "Player" }),
    cell: ({ row }) => {
      const userId = row.original.user.user_id;
      const username = row.original.user.username;

      return (
        <div className="flex flex-row items-center space-x-2">
          <Avatar className="border-2 border-white h-8 w-8">
            <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
              <Image
                src={row.original.user.avatar_url}
                alt="logo"
                width={50}
                height={50}
              />
            </Suspense>
          </Avatar>

          <UserHoverCard user={row.original.user} asChild>
            <Link href={`/user/${userId}`} className="hover:underline">
              {username}
            </Link>
          </UserHoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "max_combo",
    header: ({ column }) => sortableHeader({ column, title: "Max Combo" }),
    cell: ({ row }) => {
      const maxPossibleCombo = useContext(ScoreTableContext)?.beatmap.max_combo;
      const { max_combo } = row.original;

      return (
        <div className={max_combo === maxPossibleCombo ? "text-primary" : ""}>
          {max_combo}x
        </div>
      );
    },
  },
  {
    accessorKey: "count_geki",
    header: ({ column }) => sortableHeader({ column, title: "Perfect" }),
    cell: ({ row }) => {
      const { count_geki } = row.original;

      return (
        <div className={count_geki === 0 ? "text-muted-foreground" : ""}>
          {count_geki}
        </div>
      );
    },
  },
  {
    accessorKey: "count_300",
    header: ({ column }) => sortableHeader({ column, title: "Great" }),
    cell: ({ row }) => {
      const { count_300 } = row.original;

      return (
        <div className={count_300 === 0 ? "text-muted-foreground" : ""}>
          {count_300}
        </div>
      );
    },
  },
  {
    accessorKey: "count_katu",
    header: ({ column }) => sortableHeader({ column, title: "Good" }),
    cell: ({ row }) => {
      const { count_katu } = row.original;

      return (
        <div className={count_katu === 0 ? "text-muted-foreground" : ""}>
          {count_katu}
        </div>
      );
    },
  },
  {
    accessorKey: "count_100",
    header: ({ column }) =>
      sortableHeader({
        column,
        title:
          gameModeToVanilla(
            useContext(ScoreTableContext)?.gamemode ?? GameMode.std
          ) === GameMode.catch
            ? "L DRP"
            : "Ok",
      }),
    cell: ({ row }) => {
      const { count_100 } = row.original;

      return (
        <div className={count_100 === 0 ? "text-muted-foreground" : ""}>
          {count_100}
        </div>
      );
    },
  },
  {
    accessorKey: "count_50",
    header: ({ column }) =>
      sortableHeader({
        column,
        title:
          gameModeToVanilla(
            useContext(ScoreTableContext)?.gamemode ?? GameMode.std
          ) === GameMode.catch
            ? "S DRP"
            : "Meh",
      }),
    cell: ({ row }) => {
      const { count_50 } = row.original;

      return (
        <div className={count_50 === 0 ? "text-muted-foreground" : ""}>
          {count_50}
        </div>
      );
    },
  },
  {
    accessorKey: "count_miss",
    header: ({ column }) => sortableHeader({ column, title: "Miss" }),
    cell: ({ row }) => {
      const { count_miss } = row.original;

      return (
        <div className={count_miss === 0 ? "text-muted-foreground" : ""}>
          {count_miss}
        </div>
      );
    },
  },
  {
    accessorKey: "performance_points",
    header: ({ column }) => sortableHeader({ column, title: "PP" }),
    cell: ({ row }) => {
      const { performance_points } = row.original;
      const formatted = numberWith(performance_points.toFixed(2), ",");

      return formatted;
    },
  },
  {
    accessorKey: "when_played",
    header: ({ column }) => sortableHeader({ column, title: "Time" }),
    cell: ({ row }) => {
      const { when_played } = row.original;

      return (
        <Tooltip content={toPrettyDate(when_played, true)}>
          {timeSince(when_played, undefined, true)}
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "mods_int",
    header: ({ column }) => sortableHeader({ column, title: "Mods" }),
    cell: ({ row }) => {
      const { mods } = row.original;
      return mods;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const score = row.original;

      const { self } = useSelf();
      const { downloadReplay } = useDownloadReplay(score.id);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/score/${score.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={downloadReplay}
              disabled={!self || !score.has_replay}
            >
              Download Replay
            </DropdownMenuItem>
            {/* TODO: Add report score option */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const sortableHeader = ({
  column,
  title,
}: {
  column: Column<Score, unknown>;
  title: string;
}) => {
  return (
    <Button
      variant="ghost"
      className="px-1"
      size="sm"
      onClick={() => {
        column.toggleSorting(column.getIsSorted() === "asc");
      }}
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <SortAsc />
      ) : column.getIsSorted() === "desc" ? (
        <SortDesc />
      ) : null}
    </Button>
  );
};
