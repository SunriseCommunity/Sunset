"use client";

import { Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAdminScoreColumns } from "@/app/(admin)/admin/users/[id]/edit/components/Tabs/AdminUserEditScores/components/AdminScoreColumns";
import { AdminScoreDataTable } from "@/app/(admin)/admin/users/[id]/edit/components/Tabs/AdminUserEditScores/components/AdminScoreDataTable";
import { ScoreFiltersCard } from "@/components/Admin/ScoreProcessing/ScoreFiltersCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useBulkScoreProcessing } from "@/lib/hooks/api/score-processing/useScoreProcessingActions";
import type { AdminUserScoresParams } from "@/lib/hooks/api/user/useAdminUserScores";
import { useAdminUserScores } from "@/lib/hooks/api/user/useAdminUserScores";
import type { UserSensitiveResponse } from "@/lib/types/api";
import { ScoreTaskType } from "@/lib/types/api";

const PAGE_SIZE = 25;
const MAX_BULK_IDS = 100;

export default function AdminUserEditScores({ user }: { user: UserSensitiveResponse }) {
  const { toast } = useToast();
  const userId = user.user_id;
  const columns = useAdminScoreColumns();

  const [filters, setFilters] = useState<AdminUserScoresParams>({});
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<ScoreTaskType>(ScoreTaskType.RECALCULATION);

  const queryParams = useMemo(
    () => ({
      mode: filters.mode ?? undefined,
      mods: filters.mods ?? undefined,
      submission_status: filters.submission_status ?? undefined,
      beatmap_status: filters.beatmap_status ?? undefined,
      submitted_from: filters.submitted_from ?? undefined,
      submitted_to: filters.submitted_to ?? undefined,
      sort: filters.sort ?? undefined,
    }),
    [filters],
  );

  const { data, isLoading, mutate } = useAdminUserScores(
    userId,
    queryParams,
    pagination.pageIndex + 1,
    pagination.pageSize,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const scores = useMemo(() => data?.scores ?? [], [data?.scores]);
  const totalCount = data?.total_count ?? 0;

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: PAGE_SIZE });
    setSelectedIds([]);
  }, [queryParams]);

  const { trigger: bulkByIds, isMutating: isBulkByIds } = useBulkScoreProcessing();

  const applyBulk = async () => {
    try {
      if (selectedIds.length === 0) {
        toast({
          title: "Nothing selected",
          description: "Select scores first.",
          variant: "destructive",
        });
        return;
      }

      if (selectedIds.length > MAX_BULK_IDS) {
        toast({
          title: "Too many selected",
          description: `Select up to ${MAX_BULK_IDS} scores.`,
          variant: "destructive",
        });
        return;
      }

      const result = await bulkByIds({ score_ids: selectedIds, action: bulkAction });
      toast({
        title: "Bulk queued",
        description: `Queued ${result.queued}, skipped ${result.skipped}.`,
      });

      setSelectedIds([]);
      mutate();
    }
    catch (error) {
      toast({
        title: "Bulk action failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {totalCount}
          {" "}
          score(s)
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 size-4" />
          Filters
        </Button>
      </div>

      <FilterPanel
        showFilters={showFilters}
        filters={filters}
        isLoading={isLoading}
        onApplyFilters={(next) => {
          setFilters(next);
          setPagination({ pageIndex: 0, pageSize: PAGE_SIZE });
        }}
      />

      <BulkActionToolbar
        bulkAction={bulkAction}
        onBulkActionChange={setBulkAction}
        onApplyBulk={applyBulk}
        selectedCount={selectedIds.length}
        isBulkLoading={isBulkByIds}
      />

      <AdminScoreDataTable
        columns={columns}
        data={scores}
        totalCount={totalCount}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
        onSelectionIdsChange={setSelectedIds}
      />
    </div>
  );
}

function FilterPanel({
  showFilters,
  filters,
  isLoading,
  onApplyFilters,
}: {
  showFilters: boolean;
  filters: AdminUserScoresParams;
  isLoading: boolean;
  onApplyFilters: (filters: AdminUserScoresParams) => void;
}) {
  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: showFilters ? "800px" : "0" }}
    >
      <ScoreFiltersCard value={filters} onApply={onApplyFilters} isLoading={isLoading} />
    </div>
  );
}

function BulkActionToolbar({
  bulkAction,
  onBulkActionChange,
  onApplyBulk,
  selectedCount,
  isBulkLoading,
}: {
  bulkAction: ScoreTaskType;
  onBulkActionChange: (action: ScoreTaskType) => void;
  onApplyBulk: () => Promise<void>;
  selectedCount: number;
  isBulkLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-2 md:flex-row md:items-center">
      <div className="text-xs text-muted-foreground md:mr-2">
        {selectedCount}
        {" "}
        selected
      </div>
      <Select value={bulkAction} onValueChange={value => onBulkActionChange(value as ScoreTaskType)}>
        <SelectTrigger className="h-8 w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ScoreTaskType).map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={onApplyBulk} disabled={selectedCount === 0} isLoading={isBulkLoading}>
        Apply
      </Button>
    </div>
  );
}
