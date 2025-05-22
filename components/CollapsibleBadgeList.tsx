"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/badge";

interface CollapsibleBadgeListProps {
  badges: React.ReactNode[];
  maxVisible?: number;
  className?: string;
  disableButton?: boolean;
}

export function CollapsibleBadgeList({
  badges,
  maxVisible = 3,
  className,
  disableButton = false,
}: CollapsibleBadgeListProps) {
  const [expanded, setExpanded] = React.useState(false);
  const hasMoreBadges = badges.length > maxVisible;

  const visibleBadges = expanded ? badges : badges.slice(0, maxVisible);
  const hiddenCount = badges.length - maxVisible;

  return (
    <div className={twMerge("flex flex-wrap items-center gap-2", className)}>
      {visibleBadges}

      {!expanded &&
        hasMoreBadges &&
        (!disableButton ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 rounded-md px-2 text-xs font-normal border"
            onClick={() => setExpanded(true)}
          >
            +{hiddenCount} more
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        ) : (
          <Badge variant="secondary" className="p-0.5 rounded-full">
            +{hiddenCount}
          </Badge>
        ))}

      {expanded && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 rounded-md px-2 text-xs font-normal border"
          onClick={() => setExpanded(false)}
        >
          <ChevronUp className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
