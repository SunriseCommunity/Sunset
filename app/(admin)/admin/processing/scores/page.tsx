"use client";

import { Filter, ListChecks, RefreshCw, Search } from "lucide-react";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";

import { AddScoreProcessingDialog } from "@/components/Admin/ScoreProcessing/AddScoreProcessingDialog";
import { ScoreProcessingTaskCard } from "@/components/Admin/ScoreProcessing/ScoreProcessingTaskCard";
import { ScoreProcessingTaskFiltersCard } from "@/components/Admin/ScoreProcessing/ScoreProcessingTaskFiltersCard";
import PrettyHeader from "@/components/General/PrettyHeader";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useScoreProcessingStats } from "@/lib/hooks/api/score-processing/useScoreProcessingStats";
import type { ScoreProcessingTaskFilters } from "@/lib/hooks/api/score-processing/useScoreProcessingTasks";
import { useScoreProcessingTasks } from "@/lib/hooks/api/score-processing/useScoreProcessingTasks";
import useDebounce from "@/lib/hooks/useDebounce";
import type { ScoreProcessingTaskResponse } from "@/lib/types/api";
import { SecondsToString } from "@/lib/utils/secondsTo";
import { tryParseNumber } from "@/lib/utils/type.util";

const PAGE_SIZE = 20;

