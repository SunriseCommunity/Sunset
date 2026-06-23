"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCreateScoreProcessingTask } from "@/lib/hooks/api/score-processing/useScoreProcessingActions";
import { useScoreProcessingPreview } from "@/lib/hooks/api/score-processing/useScoreProcessingPreview";
import useDebounce from "@/lib/hooks/useDebounce";
import { ScoreTaskType } from "@/lib/types/api";
import { getStatusBadgeClassNameColors } from "@/lib/utils/getStatusBadgeClassNameColors";
import { tryParseNumber } from "@/lib/utils/type.util";

interface AddScoreProcessingDialogProps {
  onCreated: () => void;
}

export function AddScoreProcessingDialog({ onCreated }: AddScoreProcessingDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [scoreIdInput, setScoreIdInput] = useState("");
  const [action, setAction] = useState<ScoreTaskType>(ScoreTaskType.RECALCULATION);

  const debouncedScoreId = useDebounce(scoreIdInput, 400);
  const parsedScoreId = tryParseNumber(debouncedScoreId) ?? null;

  const { data: preview, isLoading, error } = useScoreProcessingPreview(parsedScoreId);
  const { trigger: createTask, isMutating } = useCreateScoreProcessingTask();

  const handleSubmit = async () => {
    const scoreId = tryParseNumber(scoreIdInput);
    if (!scoreId) {
      toast({ title: "Invalid score id", description: "Enter a valid score id.", variant: "destructive" });
      return;
    }

    try {
      await createTask({ score_id: scoreId, action });
      toast({ title: "Task queued", description: `Queued ${action} for score #${scoreId}.` });
      onCreated();
      setOpen(false);
      setScoreIdInput("");
    }
    catch (createError) {
      toast({ title: "Could not queue task", description: (createError as Error).message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 size-4" />
          Add entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Queue score processing</DialogTitle>
          <DialogDescription>
            Enter a score id, review the preview, then choose an action to queue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Score id</label>
            <Input
              type="number"
              placeholder="e.g. 12345"
              value={scoreIdInput}
              onChange={event => setScoreIdInput(event.target.value)}
            />
          </div>

          {parsedScoreId && (
            <div className="rounded-md border p-3 text-sm">
              {isLoading
                ? (
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  )
                : error
                  ? <p className="text-red-400">Score not found.</p>
                  : preview
                    ? (
                        <div className="space-y-1">
                          <p className="font-medium">
                            Score #
                            {preview.score.score.id}
                            {" · "}
                            {preview.score.score.user?.username ?? "Unknown"}
                          </p>
                          <p className="text-muted-foreground">
                            {Math.round(preview.score.score.performance_points)}
                            pp
                            {" · "}
                            {preview.score.submission_status}
                            {" · "}
                            {preview.score.beatmap_status}
                          </p>
                          {preview.active_task && (
                            <Badge className={getStatusBadgeClassNameColors(preview.active_task.status)}>
                              Active:
                              {" "}
                              {preview.active_task.task_type}
                              {" "}
                              (
                              {preview.active_task.status}
                              )
                            </Badge>
                          )}
                        </div>
                      )
                    : null}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Action</label>
            <Select value={action} onValueChange={value => setAction(value as ScoreTaskType)}>
              <SelectTrigger>
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
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} isLoading={isMutating}>
            Queue action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
