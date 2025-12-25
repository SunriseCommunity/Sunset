"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { SortAsc, SortDesc } from "lucide-react";

import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EventUserResponse, UserEventType } from "@/lib/types/api";
import { timeSince } from "@/lib/utils/timeSince";

function hashStringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line unicorn/prefer-code-point -- intentional
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

function formatEventType(eventType: UserEventType): string {
  return eventType
    .replaceAll(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, str => str.toUpperCase());
}

function parseJsonData(jsonData: string): Record<string, any> | null {
  try {
    return JSON.parse(jsonData);
  }
  catch {
    return null;
  }
}

export const adminUserEventsColumns: Array<ColumnDef<EventUserResponse>> = [
  {
    accessorKey: "id",
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
          {row.original.id}
        </div>
      );
    },
  },
  {
    accessorKey: "event_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start px-2 text-sm"
        >
          Event Type
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
      const eventType = row.original.event_type;
      const hue = hashStringToHue(eventType);

      return (
        <div className="px-2">
          <Badge
            variant="secondary"
            style={{
              backgroundColor: `hsla(${hue}, 70%, 60%, 0.2)`,
              color: `hsl(${hue}, 70%, 60%)`,
            }}
          >
            {formatEventType(eventType)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "ip",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start px-2 text-sm"
        >
          IP Address
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
        <div className="px-2 text-left font-mono text-sm">
          {row.original.ip}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-start px-2 text-sm"
        >
          Created At
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
      const createdAt = row.original.created_at;
      return (
        <div className="text-nowrap px-2 text-sm text-muted-foreground">
          <Tooltip content={new Date(createdAt).toLocaleString()}>
            <span>{timeSince(createdAt)}</span>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "json_data",
    header: "Data",
    cell: ({ row }) => {
      const jsonData = row.original.json_data;
      const parsed = parseJsonData(jsonData);

      return (
        <div className="max-w-2xl px-2">
          {parsed ? (
            <pre className="overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted p-2 font-mono text-xs">
              {JSON.stringify(parsed, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-muted-foreground">
              {jsonData || "No data"}
            </div>
          )}
        </div>
      );
    },
  },
];
