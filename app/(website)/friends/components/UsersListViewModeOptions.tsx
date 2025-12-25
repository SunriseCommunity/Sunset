"use client";

import { Grid3x3, List } from "lucide-react";

import { Button } from "@/components/ui/button";

export type UsersListViewModeType = "grid" | "list";

interface UsersListViewModeOptionsProps {
  viewMode: UsersListViewModeType;
  onViewChange: (view: UsersListViewModeType) => void;
}

export function UsersListViewModeOptions({
  viewMode,
  onViewChange,
}: UsersListViewModeOptionsProps) {
  return (
    <div className="flex rounded-md">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewChange("list")}
        className={`rounded-r-none hover:bg-primary hover:text-primary-foreground ${
          viewMode === "list"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        <List className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewChange("grid")}
        className={`rounded-l-none hover:bg-primary hover:text-primary-foreground ${
          viewMode === "grid"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        <Grid3x3 className="size-4" />
      </Button>
    </div>
  );
}
