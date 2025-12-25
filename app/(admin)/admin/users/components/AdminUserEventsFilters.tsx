"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { UserEventType } from "@/lib/types/api";

const userEventTypeList = Object.values(UserEventType).map((v) => {
  return {
    value: v,
    label: v
      .replaceAll(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, str => str.toUpperCase()),
  };
});

interface AdminUserEventsFiltersProps {
  onApplyFilters: (filters: {
    eventTypes: UserEventType[] | null;
  }) => void;
  isLoading: boolean;
  defaultEventTypes: UserEventType[] | null;
}

export function AdminUserEventsFilters({
  onApplyFilters,
  isLoading,
  defaultEventTypes,
}: AdminUserEventsFiltersProps) {
  const [eventTypes, setEventTypes] = useState<UserEventType[] | null>(
    defaultEventTypes,
  );

  const handleApplyFilters = () => {
    onApplyFilters({
      eventTypes: (eventTypes?.length ?? 0) > 0 ? eventTypes : null,
    });
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-4 p-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Event Types</label>
          <MultiSelect
            options={userEventTypeList}
            defaultValue={eventTypes ?? []}
            onValueChange={v =>
              setEventTypes(
                !v.includes("") ? (v as UserEventType[]) : null,
              )}
            placeholder="Select event types..."
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleApplyFilters}
            className="flex-1"
            isLoading={isLoading}
          >
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
