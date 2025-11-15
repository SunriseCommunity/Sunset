"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserSensitiveResponse } from "@/lib/types/api";
import { timeSince } from "@/lib/utils/timeSince";
import { isUserCanUseAdminPanel } from "@/lib/utils/isUserCanUseAdminPanel";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, SortAsc, SortDesc, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import useSelf from "@/lib/hooks/useSelf";
import { Tooltip } from "@/components/Tooltip";
import { useState, useContext } from "react";
import { PersonalInfoVisibilityContext } from "@/app/(admin)/admin/users/components/UsersSearch";
import UserStatusText, {
  statusColor,
} from "@/app/(website)/user/[id]/components/UserStatusText";

export const adminUserColumns: ColumnDef<UserSensitiveResponse>[] = [
  {
    accessorKey: "user_id",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="justify-start text-sm w-full px-2"
        >
          ID
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-left font-mono text-sm text-muted-foreground px-2">
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
          className="justify-start text-sm w-full px-2 flex items-center whitespace-nowrap"
        >
          Username
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const { username, user_id, avatar_url } = row.original;
      return (
        <Link
          href={`/admin/users/${user_id}/edit`}
          className="flex items-center space-x-3 hover:underline px-2"
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
      const badges = row.original.badges;
      return (
        <div className="flex items-center ">
          {badges.length > 0 ? (
            <UserPrivilegeBadges
              badges={badges}
              small={true}
              className="flex-shrink-0"
            />
          ) : (
            <span className="text-muted-foreground text-sm">None</span>
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
          className="justify-start text-sm w-full px-2"
        >
          Restricted
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : null}
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
          className="justify-start text-sm w-full px-2"
        >
          Joined
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const registerDate = row.original.register_date;
      return (
        <div className="text-sm text-muted-foreground px-2 text-nowrap">
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
          className="justify-start text-sm w-full px-2"
        >
          Last Online
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const lastOnline = row.original.last_online_time;
      const userStatus = row.original.user_status;
      const isOffline = userStatus === "Offline";

      return (
        <div className="text-sm text-muted-foreground px-2 text-nowrap">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
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
          className="justify-start text-sm w-full px-2"
        >
          Email
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.original.email;
      const showByDefault = useContext(PersonalInfoVisibilityContext);
      const [isVisible, setIsVisible] = useState(false);

      const shouldShow = showByDefault || isVisible;

      return (
        <div className="flex items-center gap-2 px-2">
          <span
            className={`text-sm font-mono transition-all duration-200 ${
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
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
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
      const { self } = useSelf();

      const canEdit = self && isUserCanUseAdminPanel(self);

      return (
        <div className="px-2">
          <Button variant="outline" size="sm" disabled={!canEdit} asChild>
            <Link href={`/admin/users/${userId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      );
    },
  },
];
