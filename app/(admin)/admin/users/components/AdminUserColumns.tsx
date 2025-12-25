"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, EyeOff, SortAsc, SortDesc } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

import { PersonalInfoVisibilityContext } from "@/app/(admin)/admin/users/components/UsersSearch";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";
import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useSelf from "@/lib/hooks/useSelf";
import type { UserSensitiveResponse } from "@/lib/types/api";
import { timeSince } from "@/lib/utils/timeSince";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

export const adminUserColumns: Array<ColumnDef<UserSensitiveResponse>> = [
  {
    accessorKey: "user_id",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start px-2 text-sm"
        >
          ID
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 size-4" />
          ) : column.getIsSorted() === "desc"
            ? (
                <SortDesc className="ml-2 size-4" />
              )
            : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="px-2 text-left font-mono text-sm text-muted-foreground">
          {row.original.user_id}
        </div>
      );
    },
  },
  {
    accessorKey: "country_code",
    header: "Flag",
    cell: ({ row }) => {
      const countryCode = row.original.country_code;
      return (
        <div className="flex items-center">
          <Tooltip content={countryCode}>
            <Image
              src={`/images/flags/${countryCode}.png`}
              alt={`${countryCode} Flag`}
              width={32}
              height={32}
            />
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex w-full items-center justify-start whitespace-nowrap px-2 text-sm"
        >
          Username
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 size-4" />
          ) : column.getIsSorted() === "desc"
            ? (
                <SortDesc className="ml-2 size-4" />
              )
            : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const { username, user_id, avatar_url } = row.original;
      return (
        <Link
          href={`/admin/users/${user_id}/edit`}
          className="flex items-center space-x-3 px-2 hover:underline"
        >
          <Image
            src={avatar_url}
            alt={username}
            width={40}
            height={40}
            className="rounded-full border-2 border-border"
          />
          <span className="font-medium">{username}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "badges",
    header: "Privileges",
    cell: ({ row }) => {
      const { badges } = row.original;
      return (
        <div className="flex items-center ">
          {badges.length > 0 ? (
            <UserPrivilegeBadges
              badges={badges}
              small={true}
              className="flex-shrink-0"
            />
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "restricted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start px-2 text-sm"
        >
          Restricted
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 size-4" />
          ) : column.getIsSorted() === "desc"
            ? (
                <SortDesc className="ml-2 size-4" />
              )
            : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const isRestricted = row.original.restricted;
      return (
        <div className="px-2">
          <Badge
            variant={isRestricted ? "destructive" : "secondary"}
            className={isRestricted ? "" : "bg-green-600/20 text-green-400"}
          >
            {isRestricted ? "Yes" : "No"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "register_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start px-2 text-sm"
        >
          Joined
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 size-4" />
          ) : column.getIsSorted() === "desc"
            ? (
                <SortDesc className="ml-2 size-4" />
              )
            : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const registerDate = row.original.register_date;
      return (
        <div className="text-nowrap px-2 text-sm text-muted-foreground">
          <Tooltip content={new Date(registerDate).toLocaleString()}>
            <span>{timeSince(registerDate)}</span>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "last_online_time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start px-2 text-sm"
        >
          Last Online
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 size-4" />
          ) : column.getIsSorted() === "desc"
            ? (
                <SortDesc className="ml-2 size-4" />
              )
            : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const lastOnline = row.original.last_online_time;
      const userStatus = row.original.user_status;
      const isOffline = userStatus === "Offline";

      return (
        <div className="text-nowrap px-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div
              className={`size-2 rounded-full ${
                !isOffline
                  ? `bg-${statusColor(userStatus)} animate-pulse`
                  : "bg-gray-500"
              }`}
            />
            {isOffline ? (
              <Tooltip content={new Date(lastOnline).toLocaleString()}>
                <span>{timeSince(lastOnline)}</span>
              </Tooltip>
            ) : (
              <p className={`text-sm ${`text-${statusColor(userStatus)}`}`}>
                Online
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start px-2 text-sm"
        >
          Email
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 size-4" />
          ) : column.getIsSorted() === "desc"
            ? (
                <SortDesc className="ml-2 size-4" />
              )
            : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const { email } = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
      const showByDefault = useContext(PersonalInfoVisibilityContext);
      // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
      const [isVisible, setIsVisible] = useState(false);

      const shouldShow = showByDefault || isVisible;

      return (
        <div className="flex items-center gap-2 px-2">
          <span
            className={`font-mono text-sm transition-all duration-200 ${
              shouldShow ? "" : "select-none"
            }`}
          >
            {shouldShow ? email : "•••••••••••••••"}
          </span>
          {!showByDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="size-6 flex-shrink-0 p-0"
            >
              {isVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const userId = row.original.user_id;
      // eslint-disable-next-line react-hooks/rules-of-hooks -- table context
      const { self } = useSelf();

      const canEdit = self && isUserHasAdminPrivilege(self);

      return (
        <div className="px-2">
          <Button variant="outline" size="sm" disabled={!canEdit} asChild>
            <Link href={`/admin/users/${userId}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit
            </Link>
          </Button>
        </div>
      );
    },
  },
];
