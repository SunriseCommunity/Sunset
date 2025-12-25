"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

      {!expanded
        && hasMoreBadges
        && (!disableButton
          ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 rounded-md border px-2 text-xs font-normal"
                onClick={() => setExpanded(true)}
              >
                +
                {hiddenCount}
                {" "}
                more
                <ChevronDown className="ml-1 size-3" />
              </Button>
            )
          : (
              <Badge variant="secondary" className="rounded-full p-0.5">
                +{hiddenCount}
              </Badge>
            ))}

      {expanded && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 rounded-md border px-2 text-xs font-normal"
          onClick={() => setExpanded(false)}
        >
          <ChevronUp className="ml-1 size-3" />
        </Button>
      )}
    </div>
  );
}
