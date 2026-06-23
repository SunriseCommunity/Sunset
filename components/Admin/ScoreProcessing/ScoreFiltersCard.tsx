"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminUserScoresParams } from "@/lib/hooks/api/user/useAdminUserScores";
import { BeatmapStatus, GameMode, Mods, ScoreProcessingStatus, ScoreSortType } from "@/lib/types/api";

interface ScoreFiltersCardProps {
  value: AdminUserScoresParams;
  onApply: (filters: AdminUserScoresParams) => void;
  isLoading?: boolean;
}

const ANY_VALUE = "any";

export function ScoreFiltersCard({
  value,
  onApply,
  isLoading,
}: ScoreFiltersCardProps) {
  const [draft, setDraft] = useState<AdminUserScoresParams>(value);

  const update = useCallback(
    <Key extends keyof AdminUserScoresParams>(key: Key, next: AdminUserScoresParams[Key]) => {
      setDraft(previous => ({ ...previous, [key]: next }));
    },
    [],
  );

  const handleApply = useCallback(() => onApply(draft), [draft, onApply]);

  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Gamemode</label>
          <Select
            value={draft.mode ?? ANY_VALUE}
            onValueChange={selected => update("mode", selected === ANY_VALUE ? undefined : (selected as GameMode))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_VALUE}>Any mode</SelectItem>
              {Object.values(GameMode).map(mode => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mods</label>
          <MultiSelect
            options={Object.values(Mods).map(option => ({ label: option, value: option }))}
            defaultValue={draft.mods ?? []}
            placeholder="Any mods"
            onValueChange={selected => update("mods", selected.length > 0 ? selected as Mods[] : undefined)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Score submission status</label>
          <Select
            value={draft.submission_status ?? ANY_VALUE}
            onValueChange={selected => update("submission_status", selected === ANY_VALUE ? undefined : (selected as AdminUserScoresParams["submission_status"]))}
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
          <label className="text-sm font-medium">Beatmap status</label>
          <Select
            value={draft.beatmap_status ?? ANY_VALUE}
            onValueChange={selected => update("beatmap_status", selected === ANY_VALUE ? undefined : (selected as AdminUserScoresParams["beatmap_status"]))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_VALUE}>Any status</SelectItem>
              {Object.values(BeatmapStatus).map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Submitted from</label>
          <Input
            type="date"
            value={draft.submitted_from ?? ""}
            onChange={event => update("submitted_from", event.target.value || undefined)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Submitted to</label>
          <Input
            type="date"
            value={draft.submitted_to ?? ""}
            onChange={event => update("submitted_to", event.target.value || undefined)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sort by</label>
          <Select
            value={draft.sort ?? Object.values(ScoreSortType)[0]}
            onValueChange={selected => update("sort", selected as AdminUserScoresParams["sort"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ScoreSortType).map(option => (
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
