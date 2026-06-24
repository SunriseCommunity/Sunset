"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScoreProcessingTaskFilters } from "@/lib/hooks/api/score-processing/useScoreProcessingTasks";
import { ScoreProcessingStatus, ScoreTaskType } from "@/lib/types/api";

interface ScoreProcessingTaskFiltersCardProps {
  value: ScoreProcessingTaskFilters;
  onApply: (filters: ScoreProcessingTaskFilters) => void;
  isLoading?: boolean;
}

const ANY_VALUE = "any";

export function ScoreProcessingTaskFiltersCard({
  value,
  onApply,
  isLoading,
}: ScoreProcessingTaskFiltersCardProps) {
  const [draft, setDraft] = useState<ScoreProcessingTaskFilters>(value);

  const update = useCallback(
    <Key extends keyof ScoreProcessingTaskFilters>(key: Key, next: ScoreProcessingTaskFilters[Key]) => {
      setDraft(previous => ({ ...previous, [key]: next }));
    },
    [],
  );

  const handleApply = useCallback(() => onApply(draft), [draft, onApply]);

  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">

        <div className="space-y-2">
          <label className="text-sm font-medium">Task status</label>
          <Select
            value={draft.status ?? ANY_VALUE}
            onValueChange={selected => update("status", selected === ANY_VALUE ? undefined : (selected as ScoreProcessingStatus))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_VALUE}>Any status</SelectItem>
              {Object.values(ScoreProcessingStatus).map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Task type</label>
          <Select
            value={draft.task_type ?? ANY_VALUE}
            onValueChange={selected => update("task_type", selected === ANY_VALUE ? undefined : (selected as ScoreTaskType))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_VALUE}>Any type</SelectItem>
              {Object.values(ScoreTaskType).map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 md:col-span-2">
          <Button onClick={handleApply} className="flex-1" isLoading={isLoading}>
            Apply filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
