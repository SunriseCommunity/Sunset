"use client";

import { Filter } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdminScoreColumns } from "@/app/(admin)/admin/users/[id]/edit/components/Tabs/AdminUserEditScores/components/AdminScoreColumns";
import { AdminScoreDataTable } from "@/app/(admin)/admin/users/[id]/edit/components/Tabs/AdminUserEditScores/components/AdminScoreDataTable";
import { ScoreFiltersCard } from "@/components/Admin/ScoreProcessing/ScoreFiltersCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useBulkScoreProcessing,
  useBulkScoreProcessingByFilter,
} from "@/lib/hooks/api/score-processing/useScoreProcessingActions";
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
  const { trigger: bulkByFilter, isMutating: isBulkByFilter } = useBulkScoreProcessingByFilter();

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
          description: `Select up to ${MAX_BULK_IDS} scores, or use "Apply to all matching".`,
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

  const handleSelectionChange = useCallback((ids: number[]) => {
    setSelectedIds(ids);
  }, []);

  const handleApplyFilters = useCallback((next: AdminUserScoresParams) => {
    setFilters(next);
    setPagination({ pageIndex: 0, pageSize: PAGE_SIZE });
  }, []);

  const applyBulkAllMatching = useCallback(async () => {
    try {
      await bulkByFilter({
        action: bulkAction,
        user_id: userId,
        ...queryParams,
      });
      toast({
        title: "Bulk queued",
        description: `Queued ${bulkAction} for all ${totalCount} matching scores (runs in background).`,
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
  }, [bulkAction, bulkByFilter, mutate, queryParams, toast, totalCount, userId]);

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
        onApplyFilters={handleApplyFilters}
      />

      <BulkActionToolbar
        bulkAction={bulkAction}
        onBulkActionChange={setBulkAction}
        onApplyBulk={applyBulk}
        onApplyBulkAllMatching={applyBulkAllMatching}
        selectedCount={selectedIds.length}
        totalCount={totalCount}
        pageSize={scores.length}
        isBulkLoading={isBulkByIds || isBulkByFilter}
      />

      <AdminScoreDataTable
        columns={columns}
        data={scores}
        totalCount={totalCount}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
        onSelectionIdsChange={handleSelectionChange}
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
  onApplyBulkAllMatching,
  selectedCount,
  totalCount,
  pageSize,
  isBulkLoading,
}: {
  bulkAction: ScoreTaskType;
  onBulkActionChange: (action: ScoreTaskType) => void;
  onApplyBulk: () => Promise<void>;
  onApplyBulkAllMatching: () => Promise<void>;
  selectedCount: number;
  totalCount: number;
  pageSize: number;
  isBulkLoading: boolean;
}) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"single" | "all" | null>(null);

  const showAllMatchingBtn = selectedCount === pageSize && pageSize > 0 && totalCount > pageSize;

  const handleConfirm = async () => {
    setConfirmDialogOpen(false);
    if (pendingAction === "single") {
      await onApplyBulk();
    }
    else if (pendingAction === "all") {
      await onApplyBulkAllMatching();
    }
    setPendingAction(null);
  };

  const handleOpenDialog = (action: "single" | "all") => {
    setPendingAction(action);
    setConfirmDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-2 md:flex-row md:items-center">
      <span className="text-xs text-muted-foreground md:mr-2">
        {selectedCount}
        {" "}
        selected
      </span>
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
      <Button size="sm" onClick={() => handleOpenDialog("single")} disabled={selectedCount === 0 || isBulkLoading} isLoading={isBulkLoading}>
        Apply
      </Button>
      {showAllMatchingBtn && (
        <Button size="sm" variant="secondary" onClick={() => handleOpenDialog("all")} isLoading={isBulkLoading}>
          {`Apply to all ${totalCount} matching`}
        </Button>
      )}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "all"
                ? `Are you sure you want to apply "${bulkAction}" to all ${totalCount} matching scores?`
                : `Are you sure you want to apply "${bulkAction}" to ${selectedCount} selected score(s)?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
