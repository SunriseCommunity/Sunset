"use client";

import { ExternalLink, RotateCcw, Square } from "lucide-react";
import Link from "next/link";

import PrettyDate from "@/components/General/PrettyDate";
import ImageWithFallback from "@/components/ImageWithFallback";
import { SmallUserElement } from "@/components/SmallUserElement";
import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import {
  useCancelScoreProcessingTask,
  useRequeueScoreProcessingTask,
} from "@/lib/hooks/api/score-processing/useScoreProcessingActions";
import type { ScoreProcessingTaskResponse } from "@/lib/types/api";
import { ScoreProcessingStatus } from "@/lib/types/api";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { getStatusBadgeClassNameColors } from "@/lib/utils/getStatusBadgeClassNameColors";

interface ScoreProcessingTaskCardProps {
  task: ScoreProcessingTaskResponse;
  onChanged: () => void;
}

export function ScoreProcessingTaskCard({ task, onChanged }: ScoreProcessingTaskCardProps) {
  const { toast } = useToast();
  const score = task.score?.score;
  const beatmapQuery = useBeatmap(score?.beatmap_id ?? null);
  const beatmap = beatmapQuery.data;

  const { trigger: cancelTask, isMutating: isCancelling } = useCancelScoreProcessingTask(task.id);
  const { trigger: requeueTask, isMutating: isRequeueing } = useRequeueScoreProcessingTask(task.id);

  const handleStop = async () => {
    try {
      await cancelTask();
      toast({ title: "Task stopped", description: `Task #${task.id} was cancelled.` });
      onChanged();
    }
    catch (error) {
      toast({ title: "Could not stop task", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleRequeue = async () => {
    try {
      await requeueTask();
      toast({ title: "Task requeued", description: `Task #${task.id} was requeued.` });
      onChanged();
    }
    catch (error) {
      toast({ title: "Could not requeue task", description: (error as Error).message, variant: "destructive" });
    }
  };

  const isProcessing = task.status === ScoreProcessingStatus.PROCESSING;
  const isPending = task.status === ScoreProcessingStatus.PENDING;
  const isFailed = task.status === ScoreProcessingStatus.FAILED;

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        {beatmap && (
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/list@2x.jpg`}
            alt="beatmap cover"
            width={128}
            height={128}
            className="size-12 rounded object-cover"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getStatusBadgeClassNameColors(task.status)}>{task.status}</Badge>
            <Badge variant="outline">{`ID: ${task.id}`}</Badge>
            <Badge variant="outline">{task.score?.score.game_mode_extended}</Badge>
            <Badge variant="outline">{task.task_type}</Badge>
            {task.retry_count > 0 && (
              <Badge variant="outline">
                {`Retries: ${task.retry_count} / Retry: ${task.status === ScoreProcessingStatus.PENDING ? "✔" : "✖"}`}
              </Badge>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 truncate text-base font-semibold">
            {score && (
              <span className={`text-${getGradeColor(score.grade)}`}>
                {score.grade}
              </span>
            )}
            <p>
              {beatmap ? `${beatmap.artist} - ${beatmap.title}` : `Beatmap #${score?.beatmap_id ?? "?"}`}
            </p>
            <p>
              {score?.mods}
            </p>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {score?.user && (
              <SmallUserElement avatarUrl={score?.user?.avatar_url} username={score?.user?.username} profileUrl={`/users/${score?.user?.user_id}`} />
            )}
            <span>
              Score ID: {task.score_id}
            </span>
            <PrettyDate time={task.created_at} />
          </div>

          {isFailed && task.error_message && (
            <div className="mt-2 line-clamp-2 text-sm text-red-400">
              {task.error_code ? `${task.error_code}: ` : ""}
              {task.error_message}
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/admin/scores/${task.score_id}`}>
              <ExternalLink className="mr-1 size-4" />
              Open
            </Link>
          </Button>

          {isFailed && (
            <Button variant="outline" size="sm" onClick={handleRequeue} isLoading={isRequeueing}>
              <RotateCcw className="mr-1 size-4" />
              Requeue
            </Button>
          )}

          {isProcessing && (
            <Tooltip content="Task is being processed and can't be stopped">
              <span>
                <Button variant="outline" size="sm" disabled>
                  <Square className="mr-1 size-4" />
                  Stop
                </Button>
              </span>
            </Tooltip>
          )}

          {isPending && (
            <Button variant="destructive" size="sm" onClick={handleStop} isLoading={isCancelling}>
              <Square className="mr-1 size-4" />
              Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
