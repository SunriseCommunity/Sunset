"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SortAsc, SortDesc } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useContext, useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { UserTableContext } from "@/app/(website)/leaderboard/components/UserDataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserHoverCard from "@/components/UserHoverCard";
import UserRankColor from "@/components/UserRankNumber";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse, UserStatsResponse } from "@/lib/types/api";
import numberWith from "@/lib/utils/numberWith";

export function useUserColumns() {
  const t = useT("pages.leaderboard.table");

  return useMemo(
    () =>
      [
        {
          accessorKey: "stats.rank",
          sortingFn: (a, b) => {
            return a.index - b.index;
          },
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")}
                className="w-full justify-end px-0 text-sm"
              >
                {t("columns.rank")}
                {column.getIsSorted() === "asc" ? (
                  <SortAsc />
                ) : column.getIsSorted() === "desc"
                  ? (
                      <SortDesc />
                    )
                  : null}
              </Button>
            );
          },
          cell: ({ row }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
            const table = useContext(UserTableContext);
            const { pageIndex } = table.getState().pagination;
            const { pageSize } = table.getState().pagination;
            const value = row.index + pageIndex * pageSize + 1;

            const textSize
              = value === 1
                ? "text-2xl"
                : value === 2
                  ? "text-lg"
                  : value === 3
                    ? "text-base"
                    : "text-ms";

            return (
              <UserRankColor
                rank={value}
                variant="primary"
                className={twMerge(
                  "text-center font-bold whitespace-nowrap ",
                  textSize,
                )}
              >
                # {value}
              </UserRankColor>
            );
          },
        },
        {
          accessorKey: "user.country_code",
          header: "",
          cell: ({ row }) => {
            const countryCode = row.original.user.country_code;
            return (
              <Image
                src={`/images/flags/${countryCode}.png`}
                alt="User Flag"
                className="mr-2 min-w-3"
                width={26}
                height={26}
              />
            );
          },
        },
        {
          accessorKey: "user.username",
          header: "",
          cell: ({ row }) => {
            const userId = row.original.user.user_id;
            const { username, avatar_url } = row.original.user;

            // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
            const table = useContext(UserTableContext);
            const { pageIndex } = table.getState().pagination;
            const { pageSize } = table.getState().pagination;
            const userRank = row.index + pageIndex * pageSize + 1;

            return (
              <div className="relative flex flex-row items-center space-x-2 p-3">
                <Avatar className="border-2 border-white">
                  <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
                    <Image src={avatar_url} alt="logo" width={50} height={50} />
                  </Suspense>
                </Avatar>

                <UserHoverCard user={row.original.user} asChild>
                  <Link href={`/user/${userId}`} className="hover:underline">
                    <UserRankColor
                      rank={userRank}
                      variant="primary"
                      className="smooth-transition cursor-pointer text-lg font-bold "
                    >
                      {username}
                    </UserRankColor>
                  </Link>
                </UserHoverCard>
              </div>
            );
          },
        },
        {
          id: "pp",
          accessorKey: "stats.pp",
          header: () => (
            <div className="text-right text-base font-bold text-foreground">
              {t("columns.performance")}
            </div>
          ),
          cell: ({ row }) => {
            const formatted = numberWith(row.original.stats.pp.toFixed(2), ",");
            return (
              <div className="text-right font-bold text-foreground">
                {formatted}
              </div>
            );
          },
        },
        {
          id: "ranked_score",
          accessorKey: "stats.ranked_score",
          header: () => (
            <div className="text-right text-base font-bold text-foreground">
              {t("columns.rankedScore")}
            </div>
          ),
          cell: ({ row }) => {
            const formatted = numberWith(row.original.stats.ranked_score, ",");
            return (
              <div className="-mr-2 text-right font-bold text-foreground">
                {formatted}
              </div>
            );
          },
        },
        {
          accessorKey: "stats.accuracy",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")}
                className="w-full justify-end px-0 text-sm"
              >
                {t("columns.accuracy")}
                {column.getIsSorted() === "asc" ? (
                  <SortAsc />
                ) : column.getIsSorted() === "desc"
                  ? (
                      <SortDesc />
                    )
                  : null}
              </Button>
            );
          },
          cell: ({ row }) => {
            const formatted = row.original.stats.accuracy.toFixed(2);
            return (
              <div className="text-right font-medium text-muted-foreground">
                {formatted}%
              </div>
            );
          },
        },
        {
          accessorKey: "stats.play_count",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")}
                className="w-full justify-end px-0 text-sm"
              >
                {t("columns.playCount")}
                {column.getIsSorted() === "asc" ? (
                  <SortAsc />
                ) : column.getIsSorted() === "desc"
                  ? (
                      <SortDesc />
                    )
                  : null}
              </Button>
            );
          },
          cell: ({ row }) => {
            const value = row.original.stats.play_count;
            return (
              <div className="text-right text-sm text-muted-foreground">
                {value}
              </div>
            );
          },
        },
        {
          id: "actions",
          cell: ({ row }) => {
            const userId = row.original.user.user_id;

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
                    <Link href={`/user/${userId}`}>
                      {t("actions.viewUserProfile")}
                    </Link>
                  </DropdownMenuItem>
                  {/* TODO: Add report option */}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ] as Array<ColumnDef<{
        user: UserResponse;
        stats: UserStatsResponse;
      }>>,
    [t],
  );
}
