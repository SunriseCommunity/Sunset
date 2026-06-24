"use client";

import { ExternalLink, LucideHistory, LucideScanSearch, Play, Square } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

import PrettyDate from "@/components/General/PrettyDate";
import PrettyHeader from "@/components/General/PrettyHeader";
import { SmallUserElement } from "@/components/SmallUserElement";
import Spinner from "@/components/Spinner";
import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import {
  useCancelScoreProcessingTask,
  useCreateScoreProcessingTask,
} from "@/lib/hooks/api/score-processing/useScoreProcessingActions";
import { useScoreProcessingEvents } from "@/lib/hooks/api/score-processing/useScoreProcessingEvents";
import { useScoreProcessingPreview } from "@/lib/hooks/api/score-processing/useScoreProcessingPreview";
import type { AdminScoreResponse, BeatmapResponse } from "@/lib/types/api";
import { ScoreProcessingStatus, ScoreTaskType } from "@/lib/types/api";
import { getStatusBadgeClassName } from "@/lib/utils/getStatusBadgeColor";
import numberWith from "@/lib/utils/numberWith";
import { tryParseNumber } from "@/lib/utils/type.util";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const scoreId = tryParseNumber(params.id);

  const { data: preview, error: previewError, isLoading, mutate } = useScoreProcessingPreview(scoreId ?? null);
  const { data: historyData, mutate: mutateHistory } = useScoreProcessingEvents(
    { scoreId: scoreId ?? null, limit: 20 },
    { refreshInterval: 0, revalidateOnFocus: false },
  );

  const score = preview?.score.score;
  const beatmapQuery = useBeatmap(score?.beatmap_id ?? null);
  const beatmap = beatmapQuery.data;

  const refresh = () => {
    mutate();
    mutateHistory();
  };

  if (scoreId == null || scoreId <= 0) {
    return (
      <ScoreDetailError
        title="Invalid score ID"
        description={`"${params.id}" is not a valid score ID.`}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (previewError) {
    return (
      <ScoreDetailError
        title="Could not load score"
        description={previewError.message ?? "The score preview request failed."}
      />
    );
  }

  if (!preview || !score) {
    return (
      <ScoreDetailError
        title="Score not found"
        description="The score you are looking for does not exist or has been deleted."
      />
    );
  }

  const adminScore = preview.score;

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader text={`Score ID: ${scoreId}`} roundBottom icon={<LucideHistory />} />

      <Card className="space-y-2 p-4">
        <CardTitle>
          <div className="flex items-center gap-2">
            <LucideScanSearch className="size-4" />
            <span className="text-lg font-semibold">Score details</span>
          </div>
        </CardTitle>
        <ScoreDetails scoreWithDetails={adminScore} beatmap={beatmap} />
      </Card>

      <Card className="space-y-2 p-4">
        <CardTitle>
          <div className="flex items-center gap-2">
            <Play className="size-4" />
            <span className="text-lg font-semibold">Score utilities</span>
          </div>
        </CardTitle>
        <ScoreUtilities scoreId={scoreId} />
      </Card>

      <Card className="space-y-2 p-4">
        <CardTitle>
          <div className="flex items-center gap-2">
            <LucideHistory className="size-4" />
            <span className="text-lg font-semibold">Score processing history</span>
          </div>
        </CardTitle>
        <ScoreProcessingHistory scoreId={scoreId} preview={preview} historyData={historyData} refresh={refresh} />
      </Card>
    </div>
  );
}

function ScoreDetailError({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader text="Score details" roundBottom icon={<LucideHistory />} />
      <Card className="p-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </Card>
    </div>
  );
}

function ScoreUtilities({ scoreId }: { scoreId: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="secondary">
        <Link href={`/score/${scoreId}`}>
          <ExternalLink className="mr-1 size-4" />
          Open in Sunset
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
        <Button asChild variant="secondary">
          <Link href="https://ordr.issou.best/" className="w-full">
            <ExternalLink className="mr-1 size-4" />
            Open o!rdr
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="https://analyzer.assist.games/" className="w-full">
            <ExternalLink className="mr-1 size-4" />
            Open AG analyzer
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="https://analyzer.osu.report/" className="w-full">
            <ExternalLink className="mr-1 size-4" />
            Open osu analyzer report
          </Link>
        </Button>
        {/* TODO: Admin replay download */}
        <Button variant="secondary" disabled className="w-full">
          <ExternalLink className="mr-1 size-4" />
          Download replay
        </Button>
      </div>
    </div>
  );
}

