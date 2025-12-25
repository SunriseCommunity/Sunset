"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SortAsc, SortDesc } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useContext, useMemo } from "react";

import { ScoreTableContext } from "@/app/(website)/beatmapsets/components/leaderboard/ScoreDataTable";
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
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { ScoreResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import numberWith from "@/lib/utils/numberWith";
import { timeSince } from "@/lib/utils/timeSince";
import toPrettyDate from "@/lib/utils/toPrettyDate";

export function useScoreColumns(): Array<ColumnDef<ScoreResponse>> {
  const t = useT("pages.beatmapsets.components.leaderboard");

  return useMemo(
    () => [
      {
        accessorKey: "rank",
        sortingFn: (a, b) => {
          return a.index - b.index;
        },
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.rank") }),
        cell: ({ row }) => {
          const value = row.index + 1;

          return <div className="whitespace-nowrap text-center"># {value}</div>;
        },
      },
      {
        accessorKey: "grade",
        header: "",
        cell: ({ row }) => {
          const { grade } = row.original;
          return (
            <p className={`text-${getGradeColor(grade)} text-shadow text-lg`}>
              {grade}
            </p>
          );
        },
      },
      {
        accessorKey: "total_score",
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.score") }),
        cell: ({ row }) => {
          const formatted = numberWith(row.original.total_score, ",");
          return (
            <p className={row.index === 0 ? "font-bold" : ""}>{formatted}</p>
          );
        },
      },
      {
        accessorKey: "accuracy",
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.accuracy") }),
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
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.player") }),
        cell: ({ row }) => {
          const userId = row.original.user.user_id;
          const { username } = row.original.user;

          return (
            <div className="flex flex-row items-center space-x-2">
              <Avatar className="size-8 border-2 border-white">
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
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.maxCombo") }),
        cell: ({ row }) => {
          const maxPossibleCombo
          // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
            = useContext(ScoreTableContext)?.beatmap.max_combo;
          const { max_combo } = row.original;

          return (
            <div
              className={max_combo === maxPossibleCombo ? "text-primary" : ""}
            >
              {max_combo}x
            </div>
          );
        },
      },
      {
        accessorKey: "count_geki",
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.perfect") }),
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
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.great") }),
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
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.good") }),
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
                // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
                useContext(ScoreTableContext)?.gamemode ?? GameMode.STANDARD,
              ) === GameMode.CATCH_THE_BEAT
                ? t("columns.lDrp")
                : t("columns.ok"),
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
                // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
                useContext(ScoreTableContext)?.gamemode ?? GameMode.STANDARD,
              ) === GameMode.CATCH_THE_BEAT
                ? t("columns.sDrp")
                : t("columns.meh"),
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
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.miss") }),
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
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.pp") }),
        cell: ({ row }) => {
          const { performance_points } = row.original;
          const formatted = numberWith(performance_points.toFixed(2), ",");

          return formatted;
        },
      },
      {
        accessorKey: "when_played",
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.time") }),
        cell: ({ row }) => {
          const { when_played } = row.original;

          return (
            <Tooltip
              content={toPrettyDate(when_played, true)}
              className="text-nowrap"
            >
              {timeSince(when_played, undefined, true)}
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "mods_int",
        header: ({ column }) =>
          sortableHeader({ column, title: t("columns.mods") }),
        cell: ({ row }) => {
          const { mods } = row.original;
          return mods;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const score = row.original;

          // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
          const { self } = useSelf();
          // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
          const { downloadReplay } = useDownloadReplay(score.id);

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">{t("actions.openMenu")}</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/score/${score.id}`}>
                    {t("actions.viewDetails")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={downloadReplay}
                  disabled={!self || !score.has_replay}
                >
                  {t("actions.downloadReplay")}
                </DropdownMenuItem>
                {/* TODO: Add report score option */}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t],
  );
}

function sortableHeader({
  column,
  title,
}: {
  column: Column<ScoreResponse, unknown>;
  title: string;
}) {
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
      ) : column.getIsSorted() === "desc"
        ? (
            <SortDesc />
          )
        : null}
    </Button>
  );
}
