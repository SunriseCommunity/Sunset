"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";

interface CollapsibleBadgeListProps {
  badges: React.ReactNode[];
  maxVisible?: number;
  className?: string;
}

export function CollapsibleBadgeList({
  badges,
  maxVisible = 3,
  className,
}: CollapsibleBadgeListProps) {
  const [expanded, setExpanded] = React.useState(false);
  const hasMoreBadges = badges.length > maxVisible;

  const visibleBadges = expanded ? badges : badges.slice(0, maxVisible);
  const hiddenCount = badges.length - maxVisible;

  return (
    <div className={twMerge("flex flex-wrap items-center gap-2", className)}>
      {visibleBadges}

      {!expanded && hasMoreBadges && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 rounded-md px-2 text-xs font-normal border"
          onClick={() => setExpanded(true)}
        >
          +{hiddenCount} more
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      )}

      {expanded && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 rounded-md px-2 text-xs font-normal border"
          onClick={() => setExpanded(false)}
        >
          Collapse
          <ChevronUp className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