function ScoreProcessingHistory({ scoreId, preview, historyData, refresh }: { scoreId: number; preview: NonNullable<ReturnType<typeof useScoreProcessingPreview>["data"]>; historyData: ReturnType<typeof useScoreProcessingEvents>["data"]; refresh: () => void }) {
  const [action, setAction] = useState<ScoreTaskType>(ScoreTaskType.RECALCULATION);

  const { toast } = useToast();

  const handleRun = async () => {
    try {
      await createTask({ score_id: scoreId, action });
      toast({ title: "Task queued", description: `Queued ${action} for score #${scoreId}.` });
      refresh();
    }
    catch (error) {
      toast({ title: "Could not queue task", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleStop = async () => {
    if (!preview?.active_task)
      return;

    try {
      await cancelTask();
      toast({ title: "Task stopped", description: `Task #${preview.active_task.id} was cancelled.` });
      refresh();
    }
    catch (error) {
      toast({ title: "Could not stop task", description: (error as Error).message, variant: "destructive" });
    }
  };

  const { trigger: createTask, isMutating: isCreating } = useCreateScoreProcessingTask();
  const { trigger: cancelTask, isMutating: isCancelling } = useCancelScoreProcessingTask(preview?.active_task?.id ?? 0);

  const activeTask = preview.active_task;
  const history = historyData?.events ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <Select value={action} onValueChange={value => setAction(value as ScoreTaskType)}>
          <SelectTrigger className="w-56">
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
        <Button onClick={handleRun} isLoading={isCreating}>
          <Play className="mr-1 size-4" />
          Run processing
        </Button>
      </div>

      {activeTask && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border p-3">
          <span className="text-sm font-medium">Active task:</span>
          <Badge className={getStatusBadgeClassName(activeTask.status)}>{activeTask.status}</Badge>
          <Badge variant="outline">{activeTask.task_type}</Badge>
          <Button
            variant="destructive"
            size="sm"
            className="ml-auto"
            onClick={handleStop}
            disabled={activeTask?.status !== ScoreProcessingStatus.PENDING}
            isLoading={isCancelling}
          >
            <Square className="mr-1 size-4" />
            Stop
          </Button>
        </div>
      )}

      <h2 className="text-lg font-semibold">Processing history</h2>

      {history.length > 0
        ? (
            history.map(event => (
              <div key={event.id} className="flex flex-wrap items-center gap-2 border-b py-2 last:border-b-0">
                <Badge variant="outline">{event.event_type}</Badge>
                {event.executor
                  ? (
                      <Link href={`/user/${event.executor.user_id}`} className="text-sm text-primary hover:underline">
                        {event.executor.username}
                      </Link>
                    )
                  : <Badge className="bg-muted text-muted-foreground">Server</Badge>}
                <PrettyDate className="ml-auto text-sm text-muted-foreground" time={event.created_at} />
              </div>
            ))
          )
        : <p className="text-sm text-muted-foreground">No processing history for this score.</p>}

    </div>
  );
}
function ScoreDetails({ scoreWithDetails, beatmap }: { scoreWithDetails: AdminScoreResponse; beatmap?: BeatmapResponse }) {
  const { score } = scoreWithDetails;

  const rowDataGeneric = [
    { label: "Score ID", value: score.id },
    { label: "Beatmap", value: beatmap ? <Link href={`/beatmaps/${beatmap.id}`} className="text-sm text-primary hover:underline">{beatmap.artist} - {beatmap.title}</Link> : `Beatmap #${score.beatmap_id}` },
    { label: "User", value: <SmallUserElement avatarUrl={score.user?.avatar_url} profileUrl={`/admin/users/${score.user?.user_id}/edit`} username={score.user?.username ?? "Unknown"} /> },
    { label: "Submission Status", value: scoreWithDetails.submission_status },
    { label: "Beatmap Status", value: scoreWithDetails.beatmap_status },
    { label: "When Submitted", value: <PrettyDate time={score.when_played} /> },
    { label: "Replay Available", value: score.has_replay ? "Yes" : "No" },
  ];

  const rowDataScore = [
    { label: "Mode (extended)", value: score.game_mode_extended },
    { label: "Mods", value: score.mods },
    { label: "Total Score", value: numberWith(score.total_score, ",") },
    { label: "Hit Counts", value: (
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <span className="font-light">300:</span>
          {score.count_300}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-light">Geki:</span>
          {score.count_geki}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-light">100:</span>
          {score.count_100}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-light">Katu:</span>
          {score.count_katu}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-light">50:</span>
          {score.count_50}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-light">Miss:</span>
          {score.count_miss}
        </div>
      </div>
    ) },
    { label: "Max Combo", value: `${score.max_combo}x / ${beatmap?.max_combo ?? 0}x` },
    { label: "Grade", value: score.grade },
    { label: "PP", value: <Tooltip content={`${score.performance_points} pp`}><span>{score.performance_points.toFixed(2)}pp</span></Tooltip> },
    { label: "Accuracy", value: <Tooltip content={`${score.accuracy} %`}><span>{score.accuracy.toFixed(2)}%</span></Tooltip> },
    { label: "Score Hash", value: scoreWithDetails.score_hash },
  ];

  return (
    <div className="flex flex-col gap-4">
      <span className="text-lg font-semibold">General info</span>
      <Table>
        <TableBody>
          {rowDataGeneric.map((row, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key -- used with header
            <TableRow key={`score-detail-row-${index}`}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <span className="text-lg font-semibold">Score stats</span>
      <Table>
        <TableBody>
          {rowDataScore.map((row, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key -- used with header
            <TableRow key={`score-stat-row-${index}`}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
