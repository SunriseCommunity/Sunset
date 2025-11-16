"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventUserResponse, UserEventType } from "@/lib/types/api";
import { timeSince } from "@/lib/utils/timeSince";
import { ColumnDef } from "@tanstack/react-table";
import { SortAsc, SortDesc } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";

function hashStringToHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

const formatEventType = (eventType: UserEventType): string => {
  return eventType
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (str) => str.toUpperCase());
};

const parseJsonData = (jsonData: string): Record<string, any> | null => {
  try {
    return JSON.parse(jsonData);
  } catch {
    return null;
  }
};

export const adminUserEventsColumns: ColumnDef<EventUserResponse>[] = [
  {
    accessorKey: "id",
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
          className="justify-start text-sm w-full px-2"
        >
          Event Type
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : null}
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
          className="justify-start text-sm w-full px-2"
        >
          IP Address
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
        <div className="text-left font-mono text-sm px-2">
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
          className="justify-start text-sm w-full px-2"
        >
          Created At
          {column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return (
        <div className="text-sm text-muted-foreground px-2 text-nowrap">
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
        <div className="px-2 max-w-2xl">
          {parsed ? (
            <pre className="text-xs font-mono bg-muted p-2 rounded-md overflow-auto whitespace-pre-wrap break-words">
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
