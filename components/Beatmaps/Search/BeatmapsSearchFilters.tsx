"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb, GameMode } from "@/lib/types/api";

const beatmapSearchStatusList = Object.values(BeatmapStatusWeb)
  .filter(v => v !== BeatmapStatusWeb.UNKNOWN)
  .map((v) => {
    return {
      value: v,
      label: v,
    };
  });

interface BeatmapFiltersProps {
  onApplyFilters: (filters: {
    mode: GameMode | null;
    status: BeatmapStatusWeb[] | null;
    searchByCustomStatus: boolean;
  }) => void;
  isLoading: boolean;
  defaultMode: GameMode | null;
  defaultStatus: BeatmapStatusWeb[] | null;
  defaultSearchByCustomStatus: boolean;
}

export function BeatmapsSearchFilters({
  onApplyFilters,
  isLoading,
  defaultMode,
  defaultStatus,
}: BeatmapFiltersProps) {
  const t = useT("pages.beatmaps.components.filters");
  const [mode, setMode] = useState<GameMode | null>(defaultMode);
  const [status, setStatus] = useState<BeatmapStatusWeb[] | null>(
    defaultStatus,
  );
  const [searchByCustomStatus, setSearchByCustomStatus] = useState(false);

  const handleApplyFilters = useCallback(() => {
    onApplyFilters({
      mode,
      status: (status?.length ?? 0) > 0 ? status : null,
      searchByCustomStatus,
    });
  }, [onApplyFilters, mode, status, searchByCustomStatus]);

  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("mode.label")}</label>
          <Select
            value={mode ?? "any"}
            disabled={searchByCustomStatus}
            onValueChange={v => setMode(v !== "any" ? (v as GameMode) : null)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("mode.any")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("mode.any")}</SelectItem>
              <SelectItem value={GameMode.STANDARD}>
                {t("mode.standard")}
              </SelectItem>
              <SelectItem value={GameMode.TAIKO}>{t("mode.taiko")}</SelectItem>
              <SelectItem value={GameMode.CATCH_THE_BEAT}>
                {t("mode.catch")}
              </SelectItem>
              <SelectItem value={GameMode.MANIA}>{t("mode.mania")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{t("status.label")}</label>
          <MultiSelect
            options={beatmapSearchStatusList}
            defaultValue={status ?? []}
            onValueChange={v =>
              setStatus(!v.includes("") ? (v as BeatmapStatusWeb[]) : null)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">
            {t("searchByCustomStatus.label")}
          </label>
          <Switch
            checked={searchByCustomStatus}
            onCheckedChange={() =>
              setSearchByCustomStatus(!searchByCustomStatus)}
          />
        </div>

        <div className="flex gap-2 md:col-span-2">
          <Button
            onClick={handleApplyFilters}
            className="flex-1"
            isLoading={isLoading}
          >
            {t("applyFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