export default function Page() {
  const [searchByScoreIdQuery, setSearchByScoreIdQuery] = useState("");
  const searchByScoreIdValue = useDebounce(searchByScoreIdQuery, 400);

  const [searchByTaskIdQuery, setSearchByTaskIdQuery] = useState("");
  const searchByTaskIdValue = useDebounce(searchByTaskIdQuery, 400);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ScoreProcessingTaskFilters>({});

  const scoreIdFilter = tryParseNumber(searchByScoreIdValue) ?? null;
  const taskIdFilter = tryParseNumber(searchByTaskIdValue) ?? null;

  const combinedFilters = useMemo(
    () => ({
      ...filters,
      ...(scoreIdFilter ? { score_id: scoreIdFilter } : {}),
      ...(taskIdFilter ? { task_id: taskIdFilter } : {}),
    }),
    [filters, scoreIdFilter, taskIdFilter],
  );

  const { data, error, size, setSize, isLoading, mutate } = useScoreProcessingTasks(combinedFilters, PAGE_SIZE, {
    refreshInterval: 10_000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const { data: stats, error: statsError, mutate: mutateStats } = useScoreProcessingStats({
    refreshInterval: 10_000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const tasks = data?.flatMap(page => page.tasks) ?? [];
  const totalCount = data?.find(item => item.total_count !== undefined)?.total_count ?? 0;

  const isLoadingMore = Boolean(isLoading || (size > 0 && data && data[size - 1] === undefined));

  const activeFilterCount = Object.values(filters).filter(
    value => value != null,
  ).length;

  const handleFilterByScoreIdChange = (value: string) => {
    setSearchByScoreIdQuery(value);
    setSize(1);
  };

  const handleFilterByTaskIdChange = (value: string) => {
    setSearchByTaskIdQuery(value);
    setSize(1);
  };

  const handleApplyFilters = (nextFilters: ScoreProcessingTaskFilters) => {
    setFilters(nextFilters);
    setSize(1);
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader text="Score processing" roundBottom icon={<ListChecks />} />

      <ScoreProcessingStats stats={stats} error={statsError} />

      <ScoreProcessingToolbar
        activeFilterCount={activeFilterCount}
        onFilterByScoreIdChange={handleFilterByScoreIdChange}
        onFilterByTaskIdChange={handleFilterByTaskIdChange}
        onRefresh={() => { mutate(); mutateStats(); }}
        onToggleFilters={() => setShowFilters(!showFilters)}
        searchByScoreIdQuery={searchByScoreIdQuery}
        searchByTaskIdQuery={searchByTaskIdQuery}
      />

      <ScoreProcessingFiltersPanel filters={filters} isLoading={isLoading} onApply={handleApplyFilters} showFilters={showFilters} />

      <p className="text-sm text-muted-foreground">
        {totalCount}
        {" "}
        task(s)
      </p>

      <ScoreProcessingTaskList
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        onLoadMore={() => setSize(size + 1)}
        onTaskChanged={mutate}
        tasks={tasks}
        totalCount={totalCount}
        error={error}
      />
    </div>
  );
}

function ScoreProcessingStats({
  error,
  stats,
}: {
  error: ReturnType<typeof useScoreProcessingStats>["error"];
  stats: ReturnType<typeof useScoreProcessingStats>["data"];
}) {
  if (error) {
    return (
      <Card className="p-3">
        <CardContent className="p-0 text-sm text-muted-foreground">
          Could not load processing stats.
          {" "}
          {error.message ?? "Refresh the page and try again."}
        </CardContent>
      </Card>
    );
  }

  if (!stats)
    return null;

  const values = [
    { label: "In queue", value: stats.pending.toLocaleString() },
    { label: "Processing", value: stats.processing.toLocaleString() },
    { label: "To process", value: (stats.pending + stats.processing).toLocaleString() },
    { label: "Failed", value: stats.failed.toLocaleString() },
    {
      label: "Est. time to clear",
      value:
        stats.pending > 0 && stats.estimated_pending_completion_seconds != null
          ? SecondsToString(stats.estimated_pending_completion_seconds)
          : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {values.map(stat => (
        <div key={stat.label} className="rounded-lg border bg-card p-3">
          <div className="text-xs text-muted-foreground">{stat.label}</div>
          <div className="text-lg font-semibold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

function ScoreProcessingToolbar({
  activeFilterCount,
  onFilterByScoreIdChange,
  onFilterByTaskIdChange,
  onRefresh,
  onToggleFilters,
  searchByScoreIdQuery,
  searchByTaskIdQuery,
}: {
  activeFilterCount: number;
  onFilterByScoreIdChange: (value: string) => void;
  onFilterByTaskIdChange: (value: string) => void;
  onRefresh: () => void;
  onToggleFilters: () => void;
  searchByScoreIdQuery: string;
  searchByTaskIdQuery: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <ScoreProcessingSearchInput
        inputMode="numeric"
        onChange={onFilterByScoreIdChange}
        placeholder="Filter by score id..."
        value={searchByScoreIdQuery}
      />
      <ScoreProcessingSearchInput
        inputMode="numeric"
        onChange={onFilterByTaskIdChange}
        placeholder="Filter by task id..."
        value={searchByTaskIdQuery}
      />
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" className="relative" onClick={onToggleFilters}>
          <Filter className="mr-2 size-4" />
          Filters
          {activeFilterCount > 0 && (
            <div className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </div>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => onRefresh()}>
          <RefreshCw className="size-4" />
        </Button>
        <AddScoreProcessingDialog onCreated={() => onRefresh()} />
      </div>
    </div>
  );
}

function ScoreProcessingSearchInput({
  inputMode,
  onChange,
  placeholder,
  value,
}: {
  inputMode?: ComponentProps<typeof Input>["inputMode"];
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
      <Input
        type="search"
        inputMode={inputMode}
        placeholder={placeholder}
        className="pl-8"
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  );
}

function ScoreProcessingFiltersPanel({
  filters,
  isLoading,
  onApply,
  showFilters,
}: {
  filters: ScoreProcessingTaskFilters;
  isLoading: boolean;
  onApply: (filters: ScoreProcessingTaskFilters) => void;
  showFilters: boolean;
}) {
  return (
    <div
      className="overflow-hidden transition-all duration-500 ease-in-out"
      style={{ maxHeight: showFilters ? "700px" : "0" }}
    >
      <ScoreProcessingTaskFiltersCard value={filters} onApply={onApply} isLoading={isLoading} />
    </div>
  );
}

function ScoreProcessingTaskList({
  error,
  isLoading,
  isLoadingMore,
  onLoadMore,
  onTaskChanged,
  tasks,
  totalCount,
}: {
  error: ReturnType<typeof useScoreProcessingTasks>["error"];
  isLoading: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onTaskChanged: () => void;
  tasks: ScoreProcessingTaskResponse[];
  totalCount: number;
}) {
  if (error) {
    return (
      <Card className="p-8">
        <CardContent className="flex flex-col items-center justify-center gap-2 p-0 text-center text-muted-foreground">
          <Search className="size-12 opacity-50" />
          <p className="font-medium text-foreground">Could not load score processing tasks.</p>
          <p className="text-sm">{error.message ?? "Refresh the page and try again."}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading && tasks.length === 0) {
    return (
      <Card className="p-8">
        <CardContent className="flex items-center justify-center p-0">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-8">
        <CardContent className="flex flex-col items-center justify-center p-0 text-muted-foreground">
          <Search className="mb-4 size-12 opacity-50" />
          <p>No score processing tasks found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {tasks.map(task => (
          <ScoreProcessingTaskCard key={task.id} task={task} onChanged={onTaskChanged} />
        ))}
      </div>

      {tasks.length < totalCount && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onLoadMore} isLoading={isLoadingMore}>
            Show more
          </Button>
        </div>
      )}
    </>
  );
}
